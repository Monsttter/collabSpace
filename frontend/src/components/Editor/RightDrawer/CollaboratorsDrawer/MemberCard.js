import {
    Avatar,
    Box,
    Chip,
    Typography,
} from "@mui/material";

export default function MemberCard({ member }) {

    return (

        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                py: 1.5,
            }}
        >

            <Box
                sx={{
                    position: "relative",
                }}
            >

                <Avatar>

                    {member.name[0]}

                </Avatar>

                <Box
                    sx={{
                        position: "absolute",
                        right: 2,
                        bottom: 2,

                        width: 10,
                        height: 10,

                        borderRadius: "50%",

                        bgcolor: member.color,

                        border: "2px solid white",
                    }}
                />

            </Box>

            <Box
                sx={{
                    ml: 2,
                    flex: 1,
                }}
            >

                <Typography fontWeight={600}>
                    {member.name}
                </Typography>

                {/* <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {member.online ? "Online" : "Offline"}
                </Typography> */}

            </Box>

            <Chip
                label={member.role}
                size="small"
                color={
                    member.role === "Owner"
                        ? "primary"
                        : "default"
                }
            />

        </Box>

    );

}