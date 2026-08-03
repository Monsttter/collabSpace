import { Box } from "@mui/material";

import CommentCard from "./CommentCard";

export default function CommentThread() {

    return (

        <Box
            sx={{
                mb: 3,
            }}
        >

            <CommentCard
                name="Rahul"
                message="Can we improve this paragraph?"
                time="2 min ago"
            />

            <Box
                sx={{
                    ml: 6,
                    mt: 1,
                }}
            >

                <CommentCard
                    name="Jake"
                    message="Done."
                    time="Just now"
                />

            </Box>

        </Box>

    );

}