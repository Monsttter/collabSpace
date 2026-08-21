import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCollaborators,
  removeCollaborator,
  shareDocument,
  updateCollaboratorRole,
} from "./collaboratorsThunks";

const initialState = {
  collaborators: [],

  onlineUsers: [],

  loading: false,

  error: null,
};

const collaboratorsSlice = createSlice({
  name: "collaborators",

  initialState,

  reducers: {
    handleCollaboratorEvent(state, action) {
      const { action: eventAction, data } = action.payload;

      if (eventAction === "role_updated") {
        const index = state.collaborators.findIndex(
          (c) => String(c.id) === String(data.id),
        );

        if (index !== -1) {
          state.collaborators[index] = data;
        }

        return;
      }

      if (eventAction === "removed") {
        state.collaborators = state.collaborators.filter(
          (c) => String(c.id) !== String(data.user_id),
        );
      }

      if (eventAction === "created") {
        const exists = state.collaborators.some(
          (c) => String(c.id) === String(data.id),
        );

        if (!exists) {
          state.collaborators.push(data);
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(shareDocument.fulfilled, (state, action) => {
        console.log(action.payload);
        const exists = state.collaborators.some(
          (c) => String(c.id) === String(action.payload.id),
        );

        if (!exists) {
          state.collaborators.push(action.payload);
        }
      })

      .addCase(fetchCollaborators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCollaborators.fulfilled, (state, action) => {
        state.loading = false;

        state.collaborators = action.payload;
      })

      .addCase(fetchCollaborators.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      })

      .addCase(updateCollaboratorRole.fulfilled, (state, action) => {
        const updated = action.payload;

        const index = state.collaborators.findIndex(
          (user) => user.id === updated.id,
        );

        if (index !== -1) {
          state.collaborators[index].role = updated.role;
        }
      })

      .addCase(removeCollaborator.fulfilled, (state, action) => {
        const { userId } = action.payload;

        state.collaborators = state.collaborators.filter(
          (user) => user.id !== userId,
        );
      });
  },
});

export const { handleCollaboratorEvent } = collaboratorsSlice.actions;

export default collaboratorsSlice.reducer;
