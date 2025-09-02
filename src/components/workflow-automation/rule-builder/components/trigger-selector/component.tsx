import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import { WorkflowTriggerEvent } from '../../../../../providers/workflow-automation/types';

interface TriggerSelectorProps {
  trigger: {
    event: WorkflowTriggerEvent;
    timing: 'immediate' | 'delayed';
    delay?: number;
  };
  onChange: (trigger: any) => void;
}

export const TriggerSelector: React.FC<TriggerSelectorProps> = ({ trigger, onChange }) => {
  const triggerEvents = [
    { value: 'appointment_created', label: 'Appointment Created' },
    { value: 'appointment_completed', label: 'Appointment Completed' },
    { value: 'patient_registered', label: 'Patient Registered' },
    { value: 'patient_checked_in', label: 'Patient Checked In' },
    { value: 'prescription_added', label: 'Prescription Added' },
    { value: 'vital_signs_entered', label: 'Vital Signs Entered' },
    { value: 'file_uploaded', label: 'File Uploaded' }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          When should this rule trigger?
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Trigger Event</InputLabel>
          <Select
            value={trigger.event}
            onChange={(e) => onChange({ ...trigger, event: e.target.value as WorkflowTriggerEvent })}
            label="Trigger Event"
          >
            {triggerEvents.map((event) => (
              <MenuItem key={event.value} value={event.value}>
                {event.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Execution Timing
          </Typography>
          <RadioGroup
            value={trigger.timing}
            onChange={(e) => onChange({ ...trigger, timing: e.target.value as 'immediate' | 'delayed' })}
          >
            <FormControlLabel
              value="immediate"
              control={<Radio />}
              label="Execute immediately"
            />
            <FormControlLabel
              value="delayed"
              control={<Radio />}
              label="Execute after delay"
            />
          </RadioGroup>

          {trigger.timing === 'delayed' && (
            <TextField
              type="number"
              label="Delay (minutes)"
              value={trigger.delay || 5}
              onChange={(e) => onChange({ ...trigger, delay: parseInt(e.target.value) || 5 })}
              sx={{ mt: 2, width: 200 }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};