import { Extension } from "@tiptap/core";
import {
    Plugin,
    PluginKey,
} from "@tiptap/pm/state";
import {
    Decoration,
    DecorationSet,
} from "@tiptap/pm/view";


export const commentHighlightPluginKey =
    new PluginKey("commentHighlight");


export const CommentHighlight =
    Extension.create({

        name: "commentHighlight",


        addCommands() {

            return {

                setCommentHighlight:
                    ({
                        commentId,
                        anchor,
                        head,
                    }) =>
                    ({
                        tr,
                        dispatch,
                    }) => {

                        if (dispatch) {

                            dispatch(
                                tr.setMeta(
                                    commentHighlightPluginKey,
                                    {
                                        commentId,
                                        anchor,
                                        head,
                                    }
                                )
                            );

                        }

                        return true;

                    },


                clearCommentHighlight:
                    () =>
                    ({
                        tr,
                        dispatch,
                    }) => {

                        if (dispatch) {

                            dispatch(
                                tr.setMeta(
                                    commentHighlightPluginKey,
                                    {
                                        commentId: null,
                                        anchor: null,
                                        head: null,
                                    }
                                )
                            );

                        }

                        return true;

                    },

            };

        },


        addProseMirrorPlugins() {

            return [

                new Plugin({

                    key:
                        commentHighlightPluginKey,


                    state: {

                        init() {

                            return {

                                commentId: null,

                                anchor: null,

                                head: null,

                            };

                        },


                        apply(tr, value) {

                            const meta =
                                tr.getMeta(
                                    commentHighlightPluginKey
                                );


                            /*
                             * No highlight command.
                             *
                             * If document content changes,
                             * move the highlight with the
                             * document.
                             */
                            if (!meta) {

                                if (
                                    value.anchor !== null &&
                                    value.head !== null
                                ) {

                                    return {

                                        commentId:
                                            value.commentId,

                                        anchor:
                                            tr.mapping.map(
                                                value.anchor
                                            ),

                                        head:
                                            tr.mapping.map(
                                                value.head
                                            ),

                                    };

                                }


                                return value;

                            }


                            /*
                             * Clear highlight.
                             */
                            if (
                                meta.anchor == null ||
                                meta.head == null
                            ) {

                                return {

                                    commentId: null,

                                    anchor: null,

                                    head: null,

                                };

                            }


                            /*
                             * Set new highlight.
                             */
                            return {

                                commentId:
                                    meta.commentId,

                                anchor:
                                    meta.anchor,

                                head:
                                    meta.head,

                            };

                        },

                    },


                    props: {

                        decorations(state) {

                            const {
                                anchor,
                                head,
                            } =
                                commentHighlightPluginKey
                                    .getState(state);


                            if (
                                anchor == null ||
                                head == null ||
                                anchor === head
                            ) {

                                return DecorationSet.empty;

                            }


                            return DecorationSet.create(
                                state.doc,
                                [
                                    Decoration.inline(
                                        anchor,
                                        head,
                                        {
                                            class:
                                                "comment-soft-highlight",
                                        }
                                    ),
                                ]
                            );

                        },

                    },

                }),

            ];

        },

    });