import React, { useEffect, useMemo, useState } from "react";

import {
    Box,
    Typography,
    Avatar,
    Button,
    IconButton,
    Chip,
    Divider,
    CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    Dialog,
} from "@mui/material"


import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function getInitials(name, email) {
  const value = name || email || "?";

  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

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

const avatarColors = ["#E7E0FF", "#FFE0E5", "#FFF0B8", "#DDEBFF", "#DDF5E7"];

function getAvatarColor(index) {
  return avatarColors[index % avatarColors.length];
}

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
                        ? "#B9ADFF"
                        : "divider",

                borderRadius: 1,

                backgroundColor:
                    isCurrent
                        ? "#FCFAFF"
                        : "background.paper",

                transition:
                    "all 0.15s ease",

                "&:hover": {
                    borderColor:
                        isCurrent
                            ? "#A99AFF"
                            : "#C9C9C9",

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

                        color: "#171717",

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
                                "#F1F1F3",

                            color: "#4A4A4A",

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
                                    "#EEE9FF",

                                color: "#4B35C5",

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

                        color: "#4935C6",

                        borderColor:
                            isCurrent
                                ? "#C8BEFF"
                                : "#D8D8E0",

                        "&:hover": {
                            borderColor:
                                "#8F7FFF",

                            backgroundColor:
                                "#F8F6FF",
                        },
                    }}
                >
                    Preview
                </Button>

            </Box>

        </Box>

    );
}


// import {
//     Box,
//     Chip,
//     Typography,
// } from "@mui/material";

// export default function VersionCard({

//     version,

//     onClick,

// }) {

//     return (

//         <Box

//             onClick={onClick}

//             sx={{

//                 mb:2,

//                 p:2,

//                 border:"1px solid #E5E7EB",

//                 borderRadius:3,

//                 transition:".2s",

//                 cursor:"pointer",

//                 "&:hover":{

//                     borderColor:"#6366F1",

//                     bgcolor:"#F8FAFC"

//                 }

//             }}

//         >

//             <Box

//                 sx={{

//                     display:"flex",

//                     justifyContent:"space-between",

//                     alignItems:"center"

//                 }}

//             >

//                 <Typography
//                     fontWeight={600}
//                 >

//                     {version.description}

//                 </Typography>

//                 {version.current && (

//                     <Chip

//                         label="Current"

//                         size="small"

//                         color="success"

//                     />

//                 )}

//             </Box>

//             <Typography

//                 variant="body2"

//                 color="text.secondary"

//                 sx={{mt:.5}}

//             >

//                 {version.username} • {version.created_at}

//             </Typography>

//             <Typography

//                 variant="body2"

//                 sx={{mt:1}}

//             >

//                 {version.summary}

//             </Typography>

//         </Box>

//     );

// }