import type {
  ResendOtpRequest,
  ResendOtpResponse,
  SigninRequest,
  SigninResponse,
  SignupResponse,
  UpdatePasswordRequest,
  VerifyEmailRequest,
  VerifyEmailResponse,
  VerifyOtpRequest,
} from "@/types/apiTypes/authApiTypes";
import type { AxiosError } from "axios";
import { axiosInstance } from "@/lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ApiBaseResponse } from "@/types/commonTypes";
import type { RegisterRequest } from "@/types/slice/authSliceTypes";

export const signup = createAsyncThunk<SignupResponse, RegisterRequest>(
  "auth/signup",
  async (userData: RegisterRequest, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ApiBaseResponse>;
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Something went wrong",
        },
      );
    }
  },
);

export const verifyOtp = createAsyncThunk<ApiBaseResponse, VerifyOtpRequest>(
  "auth/verify-otp",
  async (authData: VerifyOtpRequest, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/verify-otp", authData);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ApiBaseResponse>;
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Something went wrong",
        },
      );
    }
  },
);

export const signin = createAsyncThunk<SigninResponse, SigninRequest>(
  "auth/signin",
  async (userData: SigninRequest, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/login", userData);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ApiBaseResponse>;
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Something went wrong",
        },
      );
    }
  },
);

export const signout = createAsyncThunk<ApiBaseResponse>(
  "auth/signOut",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ApiBaseResponse>;
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Something went wrong",
        },
      );
    }
  },
);

export const resendOtp = createAsyncThunk<ResendOtpResponse, ResendOtpRequest>(
  "auth/resendOtp",
  async (authData: ResendOtpRequest, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/resendOtp", authData);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ApiBaseResponse>;
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Something went wrong",
        },
      );
    }
  },
);

export const verifyEmail = createAsyncThunk<VerifyEmailResponse, VerifyEmailRequest>(
  "auth/verify-email",
  async (data: VerifyEmailRequest, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/verify-email", data);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ApiBaseResponse>;
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Something went wrong",
        },
      );
    }
  },
);

export const updatePassword = createAsyncThunk<
  ApiBaseResponse,
  UpdatePasswordRequest
>("auth/updatePassword", async (authData: UpdatePasswordRequest, thunkAPI) => {
  try {
    const response = await axiosInstance.patch("/auth/update-password", authData);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiBaseResponse>;
    return thunkAPI.rejectWithValue(
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      },
    );
  }
});

export const checkUserStatus = createAsyncThunk(
  "auth/checkUserStatus",
  async () => {
    await axiosInstance.get("/auth/checkUserStatus", { withCredentials: true });
  },
);
