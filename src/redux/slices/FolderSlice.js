import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    FolderInfo: null
};

const FolderSlice = createSlice({
    name: 'FolderSlice',
    initialState,
    reducers: {
        selectFolder: (state, action) => {
            state.FolderInfo = action.payload
        },
        removeFolderSelection: (state) => {
            state.FolderInfo = null;
        },
        addEntry: (state, action) => {
            if (state.FolderInfo.Invoice == null || state.FolderInfo.Invoice === undefined)
                state.FolderInfo.Invoice = [];
            state.FolderInfo.Invoice.push(action.payload);
        },

    },
});

export const { selectFolder, removeFolderSelection, addEntry } = FolderSlice.actions;
export const selectedFolder = (state) => state.FolderSlice.FolderInfo;
export default FolderSlice.reducer;
