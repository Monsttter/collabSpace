import React from 'react'
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from 'react-router';

const AccessRevokedScreen = () => {
    const navigate= useNavigate();

  return (
    <Box
  sx={{
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <Box sx={{ textAlign: "center" }}>
    <Typography variant="h6">
      You no longer have access to this document
    </Typography>

    <Typography
      color="text.secondary"
      sx={{ mt: 1 }}
    >
      The document owner removed you as a collaborator.
    </Typography>

    <Button
      sx={{ mt: 2 }}
      onClick={() => navigate("/")}
    >
      Back to documents
    </Button>
  </Box>
</Box>
  )
}

export default AccessRevokedScreen
