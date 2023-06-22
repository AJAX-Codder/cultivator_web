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
                state.traders.Farmers = {};
            state.traders.Farmers[action.payload.FID] = action.payload;
        },
        removeFarmer: (state, action) => {
            const traders = JSON.parse(JSON.stringify(state.traders));
            const Farmers = traders.Farmers;
            delete Farmers[action.payload];
            state.traders.Farmers = { ...Farmers };
        },
        editFarmer: (state, action) => {
            const { key, Name, Village, Mobile } = action.payload;
            const traders = JSON.parse(JSON.stringify(state.traders));
            const Farmers = traders.Farmers;
            const updatedFarmer = {
                ...Farmers[key],
                Name,
                Village,
                Mobile
            };
            Farmers[key] = updatedFarmer;
            state.traders = traders;
        },
        addFolder: (state, action) => {
            if (state.traders.Farmers[state.selection.FarmerIndex].Folder == null || state.traders.Farmers[state.selection.FarmerIndex].Folder === undefined)
                state.traders.Farmers[state.selection.FarmerIndex].Folder = {};
            state.traders.Farmers[state.selection.FarmerIndex].Folder[action.payload.MFID] = action.payload;
        },
        removeFolder: (state, action) => {
            const traders = JSON.parse(JSON.stringify(state.traders));
            const Folders = traders.Farmers[state.selection.FarmerIndex].Folder;
            delete Folders[action.payload];
            state.traders.Farmers[state.selection.FarmerIndex].Folder = { ...Folders };
        },

        addEntry: (state, action) => {
            if (state.traders.Farmers[state.selection.FarmerIndex].Folder[state.selection.FolderIndex].Invoice == null || state.traders.Farmers[state.selection.FarmerIndex].Folder[state.selection.FolderIndex].Invoice === undefined)
                state.traders.Farmers[state.selection.FarmerIndex].Folder[state.selection.FolderIndex].Invoice = {};
            state.traders.Farmers[state.selection.FarmerIndex].Folder[state.selection.FolderIndex].Invoice[action.payload.IID] = action.payload;
            state.traders.Farmers[state.selection.FarmerIndex].Balance += action.payload.TYPE === "જમા " ? +action.payload.RUPEE : -action.payload.RUPEE;
            state.traders.Farmers[state.selection.FarmerIndex].Folder[state.selection.FolderIndex].Balance += action.payload.TYPE === "જમા " ? +action.payload.RUPEE : -action.payload.RUPEE;
        },
        removeEntry: (state, action) => {
            const traders = JSON.parse(JSON.stringify(state.traders));
            const Invoice = traders.Farmers[state.selection.FarmerIndex].Folder[state.selection.FolderIndex].Invoice;
            state.traders.Farmers[state.selection.FarmerIndex].Balance += !Invoice[action.payload].TYPE === "જમા " ? +Invoice[action.payload].RUPEE : -Invoice[action.payload].RUPEE;
            state.traders.Farmers[state.selection.FarmerIndex].Folder[state.selection.FolderIndex].Balance += !Invoice[action.payload].TYPE === "જમા " ? +Invoice[action.payload].RUPEE : -Invoice[action.payload].RUPEE;
            delete Invoice[action.payload];
            state.traders.Farmers[state.selection.FarmerIndex].Folder[state.selection.FolderIndex].Invoice = { ...Invoice };
        },
        editEntry: (state, action) => {
            const { FarmerIndex, FolderIndex, InvoiceIndex } = state.selection;
            const invoiceList = state.traders.Farmers[FarmerIndex].Folder[FolderIndex].Invoice;
            const newInvoice = action.payload;
            const oldInvoice = invoiceList[InvoiceIndex];

            let balance = state.traders.Farmers[FarmerIndex].Folder[FolderIndex].Balance;
            let balance2 = state.traders.Farmers[FarmerIndex].Balance;

            balance -= (oldInvoice?.TYPE === "જમા ") ? parseInt(oldInvoice.RUPEE) : -parseInt(oldInvoice.RUPEE);
            balance += (newInvoice?.TYPE === "જમા ") ? parseInt(newInvoice.RUPEE) : -parseInt(newInvoice.RUPEE);

            balance2 -= (oldInvoice?.TYPE === "જમા ") ? parseInt(oldInvoice.RUPEE) : -parseInt(oldInvoice.RUPEE);
            balance2 += (newInvoice?.TYPE === "જમા ") ? parseInt(newInvoice.RUPEE) : -parseInt(newInvoice.RUPEE);

            state.traders.Farmers[FarmerIndex].Folder[FolderIndex].Balance = balance;
            state.traders.Farmers[FarmerIndex].Balance = balance2;
            state.traders.Farmers[FarmerIndex].Folder[FolderIndex].Invoice[InvoiceIndex] = newInvoice;
        },


        // Handle Selections
        ModifySelection: (state, action) => {
            state.selection = action.payload;
        }
    },
});

export const { setSignIn, setSignOut, addFarmer, removeFarmer, editFarmer, addFolder, removeFolder, ModifySelection, addEntry, editEntry, removeEntry } = authSlice.actions;
export const selectIsLoggedIn = (state) => state.userAuth.isLoggedIn;
export const selectTraders = (state) => state.userAuth.traders;
export const selectId = (state) => state.userAuth.id;
export const selection = (state) => state.userAuth.selection;
export default authSlice.reducer;
