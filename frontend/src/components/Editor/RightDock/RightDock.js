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

export default function RightDock({

    drawer,
    setDrawer

}) {

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
                                setDrawer(

                                    drawer === item.key
                                        ? null
                                        : item.key

                                )
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


// import { Box } from "@mui/material";
// import { useState } from "react";

// import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
// import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
// import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
// import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

// import DockButton from "./DockButton";
// import DrawerPanel from "./DrawerPanel";

// import CommentsDrawer from "./CommentsDrawer";
// import PeopleDrawer from "./PeopleDrawer";
// import HistoryDrawer from "./HistoryDrawer";
// import AIDrawer from "./AIDrawer";

// export default function RightDock({activeDrawer, setActiveDrawer}) {

//     const toggleDrawer = (drawer) => {
//         setActiveDrawer((prev) =>
//             prev === drawer ? null : drawer
//         );
//     };

//     return (
//         <>
//             <Box
//                 sx={{
//                     width: 85,
//                     borderLeft: "1px solid #E5E7EB",
//                     bgcolor: "#fff",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     flexShrink: 0,
//                     py: 2,
//                     gap: 2,
//                 }}
//             >
//                 <DockButton
//                     icon={<CommentOutlinedIcon />}
//                     label="Comments"
//                     active={activeDrawer === "comments"}
//                     onClick={() => toggleDrawer("comments")}
//                 />

//                 <DockButton
//                     icon={<GroupOutlinedIcon />}
//                     label="People"
//                     active={activeDrawer === "people"}
//                     onClick={() => toggleDrawer("people")}
//                 />

//                 <DockButton
//                     icon={<HistoryOutlinedIcon />}
//                     label="History"
//                     active={activeDrawer === "history"}
//                     onClick={() => toggleDrawer("history")}
//                 />

//                 <DockButton
//                     icon={<AutoAwesomeOutlinedIcon />}
//                     label="AI"
//                     active={activeDrawer === "ai"}
//                     onClick={() => toggleDrawer("ai")}
//                 />
//             </Box>

//             {/* <DrawerPanel
//                 open={active !== null}
//                 onClose={() => setActive(null)}
//             >
//                 {active === "comments" && <CommentsDrawer />}
//                 {active === "people" && <PeopleDrawer />}
//                 {active === "history" && <HistoryDrawer />}
//                 {active === "ai" && <AIDrawer />}
//             </DrawerPanel> */}
//         </>
//     );
// }