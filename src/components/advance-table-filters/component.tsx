import React, { FC, useState } from 'react';
import {
  Box,
  Button,
  Popover,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Typography,
  Divider,
  Grid,
  FormControlLabel,
  Checkbox,
  Slider,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';

export interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text' | 'number' | 'boolean' | 'range';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}

export interface ActiveFilter {
  id: string;
  label: string;
  value: any;
  displayValue: string;
}

interface AdvancedTableFiltersProps {
  filterOptions: FilterOption[];
  activeFilters: ActiveFilter[];
  onFiltersChange: (filters: ActiveFilter[]) => void;
  onClearFilters: () => void;
}

export const AdvancedTableFilters: FC<AdvancedTableFiltersProps> = ({
  filterOptions,
  activeFilters,
  onFiltersChange,
  onClearFilters,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [tempFilters, setTempFilters] = useState<Record<string, any>>({});

  const isOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    const temp: Record<string, any> = {};
    activeFilters.forEach(filter => {
      temp[filter.id] = filter.value;
    });
    setTempFilters(temp);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setTempFilters({});
  };

  const handleApplyFilters = () => {
    const newFilters: ActiveFilter[] = [];
    
    Object.entries(tempFilters).forEach(([id, value]) => {
      if (value !== undefined && value !== null && value !== '' && 
          (Array.isArray(value) ? value.length > 0 : true)) {
        const option = filterOptions.find(opt => opt.id === id);
        if (option) {
          let displayValue = '';
          
          if (option.type === 'select' || option.type === 'multiselect') {
            if (Array.isArray(value)) {
              displayValue = value.map(v => 
                option.options?.find(opt => opt.value === v)?.label || v
              ).join(', ');
            } else {
              displayValue = option.options?.find(opt => opt.value === value)?.label || value;
            }
          } else if (option.type === 'daterange') {
            displayValue = `${value.start} - ${value.end}`;
          } else if (option.type === 'range') {
            displayValue = `${value.min} - ${value.max}`;
          } else {
            displayValue = String(value);
          }

          newFilters.push({
            id,
            label: option.label,
            value,
            displayValue,
          });
        }
      }
    });

    onFiltersChange(newFilters);
    handleClose();
  };

  const handleTempFilterChange = (id: string, value: any) => {
    setTempFilters(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleRemoveFilter = (filterId: string) => {
    const newFilters = activeFilters.filter(filter => filter.id !== filterId);
    onFiltersChange(newFilters);
  };

  const renderFilterControl = (option: FilterOption) => {
    const value = tempFilters[option.id];

    switch (option.type) {
      case 'select':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{option.label}</InputLabel>
            <Select
              value={value || ''}
              onChange={(e) => handleTempFilterChange(option.id, e.target.value)}
              label={option.label}
            >
              {option.options?.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'multiselect':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{option.label}</InputLabel>
            <Select
              multiple
              value={value || []}
              onChange={(e) => handleTempFilterChange(option.id, e.target.value)}
              label={option.label}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((val) => (
                    <Chip
                      key={val}
                      label={option.options?.find(opt => opt.value === val)?.label || val}
                      size="small"
                    />
                  ))}
                </Box>
              )}
            >
              {option.options?.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>
                  <Checkbox checked={(value || []).indexOf(opt.value) > -1} />
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'text':
        return (
          <TextField
            fullWidth
            size="small"
            label={option.label}
            value={value || ''}
            onChange={(e) => handleTempFilterChange(option.id, e.target.value)}
          />
        );

      case 'number':
        return (
          <TextField
            fullWidth
            size="small"
            type="number"
            label={option.label}
            value={value || ''}
            onChange={(e) => handleTempFilterChange(option.id, e.target.value)}
            inputProps={{ min: option.min, max: option.max }}
          />
        );

      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={value || false}
                onChange={(e) => handleTempFilterChange(option.id, e.target.checked)}
              />
            }
            label={option.label}
          />
        );

      case 'date':
        return (
          <DatePicker
            label={option.label}
            value={value || null}
            onChange={(newValue) => handleTempFilterChange(option.id, newValue)}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
              },
            }}
          />
        );

      case 'daterange':
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {option.label}
            </Typography>
            <Grid container spacing={1}>
              <Grid>
                <DatePicker
                  label="From"
                  value={value?.start || null}
                  onChange={(newValue) => 
                    handleTempFilterChange(option.id, { ...value, start: newValue })
                  }
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              <Grid>
                <DatePicker
                  label="To"
                  value={value?.end || null}
                  onChange={(newValue) => 
                    handleTempFilterChange(option.id, { ...value, end: newValue })
                  }
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 'range':
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {option.label}
            </Typography>
            <Slider
              value={value || [option.min || 0, option.max || 100]}
              onChange={(_, newValue) => {
                const [min, max] = newValue as unknown as number[];
                handleTempFilterChange(option.id, { min, max });
              }}
              valueLabelDisplay="auto"
              min={option.min || 0}
              max={option.max || 100}
            />
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="caption">
                Min: {value?.min || option.min || 0}
              </Typography>
              <Typography variant="caption">
                Max: {value?.max || option.max || 100}
              </Typography>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={handleClick}
          size="small"
        >
          Filters ({activeFilters.length})
        </Button>
        
        {activeFilters.length > 0 && (
          <Button
            variant="text"
            startIcon={<ClearIcon />}
            onClick={onClearFilters}
            size="small"
            color="error"
          >
            Clear All
          </Button>
        )}
      </Box>

      {activeFilters.length > 0 && (
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {activeFilters.map((filter) => (
            <Chip
              key={filter.id}
              label={`${filter.label}: ${filter.displayValue}`}
              onDelete={() => handleRemoveFilter(filter.id)}
              color="primary"
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
      )}

      <Popover
        open={isOpen}
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
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            p: 2,
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Filter Options
        </Typography>
        
        <Box display="flex" flexDirection="column" gap={2}>
          {filterOptions.map((option) => (
            <Box key={option.id}>
              {renderFilterControl(option)}
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </Box>
      </Popover>
    </Box>
  );
};