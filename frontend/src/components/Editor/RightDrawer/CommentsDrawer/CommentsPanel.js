import {
    Box,
    Typography,
    Divider,
} from "@mui/material";

import CommentInput from "./CommentInput";
import CommentThread from "./CommentThread";

export default function CommentsPanel() {

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
                    Comments
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Discuss changes with collaborators.
                </Typography>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    px: 2,
                    py: 2,
                }}
            >

                <CommentThread />

                <CommentThread />

                <CommentThread />

            </Box>

            <Divider />

            <CommentInput />


        </Box>
    );
}