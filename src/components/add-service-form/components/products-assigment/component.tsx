import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Chip,
  Autocomplete,
  Grid
} from "@mui/material";
import { Inventory } from '@mui/icons-material';

interface ProductOption {
  id: string;
  label: string;
  price: number;
  category: string;
}

interface ServiceProductsAssignmentProps {
  productOptions: ProductOption[];
  selectedProducts: ProductOption[];
  totalProductsCost: number;
  onProductsChange: (event: any, newValue: any[]) => void;
}

export const ServiceProductsAssignment: React.FC<ServiceProductsAssignmentProps> = ({
  productOptions,
  selectedProducts,
  totalProductsCost,
  onProductsChange
}) => {
  return (
    <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Inventory sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Required Products (Optional)
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid>
            <Autocomplete
              multiple
              options={productOptions}
              value={selectedProducts}
              onChange={onProductsChange}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Products"
                  placeholder="Search and select products needed for this service..."
                  sx={{ width: 620 }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box>
                    <Typography variant="body2">{option.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ${option.price} • Category: {option.category}
                    </Typography>
                  </Box>
                </li>
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    label={`${option.label} ($${option.price})`}
                    {...getTagProps({ index })}
                    key={option.id}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                ))
              }
            />
            {selectedProducts.length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected • Total cost: ${totalProductsCost}
              </Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};