import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField
} from "@mui/material";

interface AdditionalInfoProps {
  formData: {
    description?: string;
    storageConditions?: string;
  };
  onInputChange: (field: string, value: any) => void;
}

export const AdditionalInfo: React.FC<AdditionalInfoProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <Card sx={{ mb: 4, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Additional Information
        </Typography>

        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Grid>
            <Typography>Description</Typography>
            <TextField
              fullWidth
              rows={3}
              value={formData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              placeholder="Enter product description, usage instructions, etc."
              sx={{ width: 550 }}
            />
          </Grid>

          <Grid>
            <Typography>Storage Conditions</Typography>
            <TextField
              fullWidth
              value={formData.storageConditions}
              onChange={(e) => onInputChange('storageConditions', e.target.value)}
              placeholder="e.g., Store in cool, dry place. Temperature: 15-25°C"
              sx={{ width: 550 }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};