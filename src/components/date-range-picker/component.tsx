import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Popover,
  Typography,
  Chip,
  Stack,
  Paper,
  Grid,
} from '@mui/material';
import {
  DatePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import { DateRange } from '../interactive-chart/components/analistic-types';
import { DateRangePickerWrapper } from './style';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  label?: string;
  presets?: boolean;
  maxDate?: Date;
  minDate?: Date;
}

const PRESET_RANGES = [
  {
    label: 'Today',
    getValue: () => ({
      startDate: new Date(),
      endDate: new Date(),
    }),
  },
  {
    label: 'Yesterday',
    getValue: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        startDate: yesterday,
        endDate: yesterday,
      };
    },
  },
  {
    label: 'Last 7 days',
    getValue: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      return { startDate, endDate };
    },
  },
  {
    label: 'Last 30 days',
    getValue: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      return { startDate, endDate };
    },
  },
  {
    label: 'This month',
    getValue: () => {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { startDate, endDate };
    },
  },
  {
    label: 'Last month',
    getValue: () => {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
      return { startDate, endDate };
    },
  },
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  label = 'Date Range',
  presets = true,
  maxDate,
  minDate,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [tempRange, setTempRange] = useState<DateRange>(value);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setTempRange(value);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApply = () => {
    onChange(tempRange);
    handleClose();
  };

  const handlePresetClick = (preset: typeof PRESET_RANGES[0]) => {
    const range = preset.getValue();
    setTempRange(range);
    onChange(range);
    handleClose();
  };

  const formatDateRange = useCallback(() => {
    if (!value.startDate || !value.endDate) return 'Select date range';
    
    const start = value.startDate.toLocaleDateString();
    const end = value.endDate.toLocaleDateString();
    
    if (start === end) return start;
    return `${start} - ${end}`;
  }, [value]);

  const open = Boolean(anchorEl);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePickerWrapper>
        <Button
          variant="outlined"
          onClick={handleClick}
          startIcon={<DateRangeIcon />}
          sx={{ 
            textTransform: 'none',
            justifyContent: 'flex-start',
            width: '100%',
            minWidth: '200px',
          }}
        >
          <Box>
            <Typography variant="caption" display="block">
              {label}
            </Typography>
            <Typography variant="body2">
              {formatDateRange()}
            </Typography>
          </Box>
        </Button>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Paper sx={{ p: 2, minWidth: 400 }}>
            <Grid container spacing={2}>
              {presets && (
                <Grid>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Quick Select
                  </Typography>
                  <Stack spacing={1}>
                    {PRESET_RANGES.map((preset) => (
                      <Chip
                        key={preset.label}
                        label={preset.label}
                        variant="outlined"
                        clickable
                        onClick={() => handlePresetClick(preset)}
                        sx={{ justifyContent: 'flex-start' }}
                      />
                    ))}
                  </Stack>
                </Grid>
              )}
              
              <Grid>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Custom Range
                </Typography>
                <Stack spacing={2}>
                  <DatePicker
                    label="Start Date"
                    value={tempRange.startDate}
                    onChange={(date) =>
                      setTempRange(prev => ({ ...prev, startDate: date || new Date() }))
                    }
                    maxDate={tempRange.endDate || maxDate}
                    minDate={minDate}
                    slotProps={{
                      textField: { size: 'small', fullWidth: true }
                    }}
                  />
                  <DatePicker
                    label="End Date"
                    value={tempRange.endDate}
                    onChange={(date) =>
                      setTempRange(prev => ({ ...prev, endDate: date || new Date() }))
                    }
                    minDate={tempRange.startDate || minDate}
                    maxDate={maxDate}
                    slotProps={{
                      textField: { size: 'small', fullWidth: true }
                    }}
                  />
                  
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button variant="outlined" onClick={handleClose} fullWidth>
                      Cancel
                    </Button>
                    <Button variant="contained" onClick={handleApply} fullWidth>
                      Apply
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Popover>
      </DateRangePickerWrapper>
    </LocalizationProvider>
  );
};