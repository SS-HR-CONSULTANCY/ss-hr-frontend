import {
  createSlice,
  type PayloadAction,
  type ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import {
  resendOtp,
  signin,
  signout,
  signup,
  updatePassword,
  verifyEmail,
  verifyOtp,
} from "@/utils/apis/authApi";
import type { User } from "@/types/entities/user";
import { updateProfileInfo } from "@/utils/apis/userApi";
import type { AuthState } from "@/types/slice/authSliceTypes";
import type { VerifyEmailResponse } from "@/types/apiTypes/authApiTypes";
import type { UpdateUserInfoResponse } from "@/types/apiTypes/userApiTypes";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  otpRemainingTime: 0,
  otpTimerIsRunning: false,
  profileImageUpdating: false,
  isUpdatingPassword: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state: AuthState, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    startTimer: (state: AuthState, action: PayloadAction<number>) => {
      state.otpRemainingTime = action.payload;
      state.otpTimerIsRunning = true;
    },
    updateTimer: (state: AuthState) => {
      if (state.otpRemainingTime > 0 && state.otpTimerIsRunning) {
        state.otpRemainingTime -= 1;
      } else {
        state.otpTimerIsRunning = false;
      }
    },
    stopTimer: (state: AuthState) => {
      state.otpTimerIsRunning = false;
    },
    setProfileSignedUrl: (state, action: PayloadAction<string>) => {
      state.user = { ...state.user, profileImage: action.payload };
    },
    setResumeSignedUrl: (state, action: PayloadAction<string>) => {
      state.user = { ...state.user, resume: action.payload };
    },
    resetAuthStore: () => initialState,
  },
  extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {
    builder
      .addCase(signup.pending, (state: AuthState) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state: AuthState, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = action.payload.user;
        state.otpRemainingTime = 60;
        state.otpTimerIsRunning = true;
      })
      .addCase(signup.rejected, (state: AuthState) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });

    builder
      .addCase(verifyOtp.pending, (state: AuthState) => {
        state.isLoading = true;
      })
      .addCase(verifyOtp.fulfilled, (state: AuthState) => {
        state.isLoading = false;
        state.otpTimerIsRunning = false;
        state.otpRemainingTime = 0;
        state.isAuthenticated = false;
      })
      .addCase(verifyOtp.rejected, (state: AuthState) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });

    builder
      .addCase(signin.pending, (state: AuthState) => {
        state.isLoading = true;
      })
      .addCase(signin.fulfilled, (state: AuthState, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(signin.rejected, (state: AuthState) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });

    builder
      .addCase(signout.pending, (state: AuthState) => {
        state.isLoading = true;
      })
      .addCase(signout.fulfilled, (state: AuthState) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(signout.rejected, (state: AuthState) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });

    builder
      .addCase(resendOtp.pending, (state: AuthState) => {
        state.isLoading = true;
      })
      .addCase(resendOtp.fulfilled, (state: AuthState, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = action.payload.user;
        state.otpRemainingTime = 60;
        state.otpTimerIsRunning = true;
      })
      .addCase(resendOtp.rejected, (state: AuthState) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });

    builder.addCase(updatePassword.fulfilled, (state: AuthState) => {
      state.otpRemainingTime = 0;
      state.otpTimerIsRunning = false;
      state.isUpdatingPassword = false;
      state.user = null;
    });

    builder.addCase(
      updateProfileInfo.fulfilled,
      (state, action: PayloadAction<UpdateUserInfoResponse>) => {
        state.user = { ...state.user, ...action.payload.data };
      },
    );

    builder.addCase(
      verifyEmail.fulfilled,
      (state, action: PayloadAction<VerifyEmailResponse>) => {
        state.otpRemainingTime = 60;
        state.otpTimerIsRunning = true;
        state.isUpdatingPassword = true;
        state.user = {
          ...state.user,
          email: action.payload.data.email,
          verificationToken: action.payload.data.verificationToken,
          role: action.payload.data.role,
        };
      },
    );
  },
});

export const {
  setAuthUser,
  startTimer,
  updateTimer,
  stopTimer,
  resetAuthStore,
  setProfileSignedUrl,
  setResumeSignedUrl,
} = authSlice.actions;
export default authSlice.reducer;
