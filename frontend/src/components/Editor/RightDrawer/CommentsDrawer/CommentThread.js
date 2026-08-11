import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import ReplyComposer from "./ReplyComposer";
import CommentReply from "./CommentReply";

export default function CommentThread({ commentId }) {

  const replies = useSelector(
    (state) => state.comments.repliesByComment[commentId] || [],
  );

  const loading = useSelector(
    (state) => state.comments.repliesLoading[commentId],
  );

  return (
    <Box
      sx={{
        mt: 0.5,
        ml: 2,
        pl: 1.5,
        borderLeft: "2px solid #e5e7eb",
      }}
    >
      {loading && (
        <Typography
          sx={{
            fontSize: 12,
            color: "text.secondary",
            py: 0.5,
          }}
        >
          Loading replies...
        </Typography>
      )}

      {!loading &&
        replies.map((reply) => (
          <CommentReply key={reply.id} reply={reply}/>
        ))}

      <ReplyComposer commentId={commentId} />
    </Box>
  );
}
