import { Avatar, AvatarGroup, Box, Typography } from "@mui/material";
import { useCollaborationContext } from "./context/CollaborationContext";

export default function StatusBar() {

  const {
    users,

    connectionStatus,
  } = useCollaborationContext();
  // console.log(users);

  function getInitials(name = "") {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  }

  return (
    <Box
      sx={{
        height: 46,
        px: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
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
            display: "flex",
            alignItems: "center",
            gap: 1,
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

          <Typography fontWeight={500}>{connectionStatus}</Typography>
          {/* <Typography fontWeight={500}>
                        {users.length} collaborators online
                    </Typography> */}
          <AvatarGroup max={4} spacing="small" sx={{ p: 2 }}>
            {users.map((user) => (
              <Box
                sx={{
                  position: "relative",
                  flexShrink: 0,
                  // p: 2
                }}
              >
                <Avatar
                  sx={{ width: "35px", height: "35px", fontSize: "20px" }}
                >
                  {" "}
                  {getInitials(user.name)}
                </Avatar>
                {/* Online indicator */}
                <Box
                  sx={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: user.color,
                    border: "2px solid",
                    borderColor: "background.paper",
                  }}
                />
              </Box>
            ))}
          </AvatarGroup>
        </Box>
      </Box>
    </Box>
  );
}
