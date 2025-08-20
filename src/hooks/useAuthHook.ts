import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "@/store/store";
import { logoutUser } from "@/store/slices/authSlice";

const useAuthHook = () => {
     const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { handleLogout };
}

export default useAuthHook;