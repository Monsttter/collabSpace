import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";

import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchVersions,
  createVersion,
  fetchVersion,
  restoreVersion,
} from "../../../../store/versions/versionThunks";

import { clearSelectedVersion } from "../../../../store/versions/versionSlice";
import { useParams } from "react-router";
import VersionPreviewDialog from "./VersionPreviewDialog";
import VersionCard from "./VersionCard";
import { clearPendingSelection, closeDrawer } from "../../../../store/ui/uiSlice";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function getDateLabel(date) {
  const target = new Date(date);

  const now = new Date();

  const yesterday = new Date();

  yesterday.setDate(now.getDate() - 1);

  const targetDate = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );

  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const yesterdayDate = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
  );

  if (targetDate.getTime() === todayDate.getTime()) {
    return "Today";
  }

  if (targetDate.getTime() === yesterdayDate.getTime()) {
    return "Yesterday";
  }

  return target.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function groupVersions(versions) {
  const groups = {};

  versions.forEach((version) => {
    const label = getDateLabel(version.created_at);

    if (!groups[label]) {
      groups[label] = [];
    }

    groups[label].push(version);
  });

  return groups;
}

export default function VersionHistory() {

  const { id: documentId } = useParams();
  const [previewVersion, setPreviewVersion] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [restoreVersionTarget, setRestoreVersionTarget] = useState(null);
  const [createBackup, setCreateBackup] = useState(true);
  const [createVersionOpen, setCreateVersionOpen] = useState(false);
  const [versionDescription, setVersionDescription] = useState("");
  const [creatingVersion, setCreatingVersion] = useState(false);
  
  const currentDocument = useSelector((state) => state.documents.currentDocument);
  
  const handleRestoreRequest = (version) => {
    setRestoreVersionTarget(version);
    setCreateBackup(true);
  };

  const handleClose= ()=>{
          dispatch(closeDrawer());
          dispatch(clearPendingSelection());
      }

  const dispatch = useDispatch();

  const {
    versions = [],

    loading = false,

    creating = false,
  } = useSelector((state) => state.versions || {});

  /*
    |--------------------------------------------------------------------------
    | Load versions
    |--------------------------------------------------------------------------
    */

  useEffect(() => {
    if (!documentId) {
      return;
    }

    dispatch(fetchVersions(documentId));

    dispatch(clearSelectedVersion());
  }, [documentId, dispatch]);

  /*
    |--------------------------------------------------------------------------
    | Group versions
    |--------------------------------------------------------------------------
    */

  const groupedVersions = useMemo(() => groupVersions(versions), [versions]);

  /*
    |--------------------------------------------------------------------------
    | Create version
    |--------------------------------------------------------------------------
    */
  const handleCreateVersionClick = () => {
    setVersionDescription("");

    setCreateVersionOpen(true);
  };

  const handleCreateVersion = async () => {
    const description = versionDescription.trim();

    if (!description || creatingVersion) {
      return;
    }

    try {
        setCreatingVersion(true);
      await dispatch(
        createVersion({
          documentId,
          description,
        }),
      ).unwrap();

      setCreateVersionOpen(false);

      setVersionDescription("");
    } catch (error) {
      console.error("Failed to create version:", error);
    } finally {
        setCreatingVersion(false);
    }
  };

  const handlePreview = async (version) => {
    try {
      const result = await dispatch(
        fetchVersion({
          documentId,
          versionNumber: version.version_number,
        }),
      ).unwrap();

      setPreviewVersion(result);
      setPreviewOpen(true);
    } catch (error) {
      console.error("Failed to load version:", error);
    }
  };

  const handleRestore = async () => {
    if (!restoreVersionTarget) {
      return;
    }

    try {
      await dispatch(
        restoreVersion({
          documentId,
          versionNumber: restoreVersionTarget.version_number,
          createBackup,
        }),
      ).unwrap();

      setRestoreVersionTarget(null);
      setPreviewOpen(false);
      setPreviewVersion(null);
    } catch (error) {
      console.error("Restore failed:", error);
    }
  };

  /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

  return (
    <Box
      sx={{
        height: "100%",

        minHeight: 0,

        display: "flex",

        flexDirection: "column",

        backgroundColor: "#FFFFFF",
      }}
    >
      {/* ========================================================== */}
      {/* HEADER */}
      {/* ========================================================== */}

      <Box
        sx={{
          flexShrink: 0,

          px: 2,

          pt: 2,

          pb: 1,
        }}
      >
        {/* Title row */}

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: 1.2,
            }}
          >
            <HistoryOutlinedIcon
              sx={{
                fontSize: 25,

                color: "#4B35C5",
              }}
            />

            <Typography
              sx={{
                fontSize: 18,

                fontWeight: 600,

                color: "#111111",
              }}
            >
              Version history
            </Typography>
          </Box>

          {/* Close */}

          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: "#666666",

              width: 36,
              height: 36,

              "&:hover": {
                backgroundColor: "#F4F4F5",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Subtitle */}

        <Typography
          sx={{
            mt: 1.1,

            fontSize: 13,

            lineHeight: 1.5,

            color: "text.secondary",
          }}
        >
          Browse and restore previous versions of this document.
        </Typography>

        {/* Create version */}

        {(currentDocument?.role === "owner" || currentDocument?.role === "editor") && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            disabled={creating}
            onClick={handleCreateVersionClick}
            sx={{
              mt: 1.5,

              height: 35,

              px: 1.25,

              borderRadius: 1.5,

              textTransform: "none",

              fontSize: 14,

              fontWeight: 600,

              color: "#4935C6",

              borderColor: "#9B8DFF",

              "&:hover": {
                borderColor: "#6F5BEB",

                backgroundColor: "#F8F6FF",
              },
            }}
          >
            {creating ? "Creating..." : "Create version"}
          </Button>
        )}
      </Box>

      <Divider />

      {/* ========================================================== */}
      {/* SCROLLABLE VERSION LIST */}
      {/* ========================================================== */}

      <Box
        sx={{
          flex: 1,

          minHeight: 0,

          overflowY: "auto",

          px: 2,

          py: 2,

          /*
           * Nice scrollbar
           */

          "&::-webkit-scrollbar": {
            width: 7,
          },

          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#CFCFCF",

            borderRadius: 10,
          },

          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        }}
      >
        {loading && (
          <Box
            sx={{
              height: 200,

              display: "flex",

              alignItems: "center",

              justifyContent: "center",
            }}
          >
            <CircularProgress
              size={26}
              sx={{
                color: "#5842D5",
              }}
            />
          </Box>
        )}

        {!loading && versions.length === 0 && (
          <Box
            sx={{
              py: 8,

              textAlign: "center",
            }}
          >
            <HistoryOutlinedIcon
              sx={{
                fontSize: 42,

                color: "#C7C7C7",

                mb: 1,
              }}
            />

            <Typography
              fontWeight={600}
              sx={{
                color: "#444",
              }}
            >
              No versions yet
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
              }}
            >
              Create a version to preserve the current document state.
            </Typography>
          </Box>
        )}

        {!loading &&
          Object.entries(groupedVersions).map(([dateLabel, dateVersions]) => (
            <Box
              key={dateLabel}
              sx={{
                mb: 2,
              }}
            >
              {/* Date */}

              <Typography
                sx={{
                  fontSize: 14,

                  fontWeight: 600,

                  color: "#666666",

                  mb: 1,
                }}
              >
                {dateLabel}
              </Typography>

              {/* Versions */}

              {dateVersions.map((version, index) => (
                <VersionCard
                  key={version.id}
                  version={version}
                  index={index}
                  isCurrent={version.is_current === true}
                  onPreview={handlePreview}
                />
              ))}
            </Box>
          ))}
      </Box>

      {/* ========================================================== */}
      {/* FOOTER */}
      {/* ========================================================== */}

      <Box
        sx={{
          flexShrink: 0,

          px: 2.5,

          py: 1.5,

          borderTop: "1px solid #EEEEEE",

          display: "flex",

          alignItems: "center",

          gap: 0.75,
        }}
      >
        <LockOutlinedIcon
          sx={{
            fontSize: 17,

            color: "#777777",
          }}
        />

        <Typography
          sx={{
            fontSize: 12.5,

            color: "#777777",
          }}
        >
          Only document owners and editors can create new versions.
        </Typography>
      </Box>

      <Dialog
        open={createVersionOpen}
        onClose={() => setCreateVersionOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create version</DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Save the current state of this document as a version you can restore
            later.
          </Typography>

          <TextField
            autoFocus
            fullWidth
            label="Version description"
            placeholder="e.g. Completed dashboard UI"
            value={versionDescription}
            onChange={(event) => setVersionDescription(event.target.value)}
            multiline
            minRows={2}
            inputProps={{
              maxLength: 200,
            }}
            helperText={`${versionDescription.length}/200`}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setCreateVersionOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            disabled={creatingVersion || !versionDescription.trim()}
            onClick={handleCreateVersion}
          >
            {creatingVersion
                ? "Creating..."
                : "Create version"}
          </Button>
        </DialogActions>
      </Dialog>

      <VersionPreviewDialog
        open={previewOpen}
        version={previewVersion}
        onClose={() => {
          setPreviewOpen(false);
          setPreviewVersion(null);
        }}
        onRestore={handleRestoreRequest}
      />

      <Dialog
        open={Boolean(restoreVersionTarget)}
        onClose={() => setRestoreVersionTarget(null)}
      >
        <DialogTitle>
          Restore Version {restoreVersionTarget?.version_number}?
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This will replace the current document with the selected version.
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={createBackup}
                onChange={(e) => setCreateBackup(e.target.checked)}
              />
            }
            label="Create a version of the current document before restoring"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setRestoreVersionTarget(null)}>Cancel</Button>

          <Button variant="contained" color="warning" onClick={handleRestore}>
            Restore
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
