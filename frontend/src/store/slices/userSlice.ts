import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';


interface User {
  email: string;
  name: string;
  token: string;
  googleId?: string;
}


// Define the shape of the UserState
interface UserState {
  userInfo: any | null;
  token: string | null;
  error: string | null;
  loading: boolean;
  registerLoading: boolean;
  registerError: string | null;
  loginLoading: boolean;
  loginError: string | null;
  resendLoading: boolean;
  resendSuccess: string | null;
  resendError: string | null;
  googleLoading: boolean;
  googleError: string | null;

}

const initialState: UserState = {
  userInfo: null,
  error: null,
  token: null,
  loading: false,
  registerLoading: false,
  registerError: null,
  loginLoading: false,
  loginError: null,
  resendLoading: false,
  resendSuccess: null,
  resendError: null,
  googleLoading: false,
  googleError: null,

};


export const googleSignIn = createAsyncThunk(
  'user/googleSignIn',
  async (googleUserData: any, { rejectWithValue }) => { // You can change 'any' to a more specific type if needed
    try {
      const response = await axios.post('/api/users/google-signin', googleUserData);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

//Google login
export const googleLogin = createAsyncThunk(
  'user/googleLogin',
  async (userData: { email: string; googleId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/users/google-login', userData);
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data.message || 'Something went wrong';
      return rejectWithValue(errorMessage);
    }
  }
)

// Async action for registering a user
export const register = createAsyncThunk(
  'user/register',
  async (userData: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/users/register', userData);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data.message || 'Something went wrong';
      return rejectWithValue(errorMessage);
    }
  }
);

//Forgot Password
export const sendResetPasswordEmail = createAsyncThunk(
  'user/sendResetPasswordEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to send email');
      }
      return data;
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);


//Reset Password
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (credentials: { token: string; newPassword: string; confirmPassword: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/users/reset-password', 
        { newPassword: credentials.newPassword, confirmPassword: credentials.confirmPassword },
        {
          headers: {
            'Authorization': `Bearer ${credentials.token}`, // Set token in Authorization header
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data.message || 'Something went wrong';
      return rejectWithValue(errorMessage);
    }
  }
);



// Async action for logging in a user
export const login = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/users/login', credentials);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data.message || 'Something went wrong';
      return rejectWithValue(errorMessage);
    }
  }
);


// Async actions using createAsyncThunk
export const verifyOtp = createAsyncThunk(
  'user/verifyOtp',
  async ({ email, otp, name, phone, password }: { email: string; otp: string; name: string; phone: string, password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/users/verify-otp', { email, otp, name, phone, password });
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data.message || 'Something went wrong';
      return rejectWithValue(errorMessage);
    }
  }
);

export const resendOtp = createAsyncThunk(
  'user/resendOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/users/resend-otp', { email });
      return data.message;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data.message || 'Something went wrong';
      return rejectWithValue(errorMessage);
    }
  }
);

// User Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // OTP Verification
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<any>) => {
        state.userInfo.user = action.payload;
        state.userInfo.token = action.payload;
        console.log("OTP verification result:", action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });

    // OTP Resend
    builder

      .addCase(resendOtp.pending, (state) => {
        state.resendLoading = true;
        state.resendError = null;
        state.resendSuccess = null;
      })
      .addCase(resendOtp.fulfilled, (state, action: PayloadAction<string>) => {
        state.resendLoading = false;
        state.resendSuccess = action.payload;
      })
      .addCase(resendOtp.rejected, (state, action: PayloadAction<any>) => {
        state.resendLoading = false;
        state.resendError = action.payload;
      });

    // User Register
    builder
      .addCase(register.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
        state.userInfo = action.payload;
        console.log("User registered:", state.userInfo); // Add this
        console.log("User email registerd:", state.userInfo.user.email);

        state.registerLoading = false;
      })
      .addCase(register.rejected, (state, action: PayloadAction<any>) => {
        state.registerLoading = false;
        state.registerError = action.payload;
      });

    // Google Register 

    builder

      .addCase(googleSignIn.pending, (state) => {
        state.googleLoading = true;
        state.googleError = null;
      })
      .addCase(googleSignIn.fulfilled, (state, action: PayloadAction<any>) => {
        state.googleLoading = false;
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
        console.log("Google Sign-In successful:", state.userInfo);
      })
      .addCase(googleSignIn.rejected, (state, action: PayloadAction<any>) => {
        state.googleLoading = false;
        state.googleError = action.payload;
        console.log("Google Sign-In failed:", action.payload);
      });

    // Sending Reset Password Email

    builder
  .addCase(sendResetPasswordEmail.pending, (state) => {
    state.resendLoading = true;
    state.resendError = null;
    state.resendSuccess = null;
  })
  .addCase(sendResetPasswordEmail.fulfilled, (state, action: PayloadAction<any>) => {
    state.resendLoading = false;
    state.resendSuccess = action.payload.message || 'Password reset email sent';
  })
  .addCase(sendResetPasswordEmail.rejected, (state, action: PayloadAction<any>) => {
    state.resendLoading = false;
    state.resendError = action.payload as string || 'Failed to send reset email';
  });



    // Resetting the Password

    builder

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        console.log("Password Reset Successful:", action.payload);
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        console.log("Password Reset Failed:", action.payload);
      });


    // User Login
    builder
      .addCase(login.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.userInfo = action.payload;
        console.log("User logged in:", state.userInfo); // Add this
        state.loginLoading = false;
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.loginLoading = false;
        state.loginError = action.payload;
      });
  },
});

export const userReducer = userSlice.reducer;

