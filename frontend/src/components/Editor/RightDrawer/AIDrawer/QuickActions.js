import {
    AutoAwesome,
    Description,
    Translate,
    Edit,
    Psychology,
    Notes,
} from "@mui/icons-material";

import { Box, Button } from "@mui/material";

const actions = [

    {
        label: "Rewrite",
        icon: AutoAwesome,
    },

    {
        label: "Summarize",
        icon: Description,
    },

    {
        label: "Explain",
        icon: Psychology,
    },

    {
        label: "Continue",
        icon: Notes,
    },

    {
        label: "Translate",
        icon: Translate,
    },

    {
        label: "Improve",
        icon: Edit,
    },

];

export default function QuickActions() {

    return (

        <Box
            sx={{
                p:2,
                display:"grid",
                gridTemplateColumns:"1fr 1fr",
                gap:1
            }}
        >

            {actions.map(action=>{

                const Icon=action.icon;

                return(

                    <Button

                        key={action.label}

                        variant="outlined"

                        startIcon={<Icon/>}

                    >

                        {action.label}

                    </Button>

                );

            })}

        </Box>

    );

}