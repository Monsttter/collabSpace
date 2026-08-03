import { WebSocketServer } from "ws";

import SessionManager from "./SessionManager.js";

import {
    PING_TIMEOUT
} from "./constants.js";

export function startRealtimeServer(server) {

    const wss = new WebSocketServer({

        server

    });

    wss.on(

        "connection",

        async(conn, req) => {

            const documentId =
                req.url
                    .slice(1)
                    .split("?")[0];

            const session =
                SessionManager.getOrCreate(

                    documentId

                );
                await session.initialize();

            session.addConnection(conn);

            const {

                doc,

                messageHandler

            } = session;

            /*
            |--------------------------------------------------------------------------
            | Document Updates
            |--------------------------------------------------------------------------
            */

            const updateListener = update => {

                messageHandler.broadcastUpdate(

                    update

                );

            };

            doc.on(

                "update",

                updateListener

            );

            /*
            |--------------------------------------------------------------------------
            | Awareness
            |--------------------------------------------------------------------------
            */

            const awarenessListener =
                ({ added, updated, removed }) => {

                    messageHandler.broadcastAwareness(

                        [

                            ...added,

                            ...updated,

                            ...removed

                        ]

                    );

                };

            doc.awareness.on(

                "update",

                awarenessListener

            );

            /*
            |--------------------------------------------------------------------------
            | Incoming Messages
            |--------------------------------------------------------------------------
            */

            conn.on(

                "message",

                data => {

                    messageHandler.handle(

                        conn,

                        new Uint8Array(data)

                    );

                }

            );

            /*
            |--------------------------------------------------------------------------
            | Initial Sync
            |--------------------------------------------------------------------------
            */

            messageHandler.sendSyncStep1(

                conn

            );

            /*
            |--------------------------------------------------------------------------
            | Ping
            |--------------------------------------------------------------------------
            */

            let pong = true;

            const pingInterval =
                setInterval(() => {

                    if (!pong) {

                        conn.terminate();

                        return;

                    }

                    pong = false;

                    conn.ping();

                }, PING_TIMEOUT);

            conn.on(

                "pong",

                () => {

                    pong = true;

                }

            );

            /*
            |--------------------------------------------------------------------------
            | Close
            |--------------------------------------------------------------------------
            */

            conn.on(

                "close",

                async() => {
                  try{

                    clearInterval(

                        pingInterval

                    );

                    doc.off(

                        "update",

                        updateListener

                    );

                    doc.awareness.off(

                        "update",

                        awarenessListener

                    );

                    session.removeConnection(

                        conn

                    );

                    if (

                        session.size === 0

                    ) {

                        await session.destroy();

                        SessionManager.remove(documentId);

                    }
                    } catch (err) {

        console.error(err);

    }

                }

            );

        }

    );

}