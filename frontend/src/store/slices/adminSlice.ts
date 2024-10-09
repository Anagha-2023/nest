import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import api from '../../services/apiservice';

// Define the User interface
interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  isBlocked: boolean;
}

interface Host {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  isBlocked: boolean;
}

// Define the AdminState interface
interface AdminState {
  admin: any;
  token: string | null;
  error: string | null;
  loading: boolean;
  userInfo: User[];
  hostInfo: Host[];
  totalPages: number;
  currentPage: number;
  pendingHosts: any[];
}

const initialState: AdminState = {
  admin: null,
  token: null,
  error: null,
  loading: false,
  userInfo: [],
  hostInfo:[],
  pendingHosts: [],
  totalPages: 1,
  currentPage: 1,
};

// ADMIN AUTHENTICATION
export const adminLogin = createAsyncThunk<
  { token: string; admin: any }, 
  { email: string; password: string }, 
  { rejectValue: string }
>(
  'admin/adminLogin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/admin-login', credentials);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Login failed');
    }
  }
);

// ADMIN DASHBOARD: Fetch Users with Pagination
export const fetchUsers = createAsyncThunk<
  { users: User[]; totalPages: number; currentPage: number },
  { page: number }, // Expecting the page as an argument
  { rejectValue: string }
>(
  'admin/fetchUsers',
  async ({ page }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/admin/user-management?page=${page}`);
      return {
        users: response.data.users,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data.message || 'Failed to fetch users');
    }
  }
);


//FETCH HOSTS

export const fetchHosts = createAsyncThunk<
  { hosts: Host[]; totalPages: number; currentPage: number },
  { page: number }, // Expecting the page as an argument
  { rejectValue: string }
>(
  'admin/fetchHosts',
  async ({ page }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/admin/host-management?page=${page}`);
      return {
        hosts: response.data.hosts,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data.message || 'Failed to fetch hosts');
    }
  }
);



//BLOCK HOSTS
export const blockHost = createAsyncThunk<Host, string, { rejectValue: string }>(
  'admin/blockHost',
  async (hostId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/admin/block-host/${hostId}`);
      return response.data.host;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to block host');
    }
  }
)

// BLOCK USER
export const blockUser = createAsyncThunk<User, string, { rejectValue: string }>(
  'admin/blockUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/admin/block-user/${userId}`);
      return response.data.user;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to block user');
    }
  }
);

//UNBLOCK USER
export const unblockUser = createAsyncThunk<User, string, { rejectValue: string }>(
  'admin/unblockUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/admin/unblock-user/${userId}`);
      return response.data.user;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to unblock user');
    }
  }
);

// UNBLOCK HOST
export const unblockHost = createAsyncThunk<Host, string, { rejectValue: string }>(
  'admin/unblockHost',
  async (hostId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/admin/unblock-host/${hostId}`);
      return response.data.host;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to unblock user');
    }
  }
);

export const logout = createAsyncThunk<void, void, {rejectValue: string}>(
  'admin/Logout',
  async(_, {rejectWithValue}) => {
    try {
      await axios.post('/api/admin/admin-logout');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Logout failed');
    }
  }
)

//HOST APPROVAL

// Fetch pending hosts for verification
// export const fetchPendingHosts = createAsyncThunk<Host[], void, { rejectValue: string }>(
//   'admin/fetchPendingHosts',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get('/api/admin/pending-hosts');
//       return response.data.hosts;
//     } catch (error) {
//       const axiosError = error as AxiosError<{ message: string }>;
//       return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch pending hosts');
//     }
//   }
// );

// Approve host
// export const approveHost = createAsyncThunk<Host, string, { rejectValue: string }>(
//   'admin/approveHost',
//   async (hostId, { rejectWithValue }) => {
//     try {
//       const response = await axios.patch(`/api/admin/approve-host/${hostId}`);
//       return response.data.host;
//     } catch (error) {
//       const axiosError = error as AxiosError<{ message: string }>;
//       return rejectWithValue(axiosError.response?.data?.message || 'Failed to approve host');
//     }
//   }
// );

// Reject host
// export const rejectHost = createAsyncThunk<Host, string, { rejectValue: string }>(
//   'admin/rejectHost',
//   async (hostId, { rejectWithValue }) => {
//     try {
//       const response = await axios.patch(`/api/admin/reject-host/${hostId}`);
//       return response.data.host;
//     } catch (error) {
//       const axiosError = error as AxiosError<{ message: string }>;
//       return rejectWithValue(axiosError.response?.data?.message || 'Failed to reject host');
//     }
//   }
// );



// Create Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.admin = null;
      state.hostInfo = [];
      state.userInfo = [];
      localStorage.removeItem('token');
      localStorage.removeItem('role')
    },
  },
  extraReducers: (builder) => {
    // Admin login actions
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.admin = action.payload.admin;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', 'admin');
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

      builder
      .addCase(logout.fulfilled, (state) => {
        state.admin = null;
        state.token = null;
        state.userInfo = [];
        state.hostInfo = [];
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      })

    // Fetch users actions
    builder
  .addCase(fetchUsers.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<{ users: User[]; totalPages: number; currentPage: number }>) => {
    state.loading = false;
    state.userInfo = action.payload.users;
    state.totalPages = action.payload.totalPages;
    state.currentPage = action.payload.currentPage;
  })
  .addCase(fetchUsers.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload || 'Failed to fetch users';
  });

      // Fetch hosts actions
    builder
    .addCase(fetchHosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    builder
  .addCase(fetchHosts.fulfilled, (state, action: PayloadAction<{ hosts: Host[]; totalPages: number; currentPage: number }>) => {
    state.loading = false;
    state.hostInfo = action.payload.hosts;
    state.totalPages = action.payload.totalPages;
    state.currentPage = action.payload.currentPage;
  })

    .addCase(fetchHosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch Hosts';
    });

    // Block user actions
    builder
      .addCase(blockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blockUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.userInfo = state.userInfo.map((user) =>
          user._id === action.payload._id ? { ...action.payload, isBlocked: true } : user
        );
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to block user';
      });

    // Unblock user actions
    builder
      .addCase(unblockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unblockUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.userInfo = state.userInfo.map((user) =>
          user._id === action.payload._id ? { ...action.payload, isBlocked: false } : user
        );
      })
      .addCase(unblockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to unblock user';
      });

      // Block user actions
    builder
    .addCase(blockHost.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(blockHost.fulfilled, (state, action: PayloadAction<Host>) => {
      state.loading = false;
      state.hostInfo = state.hostInfo.map((host) =>
        host._id === action.payload._id ? { ...action.payload, isBlocked: true } : host
      );
    })
    .addCase(blockHost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to block user';
    });

  // Unblock user actions
  builder
    .addCase(unblockHost.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(unblockHost.fulfilled, (state, action: PayloadAction<Host>) => {
      state.loading = false;
      state.hostInfo = state.hostInfo.map((host) =>
        host._id === action.payload._id ? { ...action.payload, isBlocked: false } : host
      );
    })
    .addCase(unblockHost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to unblock user';
    });

    //FETCH HOSTS

    // builder.addCase(fetchPendingHosts.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // });
    // builder.addCase(fetchPendingHosts.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.pendingHosts = action.payload;
    // });
    // builder.addCase(fetchPendingHosts.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload || 'Failed to fetch pending hosts';
    // });

    // // Approve host
    // builder.addCase(approveHost.fulfilled, (state, action) => {
    //   state.pendingHosts = state.pendingHosts.filter((host) => host._id !== action.payload._id);
    // });

    // // Reject host
    // builder.addCase(rejectHost.fulfilled, (state, action) => {
    //   state.pendingHosts = state.pendingHosts.filter((host) => host._id !== action.payload._id);
    // });


  },
});

export const adminReducer = adminSlice.reducer;
