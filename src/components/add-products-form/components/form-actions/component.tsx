import React from 'react';
import { Box, Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface ProductFormActionsProps {
  onSave: () => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  onClear: () => void;
  isFormValid: boolean;
}

export const ProductFormActions: React.FC<ProductFormActionsProps> = ({
  onSave,
  onCancel,
  isSubmitting
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
      {onCancel && (
        <Button
          variant="outlined"
          size="large"
          startIcon={<CancelIcon />}
          onClick={onCancel}
          disabled={isSubmitting}
          sx={{ px: 4 }}
        >
          Cancel
        </Button>
      )}
      <Button
        variant="contained"
        size="large"
        startIcon={<SaveIcon />}
        onClick={onSave}
        disabled={isSubmitting}
        sx={{ px: 4 }}
      >
        {isSubmitting ? 'Creating...' : 'Create Product'}
      </Button>
    </Box>
  );
};
