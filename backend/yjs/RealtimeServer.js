import { WebSocketServer } from "ws";

import SessionManager from "./SessionManager.js";

import {
    PING_TIMEOUT
} from "./constants.js";

import * as awarenessProtocol from "y-protocols/awareness";

const connectionClientIds = new WeakMap();

export function startRealtimeServer(server) {

    const wss = new WebSocketServer({

        server

    });

    wss.on(

        "connection",

        async(conn, req) => {

            const url =
            new URL(
                req.url,
                `http://${req.headers.host}`
            );

            const documentId =
                url.pathname
                .slice(1);

            const channel =
            url.searchParams.get(
                "channel"
            );

            const session =
                SessionManager.getOrCreate(

                    documentId

                );
                await session.initialize();

            /*
         * ------------------------------------------------
         * Comment realtime connection
         * ------------------------------------------------
         */

        if (channel === "comments") {

            session.addCommentConnection(
                conn
            );


            conn.on(
                "close",
                () => {

                    session.removeCommentConnection(
                        conn
                    );

                }
            );


            return;

        }


        /*
         * ------------------------------------------------
         * Normal Yjs connection
         * ------------------------------------------------
         */

            session.addConnection(conn);

            connectionClientIds.set(conn, new Set());

            conn.clientIds = new Set();

            const { doc } = session;

            const messageHandler = session.messageHandler;
            messageHandler.connectionClientIds = connectionClientIds;

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

            conn.isAlive = true;

conn.on("pong", () => {

    conn.isAlive = true;

});

const pingInterval = setInterval(() => {

    if (!conn.isAlive) {

        conn.terminate();
        return;

    }

    conn.isAlive = false;

    conn.ping();

}, PING_TIMEOUT);

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

                    if (conn.clientIds.size > 0) {

                        awarenessProtocol.removeAwarenessStates(

                            doc.awareness,

                            [...conn.clientIds],

                            null

                        );

                    }

                    session.removeConnection(conn);

                    doc.off(

                        "update",

                        updateListener

                    );

                    doc.awareness.off(

                        "update",

                        awarenessListener

                    );

                    const ids =
                        connectionClientIds.get(conn);

                    if (ids && ids.size > 0) {

                        awarenessProtocol.removeAwarenessStates(

                            doc.awareness,

                            [...ids],

                            null

                        );

                    }

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