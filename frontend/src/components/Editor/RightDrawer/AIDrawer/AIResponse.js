import { Box, Typography } from "@mui/material";

export default function AIResponse(){

    return(

        <Box
            sx={{
                flex:1,
                overflowY:"auto",
                p:2
            }}
        >

            <Typography
                color="text.secondary"
            >

                AI responses will appear here.

            </Typography>

        </Box>

    );

}