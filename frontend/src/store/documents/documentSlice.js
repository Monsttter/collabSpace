import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    documents: [],
    currentDocument: null,

    loading: false,
    error: null,

    initialized: false,
};

const documentSlice = createSlice({
    name: "documents",

    initialState,

    reducers: {
        setDocuments(state, action) {
            state.documents = action.payload;
            state.initialized = true;
        },

        addDocument(state, action) {
            state.documents.unshift(action.payload);
        },

        deleteDocument(state, action) {
            state.documents = state.documents.filter(
                doc => doc.id !== action.payload
            );

            if (
                state.currentDocument &&
                state.currentDocument.id === action.payload
            ) {
                state.currentDocument = null;
            }
        },

        renameDocument(state, action) {
            const { id, title } = action.payload;

            const doc = state.documents.find(d => d.id === id);

            if (doc){
                doc.title = title;
            }

            if (
                state.currentDocument &&
                state.currentDocument.id === id
            ) {
                state.currentDocument.title = title;
            }
        },

        updateDocument(state, action) {
            const updated = action.payload;

            const index = state.documents.findIndex(
                d => d.id === updated.id
            );

            if (index !== -1)
                state.documents[index] = updated;

            if (
                state.currentDocument &&
                state.currentDocument.id === updated.id
            ) {
                state.currentDocument = updated;
            }
        },

        updateDocumentTimestamp(state, action) {
            const { id, updated_at } = action.payload;

            const doc = state.documents.find(
                d => d.id === id
            );

            if (doc) {
                doc.updated_at = updated_at;
            }

            if (
                state.currentDocument &&
                state.currentDocument.id === id
            ) {
                state.currentDocument.updated_at = updated_at;
            }
        },

        setCurrentDocument(state, action) {
            state.currentDocument = action.payload;
        },

        toggleFavorite(state, action) {
            const id = action.payload;

            const doc = state.documents.find(
                d => d.id === id
            );

            if (doc)
                doc.favorite = !doc.favorite;

            if (
                state.currentDocument &&
                state.currentDocument.id === id
            ) {
                state.currentDocument.favorite =
                    !state.currentDocument.favorite;
            }
        },

        setLoading(state, action) {
            state.loading = action.payload;
        },

        setError(state, action) {
            state.error = action.payload;
        },
    },
});

export const {
    setDocuments,
    addDocument,
    deleteDocument,
    renameDocument,
    updateDocument,
    updateDocumentTimestamp,
    setCurrentDocument,
    toggleFavorite,
    setLoading,
    setError,
} = documentSlice.actions;

export default documentSlice.reducer;
