const palette = (mode = "light") => ({
    mode,
    primary: {
        main: "#5B5CEB",
        light: "#7C7CF0",
        dark: "#4344D4",
        contrastText: "#FFFFFF",
    },

    secondary: {
        main: "#06B6D4",
    },

    background: mode === "dark" ? {
        default: "#0B1020",
        paper: "#121A2E",
    } : {
        default: "#F7F8FC",
        paper: "#FFFFFF",
    },

    text: mode === "dark" ? {
        primary: "#F8FAFC",
        secondary: "#A8B3CF",
    } : {
        primary: "#111827",
        secondary: "#6B7280",
    },

    divider: mode === "dark" ? "#26324D" : "#E5E7EB",

    success: {
        main: "#16A34A",
    },

    warning: {
        main: "#F59E0B",
    },

    error: {
        main: "#DC2626",
    },
});

export default palette;
