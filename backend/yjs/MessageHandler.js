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
        
        console.log(
    "Incoming type:",
    type
);
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

            case MESSAGE_AWARENESS:

                awarenessProtocol.applyAwarenessUpdate(

                    this.doc.awareness,

                    decoding.readVarUint8Array(

                        decoder

                    ),

                    conn

                );

                break;

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Send Initial Sync
    |--------------------------------------------------------------------------
    */

    sendSyncStep1(conn) {

        const encoder =
            encoding.createEncoder();

        encoding.writeVarUint(

            encoder,

            MESSAGE_SYNC

        );

        syncProtocol.writeSyncStep1(

            encoder,

            this.doc

        );

        conn.send(

            encoding.toUint8Array(

                encoder

            )

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Broadcast Document Update
    |--------------------------------------------------------------------------
    */

    broadcastUpdate(update) {

        console.log(
    "Broadcasting update to",
    this.session.connections.size,
    "clients"
);

for (const conn of this.session.connections) {

    console.log(
        "readyState:",
        conn.readyState
    );

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

        const encoder =
            encoding.createEncoder();

        encoding.writeVarUint(

            encoder,

            MESSAGE_AWARENESS

        );

        encoding.writeVarUint8Array(

            encoder,

            awarenessProtocol.encodeAwarenessUpdate(

                this.doc.awareness,

                clientIds

            )

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

}