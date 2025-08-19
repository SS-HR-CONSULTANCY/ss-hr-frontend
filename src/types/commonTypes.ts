export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>; // optional extra validation errors
}

export interface Route {
  path: string;
  name: string;
}