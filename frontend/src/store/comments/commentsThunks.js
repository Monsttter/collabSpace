import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "../../api/comments";

export const fetchComments = createAsyncThunk(

    "comments/fetchComments",

    async (documentId) => {

        return await api.fetchComments(documentId);

    }

);

export const createComment = createAsyncThunk(

    "comments/createComment",

    async ({documentId, comment}) => {

        return await api.createComment(documentId, comment);

    }

);

export const createReply = createAsyncThunk(

    "comments/createReply",

    async ({ commentId, message }) => {

        return await api.createReply(

            commentId,

            message

        );

    }

);

export const fetchReplies = createAsyncThunk(
    "comments/fetchReplies",
    
    async (commentId) => {

        return{
            commentId,
            replies: await api.fetchReplies(commentId)
        };

    }
);

export const setCommentResolved = createAsyncThunk(

    "comments/setCommentResolved",

    async ({commentId, resolved}) => {

        return await api.setCommentResolved(commentId, resolved);

    }

);

export const deleteComment = createAsyncThunk(

    "comments/deleteComment",

    async (commentId) => {

        return await api.deleteComment(commentId);

    }

);

export const deleteReply = createAsyncThunk(

    "comments/deleteReply",

    async (replyId) => {

        return await api.deleteReply(replyId);

    }

);

export const updateComment = createAsyncThunk(

    "comments/updateComment",

    async ({commentId, message}) => {

        return await api.updateComment(commentId, message);

    }

);

export const updateReply = createAsyncThunk(

    "comments/updateReply",

    async ({replyId, message}) => {

        return await api.updateReply(replyId, message);

    }

);
