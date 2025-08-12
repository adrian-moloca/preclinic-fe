import React from 'react';
import { Box, Paper, Typography, CircularProgress } from "@mui/material";

export const LoadingState: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <CircularProgress size={48} sx={{ mb: 2 }} />
        <Typography variant="h5" mb={2}>
          Loading Department Data...
        </Typography>
        <Typography color="text.secondary">
          Please wait while we fetch the department information.
        </Typography>
      </Paper>
    </Box>
  );
};