import { axiosInstance } from "@/lib/axios";
import { buildQueryParams, parseNewCommonResponse } from "../helpers/apiHelpers";
import type { ApiBaseResponse, ApiPaginatedResponse, FetchFunctionParams } from "@/types/commonTypes";
import type { AdminCreateNewJob, AdminfetchAllJobsResponse, AdminUpdateJobRequest } from "@/types/apiTypes/adminApiTypes";
import type { FetchJobDetailsResponse } from "@/types/apiTypes/commonApiTypes";

export const createJob = async (jobData: AdminCreateNewJob): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.post('/admin/jobs', jobData);
  return response.data;
};

export const adminFetchAllJobs = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<AdminfetchAllJobsResponse>> => {
    const query = buildQueryParams(params);
    const response = await axiosInstance.get(`/admin/jobs${query ? `?${query}` : ''}`);
    return parseNewCommonResponse<AdminfetchAllJobsResponse>(response.data.data);
};


export const adminGetJobById = async (jobId: string): Promise<FetchJobDetailsResponse> => {
  const response = await axiosInstance.get(`/admin/jobs/${jobId}`);
  return response.data.data;
};

export const adminUpdateJob = async (jobId: string, jobData: AdminUpdateJobRequest): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.put(`/admin/jobs/${jobId}`, jobData);
  return response.data;
};

export const deleteJob = async (jobId: string): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.delete(`/admin/jobs/${jobId}`);
  return response.data;
};