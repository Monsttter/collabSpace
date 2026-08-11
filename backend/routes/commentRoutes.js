// routes/commentRoutes.js

import express from "express";

import commentController from "../controllers/commentController.js";

import authenticate from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.post(
    "/documents/:documentId/comments",
    commentController.createComment
);

router.get(
    "/documents/:documentId/comments",
    commentController.getComments
);

router.post(
    "/comments/:commentId/replies",
    commentController.createReply
);

router.get(
    "/comments/:commentId/replies",
    commentController.getReplies
);

router.patch(
    "/comments/:commentId/resolve",
    commentController.setCommentResolved
);

router.delete(
    "/comments/:commentId",
    commentController.deleteComment
);

router.delete(
    "/comments/replies/:replyId",
    commentController.deleteReply
);

router.patch(
    "/comments/:commentId",
    commentController.updateComment
);

router.patch(
    "/comments/replies/:replyId",
    commentController.updateReply
);

export default router;