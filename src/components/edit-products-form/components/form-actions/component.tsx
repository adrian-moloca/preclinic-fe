import React from 'react';
import {
  Box,
  Button
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface EditProductFormActionsProps {
  isSubmitting: boolean;
  isValid: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export const EditProductFormActions: React.FC<EditProductFormActionsProps> = ({
  isSubmitting,
  isValid,
  onCancel,
  onSubmit
}) => {
  return (
    <Box display="flex" gap={2} justifyContent="flex-end" sx={{ mt: 4 }}>
      <Button
        variant="outlined"
        onClick={onCancel}
        startIcon={<CancelIcon />}
        disabled={isSubmitting}
        sx={{ minWidth: 120 }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={onSubmit}
        disabled={isSubmitting || !isValid}
        startIcon={<SaveIcon />}
        sx={{ 
          minWidth: 150,
          opacity: (!isValid || isSubmitting) ? 0.6 : 1
        }}
      >
        {isSubmitting ? 'Updating Product...' : 'Update Product'}
      </Button>
    </Box>
  );
};