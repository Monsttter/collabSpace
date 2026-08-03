import { useEffect, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useParams } from "react-router";
import EditorLayout from "./EditorLayout";
import { fetchDocument } from "../../api/documents";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentDocument } from "../../store/documents/documentSlice";
import useCollaboration from "./hooks/useCollaboration";
import { CollaborationProvider } from "./context/CollaborationContext";

export default function Editor() {

  const {id: docId}= useParams();
  
  const collaboration = useCollaboration(docId);

if (
    !collaboration.editor ||
    !collaboration.provider
) {
    return <div>Loading editor...</div>;
}

  return (
  <CollaborationProvider
        value={collaboration}
    >

        <EditorLayout key={docId} />

    </CollaborationProvider>
);
}