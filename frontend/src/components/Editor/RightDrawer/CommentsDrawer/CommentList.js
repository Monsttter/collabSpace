import {
    Box,
    CircularProgress,
    Typography,
} from "@mui/material";

import { useSelector } from "react-redux";

import CommentCard from "./CommentCard";
import { selectComments, selectCommentsLoading } from "../../../../store/comments/commentsSelectors";
import { useEffect, useRef } from "react";

export default function CommentList({editor}) {

    const comments = useSelector(selectComments);

    const loading = useSelector(selectCommentsLoading);

    const bottomRef = useRef(null);

    // Used so the initial loading of comments
    // doesn't automatically scroll the drawer.
    const initialLoadDone = useRef(false);

    useEffect(() => {

        // Don't scroll when comments are initially fetched.
        if (!initialLoadDone.current) {

            if (!loading) {
                initialLoadDone.current = true;
            }

            return;
        }

        // A new comment was added.
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });

    }, [comments.length, loading]);

    if (loading) {

        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 3,
                }}
            >
                <CircularProgress size={24} />
            </Box>
        );

    }

    if (!comments.length) {

        return (
            <Box
                sx={{
                    flex: 1,
                    py: 4,
                    textAlign: "center",
                }}
            >
                <Typography
                    color="text.secondary"
                >
                    No comments yet
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Select text or write a general comment.
                </Typography>
            </Box>
        );

    }

    return (

        <Box
            sx={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                px: 1.5,
                py: 1.5,
                scrollbarWidth: "thin",
            }}
        >

            {comments.map(comment => (

                <CommentCard

                    key={comment.id}

                    comment={comment}

                    editor={editor}

                />

            ))}

            {/* Bottom scroll target */}
            <Box
                ref={bottomRef}
                sx={{
                    height: 0,
                }}
            />

        </Box>

    );

}