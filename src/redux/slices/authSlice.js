import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    id: null,
    isLoggedIn: false,
    traders: null,
};

const authSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {
        setSignIn: (state, action) => {
            state.traders = action.payload.traders;
            state.id = action.payload.id;
            state.isLoggedIn = action.payload.isLoggedIn;
        },
        setSignOut: (state) => {
            state.id = null;
            state.traders = null;
            state.isLoggedIn = false;
        }
    },
});

export const { setSignIn, setSignOut } = authSlice.actions;
export const selectIsLoggedIn = (state) => state.userAuth.isLoggedIn;
export const selectTraders = (state) => state.userAuth.traders;
export const selectId = (state) => state.userAuth.id;
export default authSlice.reducer;
