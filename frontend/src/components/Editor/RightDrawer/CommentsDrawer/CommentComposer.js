import { Box, IconButton, TextField, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { clearSelectedRange } from "../../../../store/comments/commentsSlice";

import { createComment } from "../../../../store/comments/commentsThunks";

import { selectSelectedRange } from "../../../../store/comments/commentsSelectors";
import { createCommentPositions } from "../../../../utils/commentPositions";
import { useCollaborationContext } from "../../context/CollaborationContext";

export default function CommentComposer({editor}) {
  const { id: documentId } = useParams();

  const dispatch = useDispatch();

  const selectedRange = useSelector(selectSelectedRange);

  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const {
  
          provider,
  
          ydoc
  
      } = useCollaborationContext();

  const handleSubmit = async () => {
    const text = message.trim();

    if (!text || submitting) {
      return;
    }

    try {
      setSubmitting(true);

      let positions= null;

      if(selectedRange){
        positions = createCommentPositions(
          editor,
          ydoc,
          selectedRange.anchor,
          selectedRange.head,
        );
      }

      await dispatch(
        createComment({
          documentId,

          comment: {
            message: text,

            type: selectedRange ? "selection" : "page",

            anchorRelative:
                positions?.anchorRelative ?? null,

            headRelative:
                positions?.headRelative ?? null,

            quotedText:
                selectedRange?.text ?? null,
          },
        }),
      ).unwrap();

      setMessage("");

      // Selection is no longer needed
      // after the comment is created.
      dispatch(clearSelectedRange());
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (event) => {
    // Ctrl + Enter / Cmd + Enter
    if (event.key === "Enter") {
      event.preventDefault();

      handleSubmit();
    }
  };

  const removeSelection = () => {
    dispatch(clearSelectedRange());
  };

  return (
    <Box
      sx={{
        borderTop: "1px solid #E5E7EB",
        bgcolor: "#FFFFFF",
        px: 1.5,
        py: 1.25,
      }}
    >
      {/* Selected text */}
      {selectedRange && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",

            mb: 1,

            px: 1,

            py: 0.7,

            bgcolor: "#F1F5F9",

            border: "1px solid #E2E8F0",

            borderRadius: 1.5,

            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 3,
              alignSelf: "stretch",
              flexShrink: 0,
              bgcolor: "#6366F1",
              borderRadius: 1,
              mr: 1,
            }}
          />

          <Typography
            variant="caption"
            sx={{
              flex: 1,
              minWidth: 0,

              color: "#475569",

              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",

              fontSize: "0.72rem",
            }}
          >
            {selectedRange.text}
          </Typography>

          <IconButton
            size="small"
            onClick={removeSelection}
            sx={{
              ml: 0.5,
              p: 0.25,
            }}
          >
            <CloseIcon
              sx={{
                fontSize: 16,
              }}
            />
          </IconButton>
        </Box>
      )}

      {/* Composer */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: 0.3,
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          size="small"
          placeholder={
            selectedRange ? "Add a comment..." : "Write a comment..."
          }
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={submitting}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "#F8FAFC",
            },
          }}
        />

        <IconButton
          color="primary"
          onClick={handleSubmit}
          disabled={!message.trim() || submitting}
          sx={{
            mb: 0.25,
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

// import {
//   Avatar,
//   Box,
//   Button,
//   IconButton,
//   Paper,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { clearPendingSelection } from "../../../../store/ui/uiSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router";
// import useComments from "../../hooks/useComments";
// import { useState } from "react";
// import { Close } from "@mui/icons-material";
// import { createComment } from "../../../../store/comments/commentsThunks";

// export default function CommentComposer() {
//   const { id: documentId } = useParams();
//   const [message, setMessage] = useState("");
//   const dispatch = useDispatch();
//   // const { createComment } = useComments(documentId);

//   const { pendingSelection } = useSelector((state) => state.ui);

//   const handleSubmit = async () => {
//     dispatch(createComment({documentId,comment:{
//       message,

//       type: pendingSelection ? "selection" : "page",

//       anchor: pendingSelection?.anchor ?? null,

//       head: pendingSelection?.head ?? null,

//       quotedText: pendingSelection?.text ?? null,
//     }}));

//     dispatch(clearPendingSelection());

//     setMessage("");
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         gap: 2,
//         p: 2,
//       }}
//     >
//       <Avatar
//         sx={{
//           width: 36,
//           height: 36,
//         }}
//       >
//         R
//       </Avatar>

//       <Box sx={{ flex: 1 }}>
//         {pendingSelection && (
//           <Paper sx={{ display: "flex" }}>
//             <Typography>{pendingSelection.text}</Typography>

//             <IconButton onClick={() => dispatch(clearPendingSelection())}>
//               <Close />
//             </IconButton>
//           </Paper>
//         )}
//         <TextField
//           fullWidth
//           multiline
//           minRows={2}
//           value={message}
//           placeholder="Leave a comment..."
//           onChange={(e) => setMessage(e.target.value)}
//         />

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "flex-end",
//             mt: 1,
//           }}
//         >
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={message.trim().length === 0}
//           >
//             Comment
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// }
