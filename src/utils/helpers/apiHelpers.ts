import type {
  ApiPaginatedResponse,
  FetchFunctionParams,
} from "@/types/commonTypes";

export const buildQueryParams = (
  params?: Omit<FetchFunctionParams, "id">,
): string => {
  const query = new URLSearchParams();

  if (params?.pagination) {
    query.append("page", params.pagination.page.toString());
    query.append("limit", params.pagination.limit.toString());
    
    if (params.pagination.fromDate) {
      query.append("fromDate", params.pagination.fromDate);
    }
    if (params.pagination.toDate) {
      query.append("toDate", params.pagination.toDate);
    }
    if (params.pagination.category && params.pagination.category !== "all") {
      query.append("category", params.pagination.category);
    }
    if (params.pagination.searchQuery) {
      query.append("search", params.pagination.searchQuery);
    }
    if (params.pagination.status && params.pagination.status !== "all") {
      query.append("status", params.pagination.status);
    }
    if (params.pagination.scheduledDate) {
      query.append("scheduledDate", params.pagination.scheduledDate);
    }
    if (params.pagination.state && params.pagination.state !== "all") {
      query.append("state", params.pagination.state);
    }
    if (params.pagination.assignedTo) {
      query.append("assignedTo", params.pagination.assignedTo);
    }
    if (params.pagination.today) {
      query.append("today", params.pagination.today);
    }
    if (params.pagination.sortBy) {
      query.append("sortBy", params.pagination.sortBy);
    }
    if (params.pagination.sortOrder) {
      query.append("sortOrder", params.pagination.sortOrder);
    }
  }

  return query.toString();
};

export const parseNewCommonResponse = <T>(
  res: ApiPaginatedResponse<T>,
): ApiPaginatedResponse<T> => {
  return {
    data: res.data,
    totalCount: res.totalCount,
    currentPage: res.currentPage,
    totalPages: res.totalPages,
  };
};
