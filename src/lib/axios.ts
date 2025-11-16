import axios from "axios";

export const backendUrl = import.meta.env.VITE_ENVIRONMENT === "development" ? import.meta.env.VITE_BACKEND_DEVELOPMENT_URL : import.meta.env.VITE_BACKEND_PRODUCTION_URL;

export const frontendUrl = import.meta.env.VITE_ENVIRONMENT === "development" ? import.meta.env.VITE_FRONTEND_DEVELOPMENT_URL : import.meta.env.VITE_FRONTEND_PRODUCTION_URL

export const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

