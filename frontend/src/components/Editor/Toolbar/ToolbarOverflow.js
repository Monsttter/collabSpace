import { useState } from "react";

import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Divider,
} from "@mui/material";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import {
    FormatUnderlined,
    FormatStrikethrough,
    Code,
    Image,
    TableChart,
    HorizontalRule,
    FormatQuote,
} from "@mui/icons-material";

export default function ToolbarOverflow({
    editor,
    drawerOpen,
}) {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClose = () => setAnchorEl(null);

    const items = [];

    // Only show hidden tools when the drawer is open
    if (drawerOpen) {
        items.push(
            {
                label: "Underline",
                icon: FormatUnderlined,
                active: editor.isActive("underline"),
                action: () =>
                    editor.chain().focus().toggleUnderline().run(),
            },
            {
                label: "Strikethrough",
                icon: FormatStrikethrough,
                active: editor.isActive("strike"),
                action: () =>
                    editor.chain().focus().toggleStrike().run(),
            },
            {
                label: "Code Block",
                icon: Code,
                active: editor.isActive("codeBlock"),
                action: () =>
                    editor.chain().focus().toggleCodeBlock().run(),
            },
            {
                label: "Insert Image",
                icon: Image,
                action: () => {
                    // TODO
                },
            }
        );
    }

    // Features we'll implement later
    items.push(
        { divider: true },

        {
            label: "Insert Table",
            icon: TableChart,
            disabled: true,
        },

        {
            label: "Horizontal Rule",
            icon: HorizontalRule,
            disabled: true,
        },

        {
            label: "Quote",
            icon: FormatQuote,
            disabled: true,
        }
    );

    return (
        <>
            <IconButton
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                    width: 34,
                    height: 34,
                    borderRadius: 2,

                    "&:hover": {
                        bgcolor: "#EEF2FF",
                    },
                }}
            >
                <MoreHorizIcon fontSize="small" />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 220,
                        borderRadius: 3,
                        boxShadow:
                            "0 10px 40px rgba(15,23,42,.12)",
                    },
                }}
            >
                {items.map((item, index) => {
                    if (item.divider)
                        return <Divider key={index} />;

                    const Icon = item.icon;

                    return (
                        <MenuItem
                            key={item.label}
                            disabled={item.disabled}
                            selected={item.active}
                            onClick={() => {
                                handleClose();
                                item.action?.();
                            }}
                        >
                            <ListItemIcon>
                                <Icon fontSize="small" />
                            </ListItemIcon>

                            <ListItemText>
                                {item.label}
                            </ListItemText>
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
}