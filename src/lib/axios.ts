import axios from "axios";

const baseURL =
  import.meta.env.VITE_ENVIRONMENT === "development"
    ? import.meta.env.VITE_APP_API_BASE_URL
    : import.meta.env.VITE_BACKEND_PRODUCTION_URL;

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});