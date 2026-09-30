import { Box } from "@mui/material";

import CommentsPanel from "./CommentsDrawer/CommentsPanel";
import CollaboratorsPanel from "./CollaboratorsDrawer/CollaboratorsPanel";
import AIPanel from "./AIDrawer/AIPanel";
import { useSelector } from "react-redux";
import VersionHistory from "./HistoryDrawer/VersionHistory";
// import AIPanel from "./AIPanel";

export default function DrawerPanel({ editor, openShareDialog }) {

    const drawer= useSelector(state => state.ui.drawer);

    const panels = {
        comments: <CommentsPanel editor={editor}/>,
        collaborators: <CollaboratorsPanel openShareDialog={openShareDialog} />,
        history: <VersionHistory/>,
        ai: <AIPanel editor={editor}/>,
    };

    return (
        <Box
            sx={{
                width: { xs: "100%", sm: 380 },
                bgcolor: "background.paper",
                borderLeft: 1,
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            {panels[drawer]}
        </Box>
    );
}
