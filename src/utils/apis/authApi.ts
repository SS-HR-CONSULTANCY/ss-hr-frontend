import type { AxiosError } from "axios";
import { axiosInstance } from "@/lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ApiBaseResponse } from "@/types/commonTypes";
import type { RegisterRequest } from "@/types/slice/authSliceTypes";
import type { ResendOtpRequest, ResendOtpResponse, SigninRequest, SigninResponse, SignupResponse, UpdatePasswordRequest, updateProfileImageResponse, updateUserInfo, updateUserInfoResponse, VerifyOtpRequest } from "@/types/apiTypes/authApiTypes";


export const signup = createAsyncThunk<SignupResponse, RegisterRequest>('auth/signup',
    async (userData: RegisterRequest, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/auth/register", userData);
            return response.data;
        } catch (err) {
            const error = err as AxiosError<ApiBaseResponse>;
            return thunkAPI.rejectWithValue(error.response?.data || { success: false, message: "Something went wrong" })
        }
    }
);

export const verifyOtp = createAsyncThunk<ApiBaseResponse,VerifyOtpRequest>("auth/verify-otp",
    async (authData: VerifyOtpRequest, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/auth/verify-otp', authData);
            return response.data;
        } catch (err) {
            const error = err as AxiosError<ApiBaseResponse>;
            return thunkAPI.rejectWithValue(error.response?.data || { success: false, message: "Something went wrong" })
        }
    }
)

export const signin = createAsyncThunk<SigninResponse, SigninRequest>("auth/signin",
    async (userData: SigninRequest, thunkAPI) => {
        try {
            console.log("userData : ",userData);
            const response = await axiosInstance.post('/auth/login', userData);
            return response.data;
        } catch (err) {
            const error = err as AxiosError<ApiBaseResponse>;
            return thunkAPI.rejectWithValue(error.response?.data || { success: false, message: "Something went wrong" })
        }
    }
)

export const signout = createAsyncThunk<ApiBaseResponse>("auth/signOut",
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/auth/logout');
            return response.data;
        } catch (err) {
            const error = err as AxiosError<ApiBaseResponse>;
            return thunkAPI.rejectWithValue(error.response?.data || { success: false, message: "Something went wrong" })
        }
    }
)

export const resendOtp = createAsyncThunk<ResendOtpResponse,ResendOtpRequest>("auth/resendOtp",
    async (authData: ResendOtpRequest, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/auth/resendOtp", authData);
            return response.data;
        } catch (err) {
            const error = err as AxiosError<ApiBaseResponse>;
            return thunkAPI.rejectWithValue(error.response?.data || { success: false, message: "Something went wrong" })
        }
    }
)

export const updatePassword = createAsyncThunk<ApiBaseResponse,UpdatePasswordRequest>("auth/updatePassword",
    async (authData: UpdatePasswordRequest, thunkAPI) => {
        try {
            const response = await axiosInstance.put("/auth/updatePassword", authData);
            return response.data;
        } catch (err) {
            const error = err as AxiosError<ApiBaseResponse>;
            return thunkAPI.rejectWithValue(error.response?.data || { success: false, message: "Something went wrong" })
        }
    }
)

export const checkUserStatus = createAsyncThunk("auth/checkUserStatus",
    async () => {
        await axiosInstance.get("/auth/checkUserStatus", { withCredentials: true });
    }
);

export const updateProfileImage = createAsyncThunk<updateProfileImageResponse, FormData>('/auth/UpdateProfileImage',
    async (formData: FormData) => {
        const response = await axiosInstance.post('/auth/updateProfileImage', formData);
        return response.data;
    }
)

export const updateProfileInfo = createAsyncThunk<updateUserInfoResponse, updateUserInfo>('/auth/UpdateProfileImage',
    async (data: updateUserInfo) => {
        const response = await axiosInstance.post('/auth/updateuserInfo', data);
        return response.data;
    }
)


export const googleSignin = createAsyncThunk<SigninResponse, void>("auth/googleSignin",
  async (_, thunkAPI) => {
    try {
      window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
      return { success: true, message: "Redirecting to Google..." } as SigninResponse;
    } catch (err) {
      const error = err as AxiosError<ApiBaseResponse>;
      return thunkAPI.rejectWithValue(error.response?.data || { success: false, message: "Something went wrong" });
    }
  }
);