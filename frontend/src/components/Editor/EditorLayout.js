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
import RightDock from "./RightDock/RightDock";
import EditorWorkspace from "./EditorWorkspace";
import DrawerPanel from "./RightDrawer/DrawerPanel";
import ShareDialog from "./ShareDialog";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

export default function EditorLayout({ ydoc, provider }) {

    const {id: docId}= useParams();
    const [users, setUsers] = useState([]);
    const [drawer, setDrawer] = useState(null);
    const [shareOpen, setShareOpen] = useState(false);
    const document = useSelector(state => state.documents.currentDocument);

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
                        drawerOpen={Boolean(drawer)}
                    />

                    {drawer && (
                        <DrawerPanel
                            drawer={drawer}
                            openShareDialog={() => setShareOpen(true)}
                        />
                    )}

                    <RightDock
                        drawer={drawer}
                        setDrawer={setDrawer}
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