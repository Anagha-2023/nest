import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';


interface User {
  email: string;
  name: string;
  token: string;
  googleId?: string;
}

interface Homestay {
  _id: string;
  name: string;
  country: string;
  pricePerNight: number;
  image: string;
  rooms: number;
  description: string;
  services: Array<{ name: string; available: boolean }>;
  cancellationPeriod: number;
  offerPercentage?: number;
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
  homestays: Homestay[]; // Added homestays array
  homestayLoading: boolean; // Loading state for homestays
  homestayError: string | null; // Error state for homestays
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
  homestays: [], // Initialize homestays as an empty array
  homestayLoading: false, // Initialize loading state for homestays
  homestayError: null, // Initialize error state for homestays
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

//Fetch Homestays
export const fetchHomestays = createAsyncThunk(
  'homestays/fetchHomestays', 
  async () => {
  const response = await axios.get('/api/users/homstay-listing')
  console.log("Response:",response.data)
  return response.data;
});



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

export const userLogout = createAsyncThunk<void, void, {rejectValue: string}>(
  'user/Logout',
  async(_,{rejectWithValue}) => {
    try {
      await axios.post('/api/users/user-logout');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Logout failed');
    }
  }
)

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
        state.userInfo = action.payload;
        state.token = action.payload.token;
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


      builder
      .addCase(fetchHomestays.pending, (state) => {
        state.homestayLoading = true;
        state.homestayError = null;
      })
      .addCase(fetchHomestays.fulfilled, (state, action: PayloadAction<Homestay[]>) => {
        state.homestayLoading = false;
        state.homestays = action.payload;
        console.log(action.payload);
        
      })
      .addCase(fetchHomestays.rejected, (state, action: PayloadAction<any>) => {
        state.homestayLoading = false;
        state.homestayError = action.payload || 'Failed to fetch homestays';
      });

    // User Register
    builder
      .addCase(register.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
        state.userInfo = action.payload;
        state.token = action.payload.token;
        state.registerLoading = false;
      })
      .addCase(register.rejected, (state, action: PayloadAction<any>) => {
        state.registerLoading = false;
        state.registerError = action.payload;
      });

    // Google Sign-In
    builder
      .addCase(googleSignIn.pending, (state) => {
        state.googleLoading = true;
        state.googleError = null;
      })
      .addCase(googleSignIn.fulfilled, (state, action: PayloadAction<any>) => {
        state.googleLoading = false;
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(googleSignIn.rejected, (state, action: PayloadAction<any>) => {
        state.googleLoading = false;
        state.googleError = action.payload;
      });

    // Send Reset Password Email
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
        state.resendError = action.payload || 'Failed to send reset email';
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });

    // User Login
    builder
      .addCase(login.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.userInfo = action.payload;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', 'user');
        state.loginLoading = false;
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.loginLoading = false;
        state.loginError = action.payload;
      });

    // User Logout
    builder
      .addCase(userLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.userInfo = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        state.loading = false;
      })
      
  },
});

export const userReducer = userSlice.reducer;


