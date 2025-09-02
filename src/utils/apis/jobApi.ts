import { axiosInstance } from "@/lib/axios";
import type { AdminfetchAllJobsResponse } from "@/types/apiTypes/admin";
import { buildQueryParams, parseNewCommonResponse } from "../helpers/apiHelpers";
import type { ApiPaginatedResponse, FetchFunctionParams } from "@/types/commonTypes";

export interface Job {
  _id: string;
  companyName: string;
  designation: string;
  vacancy: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobRequest {
  companyName: string;
  designation: string;
  vacancy: number;
}

export interface CreateJobResponse {
  success: boolean;
  message: string;
  job: Job;
}

export interface UpdateJobRequest {
  companyName?: string;
  designation?: string;
  vacancy?: number;
}

export interface UpdateJobResponse {
  success: boolean;
  message: string;
  job: Job;
}

export interface GetJobResponse {
  success: boolean;
  message: string;
  job: Job;
}

export interface DeleteJobResponse {
  success: boolean;
  message: string;
}

export const adminFetchAllJobs = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<AdminfetchAllJobsResponse>> => {
    const query = buildQueryParams(params);
    const response = await axiosInstance.get(`/admin/jobs${query ? `?${query}` : ''}`);
    return parseNewCommonResponse<AdminfetchAllJobsResponse>(response.data);
};

export const createJob = async (jobData: CreateJobRequest): Promise<CreateJobResponse> => {
  const response = await axiosInstance.post('/admin/jobs', jobData);
  return response.data;
};

export const getJobById = async (jobId: string): Promise<GetJobResponse> => {
  const response = await axiosInstance.get(`/admin/jobs/${jobId}`);
  return response.data;
};

export const updateJob = async (jobId: string, jobData: UpdateJobRequest): Promise<UpdateJobResponse> => {
  const response = await axiosInstance.put(`/admin/jobs/${jobId}`, jobData);
  return response.data;
};

export const deleteJob = async (jobId: string): Promise<DeleteJobResponse> => {
  const response = await axiosInstance.delete(`/admin/jobs/${jobId}`);
  return response.data;
};