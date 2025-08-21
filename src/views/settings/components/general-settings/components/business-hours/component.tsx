import {
  Box,
  Typography,
  Grid,
  TextField,
  Card,
  Switch,
  FormControlLabel,
  useTheme,
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
  const theme = useTheme(); 
  const [closedDays, setClosedDays] = useState<Record<string, boolean>>({
    sunday: !settings.sundayOpen,
  });

  const daysOfWeek = [
    { key: 'monday', label: 'Monday', color: theme.palette.primary.main }, 
    { key: 'tuesday', label: 'Tuesday', color: theme.palette.primary.main }, 
    { key: 'wednesday', label: 'Wednesday', color: theme.palette.primary.main }, 
    { key: 'thursday', label: 'Thursday', color: theme.palette.primary.main }, 
    { key: 'friday', label: 'Friday', color: theme.palette.primary.main }, 
    { key: 'saturday', label: 'Saturday', color: theme.palette.primary.main }, 
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
            backgroundColor: theme.palette.primary.main, 
            color: theme.palette.primary.contrastText, 
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
                borderColor: closedDays[day.key] ? theme.palette.divider : day.color, 
                backgroundColor: closedDays[day.key]
                  ? theme.palette.action.disabledBackground 
                  : theme.palette.background.paper, 
                transition: 'all 0.3s ease',
                height: "150px", 
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
                <Box display="flex" gap={1} alignItems="center">
                  <TextField
                    type="time"
                    size="small"
                    value={settings[`${day.key}Open` as keyof BusinessHoursSettings]}
                    onChange={(e) => onChange(`${day.key}Open` as keyof BusinessHoursSettings, e.target.value)}
                    sx={{ width: 120 }}
                  />
                  <Typography variant="body2" color="text.secondary">to</Typography>
                  <TextField
                    type="time"
                    size="small"
                    value={settings[`${day.key}Close` as keyof BusinessHoursSettings]}
                    onChange={(e) => onChange(`${day.key}Close` as keyof BusinessHoursSettings, e.target.value)}
                    sx={{ width: 120 }}
                  />
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Closed
                </Typography>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </CustomPaper>
  );
};