import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signout } from "@/utils/apis/authApi";
import type { AppDispatch } from "@/store/store";
import { resetJobSlice } from "@/store/slices/jobSlice";
import { resetAuthStore } from "@/store/slices/authSlice";
import { resetChatSlice } from "@/store/slices/chatSlice";
import { resetUserSlice } from "@/store/slices/userSlice";
import { resetPackageSlice } from "@/store/slices/packageSlice";
import { resetPaymentSlice } from "@/store/slices/paymentSlice";
import { resetTestimonialSlice } from "@/store/slices/testimonialSlice";

const useAuthHook = ({ route }: { route: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await dispatch(signout()).unwrap();
      if (res.success) {
        toast.success(res.message || "Logout successfully");
        dispatch(resetAuthStore());
        dispatch(resetChatSlice());
        dispatch(resetJobSlice());
        dispatch(resetPackageSlice());
        dispatch(resetPaymentSlice());
        dispatch(resetTestimonialSlice());
        dispatch(resetUserSlice());
        navigate(route);
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
