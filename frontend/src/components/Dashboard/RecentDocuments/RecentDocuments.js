import {
  Box,
  Card,
  Typography,
  Divider,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router";

import DocumentRow from "./DocumentRow";
import { toggleDocumentFavorite } from "../../../api/documents";
import { toggleFavorite } from "../../../store/documents/documentSlice";
import { useDispatch } from "react-redux";

const formatUpdatedAt = (value) => {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value)) / 60000));
  if (minutes < 60) return `${minutes || 1}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
};

const RecentDocuments = ({ documents = [], loading }) => {
  const navigate = useNavigate();
  const dispatch= useDispatch();

  const handleToggleFavorite = (event, documentId) => {
      event.stopPropagation();
      toggleDocumentFavorite(documentId);
      dispatch(toggleFavorite(documentId));
    };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "20px",
        border: 1,
        borderColor: "divider",
        p: 3,
      }}
    >
      <Box
        sx={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            mb:2
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
        >
          Recent Documents
        </Typography>

        <Typography
          sx={{
            color: "primary.main",
            cursor: "pointer",
            fontWeight: 600,

            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick= {()=>{ navigate("/documents")}}
        >
          View all
        </Typography>
      </Box>

      {loading && Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} height={62} sx={{ my: 1 }} />)}

      {!loading && documents.length === 0 && (
        <Box sx={{ py: 7, textAlign: "center" }}>
          <Typography fontWeight={700}>No documents found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Create a document or adjust your search.</Typography>
        </Box>
      )}

      {!loading && documents.slice(0, 6).map((doc, index) => (
        <Box key={doc.title}>
          <DocumentRow
            doc= {doc}
            formatUpdatedAt= {formatUpdatedAt}
            collaborators={[{ name: doc.role === "owner" ? "You" : "Shared" }]}
            onClick={() => navigate(`/editor/${doc.id}`)}
            handleToggleFavorite= {handleToggleFavorite}
          />

          {index !== Math.min(documents.length, 6) - 1 && (
            <Divider />
          )}
        </Box>
      ))}
    </Card>
  );
};

export default RecentDocuments;
