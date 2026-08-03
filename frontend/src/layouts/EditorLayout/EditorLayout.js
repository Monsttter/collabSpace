// src/layouts/DashboardLayout/DashboardLayout.jsx

import {
    LayoutRoot,
    Main,
    Content,
} from "./EditorLayout.styles";

import EditorSidebar from "../../components/EditorSidebar/EditorSidebar";

const EditorLayout = ({ children }) => {
    return (
        <LayoutRoot>

            {/* <Sidebar /> */}
            <EditorSidebar />
            {/* <EditorLayout /> */}


            <Main>
    
                {children}

            </Main>

        </LayoutRoot>
    );
};

export default EditorLayout;