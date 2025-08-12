import React from 'react';
import { Box, Button } from "@mui/material";

interface ServiceFormActionsProps {
  isFormValid: boolean;
  onCancel: () => void;
}

export const ServiceFormActions: React.FC<ServiceFormActionsProps> = ({
  isFormValid,
  onCancel
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
        {isFormValid ? 'Create Service' : 'Complete Required Fields'}
      </Button>
    </Box>
  );
};