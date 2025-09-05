import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Switch
} from "@mui/material";

interface AdditionalInfoProps {
  formData: {
    description?: string;
    storageConditions?: string;
    prescriptionRequired?: boolean;
    barcode?: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: any) => void;
}

export const AdditionalInfo: React.FC<AdditionalInfoProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Additional Information
        </Typography>

        <Grid container spacing={3}>
          <Grid>
            <Typography variant="subtitle2" gutterBottom>
              Description
            </Typography>
            <TextField
              fullWidth
              rows={3}
              value={formData.description || ''}
              onChange={(e) => onInputChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description || 'Detailed product description'}
              placeholder="Enter product description..."
            />
          </Grid>

          <Grid>
            <Typography variant="subtitle2" gutterBottom>
              Storage Conditions
            </Typography>
            <TextField
              fullWidth
              value={formData.storageConditions || ''}
              onChange={(e) => onInputChange('storageConditions', e.target.value)}
              error={!!errors.storageConditions}
              helperText={errors.storageConditions || 'How should this product be stored?'}
              placeholder="e.g., Store in cool, dry place"
            />
          </Grid>

          <Grid>
            <Typography variant="subtitle2" gutterBottom>
              Barcode (Optional)
            </Typography>
            <TextField
              fullWidth
              value={formData.barcode || ''}
              onChange={(e) => onInputChange('barcode', e.target.value)}
              error={!!errors.barcode}
              helperText={errors.barcode || 'Product barcode for scanning'}
              placeholder="Scan or enter barcode"
            />
          </Grid>

          <Grid>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.prescriptionRequired || false}
                  onChange={(e) => onInputChange('prescriptionRequired', e.target.checked)}
                />
              }
              label="Prescription Required"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
