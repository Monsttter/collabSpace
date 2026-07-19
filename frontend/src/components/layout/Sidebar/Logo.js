import { Box, Typography } from "@mui/material";
import { Layers3 } from "lucide-react";

const Logo = () => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1,
            }}
        >
            <Box
                sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    bgcolor: "primary.main",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                }}
            >
                <Layers3 size={22} />
            </Box>

            <Box>
                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    collabSpace
                </Typography>

                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    Collaborative Workspace
                </Typography>
            </Box>
        </Box>
    );
};

export default Logo;