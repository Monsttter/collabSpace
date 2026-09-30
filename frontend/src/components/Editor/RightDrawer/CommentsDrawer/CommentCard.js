import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useSelector } from "react-redux";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import formatRelativeTime from "../../../../utils/formatRelativeTime";
// import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useDispatch } from "react-redux";
import { resolveCommentPositions } from "../../../../utils/commentPositions";
import { useCollaborationContext } from "../../context/CollaborationContext";
import { scrollToComment } from "../../../../utils/commentNavigation";
import {
  deleteComment,
  fetchReplies,
  setCommentResolved,
  updateComment,
} from "../../../../store/comments/commentsThunks";
import { useState } from "react";
import CommentThread from "./CommentThread";
import { commentHighlightPluginKey } from "../../extensions/CommentHighlight";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export default function CommentCard({ comment, editor }) {
  const user = useSelector((state) => state.auth.user);
  const { repliesByComment } = useSelector((state) => state.comments);

  const [openThreadId, setOpenThreadId] = useState(null);

  const [editing, setEditing] = useState(false);

  const [message, setMessage] = useState(comment.message);

  const isMine = user?.id === comment.author.id;

  const [menuOpen, setMenuOpen] = useState(false);

  const updatingComment = useSelector(
    (state) => state.comments.updatingComment,
  );

  const dispatch = useDispatch();

  const {
    // provider,

    ydoc,
  } = useCollaborationContext();

  const isOwner = String(user?.id) === String(comment.author.id);

  const startEditing = () => {
    setMessage(comment.message);

    setEditing(true);

    setMenuOpen(false);
  };

  const cancelEditing = () => {
    setMessage(comment.message);

    setEditing(false);
  };

  const saveEdit = async () => {
    const text = message.trim();

    if (!text) {
      return;
    }

    if (text === comment.message) {
      setEditing(false);

      return;
    }

    const result = await dispatch(
      updateComment({
        commentId: comment.id,

        message: text,
      }),
    );

    if (updateComment.fulfilled.match(result)) {
      setEditing(false);
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      saveEdit();
    }

    if (e.key === "Escape") {
      cancelEditing();
    }
  };

  const handleToggleResolved = async () => {
    setMenuOpen(false);

    await dispatch(
      setCommentResolved({
        commentId: comment.id,

        resolved: !comment.resolved,
      }),
    );
  };

  const handleDeleteComment = async (commentId) => {
    const result = await dispatch(deleteComment(commentId));

    if (deleteComment.fulfilled.match(result)) {
      /*
       * Remove the highlight if the
       * deleted comment is currently
       * highlighted.
       */
      const highlightState = commentHighlightPluginKey.getState(editor.state);

      if (highlightState?.commentId === commentId) {
        editor.commands.clearCommentHighlight();
      }

      /*
       * Close the thread if it is open.
       */
      setOpenThreadId((current) => (current === commentId ? null : current));
    }
  };

  const handleOpenThread = (commentId) => {
    setOpenThreadId((current) => (current === commentId ? null : commentId));

    const replies = repliesByComment[commentId];

    if (!replies) {
      dispatch(fetchReplies(commentId));
    }
  };

  const highlightComment = (comment) => {
    if (!editor || !ydoc) {
      return;
    }

    if (
      comment.type !== "selection" ||
      !comment.anchor_relative ||
      !comment.head_relative
    ) {
      return;
    }

    const positions = resolveCommentPositions(
      editor,
      ydoc,
      comment.anchor_relative,
      comment.head_relative,
    );

    if (!positions) {
      console.log("Comment anchor no longer exists:", comment.id);

      return;
    }

    editor.commands.setCommentHighlight({
      commentId: comment.id,

      anchor: positions.anchor,

      head: positions.head,
    });
  };

  const handleCommentClick = (comment) => {
    if (!editor || !ydoc) {
      return;
    }

    if (
      comment.type !== "selection" ||
      !comment.anchor_relative ||
      !comment.head_relative
    ) {
      return;
    }

    const positions = resolveCommentPositions(
      editor,
      ydoc,
      comment.anchor_relative,
      comment.head_relative,
    );

    if (!positions) {
      console.log("Comment text no longer exists");

      return;
    }

    /*
     * Show the soft highlight.
     */
    editor.commands.setCommentHighlight({
      commentId: comment.id,

      anchor: positions.anchor,

      head: positions.head,
    });

    /*
     * Scroll to the comment.
     */
    scrollToComment(
      editor,

      positions.anchor,

      positions.head,
    );
  };

  return (
    <Paper
      onMouseEnter={() => highlightComment(comment)}
      onMouseLeave={() => {
        // if (activeCommentId !== comment.id) {
        editor.commands.clearCommentHighlight();
        // }
      }}
      onClick={() => handleCommentClick(comment)}
      elevation={0}
      sx={{
        px: 1.5,
        py: 1.25,
        mb: 1,

        border: "1px solid",
        borderColor: "divider",

        borderRadius: 0.5,

        bgcolor: isMine ? "action.selected" : "background.paper",

        cursor: "pointer",

        transition: "background-color 0.15s ease",

        "&:hover": {
          bgcolor: isMine ? "action.selected" : "action.hover",
        },
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        spacing={0.75}
        sx={{
          alignItems: "center",
          lineHeight: 1,
          mb: 0.75,
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.2,
            }}
          >
            {isMine ? "You" : comment.author.username}
          </Typography>

          {!comment.edited ? (
            <Typography
              variant="caption"
              sx={{
                paddingLeft: "5px",
                color: "text.secondary",
                fontSize: "0.7rem",
                lineHeight: 1.2,
              }}
            >
              · {formatRelativeTime(comment.created_at)}
            </Typography>
          ) : (
            <Typography
              component="span"
              sx={{
                paddingLeft: "5px",
                color: "text.secondary",
                fontSize: "0.7rem",
                lineHeight: 1.2,
              }}
            >
              · edited {formatRelativeTime(comment.updated_at)}
            </Typography>
          )}

          {comment.resolved && (
            <Box
              sx={{
                mx: 1,
                display: "flex",
                alignItems: "center",
                gap: 0.4
              }}
            >
              <CheckIcon
                sx={{
                  fontSize: 15,
                  color: "success.main",
                }}
              />
            </Box>
          )}
        </Box>

        {isOwner && (
          <Box
            sx={{
              position: "relative",
            }}
          >
            <IconButton
              size="small"
              onClick={() => setMenuOpen((current) => !current)}
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
                  position: "absolute",
                  right: 0,
                  top: 24,
                  zIndex: 20,
                  minWidth: 90,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                }}
              >
                <Box
                  onClick={startEditing}
                  sx={{
                    px: 1.2,
                    py: 0.7,
                    fontSize: 12,
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  Edit
                </Box>

                <Box
                  onClick={handleToggleResolved}
                  sx={{
                    px: 1.2,
                    py: 0.7,
                    fontSize: 12,
                    cursor: "pointer",

                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  {comment.resolved ? "Reopen" : "Resolve"}
                </Box>

                <Box
                  onClick={() => handleDeleteComment(comment.id)}
                  sx={{
                    px: 1.2,
                    py: 0.7,
                    fontSize: 12,
                    cursor: "pointer",
                    color: "error.main",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  Delete
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* {String(user?.id) === String(comment.author.id) && (
          <IconButton
            size="small"
            onClick={() => handleDeleteComment(comment.id)}
          >
            <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )} */}
      </Stack>

      {/* Quoted text */}
      {comment.quoted_text && (
        <Box
          sx={{
            display: "flex",
            alignItems: "stretch",

            mb: 0.75,

            borderRadius: 0.5,

            bgcolor: "action.hover",

            border: "1px solid",
            borderColor: "divider",

            overflow: "hidden",

            maxWidth: "100%",
          }}
        >
          {/* Quote indicator */}
          <Box
            sx={{
              width: 3,
              flexShrink: 0,
              bgcolor: "text.secondary",
            }}
          />

          <Typography
            variant="caption"
            sx={{
              px: 1,
              py: 0.6,

              color: "text.secondary",

              fontSize: "0.72rem",

              lineHeight: 1.35,

              whiteSpace: "nowrap",

              overflow: "hidden",

              textOverflow: "ellipsis",
            }}
          >
            {comment.quoted_text}
          </Typography>
        </Box>
      )}

      {/* Comment message */}
      {/* <Typography
        variant="body2"
        sx={{
          color: "#1F2937",

          fontSize: "0.85rem",

          lineHeight: 1.4,

          whiteSpace: "pre-wrap",

          wordBreak: "break-word",
        }}
      >
        {comment.message}
      </Typography> */}

      {editing ? (
        <Box
          sx={{
            mt: 0.4,
          }}
        >
          <TextField
            fullWidth
            autoFocus
            multiline
            minRows={1}
            maxRows={5}
            size="small"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleEditKeyDown}
            disabled={updatingComment}
            sx={{
              "& .MuiInputBase-root": {
                fontSize: 13,
                lineHeight: 1.35,
                py: 0.45,
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 0.25,
            }}
          >
            <IconButton
              size="small"
              onClick={cancelEditing}
              disabled={updatingComment}
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
              onClick={saveEdit}
              disabled={updatingComment || !message.trim()}
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
            wordBreak: "break-word",
          }}
        >
          {comment.message}
        </Typography>
      )}

      <Button
        onClick={() => handleOpenThread(comment.id)}
        sx={{
          fontSize: 11,
          minWidth: 0,
          p: 0,
          textTransform: "none",
        }}
      >
        {comment.reply_count === 1
          ? "1 reply"
          : `${comment.reply_count} replies`}
      </Button>

      {openThreadId === comment.id && <CommentThread commentId={comment.id} />}
    </Paper>
  );
}
