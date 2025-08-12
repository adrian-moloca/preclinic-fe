import React from 'react';
import { Box, Button } from "@mui/material";

interface EditDepartmentFormActionsProps {
  isFormValid: boolean;
  onCancel: () => void;
  onReset: () => void;
}

export const EditDepartmentFormActions: React.FC<EditDepartmentFormActionsProps> = ({
  isFormValid,
  onCancel,
  onReset
}) => {
  return (
    <Box display="flex" justifyContent="center" gap={3} mt={4}>
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
        {isFormValid ? 'Update Department' : 'Complete Required Fields'}
      </Button>
    </Box>
  );
};