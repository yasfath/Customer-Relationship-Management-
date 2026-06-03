import { Capacitor, CapacitorHttp } from "@capacitor/core";
import apiInterceptor from "../interceptors/interceptors";
import { getApiBaseUrl } from "../config/api";

const isNativeMobile = Capacitor.isNativePlatform();

const buildHeaders = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const buildUrl = (path, params) => {
  const baseUrl = `${getApiBaseUrl().replace(/\/+$/, "")}/`;
  const cleanPath = path.replace(/^\/+/, "");
  const url = new URL(cleanPath, baseUrl);

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

const normalizeNativeError = (error) => {
  if (error?.response || error?.request) {
    return error;
  }

  const message = error?.message || "Request failed";

  return {
    ...error,
    message,
    request: true,
  };
};

export const apiRequest = async ({ method = "GET", path, data, params }) => {
  if (!isNativeMobile) {
    return apiInterceptor.request({
      method,
      url: path,
      data,
      params,
    });
  }

  try {
    const response = await CapacitorHttp.request({
      method,
      url: buildUrl(path, params),
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
  } catch (error) {
    throw normalizeNativeError(error);
  }
};
