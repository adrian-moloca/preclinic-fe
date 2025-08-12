import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  Divider,
} from "@mui/material";
import { FC } from "react";
import { TrendingUp } from '@mui/icons-material';

interface EarningsCardProps {
  formData: {
    basicSalary: string | number;
    da: string | number;
    hra: string | number;
    conveyance: string | number;
    medicalAllowance: string | number;
    otherEarnings: string | number;
  };
  errors: Record<string, string>;
  totalEarnings: number;
  onInputChange: (field: keyof {
    basicSalary: string | number;
    da: string | number;
    hra: string | number;
    conveyance: string | number;
    medicalAllowance: string | number;
    otherEarnings: string | number;
  }) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => void;
}

export const EarningsCard: FC<EarningsCardProps> = ({
  formData,
  errors,
  totalEarnings,
  onInputChange
}) => {
  return (
    <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
          <Typography variant="h6" fontWeight={600} color="success.main">
            Earnings
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid>
            <TextField
              fullWidth
              label="Basic Salary"
              type="number"
              value={formData.basicSalary}
              onChange={onInputChange('basicSalary')}
              error={!!errors.basicSalary}
              helperText={errors.basicSalary}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="Dearness Allowance (DA)"
              type="number"
              value={formData.da}
              onChange={onInputChange('da')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="House Rent Allowance (HRA)"
              type="number"
              value={formData.hra}
              onChange={onInputChange('hra')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="Conveyance Allowance"
              type="number"
              value={formData.conveyance}
              onChange={onInputChange('conveyance')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="Medical Allowance"
              type="number"
              value={formData.medicalAllowance}
              onChange={onInputChange('medicalAllowance')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="Other Earnings"
              type="number"
              value={formData.otherEarnings}
              onChange={onInputChange('otherEarnings')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600} color="success.main">
            Total Earnings:
          </Typography>
          <Typography variant="h6" fontWeight={700} color="success.main">
            ${totalEarnings.toFixed(2)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};