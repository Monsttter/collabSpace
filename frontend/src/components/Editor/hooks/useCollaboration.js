import { useEffect, useMemo, useState } from "react";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

import { useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import TextAlign from "@tiptap/extension-text-align";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

const COLORS = [

    "#2563EB",

    "#16A34A",

    "#DC2626",

    "#9333EA",

    "#EA580C",

    "#0891B2",

];

export function getUserColor(id) {

    let hash = 0;

    for (const ch of id) {

        hash += ch.charCodeAt(0);

    }

    return COLORS[hash % COLORS.length];

}

export default function useCollaboration() {

    const {id: docId}= useParams();
    
    const [users, setUsers] = useState([]);
 
    const [connectionStatus, setConnectionStatus] = useState("connecting");

    const user = useSelector(state => state.auth.user);
    /*
    |--------------------------------------------------------------------------
    | Shared Document
    |--------------------------------------------------------------------------
    */

    const ydoc = useMemo(() => {

        // console.log("Creating Y.Doc:", docId);

        return new Y.Doc();

    }, [docId]);

    /*
    |--------------------------------------------------------------------------
    | Provider
    |--------------------------------------------------------------------------
    */

    const [provider, setProvider] = useState(null);

    useEffect(() => {

        ydoc.on("update", update => {

    // console.log(
    //     "CLIENT UPDATE",
    //     update.length,
    //     update.toHex()
    // );
    console.log(
    Array.from(ydoc.share.keys())
);

});
        // console.log("Creating Provider:", docId);

        const wsProvider = new WebsocketProvider(

            process.env.REACT_APP_WEBSOCKET_URL,

            docId,

            ydoc

        );

        setProvider(wsProvider);

        wsProvider.on("status", event => {

            console.log(event.status);

            setConnectionStatus(event.status);

        });

        return () => {

            // console.log("Destroying Provider:", docId);

            wsProvider.destroy();

            ydoc.destroy();

        };

    }, [docId, ydoc]);

    useEffect(()=>{
        if(!user || !provider) return;

        provider.awareness.setLocalStateField("user", {

            id: user.id,

            name: user.username,

            email: user.email,

            color: getUserColor(user.id),

        });
    }, [user, provider]);

    useEffect(() => {

    if (!provider) return;

    const awareness = provider.awareness;

    const updateUsers = () => {

        const onlineUsers = [];

        awareness.getStates().forEach(state => {

            if (state.user) {

                onlineUsers.push(state.user);

            }

        });

        setUsers(onlineUsers);

    };

    awareness.on("change", updateUsers);

    updateUsers();

    return () => {

        awareness.off("change", updateUsers);

    };

}, [provider]);

useEffect(() => {

    if (!provider) return;

    const syncHandler = synced => {

        console.log("SYNC", synced);

        console.log(
            ydoc.getXmlFragment("default").toJSON()
        );

    };

    const statusHandler = event => {

        console.log(event.status);

    };

    provider.on("sync", syncHandler);

    provider.on("status", statusHandler);

    return () => {

        provider.off("sync", syncHandler);

        provider.off("status", statusHandler);

    };

}, [provider, ydoc]);

    /*
    |--------------------------------------------------------------------------
    | Editor
    |--------------------------------------------------------------------------
    */

    const editor = useEditor({

        immediatelyRender: false,

        extensions: [

            StarterKit.configure({

                history: false,

            }),

            Collaboration.configure({

                document: ydoc,

            }),

            TextAlign.configure({

                types: ["heading", "paragraph"],

            }),

        ],

        editorProps: {

            attributes: {

                class: "tiptap-editor",

            },

        },

    });

//     useEffect(()=>{
//         if(!editor) return;
//         editor.on("transaction", ({ transaction }) => {
//         console.log(transaction);

//     }, editor)
// });


    return {

        editor,

        provider,

        users,

        connectionStatus,

    };

}