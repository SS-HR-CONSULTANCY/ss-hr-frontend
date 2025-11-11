import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import type { Role } from "@/utils/commonZod";
import { useNavigate } from "react-router-dom";
import { signout } from "@/utils/apis/authApi";
import { roleLoginRoutes } from "@/utils/constants";
import { resetJobSlice } from "@/store/slices/jobSlice";
import { resetAuthStore } from "@/store/slices/authSlice";
import { resetChatSlice } from "@/store/slices/chatSlice";
import { resetUserSlice } from "@/store/slices/userSlice";
import { resetPackageSlice } from "@/store/slices/packageSlice";
import { resetPaymentSlice } from "@/store/slices/paymentSlice";
import { resetTestimonialSlice } from "@/store/slices/testimonialSlice";
import { persistAppStore, type AppDispatch, type RootState } from "@/store/store";

const useAuthHook = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const logoutRedirect = roleLoginRoutes[user?.role as Role] ?? "/login"; 

  const handleLogout = async () => {
    try {
      const res = await dispatch(signout()).unwrap();
      if (res.success) {
        toast.success(res.message || "Logout successfully");
        dispatch(resetChatSlice());
        dispatch(resetJobSlice());
        dispatch(resetPackageSlice());
        dispatch(resetPaymentSlice());
        dispatch(resetTestimonialSlice());
        dispatch(resetAuthStore());
        dispatch(resetUserSlice());
        persistAppStore.purge();
        navigate(logoutRedirect);
      } else {
        toast.error(res.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { handleLogout };
};

export default useAuthHook;
