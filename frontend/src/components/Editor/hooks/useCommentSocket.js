import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
    realtimeCommentEvent,
} from "../../../store/comments/commentsSlice";


export default function useCommentSocket(
    documentId
) {

    const dispatch = useDispatch();


    useEffect(() => {

        if (!documentId) {
            return;
        }


        const baseUrl =
            process.env.REACT_APP_WEBSOCKET_URL;


        const socket =
            new WebSocket(
                `${baseUrl}/${documentId}?channel=comments`
            );


        socket.onopen = () => {

            console.log(
                "Comment socket connected:",
                documentId
            );

        };


        socket.onmessage = (event) => {

            try {

                const message =
                    JSON.parse(event.data);


                if (
                    message.type !==
                    "comment"
                ) {
                    return;
                }


                dispatch(
                    realtimeCommentEvent(
                        message.event
                    )
                );

            } catch (error) {

                console.error(
                    "Invalid comment socket message:",
                    error
                );

            }

        };


        socket.onerror = (error) => {

            console.error(
                "Comment socket error:",
                error
            );

        };


        socket.onclose = () => {

            console.log(
                "Comment socket disconnected:",
                documentId
            );

        };


        return () => {

            socket.close();

        };

    }, [
        documentId,
        dispatch
    ]);

}