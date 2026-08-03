import { Box } from "@mui/material";

// import FloatingToolbar from "./FloatingToolbar";
import EditorToolbar from "./EditorToolbar";
import FloatingToolbar from "./Toolbar/FloatingToolbar";
import CollaborativeEditor from "./CollaborativeEditor";
import { useParams } from "react-router";
import { useCollaborationContext } from "./context/CollaborationContext";

export default function EditorWorkspace({ drawerOpen }) {
    
    const { id: docId } = useParams();

    const {

        editor,

        provider,

    } = useCollaborationContext();

    if (!editor || !provider) {

        return <div>Loading editor...</div>;

    }


  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        px: 5,
        py: 4,
        transition: ".25s",
        scrollbarWidth: "none",
      }}
    >
      <Box
        sx={{
          maxWidth: drawerOpen ? 900 : 1050,
          mx: "auto",
        }}
      >
        <FloatingToolbar editor={editor} drawerOpen={drawerOpen} />

        <CollaborativeEditor key={docId} editor={editor} />
      </Box>
    </Box>
  );
}
