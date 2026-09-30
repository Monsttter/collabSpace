import { Box, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default function SidebarHeader() {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 3,
                py: 2.5,
            }}
        >
            <Box
                sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "12px",
                    bgcolor: "#4F46E5",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                }}
            >
                <AutoAwesomeIcon fontSize="small" />
            </Box>

            <Typography
                fontWeight={700}
                fontSize={20}
            >
                collabSpace
            </Typography>
        </Box>
    );
}