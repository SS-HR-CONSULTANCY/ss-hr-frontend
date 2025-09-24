import type { User } from '@/types/entities/user';
import { updateProfileImage } from '@/utils/apis/userApi';
import type { AuthState } from '@/types/slice/authSliceTypes';
import { createSlice, type PayloadAction, type ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { resendOtp, signin, signout, signup, updatePassword, verifyOtp } from '@/utils/apis/authApi';
import type { updateProfileImageResponse } from '@/types/apiTypes/authApiTypes';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  otpRemainingTime: 0,
  otpTimerIsRunning: false,
  profileImageUpdating: false,
  otpForUpdatePassword: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state: AuthState, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    clearError: (state: AuthState) => {
      state.error = null;
    },
    setUser: (state: AuthState, action: PayloadAction<User>) => {
      state.user = action.payload
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
    clearAuthStore: (state: AuthState) => {
      state.error = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.otpRemainingTime = 0;
      state.otpTimerIsRunning = false;
      state.user = null;
    },
    setProfileImage: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.profileImage = action.payload;
      }
    },
    setOtpForUpdatePassword: (state, action) => {
      state.otpForUpdatePassword = action.payload
    }
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

    builder.addCase(signin.pending, (state: AuthState) => {
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

    builder.addCase(signout.pending, (state: AuthState) => {
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

    builder.addCase(resendOtp.pending, (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    })
      .addCase(resendOtp.fulfilled, (state: AuthState, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = action.payload.user;
        state.error = null; state.otpRemainingTime = 60;
        state.otpTimerIsRunning = true;
      })
      .addCase(resendOtp.rejected, (state: AuthState, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    builder.addCase(updatePassword.pending, (state: AuthState) => {
      state.isLoading = true;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    })
      .addCase(updatePassword.fulfilled, (state: AuthState) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state: AuthState, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      });

    builder.addCase(updateProfileImage.pending, (state) => {
      state.profileImageUpdating = true;
    })
      .addCase(updateProfileImage.fulfilled, (state, action: PayloadAction<updateProfileImageResponse>) => {
        state.profileImageUpdating = false;
        if (state.user) {
          state.user.profileImage = action.payload.data.profileImage;
        }
      })
      .addCase(updateProfileImage.rejected, (state) => {
        state.profileImageUpdating = true;
      })
  },
});

export const { clearError, setAuthUser, startTimer, updateTimer, stopTimer, clearAuthStore, setProfileImage, setOtpForUpdatePassword } = authSlice.actions;
export default authSlice.reducer;