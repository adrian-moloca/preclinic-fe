import React from 'react';
import { Box, Paper, Typography, Button } from "@mui/material";
import { ErrorOutline } from '@mui/icons-material';

interface DepartmentNotFoundProps {
  id?: string;
  onBackClick: () => void;
}

export const DepartmentNotFound: React.FC<DepartmentNotFoundProps> = ({
  id,
  onBackClick
}) => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" color="error" mb={2}>
          Department Not Found
        </Typography>
        <Typography color="text.secondary" mb={3}>
          {id 
            ? `The department with ID "${id}" could not be found.`
            : 'The requested department could not be found.'
          }
        </Typography>
        <Button variant="contained" onClick={onBackClick} size="large">
          Back to All Departments
        </Button>
      </Paper>
    </Box>
  );
};