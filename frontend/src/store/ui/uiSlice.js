import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    drawer: null,

    shareDialogOpen: false,

    sidebarCollapsed: false,

    pendingSelection: null,
    
    selectedComment: null,
};

const uiSlice = createSlice({

    name: "ui",

    initialState,

    reducers: {

        toggleDrawer(state, action) {

            state.drawer = state.drawer==action.payload ? null : action.payload;

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

} = uiSlice.actions;

export default uiSlice.reducer;