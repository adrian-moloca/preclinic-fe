import React from 'react';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface PageHeaderProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  onEdit,
  onDelete
}) => {
  return (
    <Box mb={3} display="flex" alignItems="center" justifyContent="space-between">
      <Typography variant="h4" fontWeight={600}>
        Department Details
      </Typography>
      <Box display="flex" gap={2}>
        <Tooltip title="Edit Department">
          <Button
            variant="outlined"
            onClick={onEdit}
            startIcon={<EditIcon />}
            sx={{ minWidth: 120 }}
          >
            Edit
          </Button>
        </Tooltip>
        <Tooltip title="Delete Department">
          <Button
            variant="outlined"
            color="error"
            onClick={onDelete}
            startIcon={<DeleteIcon />}
            sx={{ minWidth: 120 }}
          >
            Delete
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};