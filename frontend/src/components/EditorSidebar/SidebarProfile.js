import {
    Avatar,
    Box,
    Typography,
} from "@mui/material";

export default function SidebarProfile() {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
            }}
        >
            <Avatar
                sx={{
                    bgcolor: "#5B5CEB",
                }}
            >
                R
            </Avatar>

            <Box ml={2}>
                <Typography
                sx={{
                    fontWeight:600,
                    fontSize:14
                }}
                >
                    Rahul Choudhary
                </Typography>

                <Typography
                sx={{
                    color: "text.secondary",
                    fontSize:12
                }}
                >
                    Personal Workspace
                </Typography>
            </Box>
        </Box>
    );
}