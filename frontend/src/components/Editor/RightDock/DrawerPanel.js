import { Box } from "@mui/material";

// import { useRightDock } from "../../../contexts/RightDockContext";

import CommentsDrawer from "./CommentsDrawer";
import PeopleDrawer from "./PeopleDrawer";
import HistoryDrawer from "./HistoryDrawer";
import AIDrawer from "./AIDrawer";

export default function DrawerPanel({drawer}) {

    // const { drawer } = useRightDock();

    if (!drawer) return null;

    return (
        <Box
            sx={{
                width: 360,

                bgcolor: "#fff",

                borderLeft: "1px solid #E5E7EB",

                overflowY: "auto",

                flexShrink: 0,

                animation: "slideIn .25s ease",
            }}
        >
            {drawer === "comments" && <CommentsDrawer />}

            {drawer === "people" && <PeopleDrawer />}

            {drawer === "history" && <HistoryDrawer />}

            {drawer === "ai" && <AIDrawer />}
        </Box>
    );
}