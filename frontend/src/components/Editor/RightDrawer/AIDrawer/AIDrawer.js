import React from "react";

import {
    Box,
    Button,
    Divider,
    // Drawer,
    IconButton,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";

import CloseIcon
    from "@mui/icons-material/Close";

import AddIcon
    from "@mui/icons-material/Add";

import ContentCopyIcon
    from "@mui/icons-material/ContentCopy";

import RefreshIcon
    from "@mui/icons-material/Refresh";

import AutoAwesomeIcon
    from "@mui/icons-material/AutoAwesome";

import SendIcon
    from "@mui/icons-material/Send";

import CheckIcon
    from "@mui/icons-material/Check";


const SELECTION_ACTIONS = [
    {
        label: "Improve",
        prompt:
            "Improve the writing while preserving the original meaning.",

    },
    {
        label: "Grammar",
        prompt:
            "Fix grammar, spelling, punctuation, and awkward phrasing.",

    },
    {
        label: "Professional",
        prompt:
            "Rewrite this in a clear and professional tone.",

    },
    {
        label: "Shorten",
        prompt:
            "Make this more concise while preserving the important information.",

    },
    {
        label: "Expand",
        prompt:
            "Expand this with useful detail while preserving the original meaning.",

    },
    {
        label: "Explain",
        prompt:
            "Explain this text clearly and simply.",
    }
];


const DOCUMENT_ACTIONS = [
    {
        label: "Summarize",
        prompt:
            "Summarize this document and highlight its most important points.",
    },
    {
        label: "Action items",
        prompt:
            "Find and list the action items in this document.",
    },
    {
        label: "Key points",
        prompt:
            "Identify the most important points in this document.",
    },
    {
        label: "Decisions",
        prompt:
            "Identify the important decisions and conclusions in this document.",
    },
    {
        label: "Improve document",
        prompt:
            "Suggest improvements that would make this document clearer and more effective.",
    }
];


export default function AIDrawer({

    open,

    onClose,

    selectedText,

    prompt,

    setPrompt,

    response,

    loading,

    error,

    resultType,

    onQuickAction,

    onSubmit,

    onNew,

    onClearSelection,

    onAccept,

    onRegenerate,

    clearAIResponse,

    handleContinueWriting,

    handleAcceptInsert

}) {

    const hasSelection =
        Boolean(
            selectedText?.trim()
        );


    const actions =
        hasSelection
            ? SELECTION_ACTIONS
            : DOCUMENT_ACTIONS;


    const handleCopy = async () => {

        if (!response) {
            return;
        }

        try {

            await navigator.clipboard.writeText(
                response
            );

        } catch (error) {

            console.error(
                "Failed to copy AI response:",
                error
            );

        }

    };


    return (

        <Paper
            anchor="right"
            open={open}
            onClose={onClose}
                sx= {{

                    display:
                        "flex",

                    flexDirection:
                        "column",
                    
                    height: "100%"
                }
            }
        >

            {/* HEADER */}

            <Box
                sx={{
                    px: 2,
                    py: 1.5,

                    display: "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "space-between",

                    borderBottom:
                        "1px solid",

                    borderColor:
                        "divider"
                }}
            >

                <Box
                    sx={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap: 1
                    }}
                >

                    <AutoAwesomeIcon
                        fontSize="small"
                    />

                    <Typography
                        fontWeight={600}
                    >
                        AI Assistant
                    </Typography>

                </Box>


                <Stack
                    direction="row"
                    spacing={0.5}
                >

                    <IconButton
                        size="small"
                        onClick={onClose}
                    >

                        <CloseIcon />

                    </IconButton>

                </Stack>

            </Box>


            {/* SCROLLABLE CONTENT */}

            <Box
                sx={{
                    flex: 1,

                    overflowY:
                        "auto",

                    scrollbarWidth: "none",

                    p: 2
                }}
            >

                {/* CONTEXT */}

                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1
                }}>

                    <Typography
                        variant="body2"
                        fontWeight={600}
                    >

                        {hasSelection
                            ? "Working with selected text"
                            : "Working with this document"}

                    </Typography>
                    
                    <Tooltip
                        title="Start a new AI request"
                        sx={{
                            display: "flex",
                            direction: "row",
                            alignItems: "center",
                            color: "blue"
                        }}
                        size="small"
                        onClick={onNew}
                    >
                        <Button>
                            <AddIcon />

                            <Typography>
                                New
                            </Typography>
                        </Button>

                    </Tooltip>

                </Box>


                {/* SELECTED TEXT */}

                {hasSelection && (

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 1.25,
                            mb: 2,

                            position:
                                "relative",

                            backgroundColor:
                                "background.default"
                        }}
                    >

                        <Tooltip
                            title="Remove selection"
                        >

                            <IconButton
                                size="small"
                                onClick={
                                    onClearSelection
                                }
                                sx={{
                                    position:
                                        "absolute",

                                    top: 4,

                                    right: 4
                                }}
                            >

                                <CloseIcon
                                    fontSize="small"
                                />

                            </IconButton>

                        </Tooltip>


                        <Typography
                            variant="body2"
                            sx={{

                                paddingRight: "18px",

                                display:
                                    "-webkit-box",

                                WebkitLineClamp:
                                    5,

                                WebkitBoxOrient:
                                    "vertical",

                                overflow:
                                    "hidden"
                            }}
                        >
                            {selectedText}
                        </Typography>

                    </Paper>

                )}


                {/* PROMPT */}

                {/* <Typography
                    variant="caption"
                    color="text.secondary"
                >

                    {hasSelection
                        ? "Ask AI about this text"
                        : "Ask AI about this document"}

                </Typography> */}


                <Paper
                    variant="outlined"
                    sx={{
                        mt: 0.75,

                        p: 1,

                        display:
                            "flex",

                        alignItems:
                            "flex-end",

                        gap: 1
                    }}
                >

                    <TextField
                        fullWidth
                        multiline
                        maxRows={5}
                        variant="standard"
                        placeholder={
                            hasSelection
                                ? "Tell AI what to do..."
                                : "Ask anything..."
                        }
                        value={prompt}
                        onChange={event => {
                            setPrompt(
                                event.target.value
                            )
                            if (response) {
                                clearAIResponse();
                            }
                        }
                        }
                        onKeyDown={event => {

                            if (
                                event.key ===
                                    "Enter" &&
                                !event.shiftKey
                            )
                            {

                                event.preventDefault();

                                onSubmit();

                            }

                        }}
                        slotProps={{
                            input: {
                                disableUnderline:
                                    true
                            }
                        }}
                    />


                    <Tooltip
                        title="Send"
                    >

                        <span>

                            <IconButton
                                onClick={onSubmit}
                                disabled={
                                    !prompt.trim() ||
                                    loading
                                }
                            >

                                <SendIcon />

                            </IconButton>

                        </span>

                    </Tooltip>

                </Paper>


                {/* QUICK ACTIONS */}

                <Box sx={{ mt: 0.5 }}>

                    {/* <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Quick actions
                    </Typography> */}


                    <Stack
                        
                        direction="row"
                        // flexWrap="wrap"
                        gap={0.75}
                        sx={{ mt: 1, flexWrap: "wrap" }}
                    >

                        { !hasSelection && <Button
                            variant="outlined"
                            onClick={() =>
                                handleContinueWriting()
                            }
                            sx={{
                                textTransform:
                                    "none",

                                borderRadius:
                                    2,
                                margin: "1.5px",
                                padding: "2px 10px"
                            }}
                        >

                            Continue Writing

                        </Button>}

                        {actions.map(
                            action => (

                                <Button
                                    key={
                                        action.label
                                    }
                                    // size="small"
                                    variant="outlined"
                                    onClick={() =>
                                        onQuickAction(
                                            action
                                        )
                                    }
                                    sx={{
                                        textTransform:
                                            "none",

                                        borderRadius:
                                            2,
                                        margin: "1.5px",
                                        padding: "2px 10px"
                                    }}
                                >

                                    {action.label}

                                </Button>

                            )
                        )}

                    </Stack>

                </Box>




                {/* LOADING */}

                {loading && (

                    <Box
                        sx={{
                            mt: 3,

                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap: 1
                        }}
                    >

                        <AutoAwesomeIcon
                            fontSize="small"
                        />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Thinking...
                        </Typography>

                    </Box>

                )}


                {/* RESPONSE */}

                {response && !loading && (

                    <Box sx={{ mt: 3 }}>

                        <Divider
                            sx={{ mb: 1.5 }}
                        />


                        <Box
                            sx={{
                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "space-between"
                            }}
                        >

                            <Typography
                                // variant="caption"
                                sx={{
                                // fontWeight:600

                                }}
                            >
                                AI response
                            </Typography>


                            <Stack
                                direction="row"
                                spacing={0.25}
                            >

                                <Tooltip
                                    title="Copy response"
                                >

                                    <IconButton
                                        size="small"
                                        onClick={
                                            handleCopy
                                        }
                                    >

                                        <ContentCopyIcon
                                            fontSize="small"
                                        />

                                    </IconButton>

                                </Tooltip>


                                <Tooltip
                                    title="Regenerate"
                                >

                                    <IconButton
                                        size="small"
                                        onClick={
                                            onRegenerate
                                        }
                                    >

                                        <RefreshIcon
                                            fontSize="small"
                                        />

                                    </IconButton>

                                </Tooltip>

                            </Stack>

                        </Box>


                        <Paper
                            variant="outlined"
                            sx={{
                                mt: 1,
                                p: 1.5,

                                whiteSpace:
                                    "pre-wrap",

                                lineHeight:
                                    1.6
                            }}
                        >

                            <Typography
                                variant="body2"
                            >
                                {response}
                            </Typography>

                        </Paper>


                        {/* ACCEPT */}

                        {resultType ===
                            "edit" && (

                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={
                                    <CheckIcon />
                                }
                                onClick={
                                    onAccept
                                }
                                sx={{
                                    mt: 1.5,

                                    textTransform:
                                        "none",

                                    borderRadius:
                                        2
                                }}
                            >
                                Accept & Replace
                            </Button>

                        )}
                        {resultType ===
                            "insert" && (

                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={
                                    <CheckIcon />
                                }
                                onClick={
                                    handleAcceptInsert
                                }
                                sx={{
                                    mt: 1.5,

                                    textTransform:
                                        "none",

                                    borderRadius:
                                        2
                                }}
                            >
                                Accept & Insert
                            </Button>

                        )}

                    </Box>

                )}

                {/* ERROR */}
                
                {error && (
                
                    <Typography
                        color="error"
                        variant="body2"
                        sx={{ mt: 2 }}
                    >
                        {error}
                    </Typography>
                
                )}
            </Box>

        </Paper>

    );

}