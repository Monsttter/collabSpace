import {
    Box,
    Chip,
    Typography,
} from "@mui/material";

export default function VersionCard({

    version,

    onClick,

}) {

    return (

        <Box

            onClick={onClick}

            sx={{

                mb:2,

                p:2,

                border:"1px solid #E5E7EB",

                borderRadius:3,

                transition:".2s",

                cursor:"pointer",

                "&:hover":{

                    borderColor:"#6366F1",

                    bgcolor:"#F8FAFC"

                }

            }}

        >

            <Box

                sx={{

                    display:"flex",

                    justifyContent:"space-between",

                    alignItems:"center"

                }}

            >

                <Typography
                    fontWeight={600}
                >

                    {version.title}

                </Typography>

                {version.current && (

                    <Chip

                        label="Current"

                        size="small"

                        color="success"

                    />

                )}

            </Box>

            <Typography

                variant="body2"

                color="text.secondary"

                sx={{mt:.5}}

            >

                {version.user} • {version.time}

            </Typography>

            <Typography

                variant="body2"

                sx={{mt:1}}

            >

                {version.summary}

            </Typography>

        </Box>

    );

}