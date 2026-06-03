import React, { useState, useEffect } from "react";
import { Modal, Select, Table, Skeleton } from "antd";
import { useAuth } from "../Redux/user/AuthContext";
const { Option } = Select;
import {
  FiUsers,
  FiTrendingUp,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiInfo,
  FiPlus,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllStatusFlowLeads,
  getLeadsBySource,
  postAllStatusFlowLeads,
  putAllStatusFlowLeads,
  deleteStatusFlowLeads,
} from "../services/Leads.services";
import { getAllcampaignsRoot } from "../services/Campaign.services";
import { getStaff } from "../services/Staff.services";
import { IS_OFFLINE_LOCAL_MODE } from "../config/runtime";

const StatCard = ({
  title,
  value,
  subtext,
  delta,
  icon: Icon,
  colorClass,
  loading,
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-between border border-[#e2e8f0] h-full transition-all -md">
    {loading ? (
      <Skeleton active avatar paragraph={{ rows: 1 }} />
    ) : (
      <>
        <div className="flex items-center gap-4 mb-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}
          >
            <Icon className="text-xl" />
          </div>
          <div className="flex flex-1 justify-between items-center gap-2">
            <span className="text-sm font-semibold text-slate-700 leading-tight">
              {title}
            </span>
            <span className="text-xl font-bold text-slate-900 whitespace-nowrap">
              {value}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
              <FiInfo className="text-[10px]" />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {subtext}
            </span>
          </div>
          {delta && (
            <div className="flex items-center gap-1 bg-[#e6fcf5] text-[#0ca678] px-2 py-1 rounded-md text-[11px] font-bold">
              <FiTrendingUp className="h-3 w-3" />
              {delta}
            </div>
          )}
        </div>
      </>
    )}
  </div>
);

const Leads = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [staffFilter, setStaffFilter] = useState("All Staff");
  const [campaignFilter, setCampaignFilter] = useState("All Campaigns");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    campaign_id: null,
    status: "New",
    assignedStaff: "",
  });
  

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    campaign_id: null,
    status: "",
    assignedStaff: "",
  });
  const pageSize = 5;
  const getSelectPopupContainer = (node) => node?.parentElement || document.body;

  // API State
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const session = JSON.parse(sessionStorage.getItem("userSession"));
   
  const { user, hasRole } = useAuth();

  
  const canManageLeads = hasRole("ADMIN", "SALES_MANAGER");
  console.log("d",canManageLeads);

  const isSalesExecutive = user?.role === "SALES_EXECUTIVE";

  useEffect(() => {
    fetchData();
    fetchOptions();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
     const profileId = session.profileId;

  const leadsData = await getAllStatusFlowLeads(profileId);
      console.log("All Leads:", leadsData);
      if (Array.isArray(leadsData)) {
        setLeads([...leadsData].reverse());
      } else {
        console.error("API returned non-array for leads:", leadsData);
        const leadsArray = leadsData?.data || leadsData?.content || [];
        setLeads([...leadsArray].reverse());
      }

      const statsData = await getLeadsBySource();
      console.log("Stats:", statsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // toast.error("Failed to fetch data");
    }
    setLoading(false);
  };

  
  // Payload helper
  const preparePayload = (values) => {
    const [firstName, ...lastNameParts] = (values.name || "").split(" ");
    const campaignId = values.campaign_id;

    return {
      firstName,
      lastName: lastNameParts.join(" "),
      email: values.email,
      phone: values.phone || null,
      source: values.source || null,
      campaign_id: campaignId
        ? (IS_OFFLINE_LOCAL_MODE ? campaignId : Number(campaignId))
        : null,
      status: values.status ? values.status.toUpperCase() : null,
      assignedStaff: values.assignedTo || values.assignedStaff || null,
    };
  };

  const handleCreateOk = async () => {
    try {
      if (!createFormData.name || !createFormData.email) {
        toast.error("Name and Email are required");
        return;
      }
      if (!createFormData.source) {
        toast.error("Lead source is required");
        return;
      }

      const payload = {
  ...preparePayload(createFormData),
  profileId: session.profileId
};
      console.log("Create Payload:", payload);
      await postAllStatusFlowLeads(payload);
      toast.success("Lead created successfully");
      setIsCreateModalOpen(false);
      setCreateFormData({
        name: "",
        email: "",
        phone: "",
        source: "",
        campaign_id: null,
        status: "NEW",
        assignedStaff: "",
      });
      fetchData();
    } catch (error) {
      console.error("Backend Message:", error?.response?.data);
      toast.error(error?.response?.data?.message || "Failed to create lead");
    }
  };

  const handleEditOk = async () => {
    try {
      if (!editFormData.name || !editFormData.email) {
        toast.error("Name and Email are required");
        return;
      }
      const payload = preparePayload(editFormData);
      const leadId = selectedLead._id || selectedLead.leadId;
      console.log("Edit Payload:", payload, "ID:", leadId);
      await putAllStatusFlowLeads(leadId, payload);
      toast.success("Lead updated successfully");
      setIsEditModalOpen(false);
      setSelectedLead(null);
      await fetchData(); // Ensure stats and leads are refreshed
    } catch (error) {
      console.error("Edit error:", error);
      toast.error("Failed to update lead");
    }
  };

  const fetchOptions = async () => {
    setOptionsLoading(true);
    try {
      const campaignData = await getAllcampaignsRoot();
      console.log("Campaigns Data:", campaignData);
      if (Array.isArray(campaignData)) setCampaigns(campaignData);

      const staffData = await getStaff();
      console.log("Staff Data:", staffData);
      if (Array.isArray(staffData)) setStaffList(staffData);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
    setOptionsLoading(false);
  };

  const showDeleteModal = (record) => {
    setSelectedLead(record);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteOk = async () => {
    try {
      const leadId = selectedLead.id || selectedLead._id || selectedLead.leadId;
      console.log("Deleting Lead ID:", leadId);
      await deleteStatusFlowLeads(leadId);
      toast.success("Lead deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedLead(null);
      await fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete lead");
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedLead(null);
  };

  const showCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({
      name: "",
      email: "",
      phone: "",
      campaign_id: "",
      status: "NEW",
      assignedStaff: "",
    });
  };

  const showEditModal = (record) => {
    setSelectedLead(record);
    setIsEditModalOpen(true);

    setEditFormData({
      name: record.fullName || "",
      email: record.email || "",
      phone: record.phone || "",
      source: record.source || "",
      campaign_id: record.campaignId || null,
      status: record.status || "",
      assignedStaff: record.assignedStaff || record.assignedTo || "",
    });
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setSelectedLead(null);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      className: "text-[13px] font-semibold text-slate-800 py-4",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: "text-[13px] text-slate-600",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      className: "text-[13px] text-slate-600",
    },

    {
      title: "Source Campaign",
      dataIndex: "campaignName",
      key: "campaignName",
      className: "text-[13px] text-slate-600",
      render: (text) => text || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={
            status === "Qualified"
              ? "text-slate-500 text-[13px] "
              : "text-slate-500 text-[13px]"
          }
        >
          {status}
        </span>
      ),
    },
    {
      title: "Lead Source",
      dataIndex: "source",
      key: "source",
      className: "text-[13px] text-slate-600",
      render: (text) => text || "-",
    },
    {
      title: "Assigned Staff",
      dataIndex: "assignedStaff",
      key: "assignedStaff",
      className: "text-[13px] text-slate-600",
      render: (text) => text || "-",
    },
    {
      title: "Action",
      key: "action",
      className: "text-slate-400",
     render: (_, record) =>
  canManageLeads ? (
    <div className="flex items-center gap-3">
      <button
        className="hover:text-[#6d68b0] transition-colors"
        onClick={() => showEditModal(record)}
      >
        <FiEdit size={16} />
      </button>

      <button
        className="hover:text-red-500 transition-colors"
        onClick={() => showDeleteModal(record)}
      >
        <FiTrash2 size={16} />
      </button>
    </div>

  ) : (
    isSalesExecutive ? (
    <button
        className="hover:text-[#6d68b0] transition-colors"
        onClick={() => showEditModal(record)}
      >
        <FiEdit size={16} />
      </button>) : "-"
  ),
    },
  ];

  const filteredData = leads.filter((item) => {
    const names = item.name || ""; // API returns 'name', sometimes null
    const email = item.email || "";

    const matchesSearch =
      names.toLowerCase().includes(searchText.toLowerCase()) ||
      email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === "All Statuses" ||
      item.status?.toUpperCase() === statusFilter.toUpperCase();
    const matchesStaff =
  staffFilter === "All Staff" ||
  item.assignedStaff?.toUpperCase() === staffFilter.toUpperCase();
    const matchesCampaign =
  campaignFilter === "All Campaigns" ||
  item.campaignName === campaignFilter;
    return matchesSearch && matchesStatus && matchesStaff && matchesCampaign;
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-0 overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={stats?.totalLeads || 0}
          subtext="Total leads in system"
          icon={FiUsers}
          colorClass="bg-[#e7e6f6] text-[#6d68b0]"
          loading={loading}
        />
        <StatCard
          title="New Leads"
          value={stats?.newLeads || 0}
          subtext="Leads with 'New' status"
          icon={FiCheckCircle}
          colorClass="bg-[#e1e7ff] text-[#6366f1]"
          loading={loading}
        />
        <StatCard
          title="Converted Leads"
          value={stats?.convertedLeads || 0}
          subtext="Leads with 'Converted' status"
          icon={FiTrendingUp}
          colorClass="bg-[#eef2ff] text-[#4f46e5]"
          loading={loading}
        />
        <StatCard
          title="Lost Leads"
          value={stats?.lostLeads || 0}
          subtext="Leads with 'Lost' status"
          icon={FiXCircle}
          colorClass="bg-[#f5f3ff] text-[#8b5cf6]"
          loading={loading}
        />
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-[#e2e8f0]">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-800 mb-6">
            Leads Status Flow
          </h3>
          {canManageLeads && (
  <button
    onClick={showCreateModal}
    className="bg-[#6d68b0] mb-2! text-white! border-none flex items-center justify-center gap-2 rounded-xl h-10 px-4 text-xs! font-semibold transition-all active:scale-95 w-full sm:w-auto self-start sm:self-auto"
  >
    Create Leads <FiPlus size={18} />
  </button>
)}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            <Select
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              className="w-full h-10 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!"
            >
              <Option value="All Statuses">All Statuses</Option>
              <Option value="New">New</Option>
              <Option value="Converted">Converted</Option>
              <Option value="Contacted">Contacted</Option>
              <Option value="Lost">Lost</Option>
            </Select>
            <Select
              value={staffFilter}
              loading={optionsLoading}
              onChange={(value) => {
                setStaffFilter(value);
                setCurrentPage(1);
              }}
              className="w-full h-10 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!"
            >
              <Option value="All Staff">All Staff</Option>
              {staffList.map((staff) => (
                <Option key={staff._id} value={staff.name || staff.firstName}>
                  {staff.name ||
                    staff.fullName ||
                    `${staff.firstName || ""} ${staff.lastName || ""}`}
                </Option>
              ))}
            </Select>
            <Select
              value={campaignFilter}
              loading={optionsLoading}
              onChange={(value) => {
                setCampaignFilter(value);
                setCurrentPage(1);
              }}
              className="w-full h-10 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!"
            >
              <Option value="All Campaigns">All Campaigns</Option>
              {campaigns.map((campaign) => (
                <Option key={campaign._id} value={campaign.name}>
                  {campaign.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 rounded-xl border border-[#e2e8f0] pl-10 pr-3 outline-none focus:border-[#6d68b0] focus:shadow-[0_0_0_2px_rgba(109,104,176,0.1)] text-sm text-slate-600 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-hidden">
          <Table
            columns={columns}
            dataSource={paginatedData}
            loading={loading}
            rowKey={(record) => record.leadId || record._id || record.id}
            pagination={false}
            className="[&_.ant-table-thead_th]:bg-[#e7e6f6]! [&_.ant-table-thead_th]:text-[#4b4876]! [&_.ant-table-thead_th]:font-bold! [&_.ant-table-thead_th]:text-[13px]! [&_.ant-table-thead_th]:border-b-0! [&_.ant-table-thead_th]:rounded-none! [&_.ant-table-thead_th:first-child]:rounded-l-xl! [&_.ant-table-thead_th:last-child]:rounded-r-xl! [&_.ant-table-tbody_tr_td]:border-b! [&_.ant-table-tbody_tr_td]:border-[#f1f5f9]! [&_.ant-table-row:hover_td]:bg-[#f8fafc]!"
          />
        </div>

        {/* Footer Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <span className="text-sm text-slate-400 font-medium">
            Showing {paginatedData.length} of {filteredData.length} leads
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="h-9 px-4 rounded-xl border border-[#e2e8f0] text-slate-400 font-semibold text-xs disabled:opacity-50 hover:border-[#6d68b0] hover:text-[#6d68b0] transition-colors bg-white cursor-pointer"
            >
              Previous
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="h-9 px-4 rounded-xl border border-[#6d68b0] text-[#6d68b0] font-semibold text-xs hover:bg-[#6d68b0]/5 disabled:opacity-50 transition-colors bg-white cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Modal
        title="Create New Lead"
        open={isCreateModalOpen}
        onOk={handleCreateOk}
        onCancel={handleCreateCancel}
        okText="Create"
        cancelText="Cancel"
        width={600}
        okButtonProps={{
          style: { backgroundColor: "#6d68b0", borderColor: "#6d68b0" },
        }}
      >
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter lead name"
              value={createFormData.name}
              onChange={(e) =>
                setCreateFormData({ ...createFormData, name: e.target.value })
              }
              className="w-full h-10 rounded-xl border border-[#e2e8f0] px-3 outline-none focus:border-[#6d68b0] focus:shadow-[0_0_0_2px_rgba(109,104,176,0.1)] text-sm text-slate-600 bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                value={createFormData.email}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    email: e.target.value,
                  })
                }
                className="w-full h-10 rounded-xl border border-[#e2e8f0] px-3 outline-none focus:border-[#6d68b0] focus:shadow-[0_0_0_2px_rgba(109,104,176,0.1)] text-sm text-slate-600 bg-white"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                placeholder="Enter phone"
                value={createFormData.phone}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    phone: e.target.value,
                  })
                }
                className="w-full h-10 rounded-xl border border-[#e2e8f0] px-3 outline-none focus:border-[#6d68b0] focus:shadow-[0_0_0_2px_rgba(109,104,176,0.1)] text-sm text-slate-600 bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1">
              Source Campaign
            </label>
            <select
              value={createFormData.campaign_id || ""}
              onChange={(e) =>
                setCreateFormData({
                  ...createFormData,
                  campaign_id: e.target.value || null,
                })
              }
              className="w-full h-10 rounded-xl border border-[#e2e8f0] px-3 outline-none focus:border-[#6d68b0] text-sm text-slate-600 bg-white"
              disabled={optionsLoading}
            >
              <option value="">Select source campaign</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id || campaign._id} value={campaign.id || campaign._id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1">
              Lead Source
            </label>
            <Select
              placeholder="Select source"
              getPopupContainer={getSelectPopupContainer}
              value={createFormData.source || ""}
              onChange={(value) =>
                setCreateFormData({
                  ...createFormData,
                  source: value,
                })
              }
              className="w-full h-10 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!"
            >
              <Option value="">Select source</Option>
              <Option value="EMAIL">Email</Option>
              <Option value="SOCIAL_MEDIA">Social Media</Option>
              <Option value="ORGANIC">Organic</Option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                Status
              </label>
              <Select
                value={createFormData.status}
                getPopupContainer={getSelectPopupContainer}
                onChange={(value) =>
                  setCreateFormData({
                    ...createFormData,
                    status: value,
                  })
                }
                className="w-full h-10 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!"
              >
                <Option value="New">New</Option>              <Option value="Converted">Converted</Option>

                <Option value="Contacted">Contacted</Option>
                <Option value="Lost">Lost</Option>
              </Select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                Assigned Staff
              </label>
              <Select
                placeholder="Select staff"
                loading={optionsLoading}
                getPopupContainer={getSelectPopupContainer}
                value={createFormData.assignedStaff}
                onChange={(value) =>
                  setCreateFormData({
                    ...createFormData,
                    assignedStaff: value,
                  })
                }
                className="w-full h-10 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!"
              >
                {staffList.map((staff) => (
                  <Option key={staff.id} value={staff.name || staff.firstName}>
                    {staff.name ||
                      staff.fullName ||
                      `${staff.firstName || ""} ${staff.lastName || ""}`}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title="Edit Lead"
        open={isEditModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Save Changes"
        cancelText="Cancel"
        width={600}
        okButtonProps={{
          style: { backgroundColor: "#6d68b0", borderColor: "#6d68b0" },
        }}
      >
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={editFormData.name}
              onChange={(e) =>
                setEditFormData({ ...editFormData, name: e.target.value })
              }
              className="w-full h-10 rounded-xl border border-[#e2e8f0] px-3 outline-none focus:border-[#6d68b0] focus:shadow-[0_0_0_2px_rgba(109,104,176,0.1)] text-sm text-slate-600 bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editFormData.email}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, email: e.target.value })
                }
                className="w-full h-10 rounded-xl border border-[#e2e8f0] px-3 outline-none focus:border-[#6d68b0] focus:shadow-[0_0_0_2px_rgba(109,104,176,0.1)] text-sm text-slate-600 bg-white"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={editFormData.phone}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, phone: e.target.value })
                }
                className="w-full h-10 rounded-xl border border-[#e2e8f0] px-3 outline-none focus:border-[#6d68b0] focus:shadow-[0_0_0_2px_rgba(109,104,176,0.1)] text-sm text-slate-600 bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1">
              Source Campaign
            </label>
            <select
              value={editFormData.campaign_id || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  campaign_id: e.target.value || null,
                })
              }
              className="w-full h-10 rounded-xl border border-[#e2e8f0] px-3 outline-none focus:border-[#6d68b0] text-sm text-slate-600 bg-white"
              disabled={optionsLoading}
            >
              <option value="">Select source campaign</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id || campaign._id} value={campaign.id || campaign._id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1">
              Lead Source
            </label>
            <Select
              placeholder="Select source"
              getPopupContainer={getSelectPopupContainer}
              value={editFormData.source || ""}
              onChange={(value) =>
                setEditFormData({
                  ...editFormData,
                  source: value,
                })
              }
              className="w-full h-10 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!"
            >
              <Option value="">Select source</Option>
              <Option value="EMAIL">Email</Option>
              <Option value="SOCIAL_MEDIA">Social Media</Option>
              <Option value="ORGANIC">Organic</Option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                Status
              </label>
              <Select
                value={editFormData.status}
                getPopupContainer={getSelectPopupContainer}
                onChange={(value) =>
                  setEditFormData({ ...editFormData, status: value })
                }
                className="w-full h-10 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!"
              >
                <Option value="New">New</Option>              <Option value="Converted">Converted</Option>

                <Option value="Contacted">Contacted</Option>
                <Option value="Lost">Lost</Option>
              </Select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                Assigned Staff
              </label>
              <Select
                placeholder="Select staff"
                loading={optionsLoading}
                getPopupContainer={getSelectPopupContainer}
                value={editFormData.assignedStaff}
                onChange={(value) =>
                  setEditFormData({
                    ...editFormData,
                    assignedStaff: value
                  })
                }
                className="w-full h-10 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!"
              >
                {staffList.map((staff) => (
                  <Option key={staff._id} value={staff.name || staff.firstName}>
                    {staff.name ||
                      staff.fullName ||
                      `${staff.firstName || ""} ${staff.lastName || ""}`}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText="Yes, Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this lead?</p>
        <p>
          This will permanently remove the lead: <b>{selectedLead?.name}</b>.
        </p>
      </Modal>
    </div>
  );
};

export default Leads;
