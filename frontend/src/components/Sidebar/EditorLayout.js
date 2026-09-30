import { Outlet } from "react-router";

import Sidebar from "./Sidebar";
import SidebarSearch from "./SidebarSearch";
import SidebarDocuments from "./SidebarDocuments";

import { Box, Divider } from "@mui/material";

export default function EditorLayout() {

    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
            }}
        >
            <Sidebar>

                <SidebarSearch />

                <Divider />

                <SidebarDocuments />

            </Sidebar>

            <Box
                sx={{
                    flex: 1,
                    overflow: "auto",
                }}
            >
                <Outlet />
            </Box>

        </Box>
    );
}