import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { renameDocument, toggleFavorite } from "../../store/documents/documentSlice";
import { toggleDocumentFavorite, updateDocumentTitle } from "../../api/documents";
// import { StarBorder, StarBorderRounded } from "@mui/icons-material";

export default function EditorHeader({ openShareDialog }) {
  const navigate = useNavigate();

  const [editingTitle, setEditingTitle] = useState(false);

  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const document = useSelector((state) => state.documents.currentDocument);
  const [title, setTitle] = useState(document?.title);
  const dispatch = useDispatch();

  useEffect(() => {
    setTitle(document?.title);
  }, [document]);

  const saveTitle = async () => {
    setEditingTitle(false);

    if (!title.trim()) {
      setTitle(document.title);
      return;
    }

    if (title === document.title) return;

    try {
      setLoading(true);

      const data = await updateDocumentTitle(id, title);

      if (data.success) {
        // update redux/context here
        dispatch(renameDocument({ id, title: data.data.title }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") saveTitle();

    if (e.key === "Escape") {
      setTitle(document.title);

      setEditingTitle(false);
    }
  };

  const handleToggleFavorite= async()=>{
    await toggleDocumentFavorite(id);
    dispatch(toggleFavorite(id));
  }

  return (
    <Box
      sx={{
        height: 64,
        px: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          // justifyContent: "space-between",
        }}
      >
        <Breadcrumbs separator="›">
          <Link
            underline="hover"
            color="inherit"
            sx={{
              cursor: "pointer",
              color: "text.secondary",
              fontWeight: 500,
              fontSize: 15,
            }}
            onClick={() => navigate("/documents")}
          >
            Documents
          </Link>

          {editingTitle ? (
            <TextField
            fontWeight={700}
              value={title}
              autoFocus
              variant="standard"
              onChange={(e) => setTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={handleKeyDown}
                sx={{
                    fontWeight: 700,
                    color: "#111827",
                    fontSize: 16
                }}
            />
          ) : (
            <Typography
              onClick={() => setEditingTitle(true)}
              sx={{
                fontWeight: 700,
                color: "text.primary",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              {title}
            </Typography>
          )}
          {loading && <CircularProgress size={14} />}
        </Breadcrumbs>
        <IconButton onClick={handleToggleFavorite}>
          {
            document?.favorite ? (
                <Star
                  size={20}
                  fill="#FACC15"
                  color="#FACC15"
                />
              )
              : <Star
                  size={20}
                  fill="white"
                  color="grey"
                />
          }
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          onClick={openShareDialog}
          sx={{
            borderRadius: "12px",
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
          }}
        >
          Share
        </Button>

        {/* <IconButton>
          <MoreVertical size={20} />
        </IconButton> */}
      </Box>
    </Box>
  );
}
