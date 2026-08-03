import { Box, Button } from "@mui/material";
import {
    LayoutDashboard,
    FileText,
    Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";

const navItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/",
    },
    {
        title: "Documents",
        icon: FileText,
        path: "/documents",
    },
    {
        title: "Workspace",
        icon: Users,
        path: "/workspace",
    },
];

export default function SidebarNavigation() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box
            sx={{
                px: 2,
                py: 2,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
            }}
        >
            {navItems.map((item) => {
                const Icon = item.icon;

                const active =
                    location.pathname === item.path ||
                    (item.path === "/documents" &&
                        location.pathname.startsWith("/editor"));

                return (
                    <Button
                        key={item.title}
                        fullWidth
                        startIcon={<Icon size={18} />}
                        onClick={() => navigate(item.path)}
                        sx={{
                            justifyContent: "flex-start",
                            textTransform: "none",
                            py: 1.4,
                            gap: 1,
                            px: 1.5,
                            borderRadius: "12px",

                            color: active
                                ? "#4F46E5"
                                : "#4B5563",

                            bgcolor: active
                                ? "#EEF2FF"
                                : "transparent",

                            // fontWeight: active ? 600 : 500,
                            fontWeight: 600,

                            "&:hover": {
                                bgcolor: active
                                    ? "#E4E8FF"
                                    : "#F3F4F6",
                            },

                            "& .MuiButton-startIcon": {
                                marginRight: 1.5,
                            },
                        }}
                    >
                        {item.title}
                    </Button>
                );
            })}
        </Box>
    );
}