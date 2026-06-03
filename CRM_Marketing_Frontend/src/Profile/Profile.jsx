import React, { useState, useRef, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera, FiEdit2, FiLock, FiLogOut, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Modal, Skeleton } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
    signOutStart,
    signOutSuccess,
    signOutFailure,
    updateUser
} from '../Redux/user/userSlice.js';
import { LogoutService } from '../services/Auth.services';
import { profileUpdate, getProfileStats } from '../services/Profile.services';

const Profile = () => {

    const { currentUser } = useSelector((state) => state.user);
    console.log(" Current User : ", currentUser)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
const [stats, setStats] = useState({
  campaignsLed: 0,
  leadsGenerated: 0,
  teamSize: 0
});
const [statsLoading, setStatsLoading] = useState(true);
    const sessionUser = JSON.parse(sessionStorage.getItem("userSession"));

    const reduxUser = currentUser || sessionUser;

   const [user, setUser] = useState({
  name: reduxUser?.name || "-",
  role: reduxUser?.role || "-",
  email: reduxUser?.email || "-",
  phone: reduxUser?.phoneNumber || "-",
  location: reduxUser?.location || "-",
  avatar: reduxUser?.profileImageUrl || "",
  bio: reduxUser?.bio || "-"
});

    const [isInitialLoading, setIsInitialLoading] = useState(false);

    

   useEffect(() => {
  if (reduxUser) {
    setUser({
      name: reduxUser.name || reduxUser.fullName || "-",
      role: reduxUser.role || "-",
      email: reduxUser.email || "-",
      phone: reduxUser.phoneNumber || "-",
      location: reduxUser.location || "-",
      avatar: reduxUser.profileImageUrl || "",
      bio: reduxUser.bio || "-"
    });
  }
}, [reduxUser]);


useEffect(() => {

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const data = await getProfileStats();

      setStats({
        campaignsLed: data?.campaignsLed || 0,
        leadsGenerated: data?.leadsGenerated || 0,
        teamSize: data?.teamSize || 0
      });

    } catch (error) {
      console.error("Stats fetch error:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  loadStats();

}, []);

const displayStats = React.useMemo(() => [
  { label: "Campaigns Led", value: stats.campaignsLed },
  { label: "Leads Generated", value: stats.leadsGenerated },
  { label: "Team Size", value: stats.teamSize }
], [stats]);
// useEffect(() => {
//     const storedProfile = JSON.parse(sessionStorage.getItem("profile"));

//     const source = currentUser || storedProfile;

//     if (source) {
//         const mappedUser = {
//             name: source.name || source.fullName || "-",
//             role: source.role || "-",
//             email: source.email || "-",
//             phone: source.phone || source.phoneNumber || "-",
//             location: source.location || "-",
//             avatar: source.avatar || source.profileImageUrl || "",
//             bio: source.bio || "-"
//         };

//         setUser(mappedUser);
//     }
// }, [currentUser]);

    const handleSignOut = async () => {
        dispatch(signOutStart());
        try {
            await LogoutService();
            dispatch(signOutSuccess());
            localStorage.removeItem("token");
            localStorage.removeItem("userSession");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("userSession");
            localStorage.removeItem("crm_offline_session");
            localStorage.removeItem("crm_auth_mode");
            sessionStorage.removeItem("authMode");
            sessionStorage.removeItem("email");
            sessionStorage.removeItem("id");
            sessionStorage.removeItem("profileId");
            navigate("/signin", { replace: true });
            toast.success("Signed out successfully");
          
        } catch (error) {
            console.error("Logout failed:", error);
            dispatch(signOutFailure(error.message));
            toast.error("Sign out failed");
        }
    };


    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({ ...user });

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async (e) => {
  e.preventDefault();

  try {

    const user = reduxUser?.email;

    const payload = {
      fullName: editData.name,
      phoneNumber: editData.phone,
      location: editData.location,
      bio: editData.bio,
      email: editData.email,
      profileImageUrl: editData.avatar || user.avatar || ""
    };

    const updatedData = await profileUpdate(user, payload);

    const mappedUser = {
      name: updatedData.fullName,
      role: updatedData.role,
      email: updatedData.email,
      phoneNumber: updatedData.phoneNumber,
      location: updatedData.location,
      profileImageUrl: updatedData.profileImageUrl,
      bio: updatedData.bio
    };

    setUser(mappedUser);

    const updatedSession = {
      ...reduxUser,
      ...mappedUser
    };

    dispatch(updateUser(updatedSession));

    sessionStorage.setItem(
      "userSession",
      JSON.stringify(updatedSession)
    );

    setIsEditModalOpen(false);

    toast.success("Profile updated successfully!");

  } catch (error) {

    toast.error(
      error.response?.data?.message || "Failed to update profile"
    );

    console.error("Profile update error:", error);
  }
};

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const base64String = reader.result;
                setEditData(prev => ({ ...prev, avatar: base64String }));
            };
        } catch (error) {
            toast.error("Failed to process photo");
            console.error("Photo processing error:", error);
        }
    };

  
    if (isInitialLoading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                <Skeleton active avatar={{ size: 120, shape: 'circle' }} paragraph={{ rows: 6 }} />
                <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Profile Info Card */}
            <div className="relative">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-10">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                        {/* Avatar */}
                        <div className="relative group">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="h-40 w-40 md:h-48 md:w-48 rounded-full object-cover border-4 border-white shadow-2xl bg-white"
                                />
                            ) : (
                                <div className="h-40 w-40 md:h-48 md:w-48 rounded-full border-4 border-white shadow-2xl bg-[#e7e6f6] flex items-center justify-center">
                                    <FiUser className="w-16 h-16 md:w-20 md:h-20 text-[#6d68b0]" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-2 pb-2">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{user.name}</h1>
                                <span className="px-4 py-1.5 bg-[#e7e6f6] text-[#6d68b0] rounded-full text-sm font-bold border border-[#c9c6e6]">
                                    {user.role}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 font-medium">
                                <span className="flex items-center gap-1.5">
                                    <FiMapPin className="text-[#6d68b0]" /> {user.location}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <FiMail className="text-[#6d68b0]" /> {user.email}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <FiPhone className="text-[#6d68b0]" /> {user.phone}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3 pb-2">
                            <button
                                onClick={() => {
                                    setEditData({ ...user });
                                    setIsEditModalOpen(true);
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-[#6d68b0] text-white! rounded-2xl font-bold shadow-lg hover:bg-[#5a5598] transition-all transform cursor-pointer"
                            >
                                <FiEdit2 className="w-4 h-4" /> Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 py-8 border-y border-slate-50">
                        {statsLoading ? (
  <div className="col-span-1 sm:col-span-3 flex flex-col gap-4 w-full">
    {[1, 2, 3].map((i) => (
      <Skeleton key={i} active paragraph={false} title={{ width: '100%' }} />
    ))}
  </div>
) : (
  displayStats.map((stat, i) => (
    <div key={i} className="text-center group">
      <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
      <p className="text-3xl font-black text-slate-900 transition-colors group-hover:text-[#6d68b0]">
        {stat.value}
      </p>
    </div>
  ))
)}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
                        <div className="lg:col-span-2 space-y-8">
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <FiUser className="text-[#6d68b0]" /> About Me
                                </h3>
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    {user.bio}
                                </p>
                            </section>

                            <section className=" gap-6">
                                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                        <FiMail className="text-[#6d68b0]" /> Contact Details
                                    </h4>
                                    <div className="space-y-3 pt-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Official Email</span>
                                            <span className="font-bold text-slate-800">{user.email}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Phone No</span>
                                            <span className="font-bold text-slate-800">{user.phone}</span>
                                        </div>
                                    </div>
                                </div>

                            </section>
                        </div>

                        {/* Right Col - Settings/Quick Actions */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Settings</h3>
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => navigate('/Change-password')}
                                    className="w-full py-4 cursor-pointer bg-[#e7e6f6] text-[#6d68b0] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#d8d6ee] transition-colors"
                                >
                                    <FiLock className="w-5 h-5" /> Change Password
                                </button>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full py-4 cursor-pointer bg-red-200 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                                >
                                    <FiLogOut className="w-5 h-5" /> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal
                title={<h2 className="text-2xl font-bold text-slate-900 m-0">Edit Profile</h2>}
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
                width={700}
                centered
                closeIcon={<FiX className="w-6 h-6 text-slate-500 hover:text-slate-700 transition-colors" />}
                styles={{
                    mask: { background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' },
                    content: { borderRadius: '24px', padding: '0px', overflow: 'hidden' }
                }}
            >
                <div>
                    <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
                        <div className="flex flex-col items-center mb-2">
                            <div className="relative group">
                                {editData.avatar || user.avatar ? (
                                    <img
                                        src={editData.avatar || user.avatar}
                                        alt="Profile Preview"
                                        className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-xl bg-white"
                                    />
                                ) : (
                                    <div className="h-28 w-28 rounded-full border-4 border-white shadow-xl bg-[#e7e6f6] flex items-center justify-center">
                                        <FiUser className="w-12 h-12 text-[#6d68b0]" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute bottom-1 right-1 p-2 bg-[#6d68b0] text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
                                    title="Change Photo"
                                >
                                    <FiCamera className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editData.name}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6d68b0] focus:border-transparent outline-none transition-all"
                                    placeholder="Enter full name"
                                />
                            </div>
                            {/* 
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Role</label>
                                <input
                                    type="text"
                                    name="role"
                                    value={editData.role}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6d68b0] focus:border-transparent outline-none transition-all"
                                    placeholder="Enter role"
                                />
                            </div> 
                            */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editData.email}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6d68b0] focus:border-transparent outline-none transition-all"
                                    placeholder="Enter email"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={editData.phone}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6d68b0] focus:border-transparent outline-none transition-all"
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-slate-700">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={editData.location}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6d68b0] focus:border-transparent outline-none transition-all"
                                    placeholder="Enter location"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-slate-700">Bio</label>
                                <textarea
                                    name="bio"
                                    value={editData.bio}
                                    onChange={handleEditChange}
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6d68b0] focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Tell us about yourself"
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex-1 py-3 px-6 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 px-6 rounded-xl font-bold text-white! bg-[#6d68b0] hover:bg-[#5a5598] shadow-lg shadow-[#6d68b0]/20 transition-all cursor-pointer"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;
