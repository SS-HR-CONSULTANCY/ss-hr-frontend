import { axiosInstance } from "@/lib/axios";
import type { Testimonial } from "@/types/entities/testimonial";
import { buildQueryParams, parseNewCommonResponse } from "@/utils/helpers/apiHelpers";
import type { ApiPaginatedResponse, FetchFunctionParams, ApiBaseResponse } from "@/types/commonTypes";

export interface TestimonialResponse {
  success: boolean;
  message: string;
  data: Testimonial[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface SingleTestimonialResponse {
  success: boolean;
  message: string;
  testimonial: Testimonial;
}

export interface CreateTestimonialRequest {
  clientName: string;
  clientPhoto?: string;
  designation: string;
  testimonial: string;
}

export interface UpdateTestimonialRequest {
  clientName?: string;
  clientPhoto?: File;
  designation?: string;
  testimonial?: string;
  isVisible?: boolean;
}

export const getAllTestimonials = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<Testimonial>> => {
  const query = buildQueryParams(params);
  const response = await axiosInstance.get(`/admin/testimonials${query ? `?${query}` : ''}`);  
  return parseNewCommonResponse<Testimonial>(response.data);
  };

export const createTestimonial = async (data: FormData): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.post('/admin/testimonials', data);
  return response.data;
};

export const getTestimonialById = async (testimonialId: string): Promise<SingleTestimonialResponse> => {
  const response = await axiosInstance.get(`/admin/testimonials/${testimonialId}`);
  return response.data;
};

export const updateTestimonial = async ({testimonialId, testimonialData}: {testimonialId: string,  testimonialData: FormData}): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.patch(`/admin/testimonials/${testimonialId}`, testimonialData);
  return response.data;
};

export const deleteTestimonial = async (testimonialId: string): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.delete(`/admin/testimonials/${testimonialId}`);
  return response.data;
};

export const getTestimonialStats = async (): Promise<ApiBaseResponse & { stats?: { totalTestimonials: number } }> => {
  const response = await axiosInstance.get('/admin/testimonials/stats');
  return response.data;
};