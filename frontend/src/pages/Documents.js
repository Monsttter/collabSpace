import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import {
  Box,
  Select,
  TextField,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  deleteDocument,
  renameDocument,
  toggleFavorite,
} from "../store/documents/documentSlice";

// import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditIcon from "@mui/icons-material/Edit";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import "../styles/documents.css";
import {
  removeDocument,
  toggleDocumentFavorite,
  updateDocumentTitle,
} from "../api/documents";
import { FileText, Star } from "lucide-react";
import { DeleteOutlineOutlined } from "@mui/icons-material";

const Documents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { documents, loading, error } = useSelector((state) => state.documents);

  const [renamingDocument, setRenamingDocument] = useState(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [renameLoading, setRenameLoading] = useState(false);

  const handleRenameStart = () => {
    if (!selectedDocument) return;

    setRenamingDocument(selectedDocument);
    setRenameTitle(selectedDocument.title);
    handleMenuClose();
  };

  const handleRenameSubmit = async () => {
    const title = renameTitle.trim();

    if (!title || !renamingDocument || renameLoading) return;

    try {
      setRenameLoading(true);

      const data = await updateDocumentTitle(renamingDocument.id, title);

      if (data.success) {
        // update redux/context here
        dispatch(
          renameDocument({ id: renamingDocument.id, title: data.data.title }),
        );
      }

      setRenamingDocument(null);
      setRenameTitle("");
    } catch (error) {
      console.error("Failed to rename document:", error);
    } finally {
      setRenameLoading(false);
    }
  };

  // UI state belongs here, not in Redux
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filter, setFilter] = useState("all");

  const filterTitle = {
    all: "All documents",
    favorites: "Favorite documents",
    shared: "Shared with me",
  };

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const menuOpen = Boolean(menuAnchor);

  const handleMenuOpen = (event, document) => {
    event.stopPropagation();

    setMenuAnchor(event.currentTarget);
    setSelectedDocument(document);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    // setSelectedDocument(null);
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteStart = () => {
    if (!selectedDocument) return;

    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    if (deleteLoading) return;

    setDeleteDialogOpen(false);
    setSelectedDocument(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDocument || deleteLoading) return;

    try {
      setDeleteLoading(true);

      await removeDocument(selectedDocument.id);

      dispatch(deleteDocument(selectedDocument.id));

      setDeleteDialogOpen(false);
      setSelectedDocument(null);
    } catch (error) {
      console.error("Failed to delete document:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const visibleDocuments = useMemo(() => {
    let result = [...documents];

    // -------------------------
    // Filter
    // -------------------------

    if (filter === "favorites") {
      result = result.filter((doc) => doc.favorite);
    }

    if (filter === "shared") {
      result = result.filter((doc) => doc.role !== "owner");
    }

    // -------------------------
    // Search
    // -------------------------

    const query = searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter((doc) =>
        (doc.title || "").toLowerCase().includes(query),
      );
    }

    // -------------------------
    // Sort
    // -------------------------

    if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    }

    if (sortBy === "created") {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    if (sortBy === "alphabetical") {
      result.sort((a, b) =>
        (a.title || "").localeCompare(b.title || "", undefined, {
          sensitivity: "base",
        }),
      );
    }

    return result;
  }, [documents, searchQuery, sortBy, filter]);

  const handleOpenDocument = (documentId) => {
    navigate(`/editor/${documentId}`);
  };

  const handleToggleFavorite = (event, documentId) => {
    event.stopPropagation();
    toggleDocumentFavorite(documentId);
    dispatch(toggleFavorite(documentId));
  };

  return (
    <Box>
      <Box
        className="documents-page"
        sx={{
          px: 5,
          py: 4,
          bgcolor: "background.default",
        }}
      >
        {/* Header */}
        <Box className="documents-header">
          <Box>
            <Typography className="documents-title">Documents</Typography>

            <Typography
              className="documents-subtitle"
              sx={{ color: "text.secondary" }}
            >
              All your documents in one place
            </Typography>
          </Box>
        </Box>

        {/* Search + Sort */}
        <Box className="documents-toolbar">
          <TextField
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search documents..."
            size="small"
            className="documents-search"
            sx={{
              bgcolor: "background.paper",
            }}
            InputProps={{
              startAdornment: <SearchIcon className="search-icon" />,
            }}
          />

          <Box className="documents-sort">
            <SortIcon />

            <Typography className="sort-label">Sort by</Typography>

            <Select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              variant="standard"
              disableUnderline
            >
              <MenuItem value="recent">Recently modified</MenuItem>

              <MenuItem value="created">Recently created</MenuItem>

              <MenuItem value="alphabetical">Name A → Z</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* Filters */}
        <Box className="documents-filters">
          <button
            className={
              filter === "all" ? "document-filter active" : "document-filter"
            }
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className={
              filter === "favorites"
                ? "document-filter active"
                : "document-filter"
            }
            onClick={() => setFilter("favorites")}
          >
            Favorites
          </button>

          <button
            className={
              filter === "shared" ? "document-filter active" : "document-filter"
            }
            onClick={() => setFilter("shared")}
          >
            Shared with me
          </button>
        </Box>

        {/* Documents */}
        <Box className="documents-section">
          <Box className="documents-section-header">
            <Typography className="section-title">
              {filterTitle[filter]}
            </Typography>

            <Typography className="document-count">
              {visibleDocuments.length}{" "}
              {visibleDocuments.length === 1 ? "document" : "documents"}
            </Typography>
          </Box>

          {loading && (
            <Box className="documents-state">
              <Typography>Loading documents...</Typography>
            </Box>
          )}

          {!loading && error && (
            <Box className="documents-state error">
              <Typography>{error}</Typography>
            </Box>
          )}

          {!loading && !error && visibleDocuments.length === 0 && (
            <Box
              className="documents-empty"
              sx={{ bgcolor: "background.paper", border: 1,
                borderColor: "divider", }}
            >
              <DescriptionOutlinedIcon />

              <Typography className="empty-title">
                {searchQuery.trim()
                  ? "No documents found"
                  : filter === "favorites"
                    ? "No favorite documents"
                    : filter === "shared"
                      ? "No shared documents"
                      : "No documents yet"}
              </Typography>

              <Typography
                className="empty-description"
                sx={{ color: "text.secondary" }}
              >
                {searchQuery.trim()
                  ? "Try a different search term."
                  : filter === "favorites"
                    ? "Documents you favorite will appear here."
                    : filter === "shared"
                      ? "Documents shared with you will appear here."
                      : "Create a document from the sidebar to get started."}
              </Typography>
            </Box>
          )}

          {!loading && !error && visibleDocuments.length > 0 && (
            <Box
              className="documents-list"
              sx={{
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
              }}
            >
              {visibleDocuments.map((doc) => (
                <Box>
                  <Box
                    key={doc.id}
                    className="document-list-item"
                    sx={{ "&:hover": { backgroundColor: "action.hover" } }}
                    onClick={() => handleOpenDocument(doc.id)}
                  >
                    <Box className="document-list-main">
                      <Box className="document-list-icon">
                        <FileText size={20} />
                      </Box>

                      <Box className="document-list-info">
                        {renamingDocument?.id === doc.id ? (
                          <TextField
                            value={renameTitle}
                            onChange={(e) => setRenameTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleRenameSubmit();
                              }

                              if (e.key === "Escape") {
                                setRenamingDocument(null);
                                setRenameTitle("");
                              }
                            }}
                            autoFocus
                            size="small"
                            fullWidth
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <Typography className="document-list-title">
                            {doc.title}
                          </Typography>
                        )}

                        <Typography
                          className="document-list-time"
                          sx={{ color: "text.secondary" }}
                        >
                          Updated {formatDate(doc.updated_at)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box className="document-list-actions">
                      <IconButton
                        size="small"
                        onClick={(event) => handleToggleFavorite(event, doc.id)}
                      >
                        {doc.favorite ? (
                          <Star size={20} fill="#FACC15" color="#FACC15" />
                        ) : (
                          <Star size={20} fill="white" color="grey" />
                        )}
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuOpen(event, doc)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Divider />
                </Box>
              ))}
            </Box>
          )}

          <Menu
            anchorEl={menuAnchor}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {/* <MenuItem
        onClick={() => {
            navigate(`/doc/${selectedDocument.id}`);
            handleMenuClose();
        }}
    >
        <ListItemIcon>
            <OpenInNewIcon fontSize="small" />
        </ListItemIcon>

        <ListItemText>
            Open
        </ListItemText>
    </MenuItem> */}

            <MenuItem onClick={handleRenameStart}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>

              <ListItemText>Rename</ListItemText>
            </MenuItem>

            {/* <MenuItem
        onClick={() => {
            if (selectedDocument) {
                dispatch(toggleFavorite(selectedDocument.id));
            }

            handleMenuClose();
        }}
    >
        <ListItemIcon>
            {selectedDocument?.favorite ? (
                <StarIcon fontSize="small" />
            ) : (
                <StarOutlineIcon fontSize="small" />
            )}
        </ListItemIcon>

        <ListItemText>
            {selectedDocument?.favorite
                ? "Remove from favorites"
                : "Add to favorites"}
        </ListItemText>
    </MenuItem> */}

            <Divider />

            <MenuItem onClick={handleDeleteStart}>
              <ListItemIcon>
                <DeleteOutlineOutlined fontSize="small" />
                {/* <DeleteOutlineIcon fontSize="small" /> */}
              </ListItemIcon>

              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
          <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
            <DialogTitle>Delete document?</DialogTitle>

            <DialogContent>
              Are you sure you want to delete{" "}
              <strong>{selectedDocument?.title}</strong>? This action cannot be
              undone.
            </DialogContent>

            <DialogActions>
              <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
                Cancel
              </Button>

              <Button
                onClick={handleDeleteConfirm}
                color="error"
                variant="contained"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
};

const formatDate = (value) => {
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(value)) / 60000),
  );
  if (minutes < 60) return `${minutes || 1}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
};

export default Documents;
