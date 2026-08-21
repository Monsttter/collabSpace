import { WebSocketServer } from "ws";

import SessionManager from "./SessionManager.js";

import {
    PING_TIMEOUT
} from "./constants.js";

import * as awarenessProtocol from "y-protocols/awareness";

import { authenticateWebSocket }
    from "./wsAuth.js";

import * as repository
    from "../repositories/documentRepository.js";

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

            /*
            * Authenticate user
            */
            const user =
                authenticateWebSocket(req);

            if (!user) {

                conn.close(
                    1008,
                    "Authentication failed"
                );

                return;
            }

            /*
            * Check document membership
            */
            const member =
                await repository.getMember(
                    documentId,
                    user.id
                );

            if (!member) {

                conn.close(
                    1008,
                    "Access denied"
                );

                return;
            }

            /*
            * Store authenticated user/role
            * on this WebSocket connection.
            */
            conn.user = user;

            conn.role = member.role;

            const channel =
            url.searchParams.get(
                "channel"
            ) || "yjs";

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

            session.addCommentConnection(conn);

            /*
            * Heartbeat
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
            * Close
            */
            conn.on(
                "close",
                async() => {

                    clearInterval(pingInterval);

                    session.removeCommentConnection(
                        conn
                    );

                    if (session.totalConnections === 0) {

                        await session.destroy();

                        SessionManager.remove(
                            documentId
                        );

                    }

                }
            );

            return;
        }

        if (channel === "events") {

            session.addEventConnection(conn);

            conn.on(
                "close",
                () => {
                    session.removeEventConnection(
                        conn
                    );
                }
            );

            return;
        }

        if (
            channel === "yjs" &&
            session.isRestoring
        ) {

            conn.close(
                1012,
                "Document restoration in progress"
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

            conn.documentGeneration = session.documentGeneration;
            
            const messageHandler = session.messageHandler;
            messageHandler.connectionClientIds = connectionClientIds;

            /*
            |--------------------------------------------------------------------------
            | Incoming Messages
            |--------------------------------------------------------------------------
            */

            conn.on(

                "message",

                data => {
                    /*
                    * Ignore messages from a stale
                    * WebSocket connection.
                    */
                    if (
                        conn.documentGeneration !==
                        session.documentGeneration
                    ) {

                        return;
                    }

                    /*
                    * Ignore messages while restoration
                    * is actively happening.
                    */

                    if (session.restoring) {
                        return;
                    }

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

                    /*
                    * Remove awareness owned by
                    * this connection.
                    */

                    if (conn.clientIds && conn.clientIds.size > 0) {

                        awarenessProtocol.removeAwarenessStates(

                            session.doc.awareness,

                            [...conn.clientIds],

                            null

                        );

                    }

                    
                    const ids =
                    connectionClientIds.get(conn);

                    if (ids && ids.size > 0) {

                        awarenessProtocol.removeAwarenessStates(

                            session.doc.awareness,

                            [...ids],

                            null

                        );

                    }

                    /*
                    * Remove connection from session.
                    */
                    session.removeConnection(conn);

                    /*
                    * Destroy session only when
                    * NO realtime connections remain.
                    */
                    if (

                        session.totalConnections === 0

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