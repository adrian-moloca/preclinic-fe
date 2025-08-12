import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Chip,
  Autocomplete,
  Grid
} from "@mui/material";
import { Person } from '@mui/icons-material';

interface StaffOption {
  id: string;
  label: string;
  department: string;
  specialty?: string;
  experience?: string;
}

interface DepartmentStaffAssignmentProps {
  doctorOptions: StaffOption[];
  assistentOptions: StaffOption[];
  selectedDoctors: StaffOption[];
  selectedAssistents: StaffOption[];
  onDoctorsChange: (event: any, newValue: any[]) => void;
  onAssistentsChange: (event: any, newValue: any[]) => void;
}

export const DepartmentStaffAssignment: React.FC<DepartmentStaffAssignmentProps> = ({
  doctorOptions,
  assistentOptions,
  selectedDoctors,
  selectedAssistents,
  onDoctorsChange,
  onAssistentsChange
}) => {
  return (
    <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Person sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Staff Assignment
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid>
            <Autocomplete
              multiple
              options={doctorOptions}
              value={selectedDoctors}
              onChange={onDoctorsChange}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign Doctors"
                  placeholder="Search and select doctors..."
                  sx={{ width: 300 }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box>
                    <Typography variant="body2">{option.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.specialty} • Current: {option.department}
                    </Typography>
                  </Box>
                </li>
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    label={option.label}
                    {...getTagProps({ index })}
                    key={option.id}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))
              }
            />
            {selectedDoctors.length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {selectedDoctors.length} doctor{selectedDoctors.length !== 1 ? 's' : ''} selected
              </Typography>
            )}
          </Grid>

          <Grid>
            <Autocomplete
              multiple
              options={assistentOptions}
              value={selectedAssistents}
              onChange={onAssistentsChange}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign Assistants"
                  placeholder="Search and select assistants..."
                  sx={{ width: 300 }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box>
                    <Typography variant="body2">{option.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.experience} • Current: {option.department}
                    </Typography>
                  </Box>
                </li>
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    label={option.label}
                    {...getTagProps({ index })}
                    key={option.id}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                ))
              }
            />
            {selectedAssistents.length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {selectedAssistents.length} assistant{selectedAssistents.length !== 1 ? 's' : ''} selected
              </Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};