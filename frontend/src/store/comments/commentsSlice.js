import { createSlice } from "@reduxjs/toolkit";

import {
  fetchComments,
  createComment,
  createReply,
  // resolveComment,
  fetchReplies,
  deleteReply,
  deleteComment,
  updateReply,
  updateComment,
  setCommentResolved,
} from "./commentsThunks";

const initialState = {
  comments: [],

  repliesByComment: {},

  loading: false,

  repliesLoading: {},

  creatingReply: false,

  updatingComment: false,

  updatingReply: false,

  deletingReply: false,

  error: null,

  selectedThreadId: null,

  selectedRange: null,

  activeCommentId: null,
};

const commentsSlice = createSlice({
  name: "comments",

  initialState,

  reducers: {
    setSelectedThread(state, action) {
      state.selectedThreadId = action.payload;
    },

    clearSelectedThread(state) {
      state.selectedThreadId = null;
    },

    setSelectedRange(state, action) {
      state.selectedRange = action.payload;
    },

    clearSelectedRange(state) {
      state.selectedRange = null;
    },

    setActiveComment: (state, action) => {
      state.activeCommentId = action.payload;
    },

    clearActiveComment: (state) => {
      state.activeCommentId = null;
    },

    realtimeCommentEvent(state, action) {

    const {
        action: eventAction,
        data
    } = action.payload;


    /*
     * New comment
     */
    if (
        eventAction === "created"
    ) {

        state.comments.push(data);

        return;

    }


    /*
     * Edited / resolved comment
     */
    if (
        eventAction === "updated"
    ) {

        const index =
            state.comments.findIndex(
                comment =>
                    comment.id === data.id
            );

        if (index !== -1) {

            state.comments[index] =
                data;

        }
        return;
    }


    /*
     * Deleted comment
     */
    if (
        eventAction === "deleted"
    ) {

        state.comments =
            state.comments.filter(
                comment =>
                    comment.id !== data.id
            );


        delete state.repliesByComment[
            data.id
        ];

        delete state.repliesLoading[
            data.id
        ];

        return;

    }


    /*
     * New reply
     */
    if (
        eventAction === "reply_created"
    ) {

        const commentId =
            data.comment_id;


            const comment =
                state.comments.find(
                    comment =>
                        comment.id === commentId
                );
    
    
            if (comment) {
    
                comment.reply_count =
                    (comment.reply_count || 0) + 1;
    
            }
        if (
            !state.repliesByComment[
                commentId
            ]
        ) {

            /*
             * The replies might not have
             * been opened by this user yet.
             *
             * Don't create the replies array
             * unnecessarily.
             */
            return;

        }

        state.repliesByComment[
            commentId
        ].push(data);



        return;

    }


    /*
     * Edited reply
     */
    if (
        eventAction === "reply_updated"
    ) {

        const replies =
            state.repliesByComment[
                data.comment_id
            ];


        if (!replies) {
            return;
        }


        const index =
            replies.findIndex(
                reply =>
                    reply.id === data.id
            );


        if (index !== -1) {

            replies[index] =
                data;

        }

        return;

    }


    /*
     * Deleted reply
     */
    if (
        eventAction === "reply_deleted"
    ) {

        const commentId =
            data.comment_id;

            const comment =
                state.comments.find(
                    comment =>
                        comment.id === commentId
                );

          if (comment) {
  
              comment.reply_count =
                  Math.max(
                      0,
                      (comment.reply_count || 0) - 1
                  );
  
          }

        const replies =
            state.repliesByComment[
                commentId
            ];


        if (!replies) {
            return;
        }


        state.repliesByComment[
            commentId
        ] =
            replies.filter(
                reply =>
                    reply.id !== data.id
            );
    }

},
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchComments.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;

        state.comments = action.payload;
      })

      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      })

      .addCase(createComment.fulfilled, (state, action) => {
      })

      .addCase(fetchReplies.pending, (state, action) => {
        const commentId = action.meta.arg;

        state.repliesLoading[commentId] = true;
      })

      .addCase(fetchReplies.fulfilled, (state, action) => {
        const { commentId, replies } = action.payload;

        state.repliesByComment[commentId] = replies;

        state.repliesLoading[commentId] = false;
      })

      .addCase(fetchReplies.rejected, (state, action) => {
        const commentId = action.meta.arg;

        state.repliesLoading[commentId] = false;

        state.error = action.payload;
      })

      .addCase(createReply.pending, (state) => {
        state.creatingReply = true;
      })

      .addCase(createReply.fulfilled, (state, action) => {
        state.creatingReply = false;
      })

      .addCase(createReply.rejected, (state, action) => {
        state.creatingReply = false;

        state.error = action.payload;
      })

      .addCase(setCommentResolved.fulfilled, (state, action) => {
      })

      .addCase(deleteComment.fulfilled, (state, action) => {
      })

      .addCase(deleteReply.pending, (state) => {
        state.deletingReply = true;
      })

      .addCase(deleteReply.fulfilled, (state, action) => {
        state.deletingReply = false;
      })

      .addCase(deleteReply.rejected, (state, action) => {
        state.deletingReply = false;

        state.error = action.payload;
      })

      .addCase(updateComment.pending, (state) => {
        state.updatingComment = true;
      })

      .addCase(updateComment.fulfilled, (state, action) => {
        state.updatingComment = false;
      })

      .addCase(updateComment.rejected, (state, action) => {
        state.updatingComment = false;

        state.error = action.payload;
      })

      .addCase(updateReply.pending, (state) => {
        state.updatingReply = true;
      })

      .addCase(updateReply.fulfilled, (state, action) => {
        state.updatingReply = false;
      })

      .addCase(updateReply.rejected, (state, action) => {
        state.updatingReply = false;

        state.error = action.payload;
      });
  },
});

export const {
  setSelectedThread,

  clearSelectedThread,

  setSelectedRange,

  clearSelectedRange,

  realtimeCommentEvent
} = commentsSlice.actions;

export default commentsSlice.reducer;
