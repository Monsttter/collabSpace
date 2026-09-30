import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  // Avatar,
  Tooltip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { Search, Plus, Moon, Sun, FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/ui/uiSlice";
import {
  addDocument,
  // setDocuments,
  setError,
  // setLoading,
} from "../store/documents/documentSlice";
import { useNavigate } from "react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { createDocument } from "../api/documents";

const Navbar = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.ui.themeMode);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("");
  const [creatingDocument, setCreatingDocument] = useState(false);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  const documents = useSelector((state) => state.documents.documents);

  const searchResults = (searchQuery.trim() && documents)
    ? documents
        .filter((doc) =>
          doc.title?.toLowerCase().includes(searchQuery.trim().toLowerCase()),
        )
        .slice(0, 5)
    : [];

  const handleDocumentSelect = (documentId) => {
    navigate(`/editor/${documentId}`);
    setSearchQuery("");
    setSearchFocused(false);
    setSelectedIndex(-1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateDocument = useCallback(async () => {
    const title = documentTitle.trim();

    if (!title || creatingDocument) return;

    try {
      setCreatingDocument(true);

      const response = await createDocument(title);

      if (!response?.success) {
        throw new Error("Unable to create document");
      }

      dispatch(addDocument(response.data));

      setCreateModalOpen(false);
      setDocumentTitle("");

      navigate(`/editor/${response.data.id}`);
    } catch {
      dispatch(
        setError("We couldn't create a new document. Please try again."),
      );
    } finally {
      setCreatingDocument(false);
    }
  }, [documentTitle, creatingDocument, dispatch, navigate]);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(18,26,46,0.86)"
            : "rgba(255,255,255,0.86)",
        backdropFilter: "blur(12px)",
        borderBottom: 1,
        borderColor: "divider",
        color: "text.primary",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px !important",
          display: "flex",
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        {/* Left */}
        {/* <Box>
          <Typography variant="h5" fontWeight={700}>
            Dashboard
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Continue collaborating with your team.
          </Typography>
        </Box> */}

        <Box
          ref={searchRef}
          sx={{
            position: "relative",
            width: 280,
          }}
        >
          <TextField
            size="small"
            placeholder="Search documents..."
            value={searchQuery || ""}
            onChange={(event) => setSearchQuery(event.target.value)}
            onFocus={() => setSearchFocused(true)}
            onKeyDown={(event) => {
              if (!searchFocused || searchResults.length === 0) {
                if (event.key === "Escape") {
                  setSearchFocused(false);
                }

                return;
              }

              if (event.key === "ArrowDown") {
                event.preventDefault();

                setSelectedIndex((prev) =>
                  prev < searchResults.length - 1 ? prev + 1 : 0,
                );
              }

              if (event.key === "ArrowUp") {
                event.preventDefault();

                setSelectedIndex((prev) =>
                  prev > 0 ? prev - 1 : searchResults.length - 1,
                );
              }

              if (event.key === "Enter") {
                event.preventDefault();

                if (selectedIndex >= 0) {
                  handleDocumentSelect(searchResults[selectedIndex].id);
                }
              }

              if (event.key === "Escape") {
                event.preventDefault();
                setSearchFocused(false);
                setSelectedIndex(-1);
              }
            }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}

            slotProps={{
              input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} />
                    </InputAdornment>
                  )
                }
            }}
          />

          {searchFocused && searchQuery.trim() && (
            <Paper
              elevation={4}
              sx={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                width: "100%",
                maxHeight: 320,
                overflowY: "auto",
                zIndex: 1300,
                borderRadius: 1,
              }}
            >
              {searchResults.length > 0 ? (
                searchResults.map((doc, index) => (
                  <Box
                    key={doc.id}
                    onClick={() => handleDocumentSelect(doc.id)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      px: 2,
                      py: 1.25,
                      cursor: "pointer",

                      backgroundColor:
                        selectedIndex === index
                          ? "action.hover"
                          : "transparent",

                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <FileText size={15} color="grey" />

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          fontWeight: 500,
                        }}
                      >
                        {doc.title}
                      </Typography>

                      {/* <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Edited{" "}
                                {formatDate(doc.updated_at)}
                            </Typography> */}
                    </Box>
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    px: 2,
                    py: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No documents found
                  </Typography>
                </Box>
              )}
            </Paper>
          )}
        </Box>

        {/* Right */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => {
              setDocumentTitle("");
              setCreateModalOpen(true);
            }}
            sx={{
              borderRadius: 3,
              px: 2.5,
              py: 1,
            }}
          >
            New Document
          </Button>

          <Tooltip
            title={`Switch to ${themeMode === "dark" ? "light" : "dark"} mode`}
          >
            <IconButton onClick={() => dispatch(toggleTheme())} color="inherit">
              {themeMode === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </IconButton>
          </Tooltip>

          {/* <Tooltip title="Notifications">
          <IconButton>
            <Bell size={20} />
          </IconButton>
          </Tooltip> */}

          {/* <Avatar
            sx={{
              bgcolor: "primary.main",
              cursor: "pointer",
            }}
          >
            {initial.toUpperCase()}
          </Avatar> */}
        </Box>
      </Toolbar>
      <Dialog
        open={createModalOpen}
        onClose={() => {
          if (!creatingDocument) {
            setCreateModalOpen(false);
          }
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Create new document</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Document title"
            placeholder="Enter document title"
            value={documentTitle}
            onChange={(event) => setDocumentTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleCreateDocument();
              }
            }}
            margin="dense"
            disabled={creatingDocument}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setCreateModalOpen(false);
              setDocumentTitle("");
            }}
            disabled={creatingDocument}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateDocument}
            disabled={!documentTitle.trim() || creatingDocument}
          >
            {creatingDocument ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Navbar;
