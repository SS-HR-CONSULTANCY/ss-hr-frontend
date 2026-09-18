import { axiosInstance } from "@/lib/axios";

export const adminFetchAllCategories = async () => {
  const response = await axiosInstance.get("/admin/categories");
  return response.data;
};

export const adminCreateCategory = async (name: string) => {
  const response = await axiosInstance.post("/admin/categories", { name });
  return response.data;
};
