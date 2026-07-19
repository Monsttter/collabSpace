import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Typography,
} from "@mui/material";

import {
  FileText,
  MoreHorizontal,
  Star,
} from "lucide-react";

const DocumentRow = ({
  title,
  updatedAt,
  collaborators,
  favorite = false,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1.6,
        px: 2,
        borderRadius: "14px",
        transition: ".2s",
        cursor: "pointer",

        "&:hover": {
          backgroundColor: "#F8FAFC",
          transform: "translateX(4px)"
        },
      }}
    >
      {/* Left */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flex: 1,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            backgroundColor: "#EEF2FF",
            color: "#4F46E5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FileText size={20} />
        </Box>

        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              {title}
            </Typography>

            {favorite && (
              <Star
                size={15}
                fill="#FACC15"
                color="#FACC15"
              />
            )}
          </Box>

          <Typography
            sx={{
              color: "#64748B",
              fontSize: 13,
              mt: .3,
            }}
          >
            Updated {updatedAt}
          </Typography>
        </Box>
      </Box>

      {/* Right */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <AvatarGroup
          max={3}
          sx={{
            "& .MuiAvatar-root": {
              width: 30,
              height: 30,
              fontSize: 12,
            },
          }}
        >
          {collaborators.map((person) => (
            <Avatar key={person.name}>
              {person.name[0]}
            </Avatar>
          ))}
        </AvatarGroup>

        <IconButton size="small">
          <MoreHorizontal size={18} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default DocumentRow;