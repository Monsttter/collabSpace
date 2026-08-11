// services/commentService.js

import commentRepository from "../repositories/commentRepository.js";

class CommentService {

    async createComment(data) {

        return await commentRepository.createComment(data);

    }

    async getComments(documentId) {

        const comments =
            await commentRepository.getCommentsByDocument(documentId);

        return comments;

    }
    
    async getCommentById(commentId) {

        const comment =
            await commentRepository.getCommentById(commentId);

        return comment;

    }

    async createReply(data) {

        const comment =
            await commentRepository.getCommentById(data.commentId);

        if (!comment) {

            throw new Error("Comment not found");

        }

        return await commentRepository.createReply(data);

    }
    async getReplies(commentId) {

        const comment =
            await commentRepository.getCommentById(commentId);

        if (!comment) {

            throw new Error("Comment not found");

        }

        return await commentRepository.getReplies(commentId);

    }

    async resolveComment(commentId) {

        return await commentRepository.resolveComment(commentId);

    }

    async deleteComment(commentId) {

        return await commentRepository.deleteComment(commentId);

    }

}

export default new CommentService();