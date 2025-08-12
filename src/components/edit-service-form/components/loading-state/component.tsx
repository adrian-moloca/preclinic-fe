import React from 'react';
import { Box, Paper, Typography, CircularProgress } from "@mui/material";

export const LoadingState: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6">
          Loading service data...
        </Typography>
      </Paper>
    </Box>
  );
};