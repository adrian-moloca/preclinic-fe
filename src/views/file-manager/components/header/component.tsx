import React from "react";
import { Box, Typography } from "@mui/material";

export function FileManagerHeader() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
        Enhanced File Manager
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Advanced file organization with patient linking, smart categorization, and collaboration tools
      </Typography>
    </Box>
  );
}