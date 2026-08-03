import { NavLink } from "react-router";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

const StyledLink = styled(NavLink)(({ theme }) => ({
    textDecoration: "none",
    color: "inherit",

    "&.active .sidebar-item": {
        background: "#EEF2FF",
        color: theme.palette.primary.main,
    },
}));

const Item = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),

    padding: "12px 16px",

    borderRadius: 12,

    cursor: "pointer",

    transition: "all .2s",

    "&:hover": {
        background: "#F3F4F6",
    },
}));

const SidebarItem = ({ item }) => {

    const Icon = item.icon;

    return (
        <StyledLink to={item.path}>

            <Item className="sidebar-item">

                <Icon size={20} />

                <Typography
                    fontWeight={500}
                >
                    {item.title}
                </Typography>

            </Item>

        </StyledLink>
    );
};

export default SidebarItem;