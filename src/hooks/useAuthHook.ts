import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signout } from "@/utils/apis/authApi";
import { resetJobSlice } from "@/store/slices/jobSlice";
import { resetAuthStore } from "@/store/slices/authSlice";
import { resetChatSlice } from "@/store/slices/chatSlice";
import { resetUserSlice } from "@/store/slices/userSlice";
import { resetPackageSlice } from "@/store/slices/packageSlice";
import { resetPaymentSlice } from "@/store/slices/paymentSlice";
import { resetTestimonialSlice } from "@/store/slices/testimonialSlice";
import { persistAppStore, type AppDispatch, type RootState } from "@/store/store";

const useAuthHook = ({ route }: { route: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userAddress, userCareerData, selectedUserId, isAddUserModalOpen } = useSelector((state: RootState) => state.user);

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
        persistAppStore.purge();
        navigate(route);
        console.log("userAddress : ",userAddress);
        console.log("userCareerData : ",userCareerData);
        console.log("selectedUserId : ",selectedUserId);
        console.log("isAddUserModalOpen : ",isAddUserModalOpen);
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
