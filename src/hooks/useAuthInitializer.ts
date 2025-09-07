import { useEffect } from "react";
import { axiosInstance } from "@/lib/axios";
import { useAppDispatch } from "@/hooks/redux";
import { setAuthUser } from "@/store/slices/authSlice";

export function useAuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/currentUser");
        dispatch(setAuthUser(data.user));
      } catch {
        dispatch(setAuthUser(null));
      }
    };

    fetchUser();
  }, [dispatch]);
}
