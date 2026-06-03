import axios from "axios";
import { getApiBaseUrl } from "../config/api";

const apiInterceptor = axios.create({
  timeout: 30000,
});

apiInterceptor.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.baseURL = getApiBaseUrl();
  return config;
});

export default apiInterceptor;