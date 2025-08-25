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
            console.log("Error Checking : ",error);
            if(error.response?.status === 400) {
                console.log("first")
                return Promise.reject(error);
            }
            if (error.response?.status === 401) {
                console.log("two")
                store.dispatch(setAuthUser(null));
                toast.error("Session expired. Please log in again.");
                return;
            }
            if (error.response?.status === 403) {
                console.log("three")
                store.dispatch(setAuthUser(null));
                toast.error("Your account has been blocked.");
                return;
            }    
            console.log("four")
            return Promise.reject(error);
        }
    );
};