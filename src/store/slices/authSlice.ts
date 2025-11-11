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
import type { AuthState } from "@/types/slice/authSliceTypes";
import type { VerifyEmailResponse } from "@/types/apiTypes/authApiTypes";
import { updateProfileImage, updateProfileInfo } from "@/utils/apis/userApi";
import type { UpdateProfileImageResponse, UpdateUserInfoResponse } from "@/types/apiTypes/userApiTypes";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
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
    updateResumeKey: (state, action: PayloadAction<string>) => {
      if(state.user) {
        state.user.resume = action.payload;
      }
    },
    clearError: (state: AuthState) => {
      state.error = null;
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
    resetAuthStore: () => initialState,
    setProfileImage: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.profileImage = action.payload;
      }
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {
    builder
      .addCase(signup.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state: AuthState, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = action.payload.user;
        state.error = null;
        state.otpRemainingTime = 60;
        state.otpTimerIsRunning = true;
      })
      .addCase(signup.rejected, (state: AuthState, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
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
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state: AuthState) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = null;
      });

    builder
      .addCase(signin.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state: AuthState, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(signin.rejected, (state: AuthState, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      });

    builder
      .addCase(signout.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signout.fulfilled, (state: AuthState) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(signout.rejected, (state: AuthState, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      });

    builder
      .addCase(resendOtp.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state: AuthState, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = action.payload.user;
        state.error = null;
        state.otpRemainingTime = 60;
        state.otpTimerIsRunning = true;
      })
      .addCase(resendOtp.rejected, (state: AuthState, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updatePassword.fulfilled, (state: AuthState) => {
        state.otpRemainingTime = 0;
        state.otpTimerIsRunning = false;
        state.isUpdatingPassword = false;
        state.user = null;
      });

    builder
      .addCase(updateProfileImage.pending, (state) => {
        state.profileImageUpdating = true;
      })
      .addCase(
        updateProfileImage.fulfilled,
        (state, action: PayloadAction<UpdateProfileImageResponse>) => {
          state.profileImageUpdating = false;
          if (state.user) {
            state.user.profileImage = action.payload.data.profileImage;
          }
        },
      )
      .addCase(updateProfileImage.rejected, (state) => {
        state.profileImageUpdating = true;
      });

    builder
      .addCase(updateProfileInfo.fulfilled, (state, action: PayloadAction<UpdateUserInfoResponse>) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload.data };
        }
      });

    builder
      .addCase(verifyEmail.fulfilled, (state, action: PayloadAction<VerifyEmailResponse>) => {
        state.otpRemainingTime = 60;
        state.otpTimerIsRunning = true;
        state.isUpdatingPassword = true;
        state.user = {
          ...state.user, 
          email: action.payload.data.email,
          verificationToken: action.payload.data.verificationToken,
          role: action.payload.data.role
        };
      });

  }
});

export const {
  clearError,
  setAuthUser,
  startTimer,
  updateTimer,
  stopTimer,
  resetAuthStore,
  setProfileImage,
  updateResumeKey
} = authSlice.actions;
export default authSlice.reducer;
