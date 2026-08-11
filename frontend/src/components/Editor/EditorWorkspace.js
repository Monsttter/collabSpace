import { Box } from "@mui/material";

// import FloatingToolbar from "./FloatingToolbar";
import EditorToolbar from "./EditorToolbar";
import FloatingToolbar from "./Toolbar/FloatingToolbar";
import CollaborativeEditor from "./CollaborativeEditor";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

export default function EditorWorkspace({editor}) {
    
    const { id: docId } = useParams();

    const drawer= useSelector(state => state.ui.drawer);

    if (!editor) {

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
          maxWidth: drawer ? 900 : 1050,
          mx: "auto",
        }}
      >
        <FloatingToolbar editor={editor} />

        <CollaborativeEditor key={docId} editor={editor} />
      </Box>
    </Box>
  );
}
