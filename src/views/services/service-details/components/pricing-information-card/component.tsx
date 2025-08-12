import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import { FC } from "react";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { MedicalProduct } from "../../../../../providers/products/types";

interface PricingInformationCardProps {
  servicePrice: number;
  serviceProducts: MedicalProduct[];
  totalCost: number;
}

export const PricingInformationCard: FC<PricingInformationCardProps> = ({
  servicePrice,
  serviceProducts,
  totalCost
}) => {
  const productsCost = serviceProducts.reduce((total, product) => total + (product?.unitPrice || 0), 0);

  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <AttachMoneyIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Pricing Information
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Grid>
            <Typography variant="subtitle2" color="text.secondary">
              Base Service Price
            </Typography>
            <Typography variant="h5" fontWeight={600} color="primary.main">
              ${servicePrice.toFixed(2)}
            </Typography>
          </Grid>

          {serviceProducts.length > 0 && (
            <Grid>
              <Typography variant="subtitle2" color="text.secondary">
                Products Cost
              </Typography>
              <Typography variant="h5" fontWeight={600} color="secondary.main">
                ${productsCost.toFixed(2)}
              </Typography>
            </Grid>
          )}

          <Grid>
            <Typography variant="subtitle2" color="text.secondary">
              Total Service Cost
            </Typography>
            <Typography variant="h4" fontWeight={700} color="success.main">
              ${totalCost.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};