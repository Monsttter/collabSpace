import { Paper, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SidebarSearch() {
    return (
        <Paper
            elevation={0}
            sx={{
                display: "flex",
                alignItems: "center",
                mx: 2,
                my: 2,
                px: 1.5,
                height: 42,
                border: "1px solid #E5E7EB",
                borderRadius: 3,
            }}
        >
            <SearchIcon
                sx={{
                    color: "#9CA3AF",
                    fontSize: 20,
                }}
            />

            <InputBase
                placeholder="Search documents..."
                sx={{
                    ml: 1,
                    flex: 1,
                    fontSize: 14,
                }}
            />
        </Paper>
    );
}