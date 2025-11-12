import axios from "axios";
import { axiosInstance } from "@/lib/axios";
import type { ApiBaseResponse } from "@/types/commonTypes";

export const getUploadUrl = async (file: File, userId: string, folder: string) => {
    const response = await axiosInstance.get("/s3/file/presigned-upload-url", {
        params: {
            folder: folder,
            userId,
            fileName: file.name,
            fileType: file.type,
        },
    });
    return response.data.data;
};


export const getSignedUrl = async (s3FileKey: string): Promise<string> => {
    const response = await axiosInstance.get("/s3/file/presigned-get-url", {
        params: { s3FileKey },
    });
    return response.data.data;
};

export const deleteUserFileFromS3 = async (folder: string): Promise<ApiBaseResponse> => {
    const response = await axiosInstance.delete("/s3/file", {
        data: { folder },
    });
    return response.data;
}

export const uploadToS3 = async (file: File, uploadUrl: string) => {
    await axios.put(uploadUrl, file, {
        headers: {
            "Content-Type": file.type,
        },
    });
};