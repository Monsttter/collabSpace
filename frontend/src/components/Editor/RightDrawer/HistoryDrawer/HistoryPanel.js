import {
    Box,
    Typography,
    // Divider,
} from "@mui/material";

import VersionCard from "./VersionCard";

export default function HistoryPanel() {

    const versions = [
        {
            id: 1,
            current: true,
            time: "Just now",
            title: "Auto Saved",
            user: "You",
        },
        {
            id: 2,
            current: false,
            time: "4:18 PM",
            title: "Added collaboration section",
            user: "Rahul",
        },
        {
            id: 3,
            current: false,
            time: "3:42 PM",
            title: "Fixed toolbar alignment",
            user: "Jake",
        },
    ];

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={600}
                >
                    Version History
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Browse and restore document snapshots.
                </Typography>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 2,
                }}
            >
                {versions.map((version) => (
                    <VersionCard
                        key={version.id}
                        version={version}
                    />
                ))}
            </Box>
        </Box>
    );
}
