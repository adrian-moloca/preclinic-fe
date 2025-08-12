import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Paper,
} from "@mui/material";
import { FC } from "react";
import InventoryIcon from '@mui/icons-material/Inventory';
import { MedicalProduct } from "../../../../../providers/products/types";

interface RequiredProductsCardProps {
  serviceProducts: MedicalProduct[];
}

export const RequiredProductsCard: FC<RequiredProductsCardProps> = ({
  serviceProducts
}) => {
  if (serviceProducts.length === 0) return null;

  return (
    <Card sx={{ mb: 3, boxShadow: 2, height: '350px' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <InventoryIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Required Products ({serviceProducts.length})
          </Typography>
        </Box>
        
        <Grid container spacing={2} sx={{ height: "100%", padding: 2 }}>
          {serviceProducts.map((product, index) => (
            <Grid key={product?.id || index}>
              <Paper elevation={1} sx={{ p: 2, height: '100%', width: "200px" }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {product?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product?.category} • {product?.manufacturer}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Batch: {product?.batchNumber}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Available: {product?.quantity} {product?.unit}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Typography variant="h6" color="primary.main" fontWeight={600}>
                    ${product?.unitPrice.toFixed(2)}
                  </Typography>
                  <Chip 
                    label={product?.status.replace('_', ' ').toUpperCase()}
                    size="small"
                    color={product?.status === 'active' ? 'success' : 'default'}
                  />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};