import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import setting from './slices/setting';
export const store = configureStore({
    reducer: {
        userAuth: authSlice,
        setting: setting
    },
});