export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>; // optional extra validation errors
}