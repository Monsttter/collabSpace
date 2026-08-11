import {
    Box,
    IconButton,
    Tooltip
} from "@mui/material";

// import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import HistoryIcon from "@mui/icons-material/History";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { toggleDrawer } from "../../store/ui/uiSlice";
import { useDispatch } from "react-redux";

export default function RightDock() {

    const dispatch= useDispatch();

    const items = [

        {
            key: "comments",
            icon: <CommentOutlinedIcon />,
            label: "Comments"
        },

        {
            key: "collaborators",
            icon: <GroupOutlinedIcon />,
            label: "Collaborators"
        },

        {
            key: "history",
            icon: <HistoryIcon />,
            label: "History"
        },

        {
            key: "ai",
            icon: <AutoAwesomeOutlinedIcon />,
            label: "AI"
        }

    ];

    return (

        <Box
            sx={{
                width: 72,
                bgcolor: "white",
                borderLeft: "1px solid #E5E7EB",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pt: 3,
                gap: 3
            }}
        >

            {

                items.map(item => (

                    <Tooltip
                        key={item.key}
                        title={item.label}
                        placement="left"
                    >

                        <IconButton
                            onClick={() =>
                                dispatch(toggleDrawer(item.key))
                            }
                        >

                            {item.icon}

                        </IconButton>

                    </Tooltip>

                ))

            }

        </Box>

    );

}