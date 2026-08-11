import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const COLORS = [
  "#2563EB",
  "#16A34A",
  "#DC2626",
  "#9333EA",
  "#EA580C",
  "#0891B2",
];

function getUserColor(id) {
  let hash = 0;

  for (const ch of id) {
    hash += ch.charCodeAt(0);
  }

  return COLORS[hash % COLORS.length];
}

export default function useCollaboration() {
  const { id: docId } = useParams();

  const user = useSelector(state => state.auth.user);

  const ydocRef = useRef(null);
  const providerRef = useRef(null);

  const [ready, setReady] = useState(false);

  const [users, setUsers] = useState([]);

  const [connectionStatus, setConnectionStatus] =
    useState("connecting");

  useEffect(() => {

    if (!docId) return;

    console.log("Create collaboration");

    const ydoc = new Y.Doc();

    const provider = new WebsocketProvider(
      process.env.REACT_APP_WEBSOCKET_URL,
      docId,
      ydoc
    );

    ydocRef.current = ydoc;
    providerRef.current = provider;

    setReady(true);

    return () => {

      console.log("Destroy collaboration");

      provider.destroy();

      ydoc.destroy();

      providerRef.current = null;
      ydocRef.current = null;

      setReady(false);

    };

  }, [docId]);

  useEffect(() => {

    if (!ready) return;

    const provider = providerRef.current;

    const statusHandler = ({ status }) => {

      setConnectionStatus(status);

    };

    provider.on("status", statusHandler);

    return () => {

      provider.off("status", statusHandler);

    };

  }, [ready]);

  useEffect(() => {

    if (!ready || !user) return;

    providerRef.current.awareness.setLocalStateField("user", {

      id: user.id,

      name: user.username,

      color: getUserColor(user.id),

    });

  }, [ready, user]);

  useEffect(() => {

    if (!ready) return;

    const awareness = providerRef.current.awareness;

    const updateUsers = () => {

      const online = [];

      awareness.getStates().forEach(state => {

        if (state.user) {

          online.push(state.user);

        }

      });

      setUsers(online);

    };

    awareness.on("change", updateUsers);

    updateUsers();

    return () => {

      awareness.off("change", updateUsers);

    };

  }, [ready]);

  return {

    ready,

    ydoc: ydocRef.current,

    provider: providerRef.current,

    users,

    connectionStatus,

  };

}



// import { useEffect, useMemo, useState } from "react";

// import * as Y from "yjs";
// import { WebsocketProvider } from "y-websocket";

// import StarterKit from "@tiptap/starter-kit";
// import Collaboration from "@tiptap/extension-collaboration";
// import TextAlign from "@tiptap/extension-text-align";

// import { useSelector } from "react-redux";
// import { useParams } from "react-router";

// import { RemoteCursor } from "../extensions/RemoteCursor";
// import { useEditor } from "@tiptap/react";
// console.log("useCollaboration render");

// const COLORS = [
//   "#2563EB",
//   "#16A34A",
//   "#DC2626",
//   "#9333EA",
//   "#EA580C",
//   "#0891B2",
// ];

// export function getUserColor(id) {
//   let hash = 0;

//   for (const ch of id) {
//     hash += ch.charCodeAt(0);
//   }

//   return COLORS[hash % COLORS.length];
// }

// export default function useCollaboration() {

//   const { id: docId } = useParams();

//   const user = useSelector(state => state.auth.user);

// //   const [provider, setProvider] = useState(null);

//   const [users, setUsers] = useState([]);

//   const [connectionStatus, setConnectionStatus] =
//     useState("connecting");

//     const ydoc = useMemo(() => {

//     console.log("Create Y.Doc");

//     return new Y.Doc();

// }, [docId]);

//     const provider = useMemo(() => {

//         if (!docId) return null;

//         console.log("Create Provider");

//         return new WebsocketProvider(

//             process.env.REACT_APP_WEBSOCKET_URL,

//             docId,

//             ydoc

//         );

//     }, [docId, ydoc]);

//     useEffect(() => {

//         if (!provider) return;

//         return () => {

//             console.log("Destroy Provider", provider.awareness.clientID);

//             provider.destroy();

//             ydoc.destroy();

//         };

//     }, [provider, ydoc]);

// useEffect(() => {

//     if (!provider) return;

//     const statusHandler = ({ status }) => {

//         console.log("STATUS:", status);

//         setConnectionStatus(status);

//     };

//     const syncHandler = synced => {

//         console.log("SYNC:", synced);

//         console.log(
//         "Fragment:",
//         ydoc.getXmlFragment("default").toJSON()
//     );

//     };

//     provider.on("status", statusHandler);

//     provider.on("sync", syncHandler);

//     return () => {

//         provider.off("status", statusHandler);

//         provider.off("sync", syncHandler);

//     };

// }, [provider]);

// useEffect(() => {

//     if (!provider || !user) return;

//     provider.awareness.setLocalStateField("user", {

//         id: user.id,

//         name: user.username,

//         color: getUserColor(user.id),

//     });

// }, [provider, user]);

// useEffect(() => {

//     if (!provider) return;

//     const awareness = provider.awareness;

//     const updateUsers = () => {

//     //     console.log("Awareness change");
//     // console.log("added:", added);
//     // console.log("updated:", updated);
//     // console.log("removed:", removed);

//     console.log(
//         Array.from(awareness.getStates().entries())
//     );
//         console.log(

//             "Awareness:",

//             Array.from(awareness.getStates().values())

//         );

//         const online = [];

//         awareness.getStates().forEach(state => {

//             if (state.user) {

//                 online.push(state.user);

//             }

//         });

//         setUsers(online);

//     };

//     awareness.on("change", updateUsers);

//     updateUsers();

//     return () => {

//         awareness.off("change", updateUsers);

//     };

// }, [provider]);

//     const editor = useEditor(
//   provider
//     ? {
//         immediatelyRender: false,

//         extensions: [
//           StarterKit.configure({
//             history: false,
//           }),

//           Collaboration.configure({
//             document: ydoc,
//           }),

//           RemoteCursor.configure({
//             provider,
//           }),

//           TextAlign.configure({
//             types: ["heading", "paragraph"],
//           }),
//         ],

//         editorProps: {
//           attributes: {
//             class: "tiptap-editor",
//           },
//         },
//       }
//     : null,
//   [provider]
// );

// useEffect(() => {
//     if (!editor) return;

//     console.log(
//         "Editor created",
//         editor
//     );
//     console.log(provider);

//     return () => {
//         console.log("Editor destroyed");
//     };
// }, [editor]);

// useEffect(() => {
//     if (!editor || !provider) return;

//     const updateCursor = () => {

//         const { from, to } = editor.state.selection;

//         provider.awareness.setLocalStateField("cursor", {
//             anchor: from,
//             head: to,
//         });

//     };

//     editor.on("selectionUpdate", updateCursor);

//     editor.on("transaction", updateCursor);

//     updateCursor();

//     return () => {

//         editor.off("selectionUpdate", updateCursor);
//         editor.off("transaction", updateCursor);

//     };

// }, [editor, provider]);

//         return {

//         editor,

//         provider,

//         users,

//         connectionStatus,

//     };

// }



// import { useEffect, useMemo, useState } from "react";

// import * as Y from "yjs";
// import { WebsocketProvider } from "y-websocket";

// import { useEditor } from "@tiptap/react";

// import StarterKit from "@tiptap/starter-kit";
// import Collaboration from "@tiptap/extension-collaboration";
// import TextAlign from "@tiptap/extension-text-align";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router";
// import { RemoteCursor } from "../extensions/RemoteCursor";

// const COLORS = [

//     "#2563EB",

//     "#16A34A",

//     "#DC2626",

//     "#9333EA",

//     "#EA580C",

//     "#0891B2",

// ];

// export function getUserColor(id) {

//     let hash = 0;

//     for (const ch of id) {

//         hash += ch.charCodeAt(0);

//     }

//     return COLORS[hash % COLORS.length];

// }

// export default function useCollaboration() {

//     const {id: docId}= useParams();
    
//     const [users, setUsers] = useState([]);
 
//     const [connectionStatus, setConnectionStatus] = useState("connecting");

//     const user = useSelector(state => state.auth.user);
//     /*
//     |--------------------------------------------------------------------------
//     | Shared Document
//     |--------------------------------------------------------------------------
//     */

//     const ydoc = useMemo(() => {

//         // console.log("Creating Y.Doc:", docId);

//         return new Y.Doc();

//     }, [docId]);

//     console.log("useCollaboration render");

//     /*
//     |--------------------------------------------------------------------------
//     | Provider
//     |--------------------------------------------------------------------------
//     */

//     // const provider = useMemo(() => {
//     //     console.log("Creating provider");

//     //     return new WebsocketProvider(

//     //         process.env.REACT_APP_WEBSOCKET_URL,

//     //         docId,

//     //         ydoc

//     //     );

//     // }, [docId, ydoc]);

//     const [provider, setProvider] = useState(null);

//     useEffect(() => {

// //         ydoc.on("update", update => {

// //     // console.log(
// //     //     "CLIENT UPDATE",
// //     //     update.length,
// //     //     update.toHex()
// //     // );
// //     console.log(
// //     Array.from(ydoc.share.keys())
// // );

// // });
//         // console.log("Creating Provider:", docId);

//         const wsProvider = new WebsocketProvider(

//             process.env.REACT_APP_WEBSOCKET_URL,

//             docId,

//             ydoc

//         );

//         setProvider(wsProvider);

//         wsProvider.on("status", event => {

//             console.log(event.status);

//             setConnectionStatus(event.status);

//         });

//         return () => {

//             console.log("Destroying Provider:", docId);

//             wsProvider.destroy();

//             ydoc.destroy();

//         };

//     }, [docId, ydoc]);

//     useEffect(()=>{
//         if(!user || !provider) return;

//         provider.awareness.setLocalStateField("user", {

//             id: user.id,

//             name: user.username,

//             email: user.email,

//             color: getUserColor(user.id),

//         });
//     }, [user, provider]);

//     useEffect(() => {

//     if (!provider) return;

//     const awareness = provider.awareness;

//     const updateUsers = () => {

//         const onlineUsers = [];

//         awareness.getStates().forEach(state => {

//             if (state.user) {

//                 onlineUsers.push(state.user);

//             }

//         });

//         setUsers(onlineUsers);

//     };

//     awareness.on("change", updateUsers);

//     updateUsers();

//     return () => {

//         awareness.off("change", updateUsers);

//     };

// }, [provider]);

// useEffect(() => {

//     if (!provider) return;

//     const syncHandler = synced => {

//         console.log("SYNC", synced);

//         console.log(
//             ydoc.getXmlFragment("default").toJSON()
//         );

//     };

//     const statusHandler = event => {

//         console.log(event.status);

//     };

//     provider.on("sync", syncHandler);

//     provider.on("status", statusHandler);

//     return () => {

//         provider.off("sync", syncHandler);

//         provider.off("status", statusHandler);

//     };

// }, [provider, ydoc]);

//     /*
//     |--------------------------------------------------------------------------
//     | Editor
//     |--------------------------------------------------------------------------
//     */

//     const editor = useEditor({

//         immediatelyRender: false,

//         extensions: [

//             StarterKit.configure({

//                 history: false,

//             }),

//             Collaboration.configure({

//                 document: ydoc,

//             }),

//             // RemoteCursor.configure({

//             //     provider,

//             // }),

//             TextAlign.configure({

//                 types: ["heading", "paragraph"],

//             }),

//         ],

//         editorProps: {

//             attributes: {

//                 class: "tiptap-editor",

//             },

//         },

//     });

//     useEffect(() => {

//     if (!editor || !provider) return;

//     const updateSelection = ({ editor }) => {

//         const { from, to } = editor.state.selection;

//         provider.awareness.setLocalStateField("cursor", {

//             anchor: from,

//             head: to,

//         });

//     };

//     editor.on("selectionUpdate", updateSelection);

//     updateSelection({ editor });

//     return () => {

//         editor.off("selectionUpdate", updateSelection);

//     };

// }, [editor, provider]);

//     useEffect(() => {

//     if (!provider) return;

//     const awareness = provider.awareness;

//     const log = () => {

//         console.log(

//             Array.from(awareness.getStates().values())

//         );

//     };

//     awareness.on("change", log);

//     return () => awareness.off("change", log);

// }, [provider]);


//     return {

//         editor,

//         provider,

//         users,

//         connectionStatus,

//     };

// }