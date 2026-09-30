import {
    Avatar,
    Box,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    // ListItemIcon,
    ListItemText,
} from "@mui/material";

import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../../store/auth/authSlice";

export default function SidebarProfile() {

    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const user= useSelector(state => state.auth.user);
    const initial = user?.username?.[0] || user?.email?.[0] || "U";

    const profileMenuOpen = Boolean(profileAnchorEl);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("collabspace-theme");

        dispatch(logout());

        setProfileAnchorEl(null);

        navigate("/login", {
            replace: true,
        });
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Box 
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
            }}>

                <Avatar
                    sx={{
                        bgcolor: "#5B5CEB",
                    }}
                >
                        {initial?.toUpperCase()}
                </Avatar>

                <Box ml={2}>
                    <Typography
                    sx={{
                        fontWeight:600,
                        fontSize:14,
                        p:1
                    }}
                    >
                        {user?.username}
                    </Typography>

                    {/* <Typography
                    sx={{
                        color: "text.secondary",
                        fontSize:12
                    }}
                    >
                        Personal Workspace
                    </Typography> */}
                </Box>
            </Box>
            <IconButton
                size="small"
                onClick={(event) => {
                        setProfileAnchorEl(event.currentTarget);
                    }}
                >
                <ChevronRightIcon />
            </IconButton>

            <Menu
    anchorEl={profileAnchorEl}
    open={profileMenuOpen}
    onClose={() => setProfileAnchorEl(null)}
    anchorOrigin={{
        horizontal: "right",
    }}
>
    <MenuItem onClick={handleLogout}>
        {/* <ListItemIcon>
            <LogOutIcon fontSize="small" />
        </ListItemIcon> */}

        <ListItemText>
            Logout
        </ListItemText>
    </MenuItem>
</Menu>
            
        </Box>
    );
}