import { Box } from "@mui/material";

import FloatingToolbar from "./Toolbar/FloatingToolbar";
import CollaborativeEditor from "./CollaborativeEditor";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import BottomStatusBar from "./BottomStatusBar";

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
        display: "flex",
        flexDirection: "column",
        transition: ".25s",
        overflow: "hidden"
      }}
    >
      <Box
        sx={{
          maxWidth: drawer && 900,
          py: 3,
          overflow: "auto",
          scrollbarWidth: "none",
        }}
      >

        <FloatingToolbar editor={editor} />

        <CollaborativeEditor key={docId} editor={editor} />
      </Box>
      <Box 
        sx={{
          flexShrink: 0,
        }}>
        <BottomStatusBar editor={editor} />

      </Box>
    </Box>
  );
}
