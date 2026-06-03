const DB_KEY = "crm_offline_db_v1";
const SESSION_MODE_KEY = "crm_auth_mode";
const OFFLINE_MODE = "offline-local";

const defaultDb = () => ({
  users: [],
  campaigns: [],
  leads: [],
  contacts: [],
  deals: [],
  events: [],
  activities: [],
  emailResponses: [],
  notifications: [],
  chatRooms: [],
  chatMessages: {},
});

const nowIso = () => new Date().toISOString();

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
};

const makeId = (prefix) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const titleCase = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeRole = (role = "ADMIN") => {
  const value = role.toString().trim().toUpperCase();
  if (value === "SALESMANAGER") return "SALES_MANAGER";
  if (value === "SALESEXECUTIVE") return "SALES_EXECUTIVE";
  return value;
};

const normalizeLeadStatus = (status = "NEW") => {
  const value = status.toString().trim().toUpperCase();
  if (value === "NEW") return "New";
  if (value === "CONVERTED") return "Converted";
  if (value === "CONTACTED") return "Contacted";
  if (value === "LOST") return "Lost";
  return titleCase(value || "New");
};

const formatNotificationTime = (isoString) =>
  new Date(isoString).toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const sanitizeUser = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    profileId: user.id,
    userName: user.userName,
    username: user.userName,
    name: user.fullName,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phoneNumber: user.phoneNumber || "",
    location: user.location || "",
    bio: user.bio || "",
    profileImageUrl: user.profileImageUrl || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const getDb = () => {
  const existing = readJson(DB_KEY, null);
  if (existing) {
    if (!Array.isArray(existing.contacts)) existing.contacts = [];
    if (!Array.isArray(existing.deals)) existing.deals = [];
    if (!Array.isArray(existing.events)) existing.events = [];
    if (!Array.isArray(existing.activities)) existing.activities = [];
    if (!Array.isArray(existing.emailResponses)) existing.emailResponses = [];
    if (!Array.isArray(existing.chatRooms)) existing.chatRooms = [];
    if (!existing.chatMessages || typeof existing.chatMessages !== "object") {
      existing.chatMessages = {};
    }
    return existing;
  }

  const seeded = defaultDb();
  writeJson(DB_KEY, seeded);
  return seeded;
};

const saveDb = (db) => writeJson(DB_KEY, db);

const getCurrentSession = () =>
  readJson("userSession", null) || readJson("crm_offline_session", null);

const getCurrentUserId = () => getCurrentSession()?.id || getCurrentSession()?.profileId;
const getCurrentUserName = () =>
  getCurrentSession()?.fullName ||
  getCurrentSession()?.name ||
  getCurrentSession()?.userName ||
  "You";

const getLeadRecord = (db, id) =>
  db.leads.find(
    (item) => item.id === id || item.leadId === id || item._id === id,
  );

const getContactRecord = (db, id) =>
  db.contacts.find(
    (item) => item.id === id || item.contactId === id || item._id === id,
  );

const getContactDisplayName = (contact) =>
  contact?.name ||
  contact?.fullName ||
  [contact?.firstName, contact?.lastName].filter(Boolean).join(" ").trim() ||
  "Unknown";

const getStaffName = (db, value) => {
  if (!value) return "";
  const user = db.users.find(
    (item) =>
      item.id === value ||
      item.userName === value ||
      item.fullName === value ||
      item.email === value,
  );
  return user?.fullName || value;
};

const setSession = (user) => {
  const sanitizedUser = sanitizeUser(user);
  const token = `offline-local:${user.id}`;

  localStorage.setItem("token", token);
  sessionStorage.setItem("token", token);
  localStorage.setItem("userSession", JSON.stringify(sanitizedUser));
  sessionStorage.setItem("userSession", JSON.stringify(sanitizedUser));
  localStorage.setItem("crm_offline_session", JSON.stringify(sanitizedUser));
  sessionStorage.setItem("email", sanitizedUser.email || "");
  sessionStorage.setItem("id", sanitizedUser.id || "");
  sessionStorage.setItem("profileId", sanitizedUser.profileId || "");
  sessionStorage.setItem("authMode", OFFLINE_MODE);
  localStorage.setItem(SESSION_MODE_KEY, OFFLINE_MODE);

  return {
    ...sanitizedUser,
    token,
  };
};

const clearSession = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  localStorage.removeItem("userSession");
  sessionStorage.removeItem("userSession");
  localStorage.removeItem("crm_offline_session");
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("id");
  sessionStorage.removeItem("profileId");
  sessionStorage.removeItem("authMode");
  localStorage.removeItem(SESSION_MODE_KEY);
};

const addNotification = (db, title, message) => {
  const createdAt = nowIso();

  db.notifications.unshift({
    id: makeId("notif"),
    title,
    message,
    read: false,
    time: formatNotificationTime(createdAt),
    createdAt,
  });
};

const ensureOfflineChatSeed = (db) => {
  if (db.chatRooms.length > 0) return;

  const roomId = "offline_general_room";
  const createdAt = nowIso();

  db.chatRooms.push({
    id: roomId,
    roomName: "General",
    roomCode: "GENERAL",
    groupChat: true,
    active: true,
    createdAt,
  });

  db.chatMessages[roomId] = [
    {
      id: makeId("msg"),
      message: "Welcome to CRM Offline chat. You can send local messages here.",
      senderId: 0,
      senderName: "CRM Offline",
      senderProfileImage: null,
      createdAt,
    },
  ];
};

const hashPassword = async (value) => {
  const text = value ?? "";

  if (globalThis.crypto?.subtle) {
    const encoded = new TextEncoder().encode(text);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }

  return `fallback_${Math.abs(hash)}`;
};

const comparePassword = async (plainText, hashed) => {
  const value = await hashPassword(plainText);
  return value === hashed;
};

const updateSessionFromDb = (db, userId) => {
  const user = db.users.find((item) => item.id === userId);
  return user ? setSession(user) : null;
};

const groupLeadAnalytics = (leads, range = "1D") => {
  const now = new Date();
  const days =
    range === "1D" ? 1 : range === "1M" ? 30 : range === "1Y" ? 365 : 1800;
  const buckets = new Map();

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - index);
    const key = date.toISOString().slice(0, 10);
    buckets.set(key, { date: key, email: 0, socialMedia: 0, organic: 0 });
  }

  leads.forEach((lead) => {
    const key = (lead.createdAt || "").slice(0, 10);
    if (!buckets.has(key)) return;

    const entry = buckets.get(key);
    const source = (lead.source || "").toUpperCase();

    if (source === "EMAIL") entry.email += 1;
    else if (source === "SOCIAL_MEDIA") entry.socialMedia += 1;
    else entry.organic += 1;
  });

  return Array.from(buckets.values());
};

export const isOfflineLocalSession = () =>
  sessionStorage.getItem("authMode") === OFFLINE_MODE ||
  localStorage.getItem(SESSION_MODE_KEY) === OFFLINE_MODE ||
  (sessionStorage.getItem("token") || "").startsWith("offline-local:");

export const offlineSignup = async (payload) => {
  const db = getDb();
  const email = payload.email?.trim().toLowerCase();
  const userName = payload.userName?.trim();

  if (!email || !userName || !payload.password || !payload.fullName?.trim()) {
    throw new Error("Please fill all required fields.");
  }

  const duplicateEmail = db.users.some(
    (user) => user.email.toLowerCase() === email,
  );
  if (duplicateEmail) {
    throw new Error("Email already exists on this device.");
  }

  const duplicateUserName = db.users.some(
    (user) => user.userName.toLowerCase() === userName.toLowerCase(),
  );
  if (duplicateUserName) {
    throw new Error("Username already exists on this device.");
  }

  const createdAt = nowIso();
  const user = {
    id: makeId("user"),
    userName,
    fullName: payload.fullName.trim(),
    email,
    role: normalizeRole(payload.role),
    phoneNumber: payload.phoneNumber || "",
    location: payload.location || "",
    bio: payload.bio || "",
    profileImageUrl: payload.profileImageUrl || "",
    passwordHash: await hashPassword(payload.password),
    createdAt,
    updatedAt: createdAt,
  };

  db.users.push(user);
  addNotification(
    db,
    "Account Created",
    `${user.fullName} account has been created on this device.`,
  );
  saveDb(db);

  return {
    status: 201,
    data: sanitizeUser(user),
  };
};

export const offlineLogin = async ({ email, password }) => {
  const db = getDb();
  const normalizedEmail = email?.trim().toLowerCase();
  const user = db.users.find((item) => item.email.toLowerCase() === normalizedEmail);

  if (!user) {
    throw new Error("No local account found with this email.");
  }

  const matches = await comparePassword(password, user.passwordHash);
  if (!matches) {
    throw new Error("Incorrect password.");
  }

  addNotification(db, "Welcome Back", `${user.fullName} signed in offline.`);
  saveDb(db);

  return setSession(user);
};

export const offlineLogout = async () => {
  clearSession();
  return "Signed out successfully";
};

export const offlineChangePassword = async ({ oldPassword, newPassword }) => {
  const db = getDb();
  const userId = getCurrentUserId();
  const user = db.users.find((item) => item.id === userId);

  if (!user) {
    throw new Error("No local session found.");
  }

  const matches = await comparePassword(oldPassword, user.passwordHash);
  if (!matches) {
    throw new Error("Current password is incorrect.");
  }

  user.passwordHash = await hashPassword(newPassword);
  user.updatedAt = nowIso();
  addNotification(db, "Password Updated", "Your offline password was changed.");
  saveDb(db);

  return "Password updated successfully!";
};

export const offlineForgotPassword = async ({ email }) => {
  const db = getDb();
  const normalizedEmail = email?.trim().toLowerCase();
  const user = db.users.find((item) => item.email.toLowerCase() === normalizedEmail);

  if (!user) {
    throw new Error("No local account found with this email.");
  }

  return {
    success: true,
    message: "Local account found. You can reset the password on this device.",
  };
};

export const offlineResetPassword = async ({
  email,
  newPassword,
  confirmPassword,
}) => {
  const db = getDb();
  const normalizedEmail = email?.trim().toLowerCase();
  const user = db.users.find((item) => item.email.toLowerCase() === normalizedEmail);

  if (!user) {
    throw new Error("No local account found with this email.");
  }

  if (!newPassword || !confirmPassword) {
    throw new Error("Please fill both password fields.");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  user.passwordHash = await hashPassword(newPassword);
  user.updatedAt = nowIso();
  addNotification(
    db,
    "Password Reset",
    `${user.fullName} reset the password on this device.`,
  );
  saveDb(db);

  return { success: true, message: "Password reset successfully." };
};

export const offlineUpdateProfile = async (email, payload) => {
  const db = getDb();
  const user = db.users.find(
    (item) => item.email.toLowerCase() === email?.trim().toLowerCase(),
  );

  if (!user) {
    throw new Error("Local profile not found.");
  }

  user.fullName = payload.fullName?.trim() || user.fullName;
  user.email = payload.email?.trim().toLowerCase() || user.email;
  user.phoneNumber = payload.phoneNumber ?? user.phoneNumber;
  user.location = payload.location ?? user.location;
  user.bio = payload.bio ?? user.bio;
  user.profileImageUrl = payload.profileImageUrl ?? user.profileImageUrl;
  user.updatedAt = nowIso();

  addNotification(db, "Profile Updated", "Your profile changes were saved offline.");
  saveDb(db);

  updateSessionFromDb(db, user.id);

  return sanitizeUser(user);
};

export const getOfflineProfileStats = async () => {
  const db = getDb();
  const userId = getCurrentUserId();

  return {
    campaignsLed: db.campaigns.filter((item) => item.createdBy === userId).length,
    leadsGenerated: db.leads.filter((item) => item.profileId === userId).length,
    teamSize: db.users.length,
  };
};

export const getOfflineCampaigns = async () => getDb().campaigns;

export const createOfflineCampaign = async (payload) => {
  const db = getDb();
  const createdAt = nowIso();
  const campaign = {
    id: makeId("campaign"),
    name: payload.name?.trim() || "Untitled Campaign",
    type: payload.type || "Email",
    status: payload.status || "DRAFT",
    startDate: payload.startDate || "",
    endDate: payload.endDate || "",
    budget: Number(payload.budget || 0),
    revenueGenerated: Number(payload.revenueGenerated || 0),
    createdBy: getCurrentUserId(),
    createdAt,
    updatedAt: createdAt,
  };

  db.campaigns.unshift(campaign);
  addNotification(db, "Campaign Created", `${campaign.name} was saved offline.`);
  saveDb(db);
  return campaign;
};

export const updateOfflineCampaign = async (id, payload) => {
  const db = getDb();
  const campaign = db.campaigns.find((item) => item.id === id);

  if (!campaign) throw new Error("Campaign not found.");

  Object.assign(campaign, {
    name: payload.name?.trim() || campaign.name,
    type: payload.type ?? campaign.type,
    status: payload.status ?? campaign.status,
    startDate: payload.startDate ?? campaign.startDate,
    endDate: payload.endDate ?? campaign.endDate,
    budget: Number(payload.budget ?? campaign.budget ?? 0),
    revenueGenerated: Number(
      payload.revenueGenerated ?? campaign.revenueGenerated ?? 0,
    ),
    updatedAt: nowIso(),
  });

  addNotification(db, "Campaign Updated", `${campaign.name} was updated offline.`);
  saveDb(db);
  return campaign;
};

export const deleteOfflineCampaign = async (id) => {
  const db = getDb();
  const campaign = db.campaigns.find((item) => item.id === id);
  db.campaigns = db.campaigns.filter((item) => item.id !== id);

  if (campaign) {
    db.leads = db.leads.map((lead) =>
      lead.campaignId === id
        ? { ...lead, campaignId: null, campaignName: "" }
        : lead,
    );
    addNotification(db, "Campaign Deleted", `${campaign.name} was removed offline.`);
  }

  saveDb(db);
  return { success: true };
};

export const getOfflineCampaignSummary = async () => {
  const db = getDb();
  const totalCampaigns = db.campaigns.length;
  const activeCampaigns = db.campaigns.filter(
    (item) => item.status === "ACTIVE",
  ).length;
  const totalLeadsGenerated = db.leads.length;
  const totalRevenue = db.campaigns.reduce(
    (sum, item) => sum + Number(item.revenueGenerated || 0),
    0,
  );
  const avgConversionRate =
    totalLeadsGenerated === 0
      ? 0
      : (db.leads.filter((lead) => lead.status === "Converted").length /
          totalLeadsGenerated) *
        100;

  return {
    totalCampaigns,
    activeCampaigns,
    totalLeadsGenerated,
    avgConversionRate,
    totalRevenue,
  };
};

export const getOfflineCampaignStatus = async () => {
  const counts = getDb().campaigns.reduce((acc, campaign) => {
    acc[campaign.status] = (acc[campaign.status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).map(([status, count]) => ({ status, count }));
};

export const getOfflineLeads = async () => getDb().leads;

export const createOfflineLead = async (payload) => {
  const db = getDb();
  const createdAt = nowIso();
  const campaign = db.campaigns.find((item) => item.id === payload.campaign_id);
  const firstName = payload.firstName?.trim() || "";
  const lastName = payload.lastName?.trim() || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  const lead = {
    id: makeId("lead"),
    leadId: makeId("leadref"),
    firstName,
    lastName,
    fullName: fullName || payload.email,
    name: fullName || payload.email,
    email: payload.email?.trim().toLowerCase() || "",
    phone: payload.phone || "",
    source: (payload.source || "ORGANIC").toUpperCase(),
    status: normalizeLeadStatus(payload.status),
    assignedStaff: payload.assignedStaff || "",
    campaignId: campaign?.id || null,
    campaignName: campaign?.name || "",
    profileId: payload.profileId || getCurrentUserId(),
    createdAt,
    updatedAt: createdAt,
  };

  db.leads.unshift(lead);
  addNotification(db, "Lead Created", `${lead.fullName} was saved offline.`);
  saveDb(db);
  return lead;
};

export const updateOfflineLead = async (id, payload) => {
  const db = getDb();
  const lead = db.leads.find(
    (item) => item.id === id || item.leadId === id || item._id === id,
  );
  if (!lead) throw new Error("Lead not found.");

  const campaign = db.campaigns.find((item) => item.id === payload.campaign_id);
  const firstName = payload.firstName?.trim() || lead.firstName || "";
  const lastName = payload.lastName?.trim() || lead.lastName || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  Object.assign(lead, {
    firstName,
    lastName,
    fullName: fullName || lead.fullName,
    name: fullName || lead.name,
    email: payload.email?.trim().toLowerCase() || lead.email,
    phone: payload.phone ?? lead.phone,
    source: (payload.source || lead.source || "ORGANIC").toUpperCase(),
    status: normalizeLeadStatus(payload.status || lead.status),
    assignedStaff: payload.assignedStaff ?? lead.assignedStaff,
    campaignId: campaign?.id || null,
    campaignName: campaign?.name || "",
    updatedAt: nowIso(),
  });

  addNotification(db, "Lead Updated", `${lead.fullName} was updated offline.`);
  saveDb(db);
  return lead;
};

export const deleteOfflineLead = async (id) => {
  const db = getDb();
  const lead = db.leads.find(
    (item) => item.id === id || item.leadId === id || item._id === id,
  );
  db.leads = db.leads.filter(
    (item) => item.id !== id && item.leadId !== id && item._id !== id,
  );

  if (lead) {
    addNotification(db, "Lead Deleted", `${lead.fullName} was removed offline.`);
  }

  saveDb(db);
  return { success: true };
};

export const getOfflineLeadStats = async () => {
  const leads = getDb().leads;

  return {
    totalLeads: leads.length,
    newLeads: leads.filter((item) => item.status === "New").length,
    convertedLeads: leads.filter((item) => item.status === "Converted").length,
    lostLeads: leads.filter((item) => item.status === "Lost").length,
  };
};

export const getOfflineLeadsBySource = async () => {
  const counts = getDb().leads.reduce(
    (acc, lead) => {
      const source = (lead.source || "ORGANIC").toUpperCase();
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    },
    { EMAIL: 0, SOCIAL_MEDIA: 0, ORGANIC: 0 },
  );

  return [
    { source: "EMAIL", count: counts.EMAIL },
    { source: "SOCIAL_MEDIA", count: counts.SOCIAL_MEDIA },
    { source: "ORGANIC", count: counts.ORGANIC },
  ];
};

export const getOfflineDashboardData = async () => {
  const db = getDb();
  const totalRevenue = db.campaigns.reduce(
    (sum, item) => sum + Number(item.revenueGenerated || 0),
    0,
  );

  return {
    totalCampaigns: db.campaigns.length,
    totalLeads: db.leads.length,
    totalRevenue,
  };
};

export const getOfflineMonthlyLeads = async () => {
  const months = [];
  const leads = getDb().leads;
  const now = new Date();

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const monthName = date.toLocaleString([], { month: "short" });
    const count = leads.filter((lead) => {
      const created = new Date(lead.createdAt);
      return (
        created.getFullYear() === date.getFullYear() &&
        created.getMonth() === date.getMonth()
      );
    }).length;

    months.push({ monthName, count });
  }

  return months;
};

export const getOfflineLeadChart = async (range) =>
  groupLeadAnalytics(getDb().leads, range);

export const getOfflineContacts = async () => {
  const db = getDb();

  return [...db.contacts]
    .map((contact) => ({
      ...contact,
      staffName: contact.staffName || getStaffName(db, contact.assignedStaff),
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getOfflineContactStats = async () => {
  const db = getDb();
  const lastSevenDays = new Date();
  lastSevenDays.setDate(lastSevenDays.getDate() - 7);

  return {
    totalContacts: db.contacts.length,
    contactsWithActivities: db.contacts.filter((contact) =>
      db.activities.some((activity) => String(activity.contactId) === String(contact.id)),
    ).length,
    linkedLeads: db.contacts.filter((contact) => contact.linkedLeadId).length,
    recentlyAdded: db.contacts.filter(
      (contact) => new Date(contact.createdAt) >= lastSevenDays,
    ).length,
  };
};

export const createOfflineContact = async (payload) => {
  const db = getDb();
  const createdAt = nowIso();
  const contact = {
    id: makeId("contact"),
    _id: makeId("contactref"),
    contactId: makeId("contactref"),
    firstName: payload.firstName?.trim() || "",
    lastName: payload.lastName?.trim() || "",
    email: payload.email?.trim().toLowerCase() || "",
    phone: payload.phone || "",
    company: payload.company || "",
    assignedStaff: payload.assignedStaff || "",
    staffName: getStaffName(db, payload.assignedStaff),
    linkedLeadId: payload.linkedLeadId || null,
    createdAt,
    updatedAt: createdAt,
  };

  contact.name = getContactDisplayName(contact);
  contact.fullName = contact.name;
  db.contacts.unshift(contact);
  addNotification(db, "Contact Created", `${contact.name} was saved offline.`);
  saveDb(db);
  return contact;
};

export const updateOfflineContact = async (id, payload) => {
  const db = getDb();
  const contact = getContactRecord(db, id);
  if (!contact) throw new Error("Contact not found.");

  contact.firstName = payload.firstName?.trim() || contact.firstName;
  contact.lastName = payload.lastName?.trim() || contact.lastName;
  contact.email = payload.email?.trim().toLowerCase() || contact.email;
  contact.phone = payload.phone ?? contact.phone;
  contact.company = payload.company ?? contact.company;
  contact.assignedStaff = payload.assignedStaff ?? contact.assignedStaff;
  contact.staffName = getStaffName(db, contact.assignedStaff);
  contact.updatedAt = nowIso();
  contact.name = getContactDisplayName(contact);
  contact.fullName = contact.name;

  addNotification(db, "Contact Updated", `${contact.name} was updated offline.`);
  saveDb(db);
  return contact;
};

export const deleteOfflineContact = async (id) => {
  const db = getDb();
  const contact = getContactRecord(db, id);
  db.contacts = db.contacts.filter(
    (item) => item.id !== id && item.contactId !== id && item._id !== id,
  );
  if (contact) {
    addNotification(db, "Contact Deleted", `${contact.name} was removed offline.`);
  }
  saveDb(db);
  return { success: true };
};

export const getOfflineActivities = async () =>
  [...getDb().activities].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export const getOfflineActivitiesByRelatedId = async (id) =>
  (await getOfflineActivities()).filter(
    (item) => String(item.leadId) === String(id) || String(item.contactId) === String(id),
  );

export const getOfflineActivityPercentage = async () => {
  const activities = getDb().activities;
  const completedActivities = activities.filter(
    (item) => (item.status || "").toUpperCase() === "COMPLETED",
  ).length;
  const totalActivities = activities.length;

  return {
    percentage: totalActivities ? Math.round((completedActivities / totalActivities) * 100) : 0,
    completedActivities,
    totalActivities,
  };
};

export const createOfflineActivity = async (payload) => {
  const db = getDb();
  const lead = getLeadRecord(db, payload.leadId);
  const contact = payload.contactId ? getContactRecord(db, payload.contactId) : null;
  const createdAt = payload.date && payload.time
    ? `${payload.date}T${payload.time}`
    : nowIso();
  const personName =
    lead?.fullName || getContactDisplayName(contact) || "Contact";

  const activity = {
    id: makeId("activity"),
    activityId: makeId("activityref"),
    activityType: payload.activityType || "CALL",
    description: payload.notes || payload.description || "",
    notes: payload.notes || payload.description || "",
    date: payload.date || createdAt.slice(0, 10),
    time: payload.time || createdAt.slice(11, 19),
    duration: payload.duration || "0",
    leadId: payload.leadId || lead?.leadId || lead?.id || null,
    contactId: payload.contactId || contact?.contactId || contact?.id || null,
    personName,
    outcome: payload.outcome || "New Activity Logged",
    status: payload.status || "COMPLETED",
    company: payload.company || contact?.company || "",
    nextActionType: payload.nextActionType || "",
    nextActionDate: payload.nextActionDate || "",
    nextActionTime: payload.nextActionTime || "",
    createdAt,
    updatedAt: createdAt,
  };

  db.activities.unshift(activity);
  addNotification(db, "Activity Logged", `${activity.activityType} saved offline for ${personName}.`);
  saveDb(db);
  return activity;
};

export const getOfflineDeals = async () =>
  [...getDb().deals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export const createOfflineDeal = async (payload) => {
  const db = getDb();
  const lead = getLeadRecord(db, payload.leadId);
  const createdAt = nowIso();
  const deal = {
    id: makeId("deal"),
    _id: makeId("dealref"),
    dealId: makeId("dealref"),
    dealName: payload.dealName?.trim() || "Untitled Deal",
    amount: Number(payload.amount || 0),
    stage: payload.stage || "NEGOTIATION",
    closeDate: payload.closeDate || "",
    leadId: payload.leadId || null,
    leadName: lead?.fullName || lead?.name || "N/A",
    owner: lead?.assignedStaff || "N/A",
    staffName: lead?.assignedStaff || "N/A",
    status: lead?.status || "New",
    createdAt,
    updatedAt: createdAt,
  };

  db.deals.unshift(deal);
  addNotification(db, "Deal Created", `${deal.dealName} was saved offline.`);
  saveDb(db);
  return deal;
};

export const updateOfflineDeal = async (id, payload) => {
  const db = getDb();
  const deal = db.deals.find(
    (item) => item.id === id || item.dealId === id || item._id === id,
  );
  if (!deal) throw new Error("Deal not found.");

  const lead = getLeadRecord(db, payload.leadId || deal.leadId);
  deal.dealName = payload.dealName?.trim() || deal.dealName;
  deal.amount = Number(payload.amount ?? deal.amount ?? 0);
  deal.stage = payload.stage || deal.stage;
  deal.closeDate = payload.closeDate ?? deal.closeDate;
  deal.leadId = payload.leadId ?? deal.leadId;
  deal.leadName = lead?.fullName || lead?.name || deal.leadName;
  deal.owner = lead?.assignedStaff || deal.owner;
  deal.staffName = lead?.assignedStaff || deal.staffName;
  deal.status = lead?.status || deal.status;
  deal.updatedAt = nowIso();

  addNotification(db, "Deal Updated", `${deal.dealName} was updated offline.`);
  saveDb(db);
  return deal;
};

export const deleteOfflineDeal = async (id) => {
  const db = getDb();
  const deal = db.deals.find(
    (item) => item.id === id || item.dealId === id || item._id === id,
  );
  db.deals = db.deals.filter(
    (item) => item.id !== id && item.dealId !== id && item._id !== id,
  );
  if (deal) {
    addNotification(db, "Deal Deleted", `${deal.dealName} was removed offline.`);
  }
  saveDb(db);
  return { success: true };
};

export const getOfflineEvents = async () =>
  [...getDb().events].sort((a, b) => new Date(`${b.date}T${b.time || "00:00:00"}`) - new Date(`${a.date}T${a.time || "00:00:00"}`));

export const createOfflineEvent = async (payload) => {
  const db = getDb();
  const contact = getContactRecord(db, payload.contactId);
  const createdAt = nowIso();
  const event = {
    id: makeId("event"),
    _id: makeId("eventref"),
    eventId: makeId("eventref"),
    date: payload.date || createdAt.slice(0, 10),
    time: payload.time || createdAt.slice(11, 19),
    type: payload.type || "Meeting",
    subject: payload.subject?.trim() || "Untitled Event",
    contactId: payload.contactId || null,
    contactName: getContactDisplayName(contact),
    contact: contact
      ? {
          id: contact.id,
          contactId: contact.contactId,
          firstName: contact.firstName,
          lastName: contact.lastName,
        }
      : null,
    status: (payload.status || "SCHEDULED").toUpperCase(),
    createdAt,
    updatedAt: createdAt,
  };

  db.events.unshift(event);
  addNotification(db, "Event Created", `${event.subject} was saved offline.`);
  saveDb(db);
  return event;
};

export const updateOfflineEvent = async (id, payload) => {
  const db = getDb();
  const event = db.events.find(
    (item) => item.id === id || item.eventId === id || item._id === id,
  );
  if (!event) throw new Error("Event not found.");

  const contact = getContactRecord(db, payload.contactId || event.contactId);
  event.date = payload.date || event.date;
  event.time = payload.time || event.time;
  event.type = payload.type || event.type;
  event.subject = payload.subject?.trim() || event.subject;
  event.contactId = payload.contactId ?? event.contactId;
  event.contactName = getContactDisplayName(contact);
  event.contact = contact
    ? {
        id: contact.id,
        contactId: contact.contactId,
        firstName: contact.firstName,
        lastName: contact.lastName,
      }
    : null;
  event.status = (payload.status || event.status || "SCHEDULED").toUpperCase();
  event.updatedAt = nowIso();

  addNotification(db, "Event Updated", `${event.subject} was updated offline.`);
  saveDb(db);
  return event;
};

export const deleteOfflineEvent = async (id) => {
  const db = getDb();
  const event = db.events.find(
    (item) => item.id === id || item.eventId === id || item._id === id,
  );
  db.events = db.events.filter(
    (item) => item.id !== id && item.eventId !== id && item._id !== id,
  );
  if (event) {
    addNotification(db, "Event Deleted", `${event.subject} was removed offline.`);
  }
  saveDb(db);
  return { success: true };
};

export const getOfflineEmailResponses = async () =>
  [...getDb().emailResponses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export const createOfflineEmailResponse = async (payload) => {
  const db = getDb();
  const lead = getLeadRecord(db, payload.leadId);
  const createdAt = nowIso();
  const response = {
    id: makeId("log"),
    logId: makeId("logref"),
    activityType: payload.activityType || "EMAIL",
    createdAt,
    outcome: payload.outcome || "",
    personName: lead?.fullName || lead?.name || "Unknown",
    nextActionType: payload.nextActionType || "",
    nextActionDate: payload.nextActionDate || "",
    nextActionTime: payload.nextActionTime || "",
    notes: payload.notes || "",
    status: payload.status || "PENDING",
    leadId: payload.leadId || null,
  };

  db.emailResponses.unshift(response);
  addNotification(db, "Response Logged", `${response.activityType} response was saved offline.`);
  saveDb(db);
  return response;
};

export const getOfflineNotifications = async () => getDb().notifications;

export const markOfflineNotificationAsRead = async (id) => {
  const db = getDb();
  const notification = db.notifications.find((item) => item.id === id);
  if (notification) notification.read = true;
  saveDb(db);
  return notification;
};

export const deleteOfflineNotification = async (id) => {
  const db = getDb();
  db.notifications = db.notifications.filter((item) => item.id !== id);
  saveDb(db);
  return { success: true };
};

export const clearOfflineNotifications = async () => {
  const db = getDb();
  db.notifications = [];
  saveDb(db);
  return { success: true };
};

export const getOfflineStaff = async () =>
  getDb().users.map((user) => ({
    id: user.id,
    _id: user.id,
    name: user.fullName,
    fullName: user.fullName,
    firstName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.status || "ACTIVE",
  }));

export const createOfflineStaff = async (payload) => {
  const db = getDb();
  const email = payload.email?.trim().toLowerCase();
  const name = payload.name?.trim();

  if (!name || !email || !payload.password || !payload.role) {
    throw new Error("Please fill all required staff fields.");
  }

  const duplicateEmail = db.users.some(
    (user) => user.email.toLowerCase() === email,
  );
  if (duplicateEmail) {
    throw new Error("Staff email already exists on this device.");
  }

  const createdAt = nowIso();
  const user = {
    id: makeId("user"),
    userName: payload.userName?.trim() || email.split("@")[0],
    fullName: name,
    email,
    role: normalizeRole(payload.role),
    status: (payload.status || "ACTIVE").toString().trim().toUpperCase(),
    phoneNumber: payload.phoneNumber || "",
    location: payload.location || "",
    bio: payload.bio || "",
    profileImageUrl: payload.profileImageUrl || "",
    passwordHash: await hashPassword(payload.password),
    createdAt,
    updatedAt: createdAt,
  };

  db.users.push(user);
  addNotification(
    db,
    "Staff Created",
    `${user.fullName} was added to offline staff.`,
  );
  saveDb(db);

  return {
    id: user.id,
    _id: user.id,
    name: user.fullName,
    fullName: user.fullName,
    firstName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.status,
  };
};

export const updateOfflineStaff = async (id, payload) => {
  const db = getDb();
  const user = db.users.find((item) => item.id === id);

  if (!user) {
    throw new Error("Staff member not found.");
  }

  const nextEmail = payload.email?.trim().toLowerCase();
  if (nextEmail) {
    const duplicateEmail = db.users.some(
      (item) => item.id !== id && item.email.toLowerCase() === nextEmail,
    );
    if (duplicateEmail) {
      throw new Error("Another staff member already uses this email.");
    }
  }

  user.fullName = payload.name?.trim() || user.fullName;
  user.email = nextEmail || user.email;
  user.role = normalizeRole(payload.role || user.role);
  user.status = (payload.status || user.status || "ACTIVE")
    .toString()
    .trim()
    .toUpperCase();
  user.updatedAt = nowIso();

  addNotification(
    db,
    "Staff Updated",
    `${user.fullName} was updated in offline staff.`,
  );
  saveDb(db);

  return {
    id: user.id,
    _id: user.id,
    name: user.fullName,
    fullName: user.fullName,
    firstName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.status,
  };
};

export const deleteOfflineStaff = async (id) => {
  const db = getDb();
  const user = db.users.find((item) => item.id === id);

  db.users = db.users.filter((item) => item.id !== id);

  if (user) {
    addNotification(
      db,
      "Staff Deleted",
      `${user.fullName} was removed from offline staff.`,
    );
  }

  saveDb(db);
  return { success: true };
};

export const getOfflineChatRooms = async () => {
  const db = getDb();
  ensureOfflineChatSeed(db);
  saveDb(db);
  return db.chatRooms;
};

export const getOfflineChatMessages = async (roomId) => {
  const db = getDb();
  ensureOfflineChatSeed(db);
  return db.chatMessages[roomId] || [];
};

export const createOfflineChatRoom = async (payload) => {
  const db = getDb();
  ensureOfflineChatSeed(db);

  const createdAt = nowIso();
  const room = {
    id: makeId("room"),
    roomName: payload.roomName?.trim() || "New Room",
    roomCode: payload.roomCode?.trim() || makeId("code"),
    groupChat: payload.groupChat !== false,
    active: true,
    createdAt,
  };

  db.chatRooms.unshift(room);
  db.chatMessages[room.id] = [
    {
      id: makeId("msg"),
      message: `${room.roomName} created offline.`,
      senderId: 0,
      senderName: "CRM Offline",
      senderProfileImage: null,
      createdAt,
    },
  ];
  saveDb(db);
  return room;
};

export const deleteOfflineChatRoom = async (roomId) => {
  const db = getDb();
  db.chatRooms = db.chatRooms.filter((room) => room.id !== roomId);
  delete db.chatMessages[roomId];
  saveDb(db);
  return { success: true };
};

export const sendOfflineChatMessage = async (roomId, payload) => {
  const db = getDb();
  ensureOfflineChatSeed(db);

  if (!db.chatMessages[roomId]) {
    db.chatMessages[roomId] = [];
  }

  const createdAt = nowIso();
  const message = {
    id: makeId("msg"),
    message: payload.message?.trim() || "",
    senderId: Number(payload.senderId) || getCurrentUserId() || 1,
    senderName: payload.senderName || getCurrentUserName(),
    senderProfileImage: null,
    createdAt,
  };

  db.chatMessages[roomId].push(message);
  saveDb(db);
  return message;
};
