import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import documentReducer from "./documents/documentSlice";
// import editorReducer from "../features/editor/editorSlice";
// import collaboratorReducer from "../features/collaborators/collaboratorSlice";
// import commentReducer from "../features/comments/commentSlice";
// import uiReducer from "../features/ui/uiSlice";
// import workspaceReducer from "../features/workspace/workspaceSlice";
// import notificationReducer from "../features/notifications/notificationSlice";
// import aiReducer from "../features/ai/aiSlice";

export const store = configureStore({

    reducer:{

        auth:authReducer,

        documents:documentReducer,

        // editor:editorReducer,

        // collaborators:collaboratorReducer,

        // comments:commentReducer,

        // ui:uiReducer,

        // workspace:workspaceReducer,

        // notifications:notificationReducer,

        // ai:aiReducer

    }

});