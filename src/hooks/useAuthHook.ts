import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signout } from "@/utils/apis/authApi";
import type { AppDispatch } from "@/store/store";

const useAuthHook = () => {
     const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(signout()).unwrap();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { handleLogout };
}

export default useAuthHook;