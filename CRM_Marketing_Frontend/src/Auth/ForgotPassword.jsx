import React, { useState, useRef ,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

import {
    ForgotPasswordService,
    VerifyOtpService,
    ResetPasswordService,
    ResendOtpService
} from "../services/Auth.services";
import { IS_OFFLINE_LOCAL_MODE } from "../config/runtime";

const ForgotPassword = () => {

    const navigate = useNavigate();
    const [timer, setTimer] = useState(60);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [passwords, setPasswords] = useState({ new: "", confirm: "" });

    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const otpRefs = useRef([]);

    useEffect(() => {

    if (timer === 0) return;

    const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);

}, [timer]);
    /* ---------------- SEND OTP ---------------- */

    const handleSendOtp = async () => {

        if (!email)
            return toast.error("Please enter your email");

        setLoading(true);

        try {

            await ForgotPasswordService({ email });

            if (IS_OFFLINE_LOCAL_MODE) {
                toast.success("Local account found. Set your new password.");
                setStep(3);
            } else {
                toast.success("Verification code sent to your email");
                setStep(2);
                setTimer(60);
            }

        } catch (err) {

            toast.error(err?.response?.data || "Failed to send OTP");

        } finally {

            setLoading(false);

        }
    };

    /* ---------------- OTP INPUT ---------------- */

    const handleOtpChange = (val, index) => {

        if (isNaN(val)) return;

        const newOtp = [...otp];

        newOtp[index] = val.slice(-1);

        setOtp(newOtp);

        if (val && index < 5)
            otpRefs.current[index + 1].focus();
    };

    /* ---------------- VERIFY OTP ---------------- */

    const handleVerifyOtp = async () => {
        if (IS_OFFLINE_LOCAL_MODE) {
            setStep(3);
            return;
        }

        const enteredOtp = otp.join("");

        if (enteredOtp.length < 6)
            return toast.error("Please enter full OTP");

        setLoading(true);

        try {

            await VerifyOtpService({
                email,
                otp: enteredOtp
            });

            toast.success("OTP verified successfully");

            setStep(3);

        } catch (err) {

            toast.error(err?.response?.data || "Invalid or expired OTP");

        } finally {

            setLoading(false);

        }
    };

    /* ---------------- RESEND OTP ---------------- */

    const handleResendOtp = async () => {
        if (IS_OFFLINE_LOCAL_MODE) {
            toast.info("OTP is not needed for offline password reset.");
            return;
        }

        try {

            await ResendOtpService({ email });

            toast.success("OTP resent successfully");
setTimer(60);
            setOtp(new Array(6).fill(""));

            otpRefs.current[0].focus();

        } catch (err) {

            toast.error("Failed to resend OTP");

        }
    };

    /* ---------------- RESET PASSWORD ---------------- */

    const handleReset = async () => {

        if (!passwords.new || !passwords.confirm)
            return toast.error("Please fill both password fields");

        if (passwords.new !== passwords.confirm)
            return toast.error("Passwords do not match");

        setLoading(true);

        try {

            await ResetPasswordService({
                email,
                newPassword: passwords.new,
                confirmPassword: passwords.confirm
            });

            toast.success("Password reset successfully");

            navigate("/signin");

        } catch (err) {

            toast.error(err?.response?.data || "Password reset failed");

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#e7e6f6] via-[#c9c6e6] to-[#6d68b0] p-4">

            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex max-lg:flex-col">

                {/* Left Side */}
                <div className="max-lg:hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#f0effa] to-[#e7e6f6] flex-col justify-center items-center">
                    <img src={"/Banner.jpg"} alt="Logo" className="w-full h-full" />
                </div>

                {/* Right Side */}
                <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">

                    <h2 className="text-3xl font-bold text-gray-800 mb-8">

                        {step === 1 && "Forgot Password"}
                        {step === 2 && (IS_OFFLINE_LOCAL_MODE ? "Reset Password" : "Verification")}
                        {step === 3 && "Reset Password"}

                    </h2>

                    <div className="space-y-8">

                        {/* ---------------- STEP 1 EMAIL ---------------- */}

                        <div className={`${step > 1 ? "opacity-50 pointer-events-none" : ""}`}>

                            <label className="block text-sm font-medium text-gray-600 mb-2 pl-1">
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={step > 1}
                                placeholder="Enter your email"
                                className="w-full px-4 mb-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6d68b0]"
                            />

                            {step === 1 && (

                                <button
                                    onClick={handleSendOtp}
                                    disabled={loading}
                                    className="w-full mt-4! bg-linear-to-r from-[#8b87c1] to-[#6d68b0] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                                >
                                    {loading ? "Sending..." : (IS_OFFLINE_LOCAL_MODE ? "Continue" : "Send OTP")}
                                </button>

                            )}

                        </div>

                        {/* ---------------- STEP 2 OTP ---------------- */}

                        {!IS_OFFLINE_LOCAL_MODE && step >= 2 && (

                            <div className={`${step > 2 ? "opacity-50 pointer-events-none" : ""}`}>

                                <label className="block text-sm font-medium text-gray-600 mb-2 pl-1">
                                    Verification Code
                                </label>

                                <div className="flex justify-between gap-2">

                                    {otp.map((digit, i) => (

                                        <input
                                            key={i}
                                            ref={(el) => otpRefs.current[i] = el}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            disabled={step > 2}
                                            onChange={(e) => handleOtpChange(e.target.value, i)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Backspace" && !digit && i > 0)
                                                    otpRefs.current[i - 1].focus();
                                            }}
                                            className="w-full h-12 text-center text-xl font-bold border border-gray-200 rounded-xl focus:border-[#6d68b0] outline-none"
                                        />

                                    ))}

                                </div>

                                {step === 2 && (

                                    <>
                                        <button
                                            onClick={handleVerifyOtp}
                                            disabled={loading}
                                            className="w-full mt-4! bg-linear-to-r from-[#8b87c1] to-[#6d68b0] text-white py-3 rounded-xl font-semibold hover:shadow-lg"
                                        >
                                            {loading ? "Verifying..." : "Verify OTP"}
                                        </button>

                                       <div className="text-center mt-3">

    {timer > 0 ? (
        <p className="text-sm text-gray-500">
            Resend OTP in <span className="font-semibold text-[#6d68b0]">{timer}s</span>
        </p>
    ) : (
        <button
            onClick={handleResendOtp}
            className="text-sm text-[#6d68b0] hover:underline"
        >
            Resend OTP
        </button>
    )}

</div>
                                    </>
                                )}

                            </div>

                        )}

                        {/* ---------------- STEP 3 RESET PASSWORD ---------------- */}

                        {step === 3 && (

                            <div className="space-y-4">

                                <div>

                                    <label className="block text-sm font-medium text-gray-600 mb-1.5 pl-1">
                                        New Password
                                    </label>

                                    <div className="relative">

                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            value={passwords.new}
                                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl pr-12"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        >
                                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                        </button>

                                    </div>

                                </div>

                                <div>

                                    <label className="block text-sm font-medium text-gray-600 mb-1.5 pl-1">
                                        Confirm Password
                                    </label>

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirm password"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                    />

                                </div>

                                <button
                                    onClick={handleReset}
                                    disabled={loading}
                                    className="w-full mt-2 bg-linear-to-r from-[#8b87c1] to-[#6d68b0] text-white py-3 rounded-xl font-semibold hover:shadow-lg"
                                >
                                    {loading ? "Updating..." : "Reset Password"}
                                </button>

                            </div>

                        )}

                    </div>

                    <div className="mt-8 text-center">

                        <Link
                            to="/signin"
                            className="text-sm font-medium text-gray-500 hover:text-[#6d68b0]"
                        >
                            Back to Sign In
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ForgotPassword;
