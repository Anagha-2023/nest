import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';

interface HomestayState {
  homestays: any[];
  homestay: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  success: boolean;
}

const initialState: HomestayState = {
  homestays:[],
  homestay: null,
  status: 'idle',
  error: null,
  success: false,
};

export const addHomestay = createAsyncThunk(
  'host/addHomestay',
  async (homestayDetails: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      console.log("token:", token);
      const response = await axios.post('/api/hosts/addHomestay', homestayDetails, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log("Homestays added successfully:", response.data);
      return response.data;
    } catch (error) {
      // Log the full error details for debugging
      console.error("Error adding homestay:", error);

      // Extracting specific error details (AxiosError)
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data || error.message);
        const errorMessage = error.response?.data.message || 'Something went wrong';
        return rejectWithValue(errorMessage);
      }

      // Handle unexpected errors
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const updateHomestay = createAsyncThunk(
  'host/editHomestay',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const id = formData.get("id") as string; // Get the id from FormData
      const updatedDetails = JSON.parse(formData.get("updatedDetails") as string); // Assuming updatedDetails is JSON stored as a string in formData

      console.log("id from Formdata:", id);
      console.log("Updated details from FOrmdaata:", updatedDetails);
      
      const response = await axios.put(`/api/hosts/editHomestay/${id}`, updatedDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Set content type for file upload
        },
      });
      console.log("Homestay Updated", response.data.homestay);
      return response.data.homestay; // Return the updated homestay
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data.message || 'Failed to update homestay';
      console.log("error:",errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);




export const fetchHomestays = createAsyncThunk(
  'host/fetchHomestays',
  async (_, { rejectWithValue }) => {
    try {
      // Get the token from localStorage (or wherever it's stored)
      const token = localStorage.getItem('token');  // Replace with your token storage method
      console.log("Token got...", token);
      
      // Add the token to the Authorization header
      const response = await axios.get('/api/hosts/getHomestays-host', {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token here
        },
      });
      console.log("Homestays FEtched:", response.data);
      return response.data; // Assuming the data contains the list of homestays
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data.message || 'Something went wrong';
      return rejectWithValue(errorMessage);
    }
  }
);

const homestySlice = createSlice({
  name: 'homestay',
  initialState,
  reducers: {
    resetSuccess(state) {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle addHomestay
      .addCase(addHomestay.pending, (state) => {
        state.status = 'loading';
        state.success = false;
      })
      .addCase(addHomestay.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.homestay = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(addHomestay.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.success = false;
      })

      //Update Homestay

      .addCase(updateHomestay.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateHomestay.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.homestay = action.payload;
        console.log(action.payload);
        // Assuming the response contains the updated homestay details
        state.error = null;
      })
      .addCase(updateHomestay.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })


      // Handle fetchHomestays
      .addCase(fetchHomestays.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHomestays.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.homestays = action.payload.data;  // Set the homestays array from the fetched data
        state.error = null;
      })
      .addCase(fetchHomestays.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetSuccess } = homestySlice.actions;
export const homestayReducer = homestySlice.reducer