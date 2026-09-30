
import {
    LayoutRoot,
    Main,
} from "./EditorLayout.styles";

import EditorSidebar from "../../components/Sidebar/EditorSidebar";
import { Outlet } from "react-router";

const EditorLayout = ({ children }) => {
    return (
        <LayoutRoot>

            <EditorSidebar />

            <Main>
    
                <Outlet />

            </Main>

        </LayoutRoot>
    );
};

export default EditorLayout;