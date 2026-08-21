import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import RestoreIcon from "@mui/icons-material/Restore";

import VersionPreviewEditor from "./VersionPreviewEditor";

export default function VersionPreviewDialog({
  open,
  version,
  onClose,
  onRestore,
}) {
  if (!version) {
    return null;
  }

  const versionNumber = version.version_number;

  const description =
    version.description || "No description";

  const authorName =
    version.created_by_name ||
    version.author_name ||
    "Unknown user";

  const createdAt = version.created_at
    ? new Date(version.created_at).toLocaleString()
    : "";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      PaperProps={{
        sx: {
          height: "85vh",
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      {/* -------------------------------------------------- */}
      {/* Header */}
      {/* -------------------------------------------------- */}

      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 0.5,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={600}
            >
              Version {versionNumber}
            </Typography>
          </Box>

          <Typography
            variant="h6"
            fontWeight={700}
          >
            {description}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {authorName}
            {createdAt && ` · ${createdAt}`}
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close preview"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box
  sx={{
    px: 3,
    py: 1,
    bgcolor: "action.hover",
    borderBottom: 1,
    borderColor: "divider",
  }}
>
  <Typography
    variant="body2"
    color="text.secondary"
  >
    You are viewing a read-only snapshot of this
    document.
  </Typography>
</Box>

      <Divider />

      {/* -------------------------------------------------- */}
      {/* Preview */}
      {/* -------------------------------------------------- */}

      <DialogContent
        sx={{
          p: 0,
          bgcolor: "background.default",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            maxWidth: 900,
            minHeight: "100%",
            mx: "auto",
            my: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
            overflow: "hidden",
          }}
        >
          <VersionPreviewEditor
            snapshot={version.snapshot}
          />
        </Box>
      </DialogContent>

      <Divider />

      {/* -------------------------------------------------- */}
      {/* Footer */}
      {/* -------------------------------------------------- */}

      <DialogActions
        sx={{
          px: 3,
          py: 1.5,
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          color="inherit"
        >
          Close
        </Button>

        <Button
          variant="contained"
          startIcon={<RestoreIcon />}
          onClick={() => onRestore(version)}
        >
          Restore this version
        </Button>
      </DialogActions>
    </Dialog>
  );
}