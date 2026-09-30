import { Box, Typography } from "@mui/material";
import {
    CheckCircle2,
    LoaderCircle,
    WifiOff,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function BottomStatusBar({
    editor,
    syncStatus = "saved", // "saved" | "saving" | "offline"
}) {

    const [documentStats, setDocumentStats] = useState({
        words: 0,
        readingTime: 0,
        });

    const getStatus = () => {
        switch (syncStatus) {
            case "saving":
                return {
                    icon: (
                        <LoaderCircle
                            size={16}
                            className="spin"
                        />
                    ),
                    text: "Saving...",
                    color: "#F59E0B",
                };

            case "offline":
                return {
                    icon: <WifiOff size={16} />,
                    text: "Offline",
                    color: "#EF4444",
                };

            default:
                return {
                    icon: <CheckCircle2 size={16} />,
                    text: "All changes saved",
                    color: "#22C55E",
                };
        }
    };

    const status = getStatus();

    useEffect(() => {
      if (!editor) return;
    
      const handleTransaction = ({ transaction }) => {
        if (!transaction.docChanged) return;

        // Document statistics
        const text = transaction.doc.textContent.trim();

        const words = text
            ? text.split(/\s+/).filter(Boolean).length
            : 0;

        const readingTime = words
            ? Math.max(1, Math.ceil(words / 200))
            : 0;

        setDocumentStats({
            words,
            readingTime,
        });
      };
    
      editor.on("transaction", handleTransaction);
    
      return () => {
        editor.off("transaction", handleTransaction);
      };
    }, [editor]);

    useEffect(() => {
  if (!editor) return;

  const updateDocumentStats = () => {
    const text = editor.getText().trim();

    const words = text
      ? text.split(/\s+/).filter(Boolean).length
      : 0;

    const readingTime = words
      ? Math.max(1, Math.ceil(words / 200))
      : 0;

    setDocumentStats({
      words,
      readingTime,
    });
  };

  updateDocumentStats();

  editor.on("update", updateDocumentStats);

  return () => {
    editor.off("update", updateDocumentStats);
  };
}, [editor]);

    return (
        <Box
            sx={{
                height: 42,
                px: 3,
                borderTop: 1,
                borderColor: "divider",
                bgcolor: "background.paper",

                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",

                flexShrink: 0,
            }}
        >
            {/* Left */}

            <Typography
                sx={{
                    fontSize: 13,
                    color: "text.secondary",
                }}
            >
                {documentStats.words} words • {documentStats.readingTime} min read
            </Typography>

            {/* Right */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: status.color,
                }}
            >
                {status.icon}

                <Typography
                    sx={{
                        fontSize: 13,
                        fontWeight: 600,
                    }}
                >
                    {status.text}
                </Typography>
            </Box>
        </Box>
    );
}
