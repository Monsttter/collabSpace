import {
  // Avatar,
  // AvatarGroup,
  Box,
  IconButton,
  Typography,
} from "@mui/material";

import {
  FileText,
  // MoreHorizontal,
  Star,
} from "lucide-react";

const DocumentRow = ({
  doc,
  collaborators,
  formatUpdatedAt,
  onClick,
  handleToggleFavorite
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
          backgroundColor: "action.hover",
          transform: "translateX(4px)"
        },
      }}
      onClick={onClick}
    >
      {/* Left */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flex: 1,
          direction: ""
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

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              {doc.title}
            </Typography>

            <Typography
              sx={{
                color: "#64748B",
                fontSize: 13,
                mt: .3,
              }}
            >
              Updated {formatUpdatedAt(doc.updated_at)}
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
          <IconButton
              size="small"
              onClick={(event) => handleToggleFavorite(event, doc.id)}
            >
              {doc.favorite ? (
                <Star size={20} fill="#FACC15" color="#FACC15" />
              ) : (
                <Star size={20} fill="white" color="grey" />
              )}
            </IconButton>
        {/* <AvatarGroup
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
        </AvatarGroup> */}

        {/* <IconButton size="small">
          <MoreHorizontal size={18} />
        </IconButton> */}
      </Box>
    </Box>
  );
};

export default DocumentRow;
