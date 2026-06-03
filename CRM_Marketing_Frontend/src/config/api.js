const DEFAULT_API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN?.trim() ||
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  "http://10.113.28.12:8080";
const MOBILE_API_OVERRIDE_KEY = "crm_api_origin";

const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");
const ensureProtocol = (value = "") =>
  /^https?:\/\//i.test(value) ? value : `http://${value}`;
const normalizeUrl = (value = "") => trimTrailingSlash(ensureProtocol(value.trim()));

export const getApiOrigin = () => {
  if (typeof window === "undefined") {
    return normalizeUrl(DEFAULT_API_ORIGIN);
  }

  const override = window.localStorage.getItem(MOBILE_API_OVERRIDE_KEY)?.trim();
  if (override) {
    return normalizeUrl(override);
  }

  const { protocol, hostname } = window.location;
  const isWebHost =
    hostname &&
    hostname !== "localhost" &&
    hostname !== "127.0.0.1" &&
    !hostname.endsWith(".local");

  if (isWebHost) {
    return normalizeUrl(`${protocol}//${hostname}:8080`);
  }

  return normalizeUrl(DEFAULT_API_ORIGIN);
};

export const getApiBaseUrl = () =>
  `${trimTrailingSlash(import.meta.env.VITE_API_BASE_URL?.trim() || getApiOrigin())}/api`;

export const getProfileImageBaseUrl = () => `${getApiBaseUrl()}/profile/image/`;

export const API_ORIGIN = getApiOrigin();
export const API_BASE_URL = getApiBaseUrl();
export const PROFILE_IMAGE_BASE_URL = getProfileImageBaseUrl();
export const MOBILE_API_OVERRIDE_STORAGE_KEY = MOBILE_API_OVERRIDE_KEY;
export const normalizeApiOrigin = normalizeUrl;

export const setMobileApiOrigin = (value = "") => {
  if (typeof window === "undefined") {
    return getApiOrigin();
  }

  const normalizedOrigin = value.trim() ? normalizeUrl(value) : "";

  if (normalizedOrigin) {
    window.localStorage.setItem(MOBILE_API_OVERRIDE_KEY, normalizedOrigin);
  } else {
    window.localStorage.removeItem(MOBILE_API_OVERRIDE_KEY);
  }

  window.dispatchEvent(new CustomEvent("crm-api-origin-changed"));

  return normalizedOrigin || getApiOrigin();
};
