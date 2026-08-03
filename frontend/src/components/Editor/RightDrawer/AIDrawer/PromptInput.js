import { useState } from "react";

import {
    Box,
    Button,
    TextField,
} from "@mui/material";

export default function PromptInput(){

    const [prompt,setPrompt]=useState("");

    return(

        <Box
            sx={{
                p:2
            }}
        >

            <TextField

                multiline

                minRows={4}

                fullWidth

                placeholder="Ask AI anything about this document..."

                value={prompt}

                onChange={(e)=>setPrompt(e.target.value)}

            />

            <Button

                fullWidth

                variant="contained"

                sx={{
                    mt:2
                }}

            >

                Generate

            </Button>

        </Box>

    );

}