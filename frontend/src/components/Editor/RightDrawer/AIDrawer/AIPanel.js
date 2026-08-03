import { Box, Divider, Typography } from "@mui/material";

import QuickActions from "./QuickActions";
import PromptInput from "./PromptInput";
import AIResponse from "./AIResponse";

export default function AIPanel() {
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
                    borderBottom: "1px solid #E5E7EB",
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={600}
                >
                    AI Assistant
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Your intelligent writing partner.
                </Typography>
            </Box>

            <QuickActions />

            <Divider />

            <PromptInput />

            <Divider />

            <AIResponse />
        </Box>
    );
}