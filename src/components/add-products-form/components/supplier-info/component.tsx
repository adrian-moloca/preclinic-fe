import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField
} from "@mui/material";

interface SupplierInfoProps {
  formData: {
    supplierInfo?: {
      name?: string;
      contactNumber?: string;
      email?: string;
      address?: string;
    };
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: any) => void;
}

export const SupplierInfo: React.FC<SupplierInfoProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Supplier Information
        </Typography>

        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Grid>
            <Typography>Supplier Name</Typography>
            <TextField
              fullWidth
              value={formData.supplierInfo?.name}
              onChange={(e) => onInputChange('supplier.name', e.target.value)}
              error={!!errors.supplierName}
              helperText={errors.supplierName}
              required
              sx={{ width: 250 }}
            />
          </Grid>

          <Grid>
            <Typography>Contact Number</Typography>
            <TextField
              fullWidth
              value={formData.supplierInfo?.contactNumber}
              onChange={(e) => onInputChange('supplier.contactNumber', e.target.value)}
              error={!!errors.supplierContact}
              helperText={errors.supplierContact}
              required
              sx={{ width: 250 }}
            />
          </Grid>

          <Grid>
            <Typography>Email</Typography>
            <TextField
              fullWidth
              type="email"
              value={formData.supplierInfo?.email}
              onChange={(e) => onInputChange('supplier.email', e.target.value)}
              error={!!errors.supplierEmail}
              helperText={errors.supplierEmail}
              sx={{ width: 250 }}
            />
          </Grid>

          <Grid>
            <Typography>Address</Typography>
            <TextField
              fullWidth
              value={formData.supplierInfo?.address}
              onChange={(e) => onInputChange('supplier.address', e.target.value)}
              sx={{ width: 250 }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};