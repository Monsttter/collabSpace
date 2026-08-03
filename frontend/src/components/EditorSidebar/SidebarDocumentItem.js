import {
    Box,
    Typography,
    IconButton,
    Tooltip,
} from "@mui/material";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useNavigate } from "react-router";

export default function SidebarDocumentItem({
    doc,
    active,
}) {
    const navigate= useNavigate();
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                px: 1.5,
                py: 1.2,
                borderRadius: 2,
                cursor: "pointer",
                mb: .5,

                bgcolor: active
                    ? "#EEF2FF"
                    : "transparent",

                "&:hover": {
                    bgcolor: "#F5F7FB",

                    ".menuButton": {
                        opacity: 1,
                    },
                },

                transition: ".2s",
            }}
            onClick={()=>{navigate("/editor/"+doc.id)}}
        >
            <DescriptionOutlinedIcon
                sx={{
                    color: active
                        ? "#4F46E5"
                        : "#6B7280",

                    fontSize: 19,
                }}
            />

            <Typography
                noWrap
                sx={{
                    flex: 1,
                    ml: 1,
                    fontSize: 14,
                    fontWeight: active
                        ? 600
                        : 500,
                }}
            >
                {doc.title}
            </Typography>

            {doc.isShared && (
                <Tooltip title="Shared document">
                    <GroupsIcon
                        sx={{
                            color: "#9CA3AF",
                            fontSize: 18,
                            mr: .5,
                        }}
                    />
                </Tooltip>
            )}

            <IconButton
                size="small"
                className="menuButton"
                sx={{
                    opacity: 0,
                    transition: ".2s",
                }}
            >
                <MoreHorizIcon fontSize="small" />
            </IconButton>
        </Box>
    );
}