import { Box, Divider } from "@mui/material";
import SidebarHeader from "./SidebarHeader";
import SidebarNavigation from "./SidebarNavigation";
import SidebarProfile from "./SidebarProfile";

export default function Sidebar({ children }) {
    return (
        <Box
            sx={{
                width: 300,
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                borderRight: "1px solid #ECEEF3",
                background: "#fff",
                flexShrink: 0,
            }}
        >
            <SidebarHeader />

            <Divider />

            <SidebarNavigation />

            <Divider />

            {/* Dynamic Part */}
            <Box
                sx={{
                    flex: 1,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {children}
            </Box>

            <Divider />

            <SidebarProfile />
        </Box>
    );
}