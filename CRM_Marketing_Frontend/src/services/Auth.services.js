import { Capacitor, CapacitorHttp } from "@capacitor/core";
import apiInterceptor from "../interceptors/interceptors";
import { getApiBaseUrl } from "../config/api";
import { apiRequest } from "./request";
import { IS_OFFLINE_LOCAL_MODE } from "../config/runtime";
import {
    offlineChangePassword,
    offlineForgotPassword,
    offlineLogin,
    offlineLogout,
    offlineResetPassword,
    offlineSignup,
} from "../offline/offlineLocal";

const isNativeMobile = Capacitor.isNativePlatform();

const buildUrl = (path) => {
    const baseUrl = `${getApiBaseUrl().replace(/\/+$/, "")}/`;
    const cleanPath = path.replace(/^\/+/, "");
    return new URL(cleanPath, baseUrl).toString();
};

const buildHeaders = () => {
    const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const nativePost = async (path, data) => {
    const response = await CapacitorHttp.post({
        url: buildUrl(path),
        headers: buildHeaders(),
        data,
        connectTimeout: 30000,
        readTimeout: 30000,
    });

    return {
        data: response.data,
        status: response.status,
        headers: response.headers,
    };
};



export const signupService = async (data) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await offlineSignup(data);
        }
        if (isNativeMobile) {
            return await nativePost("/profile/create", data);
        }
        const response = await apiInterceptor.post("/profile/create", data);
        return response;
    } catch (error) {
        throw error;
    }
}


export const LoginService = async (data) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await offlineLogin(data);
        }
        if (isNativeMobile) {
            const response = await nativePost("/auth/login", data);
            return response.data;
        }
        const response = await apiInterceptor.post("/auth/login", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const ChangePasswordService = async (data) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await offlineChangePassword(data);
        }
        const response = await apiRequest({
            method: "POST",
            path: "/auth/change-password",
            data,
        });
        return response.data ?? response;
    } catch (error) {
        throw error;
    }
}

export const LogoutService = async () => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await offlineLogout();
        }
        const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");

        const response = await apiRequest({
            method: "POST",
            path: "/auth/logout",
            data: {
                token,
            },
        });

        return response.data ?? response;
    } catch (error) {
        throw error;
    }
};


export const ForgotPasswordService = async (data) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await offlineForgotPassword(data);
        }
        const response = await apiInterceptor.post("/auth/forgot-password", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const VerifyOtpService = async (data) => {
    try {
        const response = await apiInterceptor.post("/auth/verify-otp", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const ResetPasswordService = async (data) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await offlineResetPassword(data);
        }
        const response = await apiInterceptor.post("/auth/change/reset-password", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const ResendOtpService = async (data) => {
    try {
        const response = await apiInterceptor.post("/auth/resend-otp", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
