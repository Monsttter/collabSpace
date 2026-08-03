import { IconButton, Tooltip } from "@mui/material";

export default function ToolbarButton({
    title,
    icon,
    onClick,
    active = false,
    disabled = false,
}) {
    const Icon = icon;

    return (
        <Tooltip title={title}>
            <span>
                <IconButton
                    size="small"
                    disabled={disabled}
                    onClick={onClick}
                    sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 2,

                        bgcolor: active ? "#EEF2FF" : "transparent",

                        color: active ? "#4F46E5" : "#4B5563",

                        "&:hover": {
                            bgcolor: "#EEF2FF",
                        },
                    }}
                >
                    <Icon fontSize="small" />
                </IconButton>
            </span>
        </Tooltip>
    );
}