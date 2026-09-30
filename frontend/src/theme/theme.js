import { createTheme } from "@mui/material/styles";

import palette from "./palette";
import typography from "./typography";
import shadows from "./shadows";

const getTheme = (mode = "light") => createTheme({
    palette: palette(mode),
    typography,
    shadows,

    shape: {
        borderRadius: 16,
    },

    spacing: 8,
    components: {
        MuiCssBaseline: { styleOverrides: {
            ":root": {
                "--editor-text": mode === "dark" ? "#F8FAFC" : "#1F2937",
                "--editor-muted": mode === "dark" ? "#A8B3CF" : "#6B7280",
                "--editor-code-bg": mode === "dark" ? "#202C47" : "#EEF2FF",
            },
            body: { transition: "background-color 180ms ease, color 180ms ease" },
        } },
        MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
        MuiButton: { styleOverrides: { root: { borderRadius: 12, fontWeight: 700, textTransform: "none" } } },
    },
});

export default getTheme;
