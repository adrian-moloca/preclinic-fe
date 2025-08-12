import React from 'react';
import { Box, Button } from "@mui/material";

interface EditServiceFormActionsProps {
  isFormValid: boolean;
  onCancel: () => void;
  onReset: () => void;
}

export const EditServiceFormActions: React.FC<EditServiceFormActionsProps> = ({
  isFormValid,
  onCancel,
  onReset
}) => {
  return (
    <Box display="flex" justifyContent="center" gap={3} mt={6}>
      <Button
        variant="outlined"
        size="large"
        onClick={onCancel}
        sx={{ 
          minWidth: 150,
          py: 1.5
        }}
      >
        Cancel
      </Button>

      <Button
        variant="outlined"
        size="large"
        onClick={onReset}
        sx={{ 
          minWidth: 150,
          py: 1.5
        }}
      >
        Reset Changes
      </Button>

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={!isFormValid}
        sx={{ 
          minWidth: 150,
          py: 1.5,
          '&.Mui-disabled': {
            backgroundColor: 'grey.300',
            color: 'grey.500',
            opacity: 0.6
          },
          '&:not(.Mui-disabled)': {
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }
        }}
      >
        {isFormValid ? 'Update Service' : 'Complete Required Fields'}
      </Button>
    </Box>
  );
};