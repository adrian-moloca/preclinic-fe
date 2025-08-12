import {
  Box,
  Typography,
  Grid,
  TextField,
  Card,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Schedule as ScheduleIcon } from "@mui/icons-material";
import { FC, useState } from "react";
import { CustomPaper } from "../clinic-information/style";

interface BusinessHoursSettings {
  mondayOpen: string;
  mondayClose: string;
  tuesdayOpen: string;
  tuesdayClose: string;
  wednesdayOpen: string;
  wednesdayClose: string;
  thursdayOpen: string;
  thursdayClose: string;
  fridayOpen: string;
  fridayClose: string;
  saturdayOpen: string;
  saturdayClose: string;
  sundayOpen: string;
  sundayClose: string;
}

interface BusinessHoursProps {
  settings: BusinessHoursSettings;
  onChange: (field: keyof BusinessHoursSettings, value: string) => void;
}

export const BusinessHours: FC<BusinessHoursProps> = ({ settings, onChange }) => {
  const [closedDays, setClosedDays] = useState<Record<string, boolean>>({
    sunday: !settings.sundayOpen,
  });

  const daysOfWeek = [
    { key: 'monday', label: 'Monday', color: '#1976d2' },
    { key: 'tuesday', label: 'Tuesday', color: '#1976d2' },
    { key: 'wednesday', label: 'Wednesday', color: '#1976d2' },
    { key: 'thursday', label: 'Thursday', color: '#1976d2' },
    { key: 'friday', label: 'Friday', color: '#1976d2' },
    { key: 'saturday', label: 'Saturday', color: '#1976d2' },
  ];

  const handleDayToggle = (day: string, isClosed: boolean) => {
    setClosedDays(prev => ({ ...prev, [day]: isClosed }));
    if (isClosed) {
      onChange(`${day}Open` as keyof BusinessHoursSettings, '');
      onChange(`${day}Close` as keyof BusinessHoursSettings, '');
    }
  };

  return (
    <CustomPaper elevation={0}>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <ScheduleIcon />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} color="primary">
            Business Hours
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Set your clinic's operating hours for each day
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
        {daysOfWeek.map((day) => (
          <Grid key={day.key}>
            <Card
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                border: '2px solid',
                borderColor: closedDays[day.key] ? 'grey.300' : day.color,
                background: closedDays[day.key]
                  ? 'linear-gradient(145deg, #f5f5f5 0%, #e0e0e0 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                transition: 'all 0.3s ease',
                height: "100px", 
                width: "300px"
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{ color: closedDays[day.key] ? 'text.secondary' : day.color }}
                >
                  {day.label}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={!closedDays[day.key]}
                      onChange={(e) => handleDayToggle(day.key, !e.target.checked)}
                    />
                  }
                  label=""
                />
              </Box>
              
              {!closedDays[day.key] ? (
                <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                  <Grid>
                    <TextField
                      fullWidth
                      label="Open"
                      type="time"
                      size="small"
                      value={settings[`${day.key}Open` as keyof BusinessHoursSettings]}
                      onChange={(e) => onChange(`${day.key}Open` as keyof BusinessHoursSettings, e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      fullWidth
                      label="Close"
                      type="time"
                      size="small"
                      value={settings[`${day.key}Close` as keyof BusinessHoursSettings]}
                      onChange={(e) => onChange(`${day.key}Close` as keyof BusinessHoursSettings, e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 2,
                    color: 'text.secondary',
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    Closed
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </CustomPaper>
  );
};