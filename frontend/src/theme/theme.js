import { createTheme } from "@mui/material/styles";

import palette from "./palette";
import typography from "./typography";
import shadows from "./shadows";

const theme = createTheme({
    palette,
    typography,
    shadows,

    shape: {
        borderRadius: 16,
    },

    spacing: 8,
});

export default theme;