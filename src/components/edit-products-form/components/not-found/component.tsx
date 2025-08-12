import React from 'react';
import { Box, Button, Alert } from "@mui/material";

interface ProductNotFoundProps {
  onBackClick: () => void;
}

export const ProductNotFound: React.FC<ProductNotFoundProps> = ({
  onBackClick
}) => {
  return (
    <Box p={3}>
      <Alert severity="error" sx={{ mb: 3 }}>
        Product not found. The product may have been deleted or the ID is invalid.
      </Alert>
      <Button variant="contained" onClick={onBackClick}>
        Back to Products
      </Button>
    </Box>
  );
};