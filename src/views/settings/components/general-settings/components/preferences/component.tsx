import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import { Palette as PaletteIcon } from "@mui/icons-material";
import { FC } from "react";
import { CustomPaper } from "../clinic-information/style";

interface PreferencesSettings {
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  language: string;
  theme: string;
}

interface PreferencesProps {
  settings: PreferencesSettings;
  onChange: (field: keyof PreferencesSettings, value: string) => void;
}

export const Preferences: FC<PreferencesProps> = ({ settings, onChange }) => {
  const theme = useTheme(); 

  return (
    <CustomPaper elevation={0}>
      <Box display="flex" alignItems="center" gap={2} mb={4} width={'100%'}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: theme.palette.primary.main, 
            color: theme.palette.primary.contrastText, 
          }}
        >
          <PaletteIcon />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} color="primary">
            System Preferences
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure regional and display settings
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid>
          <FormControl
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
              width: 205
            }}
          >
            <InputLabel>Time Zone</InputLabel>
            <Select
              value={settings.timeZone}
              label="Time Zone"
              onChange={(e) => onChange('timeZone', e.target.value)}
            >
              <MenuItem value="UTC-12">(UTC-12:00) Baker Island</MenuItem>
              <MenuItem value="UTC-11">(UTC-11:00) American Samoa</MenuItem>
              <MenuItem value="UTC-10">(UTC-10:00) Hawaii</MenuItem>
              <MenuItem value="UTC-9">(UTC-09:00) Alaska</MenuItem>
              <MenuItem value="UTC-8">(UTC-08:00) Pacific Time</MenuItem>
              <MenuItem value="UTC-7">(UTC-07:00) Mountain Time</MenuItem>
              <MenuItem value="UTC-6">(UTC-06:00) Central Time</MenuItem>
              <MenuItem value="UTC-5">(UTC-05:00) Eastern Time</MenuItem>
              <MenuItem value="UTC-4">(UTC-04:00) Atlantic Time</MenuItem>
              <MenuItem value="UTC-3">(UTC-03:00) Argentina</MenuItem>
              <MenuItem value="UTC-2">(UTC-02:00) Mid-Atlantic</MenuItem>
              <MenuItem value="UTC-1">(UTC-01:00) Azores</MenuItem>
              <MenuItem value="UTC+0">(UTC+00:00) London, Dublin</MenuItem>
              <MenuItem value="UTC+1">(UTC+01:00) Central Europe</MenuItem>
              <MenuItem value="UTC+2">(UTC+02:00) Eastern Europe</MenuItem>
              <MenuItem value="UTC+3">(UTC+03:00) Moscow</MenuItem>
              <MenuItem value="UTC+4">(UTC+04:00) Gulf</MenuItem>
              <MenuItem value="UTC+5">(UTC+05:00) Pakistan</MenuItem>
              <MenuItem value="UTC+6">(UTC+06:00) Bangladesh</MenuItem>
              <MenuItem value="UTC+7">(UTC+07:00) Bangkok</MenuItem>
              <MenuItem value="UTC+8">(UTC+08:00) China, Singapore</MenuItem>
              <MenuItem value="UTC+9">(UTC+09:00) Japan, Korea</MenuItem>
              <MenuItem value="UTC+10">(UTC+10:00) Australia East</MenuItem>
              <MenuItem value="UTC+11">(UTC+11:00) Solomon Islands</MenuItem>
              <MenuItem value="UTC+12">(UTC+12:00) New Zealand</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid>
          <FormControl
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
              width: 205
            }}
          >
            <InputLabel>Date Format</InputLabel>
            <Select
              value={settings.dateFormat}
              label="Date Format"
              onChange={(e) => onChange('dateFormat', e.target.value)}
            >
              <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
              <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
              <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
              <MenuItem value="DD-MM-YYYY">DD-MM-YYYY</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid>
          <FormControl
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
              width: 205
            }}
          >
            <InputLabel>Time Format</InputLabel>
            <Select
              value={settings.timeFormat}
              label="Time Format"
              onChange={(e) => onChange('timeFormat', e.target.value)}
            >
              <MenuItem value="12h">12 Hour (AM/PM)</MenuItem>
              <MenuItem value="24h">24 Hour</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid>
          <FormControl
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
              width: 205
            }}
          >
            <InputLabel>Currency</InputLabel>
            <Select
              value={settings.currency}
              label="Currency"
              onChange={(e) => onChange('currency', e.target.value)}
            >
              <MenuItem value="USD">USD ($)</MenuItem>
              <MenuItem value="EUR">EUR (€)</MenuItem>
              <MenuItem value="GBP">GBP (£)</MenuItem>
              <MenuItem value="JPY">JPY (¥)</MenuItem>
              <MenuItem value="CAD">CAD (C$)</MenuItem>
              <MenuItem value="AUD">AUD (A$)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid>
          <FormControl
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
              width: 205
            }}
          >
            <InputLabel>Language</InputLabel>
            <Select
              value={settings.language}
              label="Language"
              onChange={(e) => onChange('language', e.target.value)}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
              <MenuItem value="de">German</MenuItem>
              <MenuItem value="it">Italian</MenuItem>
              <MenuItem value="pt">Portuguese</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid>
          <FormControl
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
              width: 205
            }}
          >
            <InputLabel>Theme</InputLabel>
            <Select
              value={settings.theme}
              label="Theme"
              onChange={(e) => onChange('theme', e.target.value)}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="auto">Auto</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CustomPaper>
  );
};