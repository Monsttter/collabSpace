import { useEffect } from "react";


export default function useDocumentEventSocket(
    documentId,
    onEvent
) {

    useEffect(() => {

        if (!documentId) {
            return;
        }


        const baseUrl =
            process.env.REACT_APP_WEBSOCKET_URL;


        const token =
            localStorage.getItem("token");


        let socket = null;

        let intentionallyClosed =
            false;

        let reconnectTimer =
            null;

        let reconnectAttempts =
            0;

        let accessRevoked =
            false;


        const BASE_DELAY = 1000;

        const MAX_DELAY = 10000;


        const connect = () => {

            if (
                intentionallyClosed ||
                accessRevoked
            ) {

                return;

            }


            socket =
                new WebSocket(
                    `${baseUrl}/${documentId}` +
                    `?channel=events` +
                    `&token=${encodeURIComponent(token)}`
                );


            socket.onopen = () => {

                console.log(
                    "Document event socket connected:",
                    documentId
                );


                reconnectAttempts = 0;

            };


            socket.onmessage = event => {

                try {

                    const data =
                        JSON.parse(
                            event.data
                        );


                    onEvent(data);

                } catch (error) {

                    console.error(
                        "Invalid document event:",
                        error
                    );

                }

            };


            socket.onerror = error => {

                /*
                 * Don't reconnect here.
                 *
                 * onclose handles reconnect.
                 */

                if (
                    !intentionallyClosed &&
                    !accessRevoked
                ) {

                    console.error(
                        "Document event socket error:",
                        error
                    );

                }

            };


            socket.onclose = event => {

                if (
                    intentionallyClosed ||
                    accessRevoked
                ) {

                    return;

                }


                /*
                 * 1008 = authorization/access
                 * violation.
                 *
                 * DO NOT reconnect.
                 */

                if (
                    event.code === 1008
                ) {

                    accessRevoked = true;


                    console.log(
                        "Document event socket access revoked:",
                        documentId
                    );


                    return;

                }


                console.log(
                    "Document event socket disconnected:",
                    documentId,
                    event.code
                );


                scheduleReconnect();

            };

        };


        const scheduleReconnect = () => {

            if (
                intentionallyClosed ||
                accessRevoked ||
                reconnectTimer !== null
            ) {

                return;

            }


            const delay =
                Math.min(
                    BASE_DELAY *
                    Math.pow(
                        2,
                        reconnectAttempts
                    ),
                    MAX_DELAY
                );


            reconnectAttempts++;


            reconnectTimer =
                setTimeout(
                    () => {

                        reconnectTimer =
                            null;

                        connect();

                    },
                    delay
                );

        };


        connect();


        return () => {

            intentionallyClosed =
                true;


            if (
                reconnectTimer !== null
            ) {

                clearTimeout(
                    reconnectTimer
                );

                reconnectTimer = null;

            }


            if (
                socket &&
                (
                    socket.readyState ===
                        WebSocket.OPEN ||
                    socket.readyState ===
                        WebSocket.CONNECTING
                )
            ) {

                socket.close(
                    1000,
                    "Component unmounted"
                );

            }

        };

    }, [
        documentId,
        onEvent
    ]);

}