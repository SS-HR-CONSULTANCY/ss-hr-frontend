import axios from "axios";
import { axiosInstance } from "@/lib/axios";

export const getUploadUrl = async (file: File, userId: string, folder: string) => {
  const response = await axiosInstance.get("/s3/upload-url", {
    params: {
      folder: folder,
      userId,
      fileName: file.name,
      fileType: file.type,
    },
  });
  return response.data;
};

export const uploadToS3 = async (file: File, uploadUrl: string) => {
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
};

export const getResumeUrl = async (key: string): Promise<string> => {
  const { data } = await axiosInstance.get("/s3/resume-url", {
    params: { key },
  });
  return data.url;
};