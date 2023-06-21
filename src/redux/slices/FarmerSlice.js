import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    FarmerInfo: null
};

const FarmerSlice = createSlice({
    name: 'FarmerSlice',
    initialState,
    reducers: {
        selectFarmer: (state, action) => {
            state.FarmerInfo = action.payload;
        },
        removeFarmerSelection: (state) => {
            state.FarmerInfo = null;
        },
        editFarmerSelection: (state, action) => {
            state.FarmerInfo.Name = action.payload.Name;
            state.FarmerInfo.Village = action.payload.Village;
            state.FarmerInfo.Mobile = action.payload.Mobile;
        },
        addFolder: (state, action) => {
            if (state.FarmerInfo.Folder == null || state.FarmerInfo.Folder === undefined)
                state.FarmerInfo.Folder = [];
            state.FarmerInfo.Folder.push(action.payload);
        },
        removeFolder: (state, action) => {
            state.FarmerInfo.Folder.splice(action.payload, 1);
        },
    },
});

export const {
    selectFarmer,
    removeFarmerSelection,
    editFarmerSelection,
    addFolder,
    removeFolder
} = FarmerSlice.actions;

export const selectedFarmer = (state) => state.FarmerSlice.FarmerInfo;
export const selectedFarmerIndex = (state) => state.FarmerSlice.FarmerInfo?.Index;

export default FarmerSlice.reducer;
