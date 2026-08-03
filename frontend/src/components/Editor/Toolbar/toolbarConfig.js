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
    Link,
    Code,
    Image,
    FormatColorText,
    TableChart,
    HorizontalRule,
} from "@mui/icons-material";

export const toolbarItems = [
    {
        id: "undo",
        icon: Undo,
        title: "Undo",
        priority: 1,
    },
    {
        id: "redo",
        icon: Redo,
        title: "Redo",
        priority: 1,
    },

    {
        id: "bold",
        icon: FormatBold,
        title: "Bold",
        priority: 1,
    },

    {
        id: "italic",
        icon: FormatItalic,
        title: "Italic",
        priority: 1,
    },

    {
        id: "underline",
        icon: FormatUnderlined,
        title: "Underline",
        priority: 2,
    },

    {
        id: "strike",
        icon: FormatStrikethrough,
        title: "Strike",
        priority: 2,
    },

    {
        id: "bullet",
        icon: FormatListBulleted,
        title: "Bullet List",
        priority: 1,
    },

    {
        id: "ordered",
        icon: FormatListNumbered,
        title: "Number List",
        priority: 1,
    },

    {
        id: "align",
        icon: FormatAlignLeft,
        title: "Alignment",
        priority: 3,
    },

    {
        id: "link",
        icon: Link,
        title: "Link",
        priority: 1,
    },

    {
        id: "code",
        icon: Code,
        title: "Code Block",
        priority: 4,
    },

    {
        id: "image",
        icon: Image,
        title: "Image",
        priority: 4,
    },

    {
        id: "table",
        icon: TableChart,
        title: "Table",
        priority: 4,
    },

    {
        id: "color",
        icon: FormatColorText,
        title: "Text Color",
        priority: 3,
    },

    {
        id: "divider",
        icon: HorizontalRule,
        title: "Divider",
        priority: 4,
    },
];