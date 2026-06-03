import axios from "axios";
import { getApiBaseUrl } from "../config/api";

const apiInterceptor = axios.create({
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiInterceptor.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.baseURL = getApiBaseUrl();

  return config;
});

export default apiInterceptor;
