// src/layouts/DashboardLayout/DashboardLayout.jsx

import {
    LayoutRoot,
    Main,
    Content,
} from "./DashboardLayout.styles";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

const DashboardLayout = ({ children }) => {
    return (
        <LayoutRoot>

            <Sidebar />

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