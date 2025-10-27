import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signout } from "@/utils/apis/authApi";
import type { AppDispatch } from "@/store/store";
import { toast } from "react-toastify";
import { clearAuthStore } from "@/store/slices/authSlice";

const useAuthHook = ({ route }: { route: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await dispatch(signout()).unwrap();
      if (res.success) {
        toast.success(res.message || "Logout successfully");
        dispatch(clearAuthStore());
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
