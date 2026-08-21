import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import documentReducer from "./documents/documentSlice";
// import editorReducer from "../features/editor/editorSlice";
import collaboratorsReducer from "./collaborators/collaboratorsSlice";
import commentsReducer from "./comments/commentsSlice";
import uiReducer from "./ui/uiSlice";
import versionsReducer from "./versions/versionSlice";
// import workspaceReducer from "../features/workspace/workspaceSlice";
// import notificationReducer from "../features/notifications/notificationSlice";
// import aiReducer from "../features/ai/aiSlice";

export const store = configureStore({

    reducer:{

        auth:authReducer,

        documents:documentReducer,

        // editor:editorReducer,

        collaborators:collaboratorsReducer,

        comments:commentsReducer,

        versions: versionsReducer,

        ui:uiReducer,

        // workspace:workspaceReducer,

        // notifications:notificationReducer,

        // ai:aiReducer

    }

});