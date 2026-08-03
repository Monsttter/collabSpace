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
import { MoreVertical, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { renameDocument } from "../../store/documents/documentSlice";
import { updateDocumentTitle } from "../../api/documents";

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

  return (
    <Box
      sx={{
        height: 64,
        px: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "#fff",
        borderBottom: "1px solid #ECEEF3",
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
              color: "#64748B",
              fontWeight: 500,
              fontSize: 15,
            }}
            onClick={() => navigate("/dashboard")}
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
                color: "#111827",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              {title}
            </Typography>
          )}
          {loading && <CircularProgress size={14} />}
        </Breadcrumbs>
        <IconButton>
          <Star size={19} />
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

        <IconButton>
          <MoreVertical size={20} />
        </IconButton>
      </Box>
    </Box>
  );
}
