import React from "react";

import {
    Box,
    Typography,
    // Avatar,
    Button,
    IconButton,
    Chip
} from "@mui/material"


import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// function getInitials(name, email) {
//   const value = name || email || "?";

//   return value
//     .trim()
//     .split(/\s+/)
//     .slice(0, 2)
//     .map((word) => word[0]?.toUpperCase())
//     .join("");
// }

function formatTime(date) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

/*
|--------------------------------------------------------------------------
| Avatar colors
|--------------------------------------------------------------------------
*/

// const avatarColors = ["#E7E0FF", "#FFE0E5", "#FFF0B8", "#DDEBFF", "#DDF5E7"];

// function getAvatarColor(index) {
//   return avatarColors[index % avatarColors.length];
// }

export default function VersionCard({
    version,
    index,
    isCurrent,
    onPreview,
}) {

    const authorName =
        version.username ||
        version.author_name ||
        version.email ||
        "Unknown user";


    const description =
        version.description ||
        "No description";


    return (

        <Box
            sx={{
                position: "relative",

                display: "flex",

                gap: 1,

                p: 1.5,

                mb: 1.25,

                border: "1px solid",

                borderColor:
                    isCurrent
                        ? "primary.light"
                        : "divider",

                borderRadius: 1,

                backgroundColor:
                    isCurrent
                        ? "action.selected"
                        : "background.paper",

                transition:
                    "all 0.15s ease",

                "&:hover": {
                    borderColor:
                        isCurrent
                            ? "primary.main"
                            : "text.secondary",

                    boxShadow:
                        "0 2px 8px rgba(0,0,0,0.05)",
                },
            }}
        >

            {/* ---------------------------------------------------------- */}
            {/* Avatar */}
            {/* ---------------------------------------------------------- */}

            {/* <Avatar
                sx={{
                    width: 36,
                    height: 36,

                    flexShrink: 0,

                    fontSize: 16,

                    fontWeight: 500,

                    backgroundColor:
                        getAvatarColor(index),

                    color: "#202020",
                }}
            >
                {getInitials(
                    authorName,
                    version.email
                )}
            </Avatar> */}


            {/* ---------------------------------------------------------- */}
            {/* Main content */}
            {/* ---------------------------------------------------------- */}

            <Box
                sx={{
                    flex: 1,

                    minWidth: 0,

                    pr: 5,
                }}
            >

                {/* Description */}

                <Typography
                    sx={{
                        fontSize: 15,

                        fontWeight: 700,

                        lineHeight: 1.35,

                        color: "text.primary",

                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        whiteSpace: "nowrap",
                    }}
                >
                    {description}
                </Typography>


                {/* Author */}

                <Typography
                    sx={{
                        mt: 0.35,

                        fontSize: 13.5,

                        color: "text.secondary",

                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        whiteSpace: "nowrap",
                    }}
                >
                    {authorName}
                </Typography>


                {/* Version + current + time */}

                <Box
                    sx={{
                        display: "flex",

                        alignItems: "center",

                        gap: 0.75,

                        mt: 0.9,

                        flexWrap: "wrap",
                    }}
                >

                    <Chip
                        label={`Version ${
                            version.version_number
                        }`}
                        size="small"
                        sx={{
                            height: 25,

                            fontSize: 12,

                            fontWeight: 500,

                            backgroundColor:
                                "action.hover",

                            color: "text.secondary",

                            "& .MuiChip-label": {
                                px: 1,
                            },
                        }}
                    />


                    {isCurrent && (

                        <Chip
                            label="Current"
                            size="small"
                            sx={{
                                height: 25,

                                fontSize: 12,

                                fontWeight: 600,

                                backgroundColor:
                                    "action.selected",

                                color: "primary.main",

                                "& .MuiChip-label": {
                                    px: 1,
                                },
                            }}
                        />

                    )}


                    <Typography
                        sx={{
                            fontSize: 12.5,

                            color: "text.secondary",
                        }}
                    >
                        •
                    </Typography>


                    <Typography
                        sx={{
                            fontSize: 12.5,

                            color: "text.secondary",
                        }}
                    >
                        {formatTime(
                            version.created_at
                        )}
                    </Typography>

                </Box>

            </Box>


            {/* ---------------------------------------------------------- */}
            {/* Right side */}
            {/* ---------------------------------------------------------- */}

            <Box
                sx={{
                    position: "absolute",

                    right: 10,

                    top: 10,

                    bottom: 10,

                    display: "flex",

                    flexDirection:
                        "column",

                    alignItems:
                        "flex-end",

                    justifyContent:
                        "space-between",
                }}
            >

                <IconButton
                    size="small"
                    sx={{
                        p: 0.25,

                        color:
                            "text.secondary",
                    }}
                >
                    <MoreVertIcon
                        fontSize="small"
                    />
                </IconButton>


                <Button
                    size="small"

                    variant="text"

                    startIcon={
                        <VisibilityOutlinedIcon
                            sx={{
                                fontSize:
                                    "18px !important",
                            }}
                        />
                    }

                    onClick={() =>
                        onPreview?.(
                            version
                        )
                    }

                    sx={{
                        // minWidth: 104,

                        height: 26,

                        borderRadius: 1.5,

                        textTransform:
                            "none",

                        fontSize: 13,

                        fontWeight: 600,

                        color: "primary.main",

                        borderColor:
                            isCurrent
                                ? "#C8BEFF"
                                : "#D8D8E0",

                        "&:hover": {
                            borderColor:
                                "primary.main",

                            backgroundColor:
                                "action.hover",
                        },
                    }}
                >
                    Preview
                </Button>

            </Box>

        </Box>

    );
}