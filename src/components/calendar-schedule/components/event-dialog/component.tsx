import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Alert
} from '@mui/material';
import { CalendarEvent } from '../types/types';

interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  editingEvent: CalendarEvent | null;
  dialogTitle: string;
  setDialogTitle: (title: string) => void;
  dialogColor: string;
  setDialogColor: (color: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onViewAppointment: (appointmentId: string) => void;
}

export const EventDialog: React.FC<EventDialogProps> = ({
  open,
  onClose,
  editingEvent,
  dialogTitle,
  setDialogTitle,
  dialogColor,
  setDialogColor,
  onSave,
  onDelete,
  onViewAppointment
}) => {
  const isAppointment = editingEvent?.extendedProps?.type === 'appointment';

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>
        {isAppointment 
          ? "Appointment Details" 
          : editingEvent 
            ? "Edit Event" 
            : "Create Event"
        }
      </DialogTitle>
      <DialogContent>
        {isAppointment ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            Appointment details are read-only. Click "View Full Details" to edit.
          </Alert>
        ) : (
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Event Title"
              value={dialogTitle}
              onChange={(e) => setDialogTitle(e.target.value)}
              sx={{ mb: 2 }}
              autoFocus
            />
            <TextField
              fullWidth
              type="color"
              label="Color"
              value={dialogColor}
              onChange={(e) => setDialogColor(e.target.value)}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {isAppointment ? (
          <Button 
            onClick={() => onViewAppointment(editingEvent.extendedProps?.appointmentId || '')}
            variant="contained"
          >
            View Full Details
          </Button>
        ) : (
          <>
            {editingEvent && (
              <Button onClick={onDelete} color="error">
                Delete
              </Button>
            )}
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSave} variant="contained">
              Save
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};