import { createAsyncThunk }
    from "@reduxjs/toolkit";

import * as api
    from "../../api/documentVersions";


/*
|--------------------------------------------------------------------------
| Fetch Versions
|--------------------------------------------------------------------------
*/

export const fetchVersions =
    createAsyncThunk(

        "versions/fetchVersions",

        async (documentId) => {

            return await api.fetchVersions(
                documentId
            );

        }

    );


/*
|--------------------------------------------------------------------------
| Create Version
|--------------------------------------------------------------------------
*/

export const createVersion =
    createAsyncThunk(

        "versions/createVersion",

        async ({
            documentId,
            description
        }) => {

            return await api.createVersion(
                documentId,
                description
            );

        }

    );


/*
|--------------------------------------------------------------------------
| Fetch One Version
|--------------------------------------------------------------------------
*/

export const fetchVersion =
    createAsyncThunk(

        "versions/fetchVersion",

        async ({
            documentId,
            versionNumber
        }) => {

            return await api.fetchVersion(
                documentId,
                versionNumber
            );

        }

    );

export const restoreVersion = createAsyncThunk(
    "versions/restoreVersion",

    async ({
        documentId,
        versionNumber,
        createBackup
    }) => {
        return await api.restoreVersion(
            documentId,
            versionNumber,
            createBackup
        );
    }
);