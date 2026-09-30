// src/layouts/DashboardLayout/DashboardLayout.jsx

import {
    LayoutRoot,
    Main,
    Content,
} from "./DashboardLayout.styles";

import Navbar from "../../components/Navbar";
import EditorSidebar from "../../components/Sidebar/EditorSidebar.js";
import { Outlet } from "react-router";

const DashboardLayout = ({ children }) => {
    return (
        <LayoutRoot>

            <EditorSidebar />

            <Main>

                <Navbar />

                <Content>

                    <Outlet/>

                </Content>

            </Main>

        </LayoutRoot>
    );
};

export default DashboardLayout;
