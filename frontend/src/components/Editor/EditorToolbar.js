import {
    Box,
    IconButton,
    Divider,
    MenuItem,
    Select,
    Tooltip,
} from "@mui/material";

import {
    Undo2,
    Redo2,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List,
    ListOrdered,
    CheckSquare,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link2,
    Code2,
    Image,
    Highlighter,
    ChevronDown,
    MoreHorizontal,
} from "lucide-react";

export default function EditorToolbar({ editor }) {
    if (!editor) return null;

    const buttonStyle = {
        borderRadius: 2,
        width: 36,
        height: 36,

        "&:hover": {
            bgcolor: "#F3F4F6",
        },
    };

    return (
        <Box
            sx={{
                width: "fit-content",
        maxWidth: "100%",
        mx: "auto",
        mb: 4,

        p: 1,

        bgcolor: "white",

        border: "1px solid #E5E7EB",

        borderRadius: 3,

        boxShadow: "0 2px 8px rgba(0,0,0,.05)",

        position: "sticky",

        top: 20,

        zIndex: 10,

        display: "flex"
                // height: 44,
                // bgcolor: "#fff",
                // display: "flex",
                // alignItems: "center",
                // gap: 0.5,
                // px: 2,
                // margin:"10px auto",
                // borderRadius: "10px",
                // border: "1px solid #ECEEF3",
                // position: "sticky",
                // top: 0,
                // zIndex: 20,
            }}
        >
            {/* Undo */}
            <Tooltip title="Undo">
                <IconButton
                    sx={buttonStyle}
                    onClick={() =>
                        editor.chain().focus().undo().run()
                    }
                >
                    <Undo2 size={18} />
                </IconButton>
            </Tooltip>

            {/* Redo */}
            <Tooltip title="Redo">
                <IconButton
                    sx={buttonStyle}
                    onClick={() =>
                        editor.chain().focus().redo().run()
                    }
                >
                    <Redo2 size={18} />
                </IconButton>
            </Tooltip>

            <Divider flexItem orientation="vertical" sx={{ mx: 1 }} />

            <Select
                size="small"
                value="paragraph"
                displayEmpty
                IconComponent={ChevronDown}
                sx={{
                    minWidth: 140,
                    borderRadius: 2,
                    height: 38,
                }}
            >
                <MenuItem
                    value="paragraph"
                    onClick={() =>
                        editor.chain().focus().setParagraph().run()
                    }
                >
                    Paragraph
                </MenuItem>

                <MenuItem
                    value="h1"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                >
                    Heading 1
                </MenuItem>

                <MenuItem
                    value="h2"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                >
                    Heading 2
                </MenuItem>

                <MenuItem
                    value="h3"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                >
                    Heading 3
                </MenuItem>
            </Select>

            <Divider flexItem orientation="vertical" sx={{ mx: 1 }} />

            <IconButton
                sx={buttonStyle}
                color={editor.isActive("bold") ? "primary" : "default"}
                onClick={() =>
                    editor.chain().focus().toggleBold().run()
                }
            >
                <Bold size={18} />
            </IconButton>

            <IconButton
                sx={buttonStyle}
                color={editor.isActive("italic") ? "primary" : "default"}
                onClick={() =>
                    editor.chain().focus().toggleItalic().run()
                }
            >
                <Italic size={18} />
            </IconButton>

            <IconButton
                sx={buttonStyle}
                onClick={() =>
                    editor.chain().focus().toggleUnderline().run()
                }
            >
                <Underline size={18} />
            </IconButton>

            <IconButton
                sx={buttonStyle}
                onClick={() =>
                    editor.chain().focus().toggleStrike().run()
                }
            >
                <Strikethrough size={18} />
            </IconButton>

            <Divider flexItem orientation="vertical" sx={{ mx: 1 }} />

            <IconButton
                sx={buttonStyle}
                onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                }
            >
                <List size={18} />
            </IconButton>

            <IconButton
                sx={buttonStyle}
                onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                }
            >
                <ListOrdered size={18} />
            </IconButton>

            <IconButton sx={buttonStyle}>
                <CheckSquare size={18} />
            </IconButton>

            <Divider flexItem orientation="vertical" sx={{ mx: 1 }} />

            <IconButton sx={buttonStyle}>
                <AlignLeft size={18} />
            </IconButton>

            <IconButton sx={buttonStyle}>
                <AlignCenter size={18} />
            </IconButton>

            <IconButton sx={buttonStyle}>
                <AlignRight size={18} />
            </IconButton>

            <Divider flexItem orientation="vertical" sx={{ mx: 1 }} />

            <IconButton sx={buttonStyle}>
                <Link2 size={18} />
            </IconButton>

            <IconButton sx={buttonStyle}>
                <Code2 size={18} />
            </IconButton>

            <IconButton sx={buttonStyle}>
                <Highlighter size={18} />
            </IconButton>

            <IconButton sx={buttonStyle}>
                <Image size={18} />
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />
            <Divider flexItem orientation="vertical" sx={{ mx: 1 }} />

            <IconButton sx={buttonStyle}>
                <MoreHorizontal size={18} />
            </IconButton>
        </Box>
    );
}