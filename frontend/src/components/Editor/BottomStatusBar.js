import { Box, Typography } from "@mui/material";
import {
    CheckCircle2,
    LoaderCircle,
    WifiOff,
} from "lucide-react";

export default function BottomStatusBar({
    words = 0,
    readingTime = 0,
    syncStatus = "saved", // "saved" | "saving" | "offline"
}) {
    const getStatus = () => {
        switch (syncStatus) {
            case "saving":
                return {
                    icon: (
                        <LoaderCircle
                            size={16}
                            className="spin"
                        />
                    ),
                    text: "Saving...",
                    color: "#F59E0B",
                };

            case "offline":
                return {
                    icon: <WifiOff size={16} />,
                    text: "Offline",
                    color: "#EF4444",
                };

            default:
                return {
                    icon: <CheckCircle2 size={16} />,
                    text: "All changes saved",
                    color: "#22C55E",
                };
        }
    };

    const status = getStatus();

    return (
        <Box
            sx={{
                height: 42,
                px: 3,
                borderTop: "1px solid #ECEEF3",
                bgcolor: "#fff",

                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",

                flexShrink: 0,
            }}
        >
            {/* Left */}

            <Typography
                sx={{
                    fontSize: 13,
                    color: "#6B7280",
                }}
            >
                {words} words • {readingTime} min read
            </Typography>

            {/* Right */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: status.color,
                }}
            >
                {status.icon}

                <Typography
                    sx={{
                        fontSize: 13,
                        fontWeight: 600,
                    }}
                >
                    {status.text}
                </Typography>
            </Box>
        </Box>
    );
}