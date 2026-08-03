import {
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
    Undo,
    Redo,
    MoreHoriz,
    CheckBoxOutlined,
    FormatColorText,
} from "@mui/icons-material";

export const toolbarItems = [

    {
        type: "group",
        items: [
            { action: "undo", icon: Undo },
            { action: "redo", icon: Redo },
        ],
    },

    {
        type: "select",
        action: "heading",
    },

    {
        type: "group",
        items: [
            { action: "bold", icon: FormatBold },
            { action: "italic", icon: FormatItalic },
            { action: "underline", icon: FormatUnderlined },
            { action: "strike", icon: FormatStrikethrough },
        ],
    },

    {
        type: "group",
        items: [
            { action: "color", icon: FormatColorText },
        ],
    },

    {
        type: "group",
        items: [
            { action: "bullet", icon: FormatListBulleted },
            { action: "ordered", icon: FormatListNumbered },
            { action: "task", icon: CheckBoxOutlined },
        ],
    },

    {
        type: "group",
        items: [
            { action: "align", icon: FormatAlignLeft },
        ],
    },

    {
        type: "group",
        items: [
            { action: "link", icon: Link },
            { action: "code", icon: Code },
            { action: "image", icon: Image },
        ],
    },

    {
        type: "overflow",
        icon: MoreHoriz,
    },
];