// controllers/commentController.js

import commentRepository from "../repositories/commentRepository.js";
import commentService from "../services/commentService.js";
import SessionManager from "../yjs/SessionManager.js";


class CommentController {


    /*
    |--------------------------------------------------------------------------
    | Create Comment
    |--------------------------------------------------------------------------
    */

    async createComment(req, res) {

        try {

            const comment =
                await commentService.createComment({

                    documentId:
                        req.params.documentId,

                    authorId:
                        req.user.id,

                    ...req.body,

                });


            const session =
                SessionManager.get(
                    req.params.documentId
                );


            if (session) {

                session.broadcastCommentEvent({

                    action: "created",

                    data: comment,

                });

            }


            res.status(201).json(comment);

        } catch (err) {

            console.error(err);

            res.status(500).json({
                message: err.message,
            });

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Get Comments
    |--------------------------------------------------------------------------
    */

    async getComments(req, res) {

        try {

            const comments =
                await commentService.getComments(
                    req.params.documentId
                );


            res.json(comments);

        } catch (err) {

            console.error(err);

            res.status(500).json({
                message: err.message,
            });

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Create Reply
    |--------------------------------------------------------------------------
    */

    async createReply(req, res) {

        try {

            const { commentId } =
                req.params;


            const { message } =
                req.body;


            const authorId =
                req.user.id;


            if (!message?.trim()) {

                return res.status(400).json({
                    message:
                        "Reply cannot be empty",
                });

            }


            /*
             * We need the parent comment
             * to know which document's
             * session should receive
             * the realtime event.
             */
            const comment =
                await commentRepository
                    .getCommentById(
                        commentId
                    );


            if (!comment) {

                return res.status(404).json({
                    message:
                        "Comment not found",
                });

            }


            const reply =
                await commentService.createReply({

                    commentId,

                    authorId,

                    message:
                        message.trim(),

                });


            /*
             * Broadcast reply to everyone
             * viewing this document.
             */
            const session =
                SessionManager.get(
                    comment.document_id
                );


            if (session) {

                session.broadcastCommentEvent({

                    action:
                        "reply_created",

                    data: reply,

                });

            }


            res.status(201).json(reply);

        } catch (err) {

            console.error(err);

            res.status(500).json({
                message: err.message,
            });

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Get Replies
    |--------------------------------------------------------------------------
    */

    async getReplies(req, res, next) {

        try {

            const { commentId } =
                req.params;


            const replies =
                await commentService.getReplies(
                    commentId
                );


            res.json(replies);

        } catch (err) {

            next(err);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Resolve / Reopen Comment
    |--------------------------------------------------------------------------
    */

    async setCommentResolved(
        req,
        res,
        next
    ) {

        try {

            const { commentId } =
                req.params;


            const { resolved } =
                req.body;


            if (
                typeof resolved !==
                "boolean"
            ) {

                return res.status(400).json({
                    message:
                        "resolved must be boolean",
                });

            }


            const comment =
                await commentRepository
                    .getCommentById(
                        commentId
                    );


            if (!comment) {

                return res.status(404).json({
                    message:
                        "Comment not found",
                });

            }


            /*
             * Only the comment author
             * can resolve/reopen it.
             */
            if (
                String(comment.author.id) !==
                String(req.user.id)
            ) {

                return res.status(403).json({
                    message:
                        "You cannot resolve this comment",
                });

            }


            const updatedComment =
                await commentRepository
                    .setCommentResolved(
                        commentId,
                        resolved
                    );


            /*
             * Broadcast the updated
             * comment.
             */
            const session =
                SessionManager.get(
                    comment.document_id
                );


            if (session) {

                session.broadcastCommentEvent({

                    action: "updated",

                    data: updatedComment,

                });

            }


            res.json(updatedComment);

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Delete Comment
    |--------------------------------------------------------------------------
    */

    async deleteComment(
        req,
        res,
        next
    ) {

        try {

            const { commentId } =
                req.params;


            const comment =
                await commentRepository
                    .getCommentById(
                        commentId
                    );


            if (!comment) {

                return res.status(404).json({
                    message:
                        "Comment not found",
                });

            }


            if (
                String(comment.author.id) !==
                String(req.user.id)
            ) {

                return res.status(403).json({
                    message:
                        "You cannot delete this comment",
                });

            }


            const deletedComment =
                await commentRepository
                    .deleteComment(
                        commentId
                    );


            /*
             * Broadcast deletion.
             */
            const session =
                SessionManager.get(
                    comment.document_id
                );


            if (session) {

                session.broadcastCommentEvent({

                    action: "deleted",

                    data: deletedComment,

                });

            }


            res.json(deletedComment);

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Delete Reply
    |--------------------------------------------------------------------------
    */

    async deleteReply(
        req,
        res,
        next
    ) {

        try {

            const { replyId } =
                req.params;


            const reply =
                await commentRepository
                    .getReplyById(
                        replyId
                    );


            if (!reply) {

                return res.status(404).json({
                    message:
                        "Reply not found",
                });

            }


            /*
             * Only the reply author
             * can delete their reply.
             */
            if (
                String(reply.author.id) !==
                String(req.user.id)
            ) {

                return res.status(403).json({
                    message:
                        "You cannot delete this reply",
                });

            }


            const deletedReply =
                await commentRepository
                    .deleteReply(
                        replyId
                    );


            /*
             * We need the parent comment
             * to obtain document_id.
             */
            const comment =
                await commentRepository
                    .getCommentById(
                        deletedReply.comment_id
                    );


            if (comment) {

                const session =
                    SessionManager.get(
                        comment.document_id
                    );


                if (session) {

                    session.broadcastCommentEvent({

                        action:
                            "reply_deleted",

                        data:
                            deletedReply,

                    });

                }

            }


            res.json(deletedReply);

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Update Comment
    |--------------------------------------------------------------------------
    */

    async updateComment(
        req,
        res,
        next
    ) {

        try {

            const { commentId } =
                req.params;


            const { message } =
                req.body;


            if (!message?.trim()) {

                return res.status(400).json({
                    message:
                        "Comment cannot be empty",
                });

            }


            const comment =
                await commentRepository
                    .getCommentById(
                        commentId
                    );


            if (!comment) {

                return res.status(404).json({
                    message:
                        "Comment not found",
                });

            }


            if (
                String(comment.author.id) !==
                String(req.user.id)
            ) {

                return res.status(403).json({
                    message:
                        "You cannot edit this comment",
                });

            }


            const updatedComment =
                await commentRepository
                    .updateComment({

                        commentId,

                        message:
                            message.trim(),

                    });


            /*
             * Broadcast updated comment.
             */
            const session =
                SessionManager.get(
                    comment.document_id
                );


            if (session) {

                session.broadcastCommentEvent({

                    action: "updated",

                    data: updatedComment,

                });

            }


            res.json(updatedComment);

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Update Reply
    |--------------------------------------------------------------------------
    */

    async updateReply(
        req,
        res,
        next
    ) {

        try {

            const { replyId } =
                req.params;


            const { message } =
                req.body;


            if (!message?.trim()) {

                return res.status(400).json({
                    message:
                        "Reply cannot be empty",
                });

            }


            const reply =
                await commentRepository
                    .getReplyById(
                        replyId
                    );


            if (!reply) {

                return res.status(404).json({
                    message:
                        "Reply not found",
                });

            }


            if (
                String(reply.author.id) !==
                String(req.user.id)
            ) {

                return res.status(403).json({
                    message:
                        "You cannot edit this reply",
                });

            }


            const updatedReply =
                await commentRepository
                    .updateReply({

                        replyId,

                        message:
                            message.trim(),

                    });


            /*
             * Obtain parent comment so
             * we know the document.
             */
            const comment =
                await commentRepository
                    .getCommentById(
                        updatedReply.comment_id
                    );


            if (comment) {

                const session =
                    SessionManager.get(
                        comment.document_id
                    );


                if (session) {

                    session.broadcastCommentEvent({

                        action:
                            "reply_updated",

                        data:
                            updatedReply,

                    });

                }

            }


            res.json(updatedReply);

        } catch (error) {

            next(error);

        }

    }

}


export default new CommentController();