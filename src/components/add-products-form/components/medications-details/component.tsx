import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
  Box
} from "@mui/material";
import { DosageForm } from '../../../../providers/products/types';

const dosageForms: DosageForm[] = [
  'tablet', 'capsule', 'syrup', 'injection', 'cream', 'ointment', 'drops', 'inhaler', 'patch', 'suppository'
];

interface MedicationDetailsProps {
  formData: {
    dosageForm?: DosageForm;
    activeIngredient?: string;
    strength?: string;
    prescriptionRequired?: boolean;
  };
  onInputChange: (field: string, value: any) => void;
}

export const MedicationDetails: React.FC<MedicationDetailsProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Medication Details
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Grid>
            <FormControl fullWidth sx={{ width: 250 }}>
              <Typography>Dosage Form</Typography>
              <Select
                value={formData.dosageForm}
                onChange={(e) => onInputChange('dosageForm', e.target.value)}
              >
                {dosageForms.map((form) => (
                  <MenuItem key={form} value={form}>
                    {form.charAt(0).toUpperCase() + form.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid>
            <Typography>Active Ingredient</Typography>
            <TextField
              fullWidth
              value={formData.activeIngredient}
              onChange={(e) => onInputChange('activeIngredient', e.target.value)}
              sx={{ width: 250 }}
            />
          </Grid>

          <Grid>
            <Typography>Strength</Typography>
            <TextField
              fullWidth
              value={formData.strength}
              onChange={(e) => onInputChange('strength', e.target.value)}
              placeholder="e.g., 500mg, 10ml"
              sx={{ width: 250 }}
            />
          </Grid>

          <Grid sx={{ width: 250 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.prescriptionRequired}
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