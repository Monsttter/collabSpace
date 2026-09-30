import { Box } from "@mui/material";
import { EditorContent as TiptapEditorContent } from "@tiptap/react";

export default function CollaborativeEditor({
    editor
}) {

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: "auto",
                scrollbarWidth: "none",
                bgcolor: "background.default",
                px: { xs: 3, md: 8 },
                py: 5,
            }}
        >
            <Box
                sx={{
                    bgcolor: "background.paper",
                    maxWidth: 900,
                    mx: "auto",
                    p: 2,
                    borderRadius: "10px",
                    color: "text.primary"
                }}
            >
                <TiptapEditorContent editor={editor} />
            </Box>
        </Box>
    );
}
