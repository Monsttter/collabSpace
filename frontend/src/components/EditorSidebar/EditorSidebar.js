import { Outlet } from "react-router";

import Sidebar from "./Sidebar";
import SidebarSearch from "./SidebarSearch";
import SidebarDocuments from "./SidebarDocuments";

import { Box, Divider } from "@mui/material";

export default function EditorSidebar() {

    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
            }}
        >
            <Sidebar>

                {/* <SidebarSearch /> */}

                <Divider />

                <SidebarDocuments />

            </Sidebar>

            <Box
                sx={{
                    flex: 1,
                    overflow: "auto",
                }}
            >
                <Outlet />
            </Box>

        </Box>
    );
}



// import { Box, Divider } from "@mui/material";
// import SidebarHeader from "./SidebarHeader";
// import SidebarNavigation from "./SidebarNavigation";
// import SidebarSearch from "./SidebarSearch";
// import SidebarDocuments from "./SidebarDocuments";
// import SidebarProfile from "./SidebarProfile";

// export default function EditorSidebar() {
//     return (
//         <Box
//             sx={{
//                 width: 300,
//                 height: "100vh",
//                 display: "flex",
//                 flexDirection: "column",
//                 borderRight: "1px solid #ECEEF3",
//                 background: "#fff",
//                 flexShrink: 0,
//             }}
//         >
//             <SidebarHeader />

//             <Divider />

//             <SidebarNavigation />

//             <Divider />

//             <SidebarSearch />

//             <Divider />

//             {/* Scrollable Section */}
//             <Box
//                 sx={{
//                     flex: 1,
//                     overflow: "hidden",
//                     display: "flex",
//                     flexDirection: "column",
//                 }}
//             >
//                 <SidebarDocuments />
//             </Box>

//             <Divider />

//             <SidebarProfile />
//         </Box>
//     );
// }