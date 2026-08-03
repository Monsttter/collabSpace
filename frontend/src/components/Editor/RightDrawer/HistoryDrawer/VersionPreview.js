import {

ArrowBack,

Restore,

} from "@mui/icons-material";

import {

Box,

Button,

IconButton,

Typography,

} from "@mui/material";

export default function VersionPreview({

    version,

    onBack,

}) {

    return (

        <Box
            sx={{
                display:"flex",
                flexDirection:"column",
                height:"100%"
            }}
        >

            <Box
                sx={{
                    display:"flex",
                    alignItems:"center",
                    px:2,
                    py:1.5,
                    borderBottom:"1px solid #E5E7EB"
                }}
            >

                <IconButton
                    onClick={onBack}
                >
                    <ArrowBack/>
                </IconButton>

                <Typography
                    fontWeight={600}
                >
                    Version Preview
                </Typography>

            </Box>

            <Box
                sx={{
                    p:3,
                    flex:1,
                    overflowY:"auto"
                }}
            >

                <Typography
                    variant="h6"
                >
                    {version.title}
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{mb:3}}
                >
                    {version.user} • {version.time}
                </Typography>

                <Box
                    sx={{
                        minHeight:400,
                        p:2,
                        border:"1px solid #E5E7EB",
                        borderRadius:2,
                        bgcolor:"#FAFAFA",
                        whiteSpace:"pre-wrap"
                    }}
                >

                    Version content will appear here...

                </Box>

            </Box>

            {!version.current && (

                <Box
                    sx={{
                        p:2,
                        borderTop:"1px solid #E5E7EB"
                    }}
                >

                    <Button

                        fullWidth

                        variant="contained"

                        startIcon={<Restore/>}

                    >

                        Restore Version

                    </Button>

                </Box>

            )}

        </Box>

    );

}