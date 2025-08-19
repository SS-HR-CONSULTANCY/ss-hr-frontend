import type { ApiPaginatedResponse, FetchFunctionParams } from "@/types/commonTypes";

export const buildQueryParams = (params?: Omit<FetchFunctionParams, 'id'>): string => {
  const query = new URLSearchParams();

  if (params?.pagination) {
    query.append("page", params.pagination.page.toString());
    query.append("limit", params.pagination.limit.toString());
  }

  return query.toString();
};

export const parseNewCommonResponse = <T>(res: ApiPaginatedResponse<T>): ApiPaginatedResponse<T> => {
  return {
    data: res.data,
    totalCount: res.totalCount,
    currentPage: res.currentPage,
    totalPages: res.totalPages,
  };
};
