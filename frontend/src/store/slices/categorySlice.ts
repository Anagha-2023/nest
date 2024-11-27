import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export interface CategoryData {
  name: string;
  icon: string;
  isActive?: boolean;
  _id?: string;
}


interface CategoryState {
  categories: CategoryData[];
  loading: boolean;
  error: string | null;
  currentCategory: CategoryData | null ;
};


export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories', 
  async(_, {rejectWithValue}) => {
    try {
      const response = await axios.get('/api/categories/fetchAllCategory');
      console.log("Response:", response.data.data);
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData: CategoryData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/categories/addCategory', categoryData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, categoryData }: { id: string, categoryData: CategoryData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/categories/updateCategory/${id}`, categoryData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/categories/deleteCategory/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
    currentCategory: null
  } as CategoryState,
  reducers: {
    setCurrentCategory: (state, action: PayloadAction<CategoryData | null>) => {
      state.currentCategory = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create Category
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      
      // Update Category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      
      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(cat => cat._id !== action.payload);
      });
  }
});

export const { setCurrentCategory } = categorySlice.actions;
export default categorySlice.reducer;