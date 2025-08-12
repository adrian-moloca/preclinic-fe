import React from 'react';
import {
  Box,
  Button
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';

interface ProductFormActionsProps {
  isSubmitting: boolean;
  isFormValid: boolean;
  onClear: () => void;
  onSubmit: () => void;
}

export const ProductFormActions: React.FC<ProductFormActionsProps> = ({
  isSubmitting,
  isFormValid,
  onClear,
  onSubmit
}) => {
  return (
    <Box display="flex" gap={2} justifyContent="flex-end">
      <Button
        variant="outlined"
        onClick={onClear}
        startIcon={<ClearIcon />}
        disabled={isSubmitting}
        sx={{ minWidth: 120 }}
      >
        Clear
      </Button>
      <Button
        variant="contained"
        onClick={onSubmit}
        disabled={isSubmitting || !isFormValid}
        sx={{
          minWidth: 150,
          opacity: (!isFormValid || isSubmitting) ? 0.6 : 1
        }}
      >
        {isSubmitting ? 'Adding Product...' : 'Add Product'}
      </Button>
    </Box>
  );
};