import {
    Avatar,
    Box,
    Typography,
    Button,
} from "@mui/material";

export default function CommentCard({

    name,
    message,
    time,

}) {

    return (

        <Box
            sx={{
                display: "flex",
                gap: 2,
            }}
        >

            <Avatar
                sx={{
                    width: 34,
                    height: 34,
                }}
            >
                {name[0]}
            </Avatar>

            <Box
                sx={{
                    flex: 1,
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >

                    <Typography
                        fontWeight={600}
                    >
                        {name}
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        {time}
                    </Typography>

                </Box>

                <Typography
                    sx={{
                        mt: .5,
                    }}
                >
                    {message}
                </Typography>

                <Button
                    size="small"
                    sx={{
                        mt: 1,
                        px: 0,
                        minWidth: 0,
                    }}
                >
                    Reply
                </Button>

            </Box>

        </Box>

    );

}