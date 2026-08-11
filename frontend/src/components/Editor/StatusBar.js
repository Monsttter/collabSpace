import { Avatar, AvatarGroup, Box, Typography } from "@mui/material";
import { useCollaborationContext } from "./context/CollaborationContext";

export default function StatusBar() {

    const {
    
            users,

            connectionStatus
    
        } = useCollaborationContext();
        // console.log(users);

    return (
        <Box
            sx={{
                height: 46,
                px: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "#fff",
                borderBottom: "1px solid #ECEEF3",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                }}
            >
                <Box 
                    sx={{
                    display:"flex",
                    alignItems:"center",
                    gap:1
                    }}
                    >
                    <Box
                        sx={{
                            width: 9,
                            height: 9,
                            borderRadius: "50%",
                            bgcolor: "#22C55E",
                        }}
                    />

                    <Typography fontWeight={500}>
                        {connectionStatus}
                    </Typography>
                    <Typography fontWeight={500}>
                        {users.length} collaborators online
                    </Typography>
                </Box>
            </Box>

            <AvatarGroup
                max={4}
                spacing="medium"
            >
                <Avatar src="/avatars/1.jpg" />
                <Avatar src="/avatars/2.jpg" />
                <Avatar src="/avatars/3.jpg" />
                <Avatar src="/avatars/4.jpg" />
                <Avatar src="/avatars/5.jpg" />
            </AvatarGroup>
        </Box>
    );
}