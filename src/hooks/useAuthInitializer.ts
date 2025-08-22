import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { axiosInstance } from "@/components/lib/axios";

export function useAuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/currentUser");
        dispatch(setUser(data.user));
      } catch {
        dispatch(setUser(null));
      }
    };

    fetchUser();
  }, [dispatch]);
}
