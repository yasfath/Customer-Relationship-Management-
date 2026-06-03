import { useNavigate } from "react-router-dom";
import { ChangePasswordService } from "../services/Auth.services";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setData({ ...data, [e.target.id]: e.target.value });
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.newPassword !== data.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        const payload = {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
        };

        setLoading(true);
        try {
            const response = await ChangePasswordService(payload);
            toast.success(response || "Password updated successfully!");
            navigate("/Profile");
        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message ||
                "An error occurred. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#e7e6f6] via-[#c9c6e6] to-[#6d68b0] p-4">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex max-lg:flex-col">

                {/* Left Side - Illustration */}
                <div className="max-lg:hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#f0effa] to-[#e7e6f6] flex-col justify-center items-center">
                    <img
                        src={"/Banner.jpg"}
                        alt="Logo"
                        className="w-full h-full"
                    />
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">

                    <h2 className="text-3xl font-bold text-gray-800 mb-8">
                        Change Password
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2 pl-1">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    id="oldPassword"
                                    type={showPasswords.current ? "text" : "password"}
                                    value={data.oldPassword}
                                    onChange={handleChange}
                                    placeholder="Enter current password"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl pr-12 focus:outline-none focus:ring-2 focus:ring-[#6d68b0] focus:border-transparent transition text-gray-800"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility("current")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6d68b0] transition-colors"
                                >
                                    {showPasswords.current ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2 pl-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={showPasswords.new ? "text" : "password"}
                                    value={data.newPassword}
                                    onChange={handleChange}
                                    placeholder="Set new password"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl pr-12 focus:outline-none focus:ring-2 focus:ring-[#6d68b0] focus:border-transparent transition text-gray-800"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility("new")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6d68b0] transition-colors"
                                >
                                    {showPasswords.new ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2 pl-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showPasswords.confirm ? "text" : "password"}
                                    value={data.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl pr-12 focus:outline-none focus:ring-2 focus:ring-[#6d68b0] focus:border-transparent transition text-gray-800"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility("confirm")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6d68b0] transition-colors"
                                >
                                    {showPasswords.confirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full text-white! bg-linear-to-r from-[#8b87c1] to-[#6d68b0] py-3 rounded-xl font-semibold hover:shadow-lg transition-all shadow-md active:scale-[0.99] mt-2"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate("/Profile")}
                            className="text-sm font-medium text-gray-500 hover:text-[#6d68b0] transition-colors underline-offset-4 hover:underline"
                        >
                            Cancel and Return
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
