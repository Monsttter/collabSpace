import {
    Box,
    Typography,
    Divider,
} from "@mui/material";

// import CommentThread from "./CommentThread";
import { useDispatch } from "react-redux";
import { X } from "lucide-react";
import { clearPendingSelection, closeDrawer } from "../../../../store/ui/uiSlice";
import CommentComposer from "./CommentComposer";
import CommentList from "./CommentList";
import { fetchComments } from "../../../../store/comments/commentsThunks";
import { useEffect } from "react";
import { useParams } from "react-router";

export default function CommentsPanel({editor}) {

    const { id: documentId } = useParams();
    const dispatch= useDispatch();
    // const pendingSelection= useSelector(state => state.ui.pendingSelection);
    
    const handleClose= ()=>{
        dispatch(closeDrawer());
        dispatch(clearPendingSelection());
    }

    useEffect(() => {

        dispatch(fetchComments(documentId));

    }, [dispatch, documentId]);

    return (
        <Box
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >

            <Box
                sx={{
                    px: 3,
                    py: 2,
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                    <Typography
                        variant="h6"
                        fontWeight={600}
                    >
                        Comments
                    </Typography>
                    <X cursor="pointer" onClick={handleClose}/>

                </Box>


                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Discuss changes with collaborators.
                </Typography>
            </Box>

            <CommentList editor={editor}/>

            <Divider />

            <CommentComposer editor={editor}/>


        </Box>
    );
}
