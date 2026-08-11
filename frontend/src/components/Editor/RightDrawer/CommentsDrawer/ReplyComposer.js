import React, {
    useState,
} from "react";

import {
    Box,
    TextField,
    IconButton,
} from "@mui/material";

import SendIcon
    from "@mui/icons-material/Send";

import {
    useDispatch,
    useSelector,
} from "react-redux";
import { createReply } from "../../../../store/comments/commentsThunks";


export default function ReplyComposer({
    commentId,
}) {

    const dispatch =
        useDispatch();


    const [message, setMessage] =
        useState("");


    const creating =
        useSelector(
            state =>
                state.comments
                    .creatingReply
        );


    const handleSubmit = async () => {

        const text =
            message.trim();


        if (!text || creating) {
            return;
        }


        const result =
            await dispatch(
                createReply({

                    commentId,

                    message: text,

                })
            );


        if (
            createReply.fulfilled.match(
                result
            )
        ) {

            setMessage("");

        }

    };


    const handleKeyDown = e => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            handleSubmit();

        }

    };


    return (

        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mt: 0.75,
            }}
        >

            <TextField
                fullWidth
                size="small"
                placeholder="Write a reply..."
                value={message}
                onChange={e =>
                    setMessage(
                        e.target.value
                    )
                }
                onKeyDown={handleKeyDown}
                multiline
                maxRows={3}
                sx={{
                    "& .MuiInputBase-root": {
                        fontSize: 12,
                        py: 0.25,
                    },
                }}
            />


            <IconButton
                size="small"
                disabled={
                    !message.trim() ||
                    creating
                }
                onClick={
                    handleSubmit
                }
            >

                <SendIcon
                    sx={{
                        fontSize: 17,
                    }}
                />

            </IconButton>

        </Box>

    );

}