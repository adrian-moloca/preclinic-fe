import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
} from "@mui/material";
import { FC } from "react";
import { Person, CalendarMonth } from '@mui/icons-material';

interface EmployeeInformationCardProps {
  formData: {
    employee: string;
    date: string;
  };
  errors: Record<string, string>;
  employeeOptions: Array<{
    id: string;
    name: string;
    type: string;
    department: string;
  }>;
  onInputChange: (field: keyof { employee: string; date: string }) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => void;
}

export const EmployeeInformationCard: FC<EmployeeInformationCardProps> = ({
  formData,
  errors,
  employeeOptions,
  onInputChange
}) => {
  return (
    <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Person sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Employee Information
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid>
            <FormControl fullWidth required error={!!errors.employee} sx={{ width: "400px" }}>
              <InputLabel>Select Employee</InputLabel>
              <Select
                value={formData.employee}
                onChange={onInputChange('employee')}
                label="Select Employee"
              >
                {employeeOptions.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        {employee.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {employee.type} - {employee.department}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.employee && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                  {errors.employee}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="Payroll Date"
              type="date"
              value={formData.date}
              onChange={onInputChange('date')}
              error={!!errors.date}
              helperText={errors.date}
              sx={{ width: "400px" }}
              required
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: <InputAdornment position="end"><CalendarMonth /></InputAdornment>,
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};