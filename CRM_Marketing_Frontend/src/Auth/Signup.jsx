import React, { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signupService } from "../services/Auth.services";
import {
  getApiBaseUrl,
  MOBILE_API_OVERRIDE_STORAGE_KEY,
  normalizeApiOrigin,
  setMobileApiOrigin,
} from "../config/api";
import { IS_OFFLINE_LOCAL_MODE } from "../config/runtime";

const normalizeRole = (role) => {
  const value = (role || "").toString().trim().toUpperCase();
  if (value === "SALESMANAGER") return "SALES_MANAGER";
  if (value === "SALESEXECUTIVE") return "SALES_EXECUTIVE";
  return value;
};

const getSignupErrorMessage = (error) => {
  if (error?.response) {
    return (
      error.response.data?.errMessage ||
      error.response.data?.message ||
      `Signup failed with status ${error.response.status}.`
    );
  }

  if (error?.code === "ECONNABORTED") {
    return "Signup request timed out. Please check backend and try again.";
  }

  if (error?.request) {
    return IS_OFFLINE_LOCAL_MODE
      ? "Unable to save local account on this device."
      : "Could not get signup response. Check the mobile API IP and backend server.";
  }

  return error?.message || "Unable to connect to server. Please try again later.";
};

const Signup = () => {
  const navigate = useNavigate();
  const isNativeMobile = Capacitor.isNativePlatform();

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    role: "ADMIN",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiOrigin, setApiOrigin] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return localStorage.getItem(MOBILE_API_OVERRIDE_STORAGE_KEY) || "";
  });
  const [currentApiBaseUrl, setCurrentApiBaseUrl] = useState(() => getApiBaseUrl());

  useEffect(() => {
    const syncApiBaseUrl = () => {
      setApiOrigin(localStorage.getItem(MOBILE_API_OVERRIDE_STORAGE_KEY) || "");
      setCurrentApiBaseUrl(getApiBaseUrl());
    };

    window.addEventListener("crm-api-origin-changed", syncApiBaseUrl);

    return () => {
      window.removeEventListener("crm-api-origin-changed", syncApiBaseUrl);
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.fullName ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
  userName: formData.username,
  fullName: formData.fullName,
  email: formData.email,
  password: formData.password,
  role: normalizeRole(formData.role),

  phoneNumber: "1234567890",
  location: "Chennai",
  bio: "Test user"
};

      console.log("Sending payload:", payload);
      console.log("Signup URL:", `${getApiBaseUrl()}/profile/create`);

      const response = await signupService(payload);
      const data = response?.data;

      console.log("Signup status:", response?.status);
      console.log("Signup response:", data);

      if (response?.status !== 200 && response?.status !== 201) {
        toast.error(data?.errMessage || data?.message || "Registration failed");
        return;
      }

      if (data?.success === false) {
        toast.error(data?.errMessage || "Registration failed");
        return;
      }

      toast.success("Account created successfully!");
      navigate("/signin");
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("RESPONSE:", err?.response);
      console.log("REQUEST:", err?.request);
      console.log("ERROR CODE:", err?.code);
      console.error("Registration error:", err);

      toast.error(getSignupErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleApiOriginSave = () => {
    const normalizedOrigin = apiOrigin.trim()
      ? normalizeApiOrigin(apiOrigin)
      : "";

    if (!normalizedOrigin) {
      setMobileApiOrigin("");
      setApiOrigin("");
      setCurrentApiBaseUrl(getApiBaseUrl());
      toast.success("Mobile API setting cleared.");
      return;
    }

    setMobileApiOrigin(normalizedOrigin);
    setApiOrigin(normalizedOrigin);
    setCurrentApiBaseUrl(getApiBaseUrl());
    toast.success("Mobile API setting saved.");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#e7e6f6] via-[#c9c6e6] to-[#6d68b0] p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex max-lg:flex-col">
        <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#f0effa] to-[#e7e6f6] flex-col justify-center items-center relative">
          <img
            src="/Banner.jpg"
            alt="Logo"
            className="w-full h-full"
            onError={(e) => {
              console.error("Failed to load banner image");
              e.target.style.display = "none";
            }}
          />
        </div>

        <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-16 flex flex-col justify-center">
          {!IS_OFFLINE_LOCAL_MODE && (
            <div className="mb-5 rounded-2xl border border-[#d8d4ef] bg-[#f7f6fd] p-3">
              <p className="text-xs sm:text-sm font-medium text-gray-700">
                Backend URL
              </p>
              <p className="mt-1 text-[11px] sm:text-xs text-gray-500 break-all">
                Current: {currentApiBaseUrl}
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={apiOrigin}
                  onChange={(e) => setApiOrigin(e.target.value)}
                  placeholder="http://192.168.1.5:8080"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleApiOriginSave}
                  disabled={loading}
                  className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#6d68b0] shadow-sm ring-1 ring-[#d8d4ef]"
                >
                  Save URL
                </button>
              </div>
            </div>
          )}

          {!isNativeMobile && (
            <div className="mb-3 inline-flex w-fit rounded-full bg-[#eeecfb] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#6d68b0]">
              Mobile Build 2026-04-09-2
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                UserName
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                placeholder="Enter your User Name"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Role
              </label>

              <input
                type="text"
                value="ADMIN"
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100"
              />
              <input type="hidden" name="role" value={formData.role || "ADMIN"} />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition pr-12"
                  placeholder="Create a password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6d68b0] text-white py-3 rounded-xl font-semibold hover:bg-[#5a54a0] transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <div className="text-white">Sign Up</div>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-[#6d68b0] hover:underline font-semibold"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
