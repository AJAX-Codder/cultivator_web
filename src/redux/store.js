import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import FarmerSlice from './slices/FarmerSlice';
import FolderSlice from './slices/FolderSlice';
export const store = configureStore({
    reducer: {
        userAuth: authSlice,
        FarmerSlice: FarmerSlice,
        FolderSlice: FolderSlice
    },
});