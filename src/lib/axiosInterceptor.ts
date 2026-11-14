import { store } from "@/store/store";
import { toast } from "react-toastify";
import { axiosInstance } from "./axios";
import { setAuthUser } from "@/store/slices/authSlice";

export const setupAxiosInterceptors = () => {
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 400) {
        return error.response;
      }
      if (error.response?.status === 401) {
        // Silently sign out; the protected routes redirect to the login page.
        store.dispatch(setAuthUser(null));
        return Promise.reject(error);
      }
      if (error.response?.status === 403) {
        store.dispatch(setAuthUser(null));
        toast.error("Your account has been blocked.");
        return;
      }
      return Promise.reject(error);
    },
  );
};
