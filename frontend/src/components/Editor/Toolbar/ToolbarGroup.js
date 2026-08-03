import { IconButton, Stack } from "@mui/material";

export default function ToolbarGroup({ items }) {

    return (

        <Stack
            direction="row"
            spacing={0.5}
        >

            {items.map((item) => {

                const Icon = item.icon;

                return (

                    <IconButton
                        key={item.action}
                        size="small"
                        sx={{
                            borderRadius: 2,
                            width: 34,
                            height: 34,

                            "&:hover": {
                                bgcolor: "#EEF2FF",
                            },
                        }}
                    >
                        <Icon fontSize="small" />
                    </IconButton>

                );

            })}

        </Stack>

    );

}