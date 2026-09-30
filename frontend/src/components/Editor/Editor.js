import { useParams } from "react-router";
import EditorLayout from "./EditorLayout";
import useCollaboration from "./hooks/useCollaboration";
import { CollaborationProvider } from "./context/CollaborationContext";

import "../../styles/collaborationCursor.css";

export default function Editor() {

  const {id: docId}= useParams();
  
  const collaboration = useCollaboration();

  if (!collaboration.ready) {
    return <div>Loading...</div>;
  }

  return (
  <CollaborationProvider
        value={collaboration}
    >

        <EditorLayout key={docId} />

    </CollaborationProvider>
);
}