import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    id: null,
    isLoggedIn: false,
    traders: null,
    selection: {
        TraderId: null,
        FarmerIndex: null,
        FolderIndex: null,
        EntryIndex: null
    }
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
        },
        addFarmer: (state, action) => {
            if (state.traders.Farmers == null || state.traders.Farmers === undefined)
                state.traders.Farmers = [];
            state.traders.Farmers.push(action.payload);
        },
        removeFarmer: (state, action) => {
            state.traders.Farmers.splice(action.payload, 1);
        },
        editFarmer: (state, action) => {
            const { farmerIndex, Name, Village, Mobile } = action.payload;
            const updatedFarmer = {
                ...state.traders.Farmers[farmerIndex],
                Name,
                Village,
                Mobile
            };

            state.traders.Farmers = [
                ...state.traders.Farmers.slice(0, farmerIndex),
                updatedFarmer,
                ...state.traders.Farmers.slice(farmerIndex + 1)
            ];
        },
        addFolderAuth: (state, action) => {
            const { Folder, index } = action.payload;
            if (state.traders.Farmers[index].Folder == null || state.traders.Farmers[index].Folder === undefined)
                state.traders.Farmers[index].Folder = [];
            state.traders.Farmers[index].Folder.push(Folder);
        },
        removeFolderAuth: (state, action) => {
            const { index, FolderIndex } = action.payload;
            state.traders.Farmers[index].Folder.splice(FolderIndex, 1);
        },

        addEntry: (state, action) => {
            if (state.traders.Farmers[state.selection.FarmerIndex].Folder[state.selection.FolderIndex].Invoice == null || state.traders.Farmers[state.selection.FarmerIndex].Folder[state.selection.FolderIndex].Invoice === undefined)
                state.traders.Farmers[state.selection.FarmerIndex].Folder[state.selection.FolderIndex].Invoice = [];
            state.traders.Farmers[state.selection.FarmerIndex].Folder[state.selection.FolderIndex].Invoice.push(action.payload);
        },
        // Handle Selections
        ModifySelection: (state, action) => {
            state.selection = action.payload;
        }
    },
});

export const { setSignIn, setSignOut, addFarmer, removeFarmer, editFarmer, addFolderAuth, removeFolderAuth, ModifySelection, addEntry } = authSlice.actions;
export const selectIsLoggedIn = (state) => state.userAuth.isLoggedIn;
export const selectTraders = (state) => state.userAuth.traders;
export const selectId = (state) => state.userAuth.id;
export const selection = (state) => state.userAuth.selection;
export default authSlice.reducer;
