import React from 'react';
import { Box, Typography, CircularProgress } from "@mui/material";

export const LoadingState: React.FC = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <CircularProgress />
      <Typography variant="h6" sx={{ ml: 2 }}>
        Loading product data...
      </Typography>
    </Box>
  );
};