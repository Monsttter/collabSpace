import { Box } from "@mui/material";

import CommentsPanel from "./CommentsDrawer/CommentsPanel";
import CollaboratorsPanel from "./CollaboratorsDrawer/CollaboratorsPanel";
import HistoryPanel from "./HistoryDrawer/HistoryPanel";
import AIPanel from "./AIDrawer/AIPanel";
// import AIPanel from "./AIPanel";

export default function DrawerPanel({ drawer, openShareDialog }) {

    const panels = {
        comments: <CommentsPanel />,
        collaborators: <CollaboratorsPanel openShareDialog={openShareDialog} />,
        history: <HistoryPanel/>,
        ai: <AIPanel/>,
    };

    return (
        <Box
            sx={{
                width: 360,
                bgcolor: "#fff",
                borderLeft: "1px solid #E5E7EB",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            {panels[drawer]}
        </Box>
    );
}