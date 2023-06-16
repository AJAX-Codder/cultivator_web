import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import FarmerSlice from './slices/FarmerSlice';
export const store = configureStore({
    reducer: {
        userAuth: authSlice,
        FarmerSlice: FarmerSlice
    },
});