import axios from "axios";

const baseURL =
  import.meta.env.VITE_ENVIRONMENT === "development"
    ? import.meta.env.VITE_BACKEND_DEVELOPMENT_URL
    : import.meta.env.VITE_BACKEND_PRODUCTION_URL;

console.log("baseURL : ", baseURL);

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
