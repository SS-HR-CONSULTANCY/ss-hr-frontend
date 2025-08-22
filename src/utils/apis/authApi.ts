import type { AxiosError } from "axios";
import type { User } from "@/types/entities/user";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/components/lib/axios";
import type { RegisterRequest } from "@/types/slice/authSliceTypes";

export interface ApiBaseResponse {
  success?: boolean;
  message?: string;
}

export interface SignupResponse extends ApiBaseResponse {
    user: User;
}

export type VerifyOtpRequest = Pick<User, "otp" | "verificationToken" | "role">;

export type SigninRequest = Pick<User, "email" | "role"> & {
    passWord: string;
};

export interface SigninResponse extends ApiBaseResponse {
    user: User;
}

export interface ResendOtpResponse extends ApiBaseResponse {
    user: User;
}

export type ResendOtpRequest = Pick<User, "role" | "verificationToken" | "email">;

export type UpdatePasswordRequest = Pick<User, "role" | "verificationToken"> & {
    password: string;
};


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
            const response = await axiosInstance.post('/auth/signin', userData);
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
            const response = await axiosInstance.post('/auth/signout');
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
        await axiosInstance.post("/auth/checkUserStatus");
    }
);

// export const handleGoogleLogin = async () : Promise<any> => {
//     const response = axiosInstance.get()
// }