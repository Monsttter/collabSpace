// components/layout/Sidebar/sidebarConfig.js

import {
    LayoutDashboard,
    FileText,
    Star,
    Users,
    Clock3,
    Trash2,
    Settings,
} from "lucide-react";

const sidebarConfig = [
    {
        title: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Documents",
        path: "/documents",
        icon: FileText,
    },
    {
        title: "Starred",
        path: "/starred",
        icon: Star,
    },
    {
        title: "Shared",
        path: "/shared",
        icon: Users,
    },
    {
        title: "Recent",
        path: "/recent",
        icon: Clock3,
    },
    {
        title: "Trash",
        path: "/trash",
        icon: Trash2,
    },
];

export const bottomNavigation = [
    {
        title: "Settings",
        path: "/settings",
        icon: Settings,
    },
];

export default sidebarConfig;