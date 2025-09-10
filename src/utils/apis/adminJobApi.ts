import { axiosInstance } from "@/lib/axios";
import { buildQueryParams, parseNewCommonResponse } from "../helpers/apiHelpers";
import type { ApiBaseResponse, ApiPaginatedResponse, FetchFunctionParams } from "@/types/commonTypes";
import type { AdminCreateNewJob, AdminfetchAllJobsResponse, AdminGetJobResponse, AdminUpdateJobRequest, AdminUpdateJobResponse, AsminCreateJobResponse } from "@/types/apiTypes/adminApiTypes";

export const createJob = async (jobData: AdminCreateNewJob): Promise<AsminCreateJobResponse> => {
  const response = await axiosInstance.post('/admin/jobs', jobData);
  return response.data;
};

export const adminFetchAllJobs = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<AdminfetchAllJobsResponse>> => {
    const query = buildQueryParams(params);
    const response = await axiosInstance.get(`/admin/jobs${query ? `?${query}` : ''}`);
    return parseNewCommonResponse<AdminfetchAllJobsResponse>(response.data.data);
};


export const getJobById = async (jobId: string): Promise<AdminGetJobResponse> => {
  const response = await axiosInstance.get(`/admin/jobs/${jobId}`);
  return response.data;
};

export const adminUpdateJob = async (jobData: AdminUpdateJobRequest): Promise<AdminUpdateJobResponse> => {
  const response = await axiosInstance.put(`/admin/jobs/${jobData._id}`, jobData);
  return response.data;
};

export const deleteJob = async (jobId: string): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.delete(`/admin/jobs/${jobId}`);
  return response.data;
};