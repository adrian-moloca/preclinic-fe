import React from 'react';
import { Box, Paper, Button, Alert } from "@mui/material";

interface ServiceNotFoundProps {
  onBackClick: () => void;
}

export const ServiceNotFound: React.FC<ServiceNotFoundProps> = ({
  onBackClick
}) => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Service not found. The service may have been deleted or the ID is invalid.
        </Alert>
        <Button variant="contained" onClick={onBackClick}>
          Back to Services
        </Button>
      </Paper>
    </Box>
  );
};