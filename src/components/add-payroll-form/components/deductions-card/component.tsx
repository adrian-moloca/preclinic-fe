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
import { TrendingDown } from '@mui/icons-material';

interface DeductionsCardProps {
  formData: {
    tds: string | number;
    pf: string | number;
    esi: string | number;
    profTax: string | number;
    labourWelfareFund: string | number;
    otherDeductions: string | number;
  };
  totalDeductions: number;
  onInputChange: (field: keyof {
    tds: string | number;
    pf: string | number;
    esi: string | number;
    profTax: string | number;
    labourWelfareFund: string | number;
    otherDeductions: string | number;
  }) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => void;
}

export const DeductionsCard: FC<DeductionsCardProps> = ({
  formData,
  totalDeductions,
  onInputChange
}) => {
  return (
    <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <TrendingDown sx={{ color: 'error.main', mr: 1 }} />
          <Typography variant="h6" fontWeight={600} color="error.main">
            Deductions
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ diplay: "flex", justifyContent: "center" }}>
          <Grid>
            <TextField
              fullWidth
              label="Tax Deducted at Source (TDS)"
              type="number"
              value={formData.tds}
              onChange={onInputChange('tds')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="Provident Fund (PF)"
              type="number"
              value={formData.pf}
              onChange={onInputChange('pf')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="Employee State Insurance (ESI)"
              type="number"
              value={formData.esi}
              onChange={onInputChange('esi')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="Professional Tax"
              type="number"
              value={formData.profTax}
              onChange={onInputChange('profTax')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="Labour Welfare Fund"
              type="number"
              value={formData.labourWelfareFund}
              onChange={onInputChange('labourWelfareFund')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="Other Deductions"
              type="number"
              value={formData.otherDeductions}
              onChange={onInputChange('otherDeductions')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600} color="error.main">
            Total Deductions:
          </Typography>
          <Typography variant="h6" fontWeight={700} color="error.main">
            ${totalDeductions.toFixed(2)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};