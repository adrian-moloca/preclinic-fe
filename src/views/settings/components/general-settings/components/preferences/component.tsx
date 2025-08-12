import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  return (
    <CustomPaper elevation={0}>
      <Box display="flex" alignItems="center" gap={2} mb={4} width={'100%'}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
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
              <MenuItem value="America/New_York">Eastern Time (UTC-5)</MenuItem>
              <MenuItem value="America/Chicago">Central Time (UTC-6)</MenuItem>
              <MenuItem value="America/Denver">Mountain Time (UTC-7)</MenuItem>
              <MenuItem value="America/Los_Angeles">Pacific Time (UTC-8)</MenuItem>
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
              width: 203
            }}
          >
            <InputLabel>Date Format</InputLabel>
            <Select
              value={settings.dateFormat}
              label="Date Format"
              onChange={(e) => onChange('dateFormat', e.target.value)}
            >
              <MenuItem value="MM/DD/YYYY">MM/DD/YYYY (US)</MenuItem>
              <MenuItem value="DD/MM/YYYY">DD/MM/YYYY (EU)</MenuItem>
              <MenuItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</MenuItem>
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
              width: 203
            }}
          >
            <InputLabel>Time Format</InputLabel>
            <Select
              value={settings.timeFormat}
              label="Time Format"
              onChange={(e) => onChange('timeFormat', e.target.value)}
            >
              <MenuItem value="12-hour">12-hour (AM/PM)</MenuItem>
              <MenuItem value="24-hour">24-hour</MenuItem>
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
              width: 203
            }}
          >
            <InputLabel>Currency</InputLabel>
            <Select
              value={settings.currency}
              label="Currency"
              onChange={(e) => onChange('currency', e.target.value)}
            >
              <MenuItem value="USD">USD ($) - US Dollar</MenuItem>
              <MenuItem value="EUR">EUR (€) - Euro</MenuItem>
              <MenuItem value="GBP">GBP (£) - British Pound</MenuItem>
              <MenuItem value="CAD">CAD (C$) - Canadian Dollar</MenuItem>
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
              width: 203
            }}
          >
            <InputLabel>Language</InputLabel>
            <Select
              value={settings.language}
              label="Language"
              onChange={(e) => onChange('language', e.target.value)}
            >
              <MenuItem value="en">🇺🇸 English</MenuItem>
              <MenuItem value="es">🇪🇸 Spanish</MenuItem>
              <MenuItem value="fr">🇫🇷 French</MenuItem>
              <MenuItem value="de">🇩🇪 German</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CustomPaper>
  );
};