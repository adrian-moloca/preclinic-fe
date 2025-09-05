import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Switch
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
  errors: Record<string, string>; 
  onInputChange: (field: string, value: any) => void;
}

export const MedicationDetails: React.FC<MedicationDetailsProps> = ({
  formData,
  errors, 
  onInputChange
}) => {
  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Medication Details
        </Typography>

        <Grid container spacing={3}>
          <Grid>
            <Typography variant="subtitle2" gutterBottom>
              Active Ingredient *
            </Typography>
            <TextField
              fullWidth
              value={formData.activeIngredient || ''}
              onChange={(e) => onInputChange('activeIngredient', e.target.value)}
              error={!!errors.activeIngredient}
              helperText={errors.activeIngredient || 'Main therapeutic ingredient'}
              required
              placeholder="e.g., Paracetamol"
            />
          </Grid>

          <Grid>
            <Typography variant="subtitle2" gutterBottom>
              Strength
            </Typography>
            <TextField
              fullWidth
              value={formData.strength || ''}
              onChange={(e) => onInputChange('strength', e.target.value)}
              error={!!errors.strength}
              helperText={errors.strength || 'Concentration or strength'}
              placeholder="e.g., 500mg, 10ml"
            />
          </Grid>

          <Grid>
            <Typography variant="subtitle2" gutterBottom>
              Dosage Form *
            </Typography>
            <FormControl fullWidth error={!!errors.dosageForm}>
              <Select
                value={formData.dosageForm || 'tablet'}
                onChange={(e) => onInputChange('dosageForm', e.target.value)}
                displayEmpty
              >
                {dosageForms.map((form) => (
                  <MenuItem key={form} value={form}>
                    {form.charAt(0).toUpperCase() + form.slice(1)}
                  </MenuItem>
                ))}
              </Select>
              {errors.dosageForm && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                  {errors.dosageForm}
                </Typography>
              )}
            </FormControl>
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