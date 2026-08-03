import { Box, InputBase, Typography } from "@mui/material";
import { EditorContent as TiptapEditorContent } from "@tiptap/react";
import { useState, useEffect } from "react";
import EditorToolbar from "./EditorToolbar";

export default function CollaborativeEditor({
    editor
}) {

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: "auto",
                scrollbarWidth: "none",
                bgcolor: "#F8FAFC",
                px: { xs: 3, md: 8 },
                py: 5,
            }}
        >
            <Box
                sx={{
                    maxWidth: 900,
                    mx: "auto",
                }}
            >
                <TiptapEditorContent editor={editor} />
            </Box>
        </Box>
    );
}