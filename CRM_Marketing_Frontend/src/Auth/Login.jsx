import React, { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginService } from "../services/Auth.services";
import { useDispatch } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../Redux/user/userSlice.js";
import {
  getApiBaseUrl,
  MOBILE_API_OVERRIDE_STORAGE_KEY,
  normalizeApiOrigin,
  setMobileApiOrigin,
} from "../config/api";
import { IS_OFFLINE_LOCAL_MODE } from "../config/runtime";


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isNativeMobile = Capacitor.isNativePlatform();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiOrigin, setApiOrigin] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return localStorage.getItem(MOBILE_API_OVERRIDE_STORAGE_KEY) || "";
  });
  const [currentApiBaseUrl, setCurrentApiBaseUrl] = useState(() => getApiBaseUrl());

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

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






  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.id]: e.target.value,
    });
  };

  /* =====================================================
     COMMENTED TEMPORARILY — API / JWT / REDUX FLOW
  ===================================================== */
const handleSubmit = async () => {
  if (!loginData.email || !loginData.password) {
    toast.error("Please enter email and password");
    return;
  }

  setLoading(true);

  try {
    dispatch(signInStart());

    const data = await LoginService(loginData);

    if (data.success === false) {
      const errorMsg = data.errMessage || "Login failed";
      dispatch(signInFailure(errorMsg));
      toast.error(errorMsg);
      return;
    }

    if (!data?.token) {
      throw new Error("Login response did not include a token.");
    }

    localStorage.setItem("token", data.token);
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("userSession", JSON.stringify(data));
    sessionStorage.setItem("profileId", data.profileId || "");
    sessionStorage.setItem("email", data.email || loginData.email);
    sessionStorage.setItem("id", data.id?.toString() || "");

    dispatch(signInSuccess(data));

    toast.success("Login successful!");
    navigate("/DashBoard");
  } catch (err) {
    const msg =
      err.response?.data?.errMessage ||
      err.response?.data?.message ||
      (err.code === "ECONNABORTED"
        ? "Login request timed out. Please check backend and try again."
        : "") ||
      (err.request
        ? IS_OFFLINE_LOCAL_MODE
          ? "Unable to read local account on this device."
          : "Could not get login response. Check the mobile API IP and backend server."
        : "") ||
      err.message ||
      "Something went wrong";

    dispatch(signInFailure(msg));
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#e7e6f6] via-[#c9c6e6] to-[#6d68b0] p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex max-lg:flex-col">

        {/* Left Side - Illustration */}
        <div className="max-lg:hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#f0effa] to-[#e7e6f6]  flex-col justify-center items-center">
          <img
            src={"/Banner.jpg"}
            alt="Logo"
            className="w-full h-full"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-16 flex flex-col justify-center">
          {!isNativeMobile && (
            <div className="mb-3 inline-flex w-fit rounded-full bg-[#eeecfb] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#6d68b0]">
              Mobile Build 2026-04-09-2
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
            Sign In
          </h2>

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

          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={loginData.email}
                onChange={handleChange}
                placeholder="Enter your mail"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => navigate("/Forgotpassword")}
                className="text-sm text-[#6d68b0] font-medium cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full text-white! bg-linear-to-r from-[#8b87c1] to-[#6d68b0] py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>

          <p className="mt-3! text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to={'/signup'}
              className="text-[#6d68b0] font-semibold"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;






// import React, { use, useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import {
//   signinStart,
//   signinSuccess,
//   signinFailure,
// } from "../Redux/user/userSlice";
// import { jwtDecode } from "jwt-decode";

// const Login = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [rememberMe, setRememberMe] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [formData, setFormData] = useState({});

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value,
//     });
//   };

//   const handleSubmit = async () => {
//     setError("");
//     setLoading(true);
//     dispatch(signinStart());
//     try {
//       console.log(" i am trying to login ");
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       const data = await response.json();
//       if (data.success == false) {
//         setLoading(false);
//         dispatch(signinFailure(data.errMessage));
//         setError(data.errMessage);
//         return;
//       }
//       setLoading(false);
//       setError("");
//       console.log(data);
//       const userData = {
//         id: data.userId,
//         name: data.username,
//         role: data.role,
//       };
//       const cookies = data.token;
//       console.log("cookies : ", cookies);
//       const payload = jwtDecode(cookies);
//       console.log(" Decode : ", payload);
//       dispatch(signinSuccess(userData));
//       if (payload.role == "SUPER_ADMIN") {
//         navigate("/super-admin");
//       } else if (payload.role == "JUNIOR_HR") {
//         navigate("/hr");
//       } else if (payload.role == "SENIOR_HR") {
//         navigate("/hr");
//       }
//     } catch (err) {
//       dispatch(signinFailure(err.errMessage));
//       setLoading(false);
//       setError(err.message || "Login failed. Please check your credentials.");
//       console.error("Login error:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-cyan-50 to-teal-50 p-4">
//       <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">
//         {/* Left Side - Illustration */}
//         <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-100 to-cyan-50 p-12 flex-col justify-center items-center relative">
//           <img
//             src={"/Logo.png"}
//             alt="Logo"
//             className="w-full h-auto max-w-lg object-contain"
//           />
//         </div>

//         {/* Right Side - Login Form */}
//         <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
//           {/* Logo/Title */}
//           <div className="mb-8">
//             <div className="flex items-center gap-2 mb-2">
//               <div className="w-8 h-8">
//                 <svg viewBox="0 0 40 40" className="w-full h-full">
//                   <path
//                     d="M 5 20 Q 15 10, 25 20 T 35 20 Q 25 30, 15 20 T 5 20"
//                     fill="none"
//                     stroke="#06b6d4"
//                     strokeWidth="3"
//                   />
//                 </svg>
//               </div>
//               <h1 className="text-2xl font-bold text-gray-800">HRM</h1>
//             </div>
//           </div>

//           {/* Sign In Header */}
//           <h2 className="text-3xl font-bold text-gray-800 mb-8">Sign In</h2>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
//               {error}
//             </div>
//           )}

//           {/* Login Form */}
//           <div className="space-y-6">
//             {/* Email Input */}
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-2">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={formData.email}
//                 required
//                 onChange={handleChange}
//                 placeholder="Enter your mail"
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
//                 disabled={loading}
//               />
//             </div>

//             {/* Password Input */}
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   value={formData.password}
//                   required
//                   onChange={handleChange}
//                   placeholder="Enter your password"
//                   className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition pr-12"
//                   disabled={loading}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>

//             {/* Remember Me & Forgot Password */}
//             <div className="flex items-center justify-between">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   className="w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500"
//                   disabled={loading}
//                 />
//                 <span className="text-sm text-gray-600">Remember Me</span>
//               </label>
//               <button className="text-sm text-cyan-500 hover:text-cyan-600 font-medium">
//                 Forgot password?
//               </button>
//             </div>

//             {/* Submit Button */}
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="w-full bg-linear-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Signing In...</span>
//                 </>
//               ) : (
//                 "Sign In"
//               )}
//             </button>
//           </div>

//           {/* Sign Up Link */}
//           <p className="mt-6 text-center text-sm text-gray-600">
//             Don't have an account?{" "}
//             <button
//               onClick={() => navigate("/signup")}
//               className="text-cyan-500 hover:text-cyan-600 font-semibold"
//             >
//               Sign Up
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
