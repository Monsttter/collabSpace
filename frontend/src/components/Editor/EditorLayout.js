import { Box } from "@mui/material";
import EditorHeader from "./EditorHeader";
import StatusBar from "./StatusBar";
import EditorToolbar from "./EditorToolbar";
import EditorContent from "./CollaborativeEditor";
import BottomStatusBar from "./BottomStatusBar";

import Collaboration from "@tiptap/extension-collaboration";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect, useState } from "react";

import "../../styles/editor.css"
import { updateDocument } from "../../api/documents";
import RightDock from "./RightDock";
import EditorWorkspace from "./EditorWorkspace";
import DrawerPanel from "./RightDrawer/DrawerPanel";
import ShareDialog from "./ShareDialog";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useCollaborationContext } from "./context/CollaborationContext";
import useCollaborativeEditor from "./hooks/useCollaborativeEditor";
import useCommentSocket from "./hooks/useCommentSocket";

export default function EditorLayout() {

    const {id: docId}= useParams();
    const drawer= useSelector(state => state.ui.drawer);
    const [shareOpen, setShareOpen] = useState(false);
    const document = useSelector(state => state.documents.currentDocument);

    useCommentSocket(docId);

    const {

        provider,

        ydoc

    } = useCollaborationContext();

    const editor =
    useCollaborativeEditor(
        ydoc,
        provider
    );

    return (

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                <EditorHeader openShareDialog={() => setShareOpen(true)}/>

                <StatusBar />

                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        overflow: "hidden",
                    }}
                >
                    <EditorWorkspace
                        key= {docId}
                        editor={editor}
                    />

                    {drawer && (
                        <DrawerPanel
                            editor={editor}
                            openShareDialog={() => setShareOpen(true)}
                        />
                    )}

                    <RightDock
                    />
                </Box>

                <BottomStatusBar />
                
                <ShareDialog

                    open={shareOpen}

                    onClose={() =>
                        setShareOpen(false)
                    }

                />

            </Box>
    );
}