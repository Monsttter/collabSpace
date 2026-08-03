import { Box } from "@mui/material";

// import Sidebar from "../components/Sidebar/Sidebar";
// import SidebarSearch from "../components/Sidebar/SidebarSearch";
// import SidebarDocuments from "../components/Sidebar/SidebarDocuments";

// import EditorLayout from "../../components/editor/EditorLayout";
import EditorSidebar from "../../components/EditorSidebar/EditorSidebar";
import Editor from "../../components/Editor/Editor";
import RightDock from "../../components/Editor/RightDock/RightDock";
import { useParams } from "react-router";
// import RightDock from "../components/editor/RightDock";

export default function EditorPage() {

    const {id: docId}= useParams();

    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
            }}
        >
            {/* <Sidebar
                content={
                    <>
                        <SidebarSearch />
                        <SidebarDocuments />
                    </>
                }
            /> */}
            <EditorSidebar />

            <Editor key={docId}/>
        </Box>
    );
}

// // import Typography from "@mui/material/Typography";
// import { Box, Typography, Button } from "@mui/material";
// import { Plus } from "lucide-react";

// import EditorLayout from "../../layouts/EditorLayout/EditorLayout";
// import Editor from "../../components/Editor/Editor";

// const EditorPage = () => {
//     return (
//         <EditorLayout>

//             <Editor/>

//         </EditorLayout>
//     );
// };

// export default EditorPage;