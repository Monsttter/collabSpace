import { useEffect, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import CollaborativeEditorInner from "./CollaborativeEditorInner";
import { fetchDocument } from "../api/documents";

export default function CollaborativeEditor({ docId }) {

  const [yjsState, setYjsState] = useState(null);
  const [isSynced, setIsSynced] = useState(false);
  const [initialContent, setInitialContent]= useState("");

  useEffect(() => {
    // console.log(docId);
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      process.env.REACT_APP_WEBSOCKET_URL,
      docId,
      ydoc
    );


    provider.on("sync", async(isSynced) => {
      if (!isSynced) return;

      setIsSynced(true);

        const data= await fetchDocument(docId);
        setInitialContent(data.content);
      });

    setYjsState({ ydoc, provider });

    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [docId]);

  if (!yjsState || !isSynced || !(yjsState.ydoc && yjsState.provider)) {
    return <div>Loading editor...</div>;
  }

  return (
  <CollaborativeEditorInner
    key={docId} // 🔥 forces fresh mount
    ydoc={yjsState.ydoc}
    docId={docId}
    provider={yjsState.provider}
    initialContent={initialContent}
  />
);
}