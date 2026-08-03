import {
    Avatar,
    Box,
    Button,
    TextField,
} from "@mui/material";

export default function CommentInput() {

    return (

        <Box
            sx={{
                display: "flex",
                gap: 2,
                p: 2,
            }}
        >

            <Avatar
                sx={{
                    width: 36,
                    height: 36,
                }}
            >
                R
            </Avatar>

            <Box sx={{ flex: 1 }}>

                <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    placeholder="Leave a comment..."
                />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 1,
                    }}
                >
                    <Button
                        variant="contained"
                    >
                        Comment
                    </Button>
                </Box>

            </Box>

        </Box>

    );

}