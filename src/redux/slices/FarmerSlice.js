import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    FarmerInfo: null
};

const FarmerSlice = createSlice({
    name: 'FarmerSlice',
    initialState,
    reducers: {
        selectFarmer: (state, action) => {
            state.FarmerInfo = action.payload
        }
    },
});

export const { selectFarmer } = FarmerSlice.actions;
export const selectedFarmer = (state) => state.FarmerSlice.FarmerInfo;
export default FarmerSlice.reducer;
