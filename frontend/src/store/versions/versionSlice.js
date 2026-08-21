import { createSlice } from "@reduxjs/toolkit";

import {
  fetchVersions,
  createVersion,
  fetchVersion,
  restoreVersion,
} from "./versionThunks";

const initialState = {
  /*
   * Version metadata shown
   * in history drawer.
   */
  versions: [],

  /*
   * Currently selected version.
   */
  selectedVersion: null,

  /*
   * Loading history.
   */
  loading: false,

  /*
   * Creating a snapshot.
   */
  creating: false,

  /*
   * Loading a specific version.
   */
  loadingVersion: false,

  restoring: false,

  error: null,
};

const versionSlice = createSlice({
  name: "versions",

  initialState,

  reducers: {
    clearVersions(state) {
      state.versions = [];

      state.selectedVersion = null;

      state.error = null;
    },

    clearSelectedVersion(state) {
      state.selectedVersion = null;
    },

    versionCreatedRealtime: (state, action) => {
      const version = action.payload;

      /*
       * Avoid duplicate insertion.
       */

      const exists = state.versions.some((v) => v.id === version.id);

      if (exists) {
        return;
      }

      state.versions.unshift(version);

      /*
       * Keep the same ordering as your
       * Version History UI.
       */

      state.versions.sort((a, b) => b.version_number - a.version_number);
    },
  },

  extraReducers: (builder) => {
    /*
            |--------------------------------------------------------------------------
            | Fetch Versions
            |--------------------------------------------------------------------------
            */

    builder

      .addCase(
        fetchVersions.pending,

        (state) => {
          state.loading = true;

          state.error = null;
        },
      )

      .addCase(
        fetchVersions.fulfilled,

        (state, action) => {
          state.loading = false;

          state.versions = action.payload;
        },
      )

      .addCase(
        fetchVersions.rejected,

        (state, action) => {
          state.loading = false;

          state.error = action.error.message;
        },
      );

    /*
            |--------------------------------------------------------------------------
            | Create Version
            |--------------------------------------------------------------------------
            */

    builder

      .addCase(
        createVersion.pending,

        (state) => {
          state.creating = true;

          state.error = null;
        },
      )

      .addCase(
        createVersion.fulfilled,

        (state, action) => {
          state.creating = false;

          /*
           * Add newly-created version
           * to the history immediately.
           */

          // state.versions.unshift(action.payload);
        },
      )

      .addCase(
        createVersion.rejected,

        (state, action) => {
          state.creating = false;

          state.error = action.error.message;
        },
      );

    /*
            |--------------------------------------------------------------------------
            | Fetch One Version
            |--------------------------------------------------------------------------
            */

    builder

      .addCase(
        fetchVersion.pending,

        (state) => {
          state.loadingVersion = true;

          state.error = null;
        },
      )

      .addCase(
        fetchVersion.fulfilled,

        (state, action) => {
          state.loadingVersion = false;

          state.selectedVersion = action.payload;
        },
      )

      .addCase(
        fetchVersion.rejected,

        (state, action) => {
          state.loadingVersion = false;

          state.error = action.error.message;
        },
      )

      .addCase(restoreVersion.pending, (state) => {
        state.restoring = true;
        state.error = null;
      })

      .addCase(restoreVersion.fulfilled, (state) => {
        state.restoring = false;
      })

      .addCase(restoreVersion.rejected, (state, action) => {
        state.restoring = false;
        state.error = action.error.message;
      });
  },
});

export const { clearVersions, clearSelectedVersion, versionCreatedRealtime} = versionSlice.actions;

export default versionSlice.reducer;
