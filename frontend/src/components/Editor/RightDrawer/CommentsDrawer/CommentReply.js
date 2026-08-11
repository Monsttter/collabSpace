import React, { useEffect, useState } from "react";

import {
    Box,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import DeleteOutline from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { useDispatch, useSelector } from "react-redux";
import { deleteReply, updateReply } from "../../../../store/comments/commentsThunks";
import formatRelativeTime from "../../../../utils/formatRelativeTime";


export default function Reply({ reply }) {

    const dispatch = useDispatch();

    const user = useSelector(
        state => state.auth.user
    );

    const [editing, setEditing] =
        useState(false);

    const [message, setMessage] =
        useState(reply.message);


    const [menuOpen, setMenuOpen] =
        useState(false);


    const updating = useSelector(
        state => state.comments.updatingReply
    );


    const deleting = useSelector(
        state => state.comments.deletingReply
    );


    /*
     * Keep local text synchronized if the
     * reply changes from Redux.
     */
    useEffect(() => {

        if (!editing) {

            setMessage(reply.message);

        }

    }, [reply.message, editing]);


    const isOwner =
        String(user?.id) ===
        String(reply.author.id);


    const startEditing = () => {

        setMessage(reply.message);

        setEditing(true);

        setMenuOpen(false);

    };


    const cancelEditing = () => {

        setMessage(reply.message);

        setEditing(false);

    };


    const saveEdit = async () => {

        const text =
            message.trim();


        if (!text) {
            return;
        }


        if (text === reply.message) {

            setEditing(false);

            return;

        }


        const result =
            await dispatch(
                updateReply({

                    replyId: reply.id,

                    message: text,

                })
            );


        if (
            updateReply.fulfilled.match(
                result
            )
        ) {

            setEditing(false);

        }

    };


    const handleKeyDown = e => {

        /*
         * Ctrl/Cmd + Enter
         * saves the reply.
         */
        if (
            e.key === "Enter" 
        ) {

            e.preventDefault();

            saveEdit();

        }


        /*
         * Escape cancels editing.
         */
        if (e.key === "Escape") {

            cancelEditing();

        }

    };


    const handleDelete = async () => {

        setMenuOpen(false);

        await dispatch(
            deleteReply(reply.id)
        );

    };


    return (

        <Box
            sx={{
                py: 0.55,
                position: "relative",
            }}
        >

            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    minHeight: 20,
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        // gap: 0.5,
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            lineHeight: 1.2,
                        }}
                    >
                        {reply.author.username}
                    </Typography>

                    {!reply.edited ? <Typography
                                variant="caption"
                                sx={{
                                  paddingLeft: "5px",
                                  color: "#9CA3AF",
                                  fontSize: "0.7rem",
                                  lineHeight: 1.2,
                                }}
                              >
                                · {formatRelativeTime(reply.created_at)}
                              </Typography>


                    :

                        <Typography
                            sx={{
                                paddingLeft: "5px",
                                  color: "#9CA3AF",
                                  fontSize: "0.7rem",
                                  lineHeight: 1.2,
                            }}
                        >
                            · edited {formatRelativeTime(reply.updated_at)}
                        </Typography>

                    }

                </Box>


                {isOwner && (

                    <Box
                        sx={{
                            position:
                                "relative",
                        }}
                    >

                        <IconButton
                            size="small"
                            onClick={() =>
                                setMenuOpen(
                                    current =>
                                        !current
                                )
                            }
                            sx={{
                                width: 22,
                                height: 22,
                                opacity: 0.65,
                            }}
                        >

                            <MoreHorizIcon
                                sx={{
                                    fontSize: 16,
                                }}
                            />

                        </IconButton>


                        {menuOpen && (

                            <Box
                                sx={{
                                    position:
                                        "absolute",
                                    right: 0,
                                    top: 24,
                                    zIndex: 20,
                                    minWidth: 90,
                                    bgcolor:
                                        "background.paper",
                                    border:
                                        "1px solid",
                                    borderColor:
                                        "divider",
                                    borderRadius: 1,
                                    boxShadow:
                                        "0 3px 12px rgba(0,0,0,0.12)",
                                    overflow:
                                        "hidden",
                                }}
                            >

                                <Box
                                    onClick={
                                        startEditing
                                    }
                                    sx={{
                                        px: 1.2,
                                        py: 0.7,
                                        fontSize: 12,
                                        cursor:
                                            "pointer",
                                        "&:hover": {
                                            bgcolor:
                                                "action.hover",
                                        },
                                    }}
                                >
                                    Edit
                                </Box>


                                <Box
                                    onClick={
                                        handleDelete
                                    }
                                    sx={{
                                        px: 1.2,
                                        py: 0.7,
                                        fontSize: 12,
                                        cursor:
                                            "pointer",
                                        color:
                                            "error.main",
                                        "&:hover": {
                                            bgcolor:
                                                "action.hover",
                                        },
                                    }}
                                >
                                    Delete
                                </Box>

                            </Box>

                        )}

                    </Box>

                )}

            </Box>


            {/* MESSAGE / EDITOR */}

            {editing ? (

                <Box
                    sx={{
                        mt: 0.35,
                    }}
                >

                    <TextField
                        fullWidth
                        autoFocus
                        multiline
                        minRows={1}
                        maxRows={4}
                        size="small"
                        value={message}
                        onChange={e =>
                            setMessage(
                                e.target.value
                            )
                        }
                        onKeyDown={
                            handleKeyDown
                        }
                        disabled={updating}
                        sx={{
                            "& .MuiInputBase-root":
                                {
                                    fontSize: 12,
                                    lineHeight: 1.35,
                                    py: 0.45,
                                },

                            "& textarea": {
                                padding: 0,
                            },
                        }}
                    />


                    {/* EDIT ACTIONS */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "flex-end",
                            alignItems: "center",
                            gap: 0.25,
                            mt: 0.25,
                        }}
                    >

                        <IconButton
                            size="small"
                            onClick={
                                cancelEditing
                            }
                            disabled={
                                updating
                            }
                            sx={{
                                width: 23,
                                height: 23,
                            }}
                        >

                            <CloseIcon
                                sx={{
                                    fontSize: 15,
                                }}
                            />

                        </IconButton>


                        <IconButton
                            size="small"
                            onClick={
                                saveEdit
                            }
                            disabled={
                                updating ||
                                !message.trim()
                            }
                            sx={{
                                width: 23,
                                height: 23,
                            }}
                        >

                            <CheckIcon
                                sx={{
                                    fontSize: 16,
                                }}
                            />

                        </IconButton>

                    </Box>

                </Box>

            ) : (

                <Typography
                    sx={{
                        fontSize: 13,
                        lineHeight: 1.35,
                        color: "text.secondary",
                        wordBreak: "break-word",
                    }}
                >
                    {reply.message}
                </Typography>

            )}

        </Box>

    );

}

// import React, { useState } from "react";
// import { Box, Typography, IconButton } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
// import {
//   deleteReply,
//   updateReply,
// } from "../../../../store/comments/commentsThunks";
// import formatRelativeTime from "../../../../utils/formatRelativeTime";

// const CommentReply = ({reply}) => {
//   const user = useSelector((state) => state.auth.user);
//   const [editing, setEditing] = useState(false);

//   const [message, setMessage] = useState(reply.message);

//   const dispatch = useDispatch();

//   const handleDelete = async (replyId) => {
//     await dispatch(deleteReply(replyId));
//   };

//   const startEditing = () => {
//     setMessage(reply.message);

//     setEditing(true);
//   };

//   const handleSave = async () => {
//     const text = message.trim();

//     if (!text) {
//       return;
//     }

//     const result = await dispatch(
//       updateReply({
//         replyId: reply.id,

//         message: text,
//       }),
//     );

//     if (updateReply.fulfilled.match(result)) {
//       setEditing(false);
//     }
//   };
//   const handleKeyDown = (e) => {
//     if (e.key === "Escape") {
//       setEditing(false);

//       setMessage(reply.message);
//     }
//   };

//   return (
//     <Box
//       key={reply.id}
//       sx={{
//         py: 0.6,
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <Typography
//           sx={{
//             fontSize: 12,
//             fontWeight: 700,
//           }}
//         >
//           {reply.author.username}
//           <Typography
//             variant="caption"
//             sx={{
//               paddingLeft: "10px",
//               color: "#9CA3AF",
//               fontSize: "0.7rem",
//               lineHeight: 1.2,
//             }}
//           >
//             {formatRelativeTime(reply.created_at)}
//           </Typography>
//           {reply.edited && (
//             <Typography
//               component="span"
//               sx={{
//                 fontSize: 10,
//                 color: "text.secondary",
//               }}
//             >
//               · edited
//             </Typography>
//           )}
//         </Typography>

//         {String(user?.id) === String(reply.author.id) && (
//           <IconButton size="small" onClick={() => handleDelete(reply.id)}>
//             <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />
//             {/* <Trash/> */}
//           </IconButton>
//         )}
//       </Box>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         <Typography
//           sx={{
//             fontSize: 13,
//             lineHeight: 1.35,
//             color: "text.secondary",
//           }}
//         >
//           {reply.message}
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default CommentReply;
