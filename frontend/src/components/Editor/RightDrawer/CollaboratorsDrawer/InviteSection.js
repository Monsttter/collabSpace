import { useState } from "react";

import {
    Box,
    Button,
    Collapse,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";

export default function InviteSection() {

    const [open, setOpen] = useState(false);

    const [role, setRole] = useState("Editor");

    return (

        <Box
            sx={{
                p: 2,
            }}
        >

            <Button
                variant="text"
                onClick={() => setOpen(!open)}
            >
                {open ? "Cancel" : "+ Invite"}
            </Button>

            <Collapse in={open}>

                <Box
                    sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >

                    <TextField
                        size="small"
                        label="Email Address"
                        fullWidth
                    />

                    <Select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        size="small"
                    >

                        <MenuItem value="Editor">
                            Editor
                        </MenuItem>

                        <MenuItem value="Viewer">
                            Viewer
                        </MenuItem>

                    </Select>

                    <Button
                        variant="contained"
                    >
                        Invite
                    </Button>

                </Box>

            </Collapse>

        </Box>

    );

}