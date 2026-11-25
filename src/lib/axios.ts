import axios from "axios";

export const backendUrl =
  import.meta.env.VITE_ENVIRONMENT === "development"
    ? import.meta.env.VITE_BACKEND_DEVELOPMENT_URL
    : import.meta.env.VITE_BACKEND_PRODUCTION_URL;

export const frontendUrl =
  import.meta.env.VITE_ENVIRONMENT === "development"
    ? import.meta.env.VITE_FRONTEND_DEVELOPMENT_URL
    : import.meta.env.VITE_FRONTEND_PRODUCTION_URL;

export const axiosInstance = axios.create({
  baseURL: (backendUrl || "").endsWith("/api")
    ? backendUrl
    : `${backendUrl || ""}/api`,
  withCredentials: true,
});

// Fallback when the browser blocks third-party cookies (API is on another site).
export const AUTH_TOKEN_KEY = "auth_token";

export const setAuthToken = (token?: string | null) => {
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
};

axiosInstance.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    /* storage unavailable */
  }
  return config;
});
