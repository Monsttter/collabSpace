import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    drawer: null,

    shareDialogOpen: false,

    sidebarCollapsed: false,

    pendingSelection: null,
    
    selectedComment: null,

    themeMode: localStorage.getItem("collabspace-theme") || "light",
};

const uiSlice = createSlice({

    name: "ui",

    initialState,

    reducers: {

        toggleDrawer(state, action) {

            state.drawer = state.drawer === action.payload ? null : action.payload;

        },
        
        openDrawer(state, action) {

            state.drawer = action.payload;

        },

        closeDrawer(state) {

            state.drawer = null;

        },

        setPendingSelection(state, action) {

            state.pendingSelection = action.payload;

        },

        clearPendingSelection(state) {

            state.pendingSelection = null;

        },

        setSelectedComment(state, action) {

            state.selectedComment = action.payload;

        },

        clearSelectedComment(state) {

            state.selectedComment = null;

        },

        toggleTheme(state) {
            state.themeMode = state.themeMode === "dark" ? "light" : "dark";
        },

    },

});

export const {

    openDrawer,
    
    toggleDrawer,

    closeDrawer,

    setPendingSelection,

    clearPendingSelection,

    setSelectedComment,

    clearSelectedComment,

    toggleTheme,

} = uiSlice.actions;

export default uiSlice.reducer;
