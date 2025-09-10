import { axiosInstance } from "@/lib/axios";
import { buildQueryParams, parseNewCommonResponse } from "../helpers/apiHelpers";
import { type ApiPaginatedResponse, type FetchFunctionParams } from "@/types/commonTypes";
import type { CreatePaymentFormData, UpdatePaymentFormData } from "@/types/entities/payment";


export type AdminfetchAllPaymentsResponse = {
  _id: string;
  customerId: string;
  packageId: string;
  customerName: string;
  packageName: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentMethod: 'googlepay' | 'banktransfer' | 'cash';
  paymentDate: string;
  referenceId: string;
  paymentProof: string;
  adminNotes: string;
  status: 'pending' | 'partiallypaid' | 'fullypaid';
  createdAt: string;
  updatedAt: string;
};

// Get all payments with pagination
export const getAllPayments = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<AdminfetchAllPaymentsResponse>> => {
  const query = buildQueryParams(params);
  const response = await axiosInstance.get(`/admin/payments${query ? `?${query}` : ''}`);
  return parseNewCommonResponse<AdminfetchAllPaymentsResponse>(response.data);
};

// Get payment by ID
export const getPaymentById = async (paymentId: string) => {
  const response = await axiosInstance.get(`/admin/payments/${paymentId}`);
  return response.data;
};

// Create new payment
export const createPayment = async (paymentData: CreatePaymentFormData) => {
  const response = await axiosInstance.post('/admin/payments/', paymentData);
  return response.data;
};

// Update payment
export const updatePayment = async (paymentId: string, paymentData: UpdatePaymentFormData) => {
  const response = await axiosInstance.put(`/admin/payments/${paymentId}`, paymentData);
  return response.data;
};

// Delete payment
export const deletePayment = async (paymentId: string) => {
  const response = await axiosInstance.delete(`/admin/payments/${paymentId}`);
  return response.data;
};

// Get payment statistics
export const getPaymentStats = async () => {
  const response = await axiosInstance.get('/admin/payments/stats');
  return response.data;
};

// Get payments by customer
export const getPaymentsByCustomer = async (customerId: string, params?: FetchFunctionParams): Promise<ApiPaginatedResponse<AdminfetchAllPaymentsResponse>> => {
  const query = buildQueryParams(params);
  const response = await axiosInstance.get(`/admin/payments/customer/${customerId}${query ? `?${query}` : ''}`);
  return parseNewCommonResponse<AdminfetchAllPaymentsResponse>(response.data);
};

// Get payments by package
export const getPaymentsByPackage = async (packageId: string, params?: FetchFunctionParams): Promise<ApiPaginatedResponse<AdminfetchAllPaymentsResponse>> => {
  const query = buildQueryParams(params);
  const response = await axiosInstance.get(`/admin/payments/package/${packageId}${query ? `?${query}` : ''}`);
  return parseNewCommonResponse<AdminfetchAllPaymentsResponse>(response.data);
};

// Get payments by status
export const getPaymentsByStatus = async (status: string, params?: FetchFunctionParams): Promise<ApiPaginatedResponse<AdminfetchAllPaymentsResponse>> => {
  const query = buildQueryParams(params);
  const response = await axiosInstance.get(`/admin/payments/status/${status}${query ? `?${query}` : ''}`);
  return parseNewCommonResponse<AdminfetchAllPaymentsResponse>(response.data);
};