import {
    Box,
    Divider,
    Stack,
    Typography,
    Avatar,
} from "@mui/material";

import sidebarConfig, {
    bottomNavigation,
} from "./sidebarConfig";

import SidebarItem from "./SidebarItem";
import Logo from "./Logo";

const Sidebar = () => {
    return (
        <Box
            sx={{
        top: 0,
        // bgcolor: "#fff",
        // borderRight: "1px solid #ECEEF3",
                width: 280,
                bgcolor: "background.paper",
                borderRight: 1,
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                // justifyContent: "space-between",
                minHeight: "100vh",
                px: 2,
                py: 3,
                height: "100vh",
                position: "sticky"
            }}
        >
            <Box>
                <Logo />

                <Divider sx={{ my: 3 }} />

                <Stack spacing={1}>
                    {sidebarConfig.map((item) => (
                        <SidebarItem
                            key={item.title}
                            item={item}
                        />
                    ))}
                </Stack>
            </Box>

            <Box sx={{mt:"auto"}}>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1}>
                    {bottomNavigation.map((item) => (
                        <SidebarItem
                            key={item.title}
                            item={item}
                        />
                    ))}
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 1,
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: "primary.main",
                        }}
                    >
                        R
                    </Avatar>

                    <Box>
                        <Typography
                            fontWeight={600}
                        >
                            Rahul
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Free Plan
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Sidebar;