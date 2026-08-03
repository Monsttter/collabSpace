import { Stack, Typography } from "@mui/material";

export default function DockButton({
    icon,
    label,
    active,
    onClick,
}) {
    return (
        <Stack
            spacing={0.7}
            onClick={onClick}
            sx={{
                alignItems:"center",
                width: 64,
                py: 1.2,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: active ? "#EEF2FF" : "transparent",
                color: active ? "#4F46E5" : "#6B7280",
                transition: ".2s",

                "&:hover": {
                    bgcolor: "#F3F4F6",
                },
            }}
        >
            {icon}

            <Typography
                fontSize={11}
                fontWeight={500}
            >
                {label}
            </Typography>
        </Stack>
    );
}