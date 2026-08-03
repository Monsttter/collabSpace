import { Close, CloseOutlined, ContentCopy } from "@mui/icons-material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    Typography,
    Divider,
    Box,
    IconButton,
    Stack,
    RadioGroup,
    FormControlLabel,
    Radio,
    InputAdornment
} from "@mui/material";

import { useState } from "react";
import { shareDocument } from "../../api/documents";
import { useParams } from "react-router";

// export default function ShareDialog({

//     open,

//     onClose,

// }) {

//     // const [permission, setPermission] = useState("Editor");

//     const [permission, setPermission] = useState("Editor");

//     const [generalAccess, setGeneralAccess] = useState("Private");

//     const [linkPermission, setLinkPermission] = useState("Viewer");

//     const shareLink =
//         "https://collabspace.app/doc/3Hdj82Ksk";

//         const handleCopy = async () => {

//     await navigator.clipboard.writeText(
//             shareLink
//         );

//     };

//     return (

//         <Dialog
//             open={open}
//             onClose={onClose}
//             fullWidth
//             maxWidth="sm"
//         >

//             <DialogTitle
//                 sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                 }}
//             >

//                 Share "Project Proposal"

//                 <IconButton onClick={onClose}>
//                     <Close />
//                 </IconButton>

//             </DialogTitle>

//             <DialogContent>

//                 <Typography
//                     fontWeight={600}
//                     mb={2}
//                 >

//                 Invite People

//                 </Typography>

//                 <TextField

//                     label="Email Address"

//                     fullWidth

//                     size="small"

//                 />

//                 <Stack
//                     direction="row"
//                     spacing={2}
//                     mt={2}
//                 >

//                 <Select

//                     value={permission}

//                     onChange={(e)=>
//                         setPermission(e.target.value)
//                     }

//                     sx={{
//                         width:170
//                     }}

//                 >

//                 <MenuItem value="Editor">

//                 Editor

//                 </MenuItem>

//                 <MenuItem value="Viewer">

//                 Viewer

//                 </MenuItem>

//                 </Select>

//                 <Button
//                     variant="contained"
//                     sx={{
//                         flex:1
//                     }}
//                 >

//                 Send Invite

//                 </Button>

//                 </Stack>

//                 <Divider sx={{ my: 4 }} />

//                 <Typography
//                     fontWeight={600}
//                 >

//                 General Access

//                 </Typography>

//                 <RadioGroup

//                     value={generalAccess}

//                     onChange={(e)=>
//                         setGeneralAccess(e.target.value)
//                     }

//                 >

//                 <FormControlLabel

//                     value="Private"

//                     control={<Radio/>}

//                     label="Private"

//                 />

//                 <FormControlLabel

//                     value="Anyone"

//                     control={<Radio/>}

//                     label="Anyone with the link"

//                 />

//                 </RadioGroup>

//                 <Select

//                     value={linkPermission}

//                     onChange={(e)=>
//                         setLinkPermission(e.target.value)
//                     }

//                     disabled={
//                         generalAccess==="Private"
//                     }

//                 >

//                 <MenuItem value="Viewer">

//                 Viewer

//                 </MenuItem>

//                 <MenuItem value="Editor">

//                 Editor

//                 </MenuItem>

//                 </Select>

//                 <Divider sx={{ my: 4 }} />

//                 <Typography
//                     fontWeight={600}
//                     mb={2}
//                 >

//                 Share Link

//                 </Typography>

//                 <TextField

//                     fullWidth

//                     size="small"

//                     value={shareLink}

//                     InputProps={{

//                         readOnly:true,

//                         endAdornment:(

//                             <InputAdornment position="end">

//                                 <IconButton onClick={handleCopy}>

//                                     <ContentCopy/>

//                                 </IconButton>

//                             </InputAdornment>

//                         )

//                     }}

//                 />

//             </DialogContent>

//             <DialogActions>

//                 <Button
//                     onClick={onClose}
//                 >

//                     Close

//                 </Button>

//             </DialogActions>

//         </Dialog>

//     );

// }



// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Button,
//     TextField,
//     Select,
//     MenuItem,
//     Typography,
//     Divider,
//     Box,
// } from "@mui/material";

// import { useState } from "react";

export default function ShareDialog({

    open,

    onClose,

}) {

    const {id}= useParams();

    const [permission, setPermission] = useState("editor");

    const [generalAccess, setGeneralAccess] = useState("Private");

    const [linkPermission, setLinkPermission] = useState("viewer");

    const [email, setEmail]= useState("");

    const shareLink =
        "https://collabspace.app/doc/3Hdj82Ksk";

    const handleCopy = async () => {

        await navigator.clipboard.writeText(
                shareLink
            );

    };
    
    const handleShare = async () => {

        console.log(id, email);
        await shareDocument(id, email, permission);
        onClose();

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <DialogTitle>

                    Share Document


                </DialogTitle>
                <DialogActions>

                    <Button
                        onClick={onClose}
                    >

                        <CloseOutlined sx={{ color: "black" }}/>

                    </Button>

                </DialogActions>

            </Box>

            <DialogContent>

                <Typography
                    sx={{ mb: 2 }}
                >

                    Invite People

                </Typography>

                <TextField

                    fullWidth

                    label="Email"

                    size="small"

                    value={email}

                    onChange={(e)=> setEmail(e.target.value)}

                />

                <Select

                    fullWidth

                    sx={{ mt: 2 }}

                    value={permission}

                    onChange={(e) =>
                        setPermission(e.target.value)
                    }

                >

                    <MenuItem value="editor">

                        Editor

                    </MenuItem>

                    <MenuItem value="viewer">

                        Viewer

                    </MenuItem>

                </Select>

                <Button

                    fullWidth

                    variant="contained"

                    sx={{ mt: 2 }}

                    onClick={handleShare}

                >

                    Send Invite

                </Button>

                <Divider
                    sx={{ my: 3 }}
                />

                <Typography
                    fontWeight={600}
                >

                General Access

                </Typography>

                <RadioGroup

                    value={generalAccess}

                    onChange={(e)=>
                        setGeneralAccess(e.target.value)
                    }

                >

                <FormControlLabel

                    value="Private"

                    control={<Radio/>}

                    label="Private"

                />

                <FormControlLabel

                    value="Anyone"

                    control={<Radio/>}

                    label="Anyone with the link"

                />

                </RadioGroup>

                <Select

                    value={linkPermission}

                    onChange={(e)=>
                        setLinkPermission(e.target.value)
                    }

                    disabled={
                        generalAccess==="Private"
                    }

                >

                <MenuItem value="Viewer">

                Viewer

                </MenuItem>

                <MenuItem value="Editor">

                Editor

                </MenuItem>

                </Select>

                <Divider sx={{ my: 2 }} />

                <Typography
                    fontWeight={600}
                    mb={2}
                >

                Share Link

                </Typography>

                <TextField

                    fullWidth

                    size="small"

                    value={shareLink}

                    slotProps={{

                        readOnly:true,

                        input: {endAdornment:(

                            <InputAdornment position="end">

                                <IconButton onClick={handleCopy}>

                                    <ContentCopy sx={{height: "20px"}}/>

                                </IconButton>

                            </InputAdornment>

                        )
                        }

                    }}

                />

            </DialogContent>

            {/* <DialogActions>

                <Button
                    onClick={onClose}
                >

                    Close

                </Button>

            </DialogActions> */}

        </Dialog>

    );

}