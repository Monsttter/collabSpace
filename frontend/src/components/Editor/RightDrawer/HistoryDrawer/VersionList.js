import {
    Box,
    Typography,
} from "@mui/material";

import VersionCard from "./VersionCard";

export default function VersionList({

    versions,

    onSelect,

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
                    px:3,
                    py:2,
                    borderBottom:"1px solid #E5E7EB"
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight={600}
                >
                    Version History
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Browse document snapshots.
                </Typography>

            </Box>

            <Box
                sx={{
                    flex:1,
                    overflowY:"auto",
                    p:2
                }}
            >

                {versions.map(version => (

                    <VersionCard

                        key={version.id}

                        version={version}

                        onClick={() => onSelect(version)}

                    />

                ))}

            </Box>

        </Box>

    );

}