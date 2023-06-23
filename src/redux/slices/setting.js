import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const initialState = {
    showHeading: Cookies.get("Heading") === undefined ? "true" : Cookies.get("Heading")
};
const settingSlice = createSlice({
    name: 'setting',
    initialState,
    reducers: {
        setHeading: (state, action) => {
            state.showHeading = action.payload;
            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
            Cookies.set("Heading", action.payload, { expires: oneYearFromNow });
        }
    },
});

export const { setHeading } = settingSlice.actions;
export const showHeding = (state) => state.setting.showHeading;
export default settingSlice.reducer;
