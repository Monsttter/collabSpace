import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api/share";

export const shareDocument = createAsyncThunk(
    "share/shareDocument",

    async ({documentId, email, role}) => {
        return await api.shareDocument(documentId, email, role);
    }
);

export const fetchCollaborators = createAsyncThunk(
    "share/fetchCollaborators",

    async (documentId) => {
        return await api.getCollaborators(documentId);
    }
);

export const updateCollaboratorRole =
    createAsyncThunk(
        "share/updateCollaboratorRole",

        async ({
            documentId,
            userId,
            role,
        }) => {

            return await api.updateCollaboratorRole(
                documentId,
                userId,
                role
            );

        }
    );

export const removeCollaborator =
    createAsyncThunk(
        "share/removeCollaborator",

        async ({
            documentId,
            userId,
        }) => {

            return await api.removeCollaborator(
                documentId,
                userId
            );

        }
    );