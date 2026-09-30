// src/layouts/DashboardLayout/DashboardLayout.styles.js

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

export const LayoutRoot = styled(Box)(({ theme }) => ({
    display: "flex",
    height: "100vh",
    overflow: "hidden",
    backgroundColor: theme.palette.background.default,
}));

export const Main = styled("main")(({ theme }) => ({
    // flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    overflowY: "scroll",
    width: "100%"
}));

export const Content = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(4),
}));