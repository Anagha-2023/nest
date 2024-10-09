import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './slices/userSlice';
import { adminReducer } from './slices/adminSlice';
import { hostReducer } from './slices/hostSlice'
import { homestayReducer } from './slices/hosthomestaySlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    host: hostReducer,
    homestay: homestayReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
