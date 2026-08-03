import { Box, Divider } from "@mui/material";

import {
    Undo,
    Redo,
    FormatBold,
    FormatItalic,
    FormatUnderlined,
    FormatStrikethrough,
    FormatListBulleted,
    FormatListNumbered,
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
    Link,
    Code,
    Image,
} from "@mui/icons-material";

import HeadingSelect from "./HeadingSelect";
import ToolbarButton from "./ToolbarButton";
import ToolbarOverflow from "./ToolbarOverflow";

export default function FloatingToolbar({
    editor,
    drawerOpen,
}) {
    if (!editor) return null;

    return (
        <Box
            sx={{
                position: "sticky",
                top: 0,
                zIndex: 100,

                display: "flex",
                alignItems: "center",

                width: "fit-content",
                maxWidth: "100%",

                mx: "auto",
                mb: 4,

                px: 2,
                py: 0.8,

                borderRadius: "999px",

                background: "rgba(255,255,255,.90)",
                backdropFilter: "blur(16px)",

                border: "1px solid #E5E7EB",

                boxShadow:
                    "0 10px 35px rgba(15,23,42,.08)",

                gap: 0.5,

                transition: ".25s",
            }}
        >
            {/* Undo / Redo */}

            <ToolbarButton
                title="Undo"
                icon={Undo}
                disabled={!editor.can().undo()}
                onClick={() =>
                    editor.chain().focus().undo().run()
                }
            />

            <ToolbarButton
                title="Redo"
                icon={Redo}
                disabled={!editor.can().redo()}
                onClick={() =>
                    editor.chain().focus().redo().run()
                }
            />

            <Divider orientation="vertical" flexItem />

            {/* Heading */}

            <HeadingSelect editor={editor} />

            <Divider orientation="vertical" flexItem />

            {/* Text */}

            <ToolbarButton
                title="Bold"
                icon={FormatBold}
                active={editor.isActive("bold")}
                onClick={() =>
                    editor.chain().focus().toggleBold().run()
                }
            />

            <ToolbarButton
                title="Italic"
                icon={FormatItalic}
                active={editor.isActive("italic")}
                onClick={() =>
                    editor.chain().focus().toggleItalic().run()
                }
            />

            
            <ToolbarButton
                title="Underline"
                icon={FormatUnderlined}
                active={editor.isActive("underline")}
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleUnderline()
                        .run()
                }
            />

            <ToolbarButton
                title="Strike"
                icon={FormatStrikethrough}
                active={editor.isActive("strike")}
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleStrike()
                        .run()
                }
            />

            <Divider orientation="vertical" flexItem />

            {/* Lists */}

            <ToolbarButton
                title="Bullet List"
                icon={FormatListBulleted}
                active={editor.isActive("bulletList")}
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleBulletList()
                        .run()
                }
            />

            <ToolbarButton
                title="Numbered List"
                icon={FormatListNumbered}
                active={editor.isActive("orderedList")}
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleOrderedList()
                        .run()
                }
            />

            <Divider orientation="vertical" flexItem />

            <ToolbarButton
                title="Align Left"
                icon={FormatAlignLeft}
                active={editor.isActive({ textAlign: "left" })}
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .setTextAlign("left")
                        .run()
                }
            />

            <ToolbarButton
                title="Align Center"
                icon={FormatAlignCenter}
                active={editor.isActive({ textAlign: "center" })}
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .setTextAlign("center")
                        .run()
                }
            />

            <ToolbarButton
                title="Align Right"
                icon={FormatAlignRight}
                active={editor.isActive({ textAlign: "right" })}
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .setTextAlign("right")
                        .run()
                }
            />

            <Divider orientation="vertical" flexItem />

            {/* Link */}

            <ToolbarButton
                title="Link"
                icon={Link}
                active={editor.isActive("link")}
                onClick={() => {}}
            />

            {/* Hidden when drawer opens */}

            {!drawerOpen && (
                <>
                    <ToolbarButton
                        title="Code Block"
                        icon={Code}
                        active={editor.isActive("codeBlock")}
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleCodeBlock()
                                .run()
                        }
                    />

                    <ToolbarButton
                        title="Image"
                        icon={Image}
                        onClick={() => {}}
                    />
                </>
            )}

            {/* Overflow */}

            <ToolbarOverflow
                editor={editor}
                drawerOpen={drawerOpen}
            />
        </Box>
    );
}