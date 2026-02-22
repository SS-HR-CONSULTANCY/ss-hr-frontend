import { axiosInstance, backendUrl } from "@/lib/axios";
import type { ApiBaseResponse } from "@/types/commonTypes";

export const getUploadUrl = async (
  file: File,
  userId: string,
  folder: string,
): Promise<{ uploadUrl: string; key: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post("/s3/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  // The backend now actually does the upload here and returns { uploadUrl, key }
  return response.data.data;
};

export const getSignedUrl = async (s3FileKey: string): Promise<string> => {
  if (!s3FileKey) return "";
  if (s3FileKey.startsWith("http")) return s3FileKey;
  
  const base = backendUrl?.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
  return `${base}/api/uploads/${s3FileKey}`;
};

export const deleteUserFileFromS3 = async (
  folder: string,
): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.delete("/s3", {
    data: { folder },
  });
  return response.data;
};

export const uploadToS3 = async (file: File, uploadUrl: string) => {
  // This is now a no-op! The file was already uploaded in getUploadUrl!
  // We keep this empty function to prevent breaking the existing React components.
  return Promise.resolve();
};
