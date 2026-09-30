import Sidebar from "./Sidebar";
import SidebarDocuments from "./SidebarDocuments";

import { Box, Divider } from "@mui/material";

export default function EditorSidebar() {

    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
            }}
        >
            <Sidebar>

                {/* <SidebarSearch /> */}

                <Divider />

                <SidebarDocuments />

            </Sidebar>

        </Box>
    );
}