import { Box, Typography, Divider, Button } from "@mui/material";

import InviteSection from "./InviteSection";
import MemberCard from "./MemberCard";
import { PersonAddAlt1 } from "@mui/icons-material";
import { useCollaborationContext } from "../../context/CollaborationContext";

export default function CollaboratorsPanel({ openShareDialog }) {

    // const members = [
    //     {
    //         id: 1,
    //         name: "Rahul",
    //         role: "Owner",
    //         online: true,
    //     },
    //     {
    //         id: 2,
    //         name: "Jake",
    //         role: "Editor",
    //         online: true,
    //     },
    //     {
    //         id: 3,
    //         name: "John",
    //         role: "Viewer",
    //         online: false,
    //     },
    // ];

    const { users } =
    useCollaborationContext();

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
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            Collaborators
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Manage document access.
                        </Typography>
                    </Box>

                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<PersonAddAlt1 />}
                        onClick={openShareDialog}
                    >
                        Invite
                    </Button>

                </Box>
            </Box>

            {/* <InviteSection />

            <Divider /> */}

            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 2,
                }}
            >

                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    Workspace Members
                </Typography>

                {users.map(member => (

                    <MemberCard
                        key={member.id}
                        member={member}
                    />

                ))}

            </Box>

        </Box>

    );

}