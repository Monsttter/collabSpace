// src/layouts/DashboardLayout/DashboardLayout.jsx

import {
    LayoutRoot,
    Main,
    Content,
} from "./DashboardLayout.styles";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import EditorSidebar from "../../components/EditorSidebar/EditorSidebar";
import EditorLayout from "../../components/Editor/EditorLayout";
// import EditorLayout from "../../components/EditorSidebar/EditorLayout";

const DashboardLayout = ({ children }) => {
    return (
        <LayoutRoot>

            {/* <Sidebar /> */}
            <EditorSidebar />
            {/* <EditorLayout /> */}


            <Main>

                <Navbar />

                <Content>

                    {children}

                </Content>

            </Main>

        </LayoutRoot>
    );
};

export default DashboardLayout;