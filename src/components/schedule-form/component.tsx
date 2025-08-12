import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Typography,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AddScheduleWrapper,
  DayButtonsWrapper,
  ScheduleFormWrapper,
  SubmitButtonWrapper,
} from './style';
import { useScheduleContext } from '../../providers/schedule';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];
const sessionOptions = ['Morning', 'Afternoon', 'Evening'];

type ScheduleEntry = {
  id: number;
  session: string;
  from: string;
  to: string;
};

interface ScheduleFormProps {
  role?: string;
  title?: string;
  onSubmit?: (schedules: Record<string, ScheduleEntry[]>) => void;
  hideSubmitButton?: boolean;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  role,
  title,
  onSubmit,
  hideSubmitButton = false
}) => {
  const { 
    weeklySchedules, 
    addSchedule, 
    updateSchedule, 
    deleteSchedule, 
    setRole,
    currentRole,
    getSchedulesForRole,
    roleSchedules
  } = useScheduleContext();
  
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = location.state?.isEditing || false;

  useEffect(() => {
    if (role) {
      setRole(role);
    }
  }, [role, setRole]);

  const targetRole = role || currentRole;
  const currentRoleSchedules = targetRole ? getSchedulesForRole(targetRole) : weeklySchedules;
  const schedules = currentRoleSchedules[selectedDay] || [];

  const triggerOnSubmit = useCallback(() => {
    if (onSubmit && hideSubmitButton) {
      const latestSchedules = targetRole ? getSchedulesForRole(targetRole) : weeklySchedules;
      onSubmit(latestSchedules);
    }
  }, [onSubmit, hideSubmitButton, targetRole, getSchedulesForRole, weeklySchedules]);

  useEffect(() => {
    if (onSubmit && hideSubmitButton && targetRole) {
      const currentSchedules = roleSchedules[targetRole];
      if (currentSchedules && Object.keys(currentSchedules).length > 0) {
        setTimeout(() => {
          triggerOnSubmit();
        }, 50); 
      }
    }
  }, [roleSchedules, targetRole, triggerOnSubmit, onSubmit, hideSubmitButton]);

  const handleDayClick = (day: string) => {
    setSelectedDay(day);
  };

  const handleAddSchedule = () => {
    const newSchedule: ScheduleEntry = {
      id: Date.now(),
      session: '',
      from: '',
      to: '',
    };
    addSchedule(selectedDay, newSchedule, targetRole);
  };

  const handleChange = (id: number, field: keyof ScheduleEntry, value: string) => {
    
    const scheduleToEdit = schedules.find((entry) => entry.id === id);
    if (!scheduleToEdit) {
      return;
    }
    
    const updated = { ...scheduleToEdit, [field]: value };
    
    updateSchedule(selectedDay, updated, targetRole);
  };

  const handleDeleteSchedule = (id: number) => {
    deleteSchedule(selectedDay, id, targetRole);
  };

  const handleSubmit = () => {
    const finalSchedules = targetRole ? getSchedulesForRole(targetRole) : weeklySchedules;
    
    if (onSubmit) {
      onSubmit(finalSchedules);
    } else {
      navigate('/');
    }
  };

  const displayTitle = title || 
    (targetRole ? `${targetRole.charAt(0).toUpperCase() + targetRole.slice(1)} Schedule` : 'Weekly Schedule');

  const formTitle = isEditing ? `Edit ${displayTitle}` : `Create ${displayTitle}`;

  const hasAnySchedules = Object.values(currentRoleSchedules).some(daySchedules => 
    Array.isArray(daySchedules) && daySchedules.length > 0
  );

  return (
    <ScheduleFormWrapper>
      <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          {formTitle}
        </Typography>
        {targetRole && (
          <Chip 
            label={targetRole}
            color="primary" 
            size="small" 
            sx={{ ml: 2, textTransform: 'capitalize' }}
          />
        )}
      </Box>

      <DayButtonsWrapper>
        {daysOfWeek.map((day) => (
          <Button
            key={day}
            variant={selectedDay === day ? 'contained' : 'outlined'}
            sx={{
              textTransform: 'none',
              borderRadius: 3,
              backgroundColor: selectedDay === day ? '#3F3DFF' : '#f9f9f9',
              color: selectedDay === day ? 'white' : '#333',
              borderColor: selectedDay === day ? '#3F3DFF' : '#ccc',
              px: 2,
              py: 1,
              minWidth: 100,
              '&:hover': {
                backgroundColor: selectedDay === day ? '#2e2cdf' : '#eaeaea',
              },
            }}
            onClick={() => handleDayClick(day)}
          >
            {day}
          </Button>
        ))}
      </DayButtonsWrapper>

      <Box>
        {schedules.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" my={3}>
            No schedules for <strong>{selectedDay}</strong> yet.
          </Typography>
        ) : (
          schedules.map((entry) => (
            <Box
              key={entry.id}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: '#f9f9f9',
                boxShadow: 1,
              }}
            >
              <FormControl sx={{ minWidth: 160, flex: 1 }}>
                <InputLabel>Session</InputLabel>
                <Select
                  value={entry.session}
                  onChange={(e) => handleChange(entry.id, 'session', e.target.value)}
                  label="Session"
                >
                  {sessionOptions.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="From"
                type="time"
                value={entry.from}
                onChange={(e) => {
                  console.log('FROM field changed to:', e.target.value);
                  handleChange(entry.id, 'from', e.target.value);
                }}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                sx={{ flex: 1 }}
              />

              <TextField
                label="To"
                type="time"
                value={entry.to}
                onChange={(e) => {
                  console.log('TO field changed to:', e.target.value);
                  console.log('Current entry before change:', entry);
                  handleChange(entry.id, 'to', e.target.value);
                }}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                sx={{ flex: 1 }}
              />

              <IconButton
                onClick={() => handleDeleteSchedule(entry.id)}
                color="error"
                sx={{
                  backgroundColor: '#fff0f0',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#ffe0e0',
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))
        )}
      </Box>

      <AddScheduleWrapper>
        <IconButton
          onClick={handleAddSchedule}
          color="primary"
          sx={{
            backgroundColor: '#eef2ff',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#dbe4ff',
            },
          }}
        >
          <AddIcon />
        </IconButton>
        <Typography sx={{ ml: 2 }} fontWeight="medium">
          Add schedule for <strong>{selectedDay}</strong>
        </Typography>
      </AddScheduleWrapper>

      {!hideSubmitButton && (
        <SubmitButtonWrapper>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            size="large"
            disabled={!hasAnySchedules}
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 'bold',
              '&.Mui-disabled': {
                backgroundColor: 'grey.300',
                color: 'grey.500',
                opacity: 0.6
              }
            }}
          >
            {isEditing ? 'Save Changes' : `Submit ${displayTitle}`}
          </Button>
        </SubmitButtonWrapper>
      )}
    </ScheduleFormWrapper>
  );
};
