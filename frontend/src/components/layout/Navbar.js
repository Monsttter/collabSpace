import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
} from "@mui/material";

import { Search, Bell, Plus } from "lucide-react";

const Navbar = () => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: 1,
        borderColor: "divider",
        color: "text.primary",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px !important",
          display: "flex",
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        {/* Left */}
        {/* <Box>
          <Typography variant="h5" fontWeight={700}>
            Dashboard
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Continue collaborating with your team.
          </Typography>
        </Box> */}
          <TextField
            size="small"
            placeholder="Search documents..."
            sx={{
              width: 280,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
          />

        {/* Right */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >

          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            sx={{
              borderRadius: 3,
              px: 2.5,
              py: 1,
            }}
          >
            New Document
          </Button>

          <IconButton>
            <Bell size={20} />
          </IconButton>

          <Avatar
            sx={{
              bgcolor: "primary.main",
              cursor: "pointer",
            }}
          >
            R
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;