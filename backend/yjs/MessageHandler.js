import * as syncProtocol from "y-protocols/sync";
import * as awarenessProtocol from "y-protocols/awareness";

import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";

import {
    MESSAGE_SYNC,
    MESSAGE_AWARENESS
} from "./constants.js";

export default class MessageHandler {

    constructor(session) {

        this.session = session;

        this.doc = session.doc;

    }

    /*
    |--------------------------------------------------------------------------
    | Incoming Message
    |--------------------------------------------------------------------------
    */

    handle(conn, message) {
        const decoder =
        decoding.createDecoder(message);
        
        const encoder =
        encoding.createEncoder();
        
        const type =
        decoding.readVarUint(decoder);
        
//         console.log(
//     "Incoming type:",
//     type
// );
        switch (type) {
            
            case MESSAGE_SYNC:
                
                encoding.writeVarUint(
                    
                    encoder,
                    
                    MESSAGE_SYNC
                    
                );
                
                syncProtocol.readSyncMessage(
                    
                    decoder,
                    
                    encoder,
                    
                    this.doc,
                    
                    conn
                    
                );
                
                if (encoding.length(encoder) > 1) {

                    conn.send(

                        encoding.toUint8Array(

                            encoder

                        )

                    );

                }

                break;

            case MESSAGE_AWARENESS: {

                const update =
                    decoding.readVarUint8Array(decoder);

                awarenessProtocol.applyAwarenessUpdate(

                    this.doc.awareness,

                    update,

                    conn

                );

                // Track every awareness client currently owned
                // by this websocket.
                const ids =
                    this.connectionClientIds.get(conn);

                ids.clear();

                this.doc.awareness.getStates().forEach((_, clientId) => {

                    const meta =
                        this.doc.awareness.meta.get(clientId);

                    if (meta) {

                        ids.add(clientId);

                    }

                });

                break;
            }

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Send Initial Sync
    |--------------------------------------------------------------------------
    */

    sendSyncStep1(conn) {

    // -----------------------------
    // Send document state
    // -----------------------------

    const syncEncoder = encoding.createEncoder();

    encoding.writeVarUint(
        syncEncoder,
        MESSAGE_SYNC
    );

    syncProtocol.writeSyncStep1(
        syncEncoder,
        this.doc
    );

    conn.send(
        encoding.toUint8Array(syncEncoder)
    );

    // -----------------------------
    // Send existing awareness
    // -----------------------------

    const awarenessStates =
        Array.from(
            this.doc.awareness.getStates().keys()
        );

    if (awarenessStates.length === 0)
        return;

//     console.log(
//     "Initial awareness:",
//     awarenessStates
// );

    const awarenessEncoder =
        encoding.createEncoder();

    encoding.writeVarUint(
        awarenessEncoder,
        MESSAGE_AWARENESS
    );

    encoding.writeVarUint8Array(
        awarenessEncoder,
        awarenessProtocol.encodeAwarenessUpdate(
            this.doc.awareness,
            awarenessStates
        )
    );

    conn.send(
        encoding.toUint8Array(
            awarenessEncoder
        )
    );
}

    /*
    |--------------------------------------------------------------------------
    | Broadcast Document Update
    |--------------------------------------------------------------------------
    */

    broadcastUpdate(update) {

//         console.log(
//     "Broadcasting update to",
//     this.session.connections.size,
//     "clients"
// );

for (const conn of this.session.connections) {

    // console.log(
    //     "readyState:",
    //     conn.readyState
    // );

}

        const encoder =
            encoding.createEncoder();

        encoding.writeVarUint(

            encoder,

            MESSAGE_SYNC

        );

        syncProtocol.writeUpdate(

            encoder,

            update

        );

        const message =
            encoding.toUint8Array(

                encoder

            );

        for (const conn of this.session.connections) {

            if (conn.readyState === 1) {

                conn.send(message);

            }

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Broadcast Awareness
    |--------------------------------------------------------------------------
    */

    broadcastAwareness(clientIds) {

    // console.log(
    //     "Broadcast awareness:",
    //     clientIds
    // );

    const encoder =
        encoding.createEncoder();

    encoding.writeVarUint(

        encoder,

        MESSAGE_AWARENESS

    );

    const update =
        awarenessProtocol.encodeAwarenessUpdate(

            this.doc.awareness,

            clientIds

        );

    // console.log(
    //     "Encoded awareness length:",
    //     update.length
    // );

    encoding.writeVarUint8Array(

        encoder,

        update

    );

    const message =
        encoding.toUint8Array(

            encoder

        );

    // console.log(
    //     "Broadcast packet length:",
    //     message.length
    // );

    for (const conn of this.session.connections) {

        if (conn.readyState === 1) {

            conn.send(message);

        }

    }

}

}