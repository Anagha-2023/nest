import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { stat } from 'fs';

interface Host {
  email: string;
  phone: string;
  name: string;
  token: string;
}

interface HomestayState {
  homestay: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define the initial state and types
interface HostState {
  hostInfo: any | null;
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

const initialState: HostState = {
  hostInfo: null,
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


// Async thunks
export const hostRegisterSlice = createAsyncThunk(
  'host/register',
  async (hostData: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/hosts/host-register', hostData);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data.message || 'Something went wrong';
      return rejectWithValue(errorMessage);
    }
  }
);

export const googleHostSignIn = createAsyncThunk(
  'host/googleSignIn',
  async (googleHostData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/hosts/google-signin', googleHostData);
      console.log("Response", response);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        console.log("error",error.response.data);
        return rejectWithValue(error.response.data.message);
      } else {
        console.log("error",error.message);
        return rejectWithValue(error)
      }
    }
  }
);


export const hostLogin = createAsyncThunk(
  'host/hostlogin',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/hosts/host-login', credentials);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data.message || 'Login failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifyHostOtp = createAsyncThunk(
  'host/verifyOtp',
  async ({ email, otp, name, phone, password }: { email: string; otp: string; name: string; phone: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/hosts/verify-host-otp', { email, otp, name, phone, password });
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      // Extract a meaningful message from the response
      const errorMessage = axiosError.response?.data.message || 'Something went wrong';
      return rejectWithValue(errorMessage);
    }
  }
);


export const hostgoogleLogin = createAsyncThunk(
  'host/hostgoogleLogin',
  async (hostData: { email: string, googleId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/hosts/host-googleLogin', hostData);
      console.log("response:", response);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data.message || 'Something went wrong';
      return rejectWithValue(errorMessage);
    }
  }
)

export const resendHostOtp = createAsyncThunk(
  'host/resendOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/hosts/resend-host-otp', { email });
      return data.message;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data.message || 'Something went wrong';
      return rejectWithValue(errorMessage);
    }
  }
);

// Create slice
const hostSlice = createSlice({
  name: 'host',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(hostRegisterSlice.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(hostRegisterSlice.fulfilled, (state, action: PayloadAction<any>) => {
        state.hostInfo = action.payload;
        console.log("User registered:", state.hostInfo); // Add this
        console.log("User email registerd:", state.hostInfo.host.email);

        state.registerLoading = false;
      })
      .addCase(hostRegisterSlice.rejected, (state, action: PayloadAction<any>) => {
        state.registerLoading = false;
        state.registerError = action.payload;
      })


      .addCase(googleHostSignIn.pending, state => {
        state.error = null;
      })
      .addCase(googleHostSignIn.fulfilled, (state, action) => {
        state.hostInfo = action.payload;
        state.error = null;
      })
      .addCase(googleHostSignIn.rejected, (state, action) => {
        state.error = action.error.message || 'Error signing in with Google';
      })

    builder
      .addCase(verifyHostOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(verifyHostOtp.fulfilled, (state, action: PayloadAction<any>) => {
        state.hostInfo.host = action.payload;
        state.hostInfo.token = action.payload;
        console.log("OTP verification result:", action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyHostOtp.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(resendHostOtp.pending, (state) => {
        state.resendLoading = true;
        state.resendError = null;
        state.resendSuccess = null;
      })
      .addCase(resendHostOtp.fulfilled, (state, action: PayloadAction<string>) => {
        state.resendLoading = false;
        state.resendSuccess = action.payload;
      })
      .addCase(resendHostOtp.rejected, (state, action: PayloadAction<any>) => {
        state.resendLoading = false;
        state.resendError = action.payload;
      });

    builder
      .addCase(hostLogin.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(hostLogin.fulfilled, (state, action: PayloadAction<any>) => {
        state.hostInfo = action.payload;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        console.log("Host logged in:", state.hostInfo); // Add this
        state.loginLoading = false;
      })
      .addCase(hostLogin.rejected, (state, action: PayloadAction<any>) => {
        state.loginLoading = false;
        state.loginError = action.payload;
      });

  },
});

export const hostReducer = hostSlice.reducer;
