import React, { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateClickArg } from "@fullcalendar/interaction";
import type { EventClickArg, EventDropArg } from "@fullcalendar/core";
import { useNavigate } from "react-router-dom";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Box, Typography, Chip
} from "@mui/material";
import { useAppointmentsContext } from "../../providers/appointments/context";
import { usePatientsContext } from "../../providers/patients/context";

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  color?: string;
  extendedProps?: {
    appointmentId?: string;
    patientId?: string;
    patients?: string[];
    patientDisplayName?: string;
    appointmentType?: string; 
    consultationType?: string;
    type?: 'appointment' | 'custom';
    reason?: string;
  };
};

export const ScheduleCalendar = () => {
  const { appointments } = useAppointmentsContext();
  const { patients } = usePatientsContext();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#3788d8");

  useEffect(() => {
    const saved = localStorage.getItem("custom-calendar-events");
    if (saved) setCustomEvents(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("custom-calendar-events", JSON.stringify(customEvents));
  }, [customEvents]);

  const getPatientNameById = useCallback((patientId: string): string => {
    let patientsArray = patients;
    if (!Array.isArray(patients)) {
      const patientsValues = Object.values(patients);
      if (patientsValues.length > 0 && Array.isArray(patientsValues[0])) {
        patientsArray = patientsValues[0] as any[];
      }
    }
    
    const patient = patientsArray.find(p => p.id === patientId);
    
    if (patient && patient.lastName && patient.firstName) {
      return `${patient.lastName} ${patient.firstName}`.trim();
    } else if (patient && patient.firstName) {
      return patient.firstName;
    } else if (patient && patient.lastName) {
      return patient.lastName;
    }
    return 'Unknown Patient';
  }, [patients]);

  const getPatientNames = (patientNames: string[]): string => {
    if (patientNames.length === 1) {
      return patientNames[0];
    }
    return `${patientNames[0]} +${patientNames.length - 1} more`;
  };

  useEffect(() => {
    const appointmentEvents: CalendarEvent[] = appointments.map(appointment => {
      const getConsultationTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
          case 'consultation': return '#1976d2';
          case 'follow-up': return '#2e7d32';
          case 'emergency': return '#d32f2f';
          case 'routine': return '#ed6c02';
          case 'procedure': return '#722ed1';
          case 'checkup': return '#388e3c';
          default: return '#1976d2';
        }
      };

      let patientDisplay: string;
      
      if (appointment.patientId) {
        patientDisplay = getPatientNameById(appointment.patientId);
      } else if (appointment.patients && appointment.patients.length > 0) {
        patientDisplay = getPatientNames(appointment.patients);
      } else {
        patientDisplay = 'Unknown Patient';
      }

      return {
        id: `appointment-${appointment.id}`,
        title: `${patientDisplay}`,
        start: `${appointment.date}T${appointment.time}`,
        color: getConsultationTypeColor(appointment.type || 'consultation'),
        extendedProps: {
          appointmentId: appointment.id,
          patientId: appointment.patientId,
          patients: appointment.patients,
          patientDisplayName: patientDisplay,
          appointmentType: appointment.appointmentType,
          consultationType: appointment.type,
          type: 'appointment' as const,
          reason: appointment.reason
        }
      };
    });

    setEvents([...appointmentEvents, ...customEvents]);
  }, [appointments, patients, customEvents, getPatientNameById]);

  const handleDateClick = (info: DateClickArg) => {
    setSelectedDate(info.dateStr);
    setEditingEvent(null);
    setTitle("");
    setColor("#3788d8");
    setOpen(true);
  };

  const handleEventClick = (info: EventClickArg) => {
    const eventProps = info.event.extendedProps;
    
    if (eventProps.type === 'appointment' && eventProps.appointmentId) {
      navigate(`/appointments/${eventProps.appointmentId}`);
      return;
    }

    setEditingEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      color: info.event.backgroundColor,
      extendedProps: eventProps
    });
    setTitle(info.event.title);
    setColor(info.event.backgroundColor || "#3788d8");
    setOpen(true);
  };

  const handleEventDrop = (info: EventDropArg) => {
    if (info.event.extendedProps.type === 'appointment') {
      info.revert();
      return;
    }

    setCustomEvents(prev =>
      prev.map(evt => evt.id === info.event.id
        ? { ...evt, start: info.event.startStr }
        : evt
      )
    );
  };

  const handleSave = () => {
    if (!title.trim()) return;

    if (editingEvent && editingEvent.extendedProps?.type !== 'appointment') {
      setCustomEvents(prev =>
        prev.map(evt => evt.id === editingEvent.id
          ? { ...evt, title, color }
          : evt
        )
      );
    } else if (!editingEvent) {
      const newEvent: CalendarEvent = {
        id: `custom-${Date.now()}`,
        title,
        start: selectedDate!,
        color,
        extendedProps: {
          type: 'custom'
        }
      };
      setCustomEvents(prev => [...prev, newEvent]);
    }
    setOpen(false);
  };

  const handleDelete = () => {
    if (editingEvent && editingEvent.extendedProps?.type === 'custom') {
      setCustomEvents(prev => prev.filter(evt => evt.id !== editingEvent.id));
    }
    setOpen(false);
  };

  const renderEventContent = (eventInfo: any) => {
    const { event } = eventInfo;
    const isAppointment = event.extendedProps.type === 'appointment';
    
    return (
      <Box sx={{ p: 0.5, cursor: 'pointer' }}>
        <Typography variant="caption" sx={{ 
          fontWeight: isAppointment ? 600 : 400,
          display: 'block',
          lineHeight: 1.2,
          fontSize: '0.7rem'
        }}>
          {isAppointment ? event.extendedProps.patientDisplayName || 'Unknown Patient' : event.title}
        </Typography>
        
        {isAppointment && event.extendedProps.reason && (
          <Typography variant="caption" sx={{ 
            fontSize: '0.6rem', 
            opacity: 0.7,
            display: 'block',
            fontStyle: 'italic'
          }}>
            {event.extendedProps.reason}
          </Typography>
        )}
        
        {isAppointment && event.extendedProps.consultationType && (
          <Typography variant="caption" sx={{ 
            fontSize: '0.6rem', 
            opacity: 0.8,
            display: 'block'
          }}>
            {event.extendedProps.consultationType.charAt(0).toUpperCase() + event.extendedProps.consultationType.slice(1)}
          </Typography>
        )}
        
        {isAppointment && event.extendedProps.consultationType && (
          <Chip 
            label={event.extendedProps.consultationType.charAt(0).toUpperCase() + event.extendedProps.consultationType.slice(1)} 
            size="small" 
            sx={{ 
              height: '16px', 
              fontSize: '0.55rem',
              mt: 0.5
            }} 
          />
        )}
      </Box>
    );
  };

  const isEditingAppointment = editingEvent?.extendedProps?.type === 'appointment';

  const getDialogPatientDisplay = () => {
    if (!editingEvent?.extendedProps) return '';
    
    if (editingEvent.extendedProps.patientId) {
      let patientsArray = patients;
      if (!Array.isArray(patients)) {
        const patientsValues = Object.values(patients);
        if (patientsValues.length > 0 && Array.isArray(patientsValues[0])) {
          patientsArray = patientsValues[0] as any[];
        }
      }
      
      const patient = patientsArray.find(p => p.id === editingEvent.extendedProps!.patientId);
      if (patient && patient.firstName && patient.lastName) {
        return `${patient.lastName} ${patient.firstName}`.trim();
      } else if (patient && patient.firstName) {
        return patient.firstName;
      } else if (patient && patient.lastName) {
        return patient.lastName;
      }
    }
    
    if (editingEvent.extendedProps.patientDisplayName) {
      return editingEvent.extendedProps.patientDisplayName;
    }
    
    if (editingEvent.extendedProps.patients && editingEvent.extendedProps.patients.length > 0) {
      return editingEvent.extendedProps.patients.join(', ');
    }
    
    return 'Unknown Patient';
  };

  return (
    <Box sx={{ maxWidth: 1100, margin: "auto", p: 2 }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        editable={true}
        eventDrop={handleEventDrop}
        selectable={true}
        eventContent={renderEventContent}
        height="auto"
        dayMaxEvents={3}
        moreLinkClick="popover"
        eventClassNames={(event) => {
          return event.event.extendedProps.type === 'appointment' ? 'appointment-event' : 'custom-event';
        }}
        eventDidMount={(info) => {
          if (info.event.extendedProps.type === 'appointment') {
            const patientText = info.event.extendedProps.patientDisplayName || 'Unknown Patient';
            
            info.el.title = `${patientText}\nType: ${info.event.extendedProps.consultationType}\nMethod: ${info.event.extendedProps.appointmentType}\nReason: ${info.event.extendedProps.reason}`;
          }
        }}
      />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditingAppointment 
            ? "Appointment Details" 
            : editingEvent 
              ? "Edit Custom Event" 
              : "Add Custom Event"
          }
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {isEditingAppointment ? (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Click "View Details" to see full appointment information.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body1">
                  <strong>Patient(s):</strong> {getDialogPatientDisplay()}
                </Typography>
                <Typography variant="body1">
                  <strong>Consultation Type:</strong> {editingEvent?.extendedProps?.consultationType ? editingEvent.extendedProps.consultationType.charAt(0).toUpperCase() + editingEvent.extendedProps.consultationType.slice(1) : 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Appointment Method:</strong> {editingEvent?.extendedProps?.appointmentType}
                </Typography>
                <Typography variant="body1">
                  <strong>Reason:</strong> {editingEvent?.extendedProps?.reason}
                </Typography>
              </Box>
            </Box>
          ) : (
            <>
              <TextField
                label="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
              />
              <TextField
                select
                label="Event Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                fullWidth
              >
                <MenuItem value="#3788d8">Blue</MenuItem>
                <MenuItem value="#ff4d4f">Red</MenuItem>
                <MenuItem value="#52c41a">Green</MenuItem>
                <MenuItem value="#faad14">Orange</MenuItem>
                <MenuItem value="#722ed1">Purple</MenuItem>
                <MenuItem value="#eb2f96">Pink</MenuItem>
              </TextField>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {isEditingAppointment ? (
            <>
              <Button onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button 
                onClick={() => {
                  navigate(`/appointments/${editingEvent?.extendedProps?.appointmentId}`);
                  setOpen(false);
                }}
                variant="contained"
              >
                View Details
              </Button>
            </>
          ) : (
            <>
              {editingEvent && editingEvent.extendedProps?.type === 'custom' && (
                <Button onClick={handleDelete} color="error">
                  Delete
                </Button>
              )}
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleSave} 
                variant="contained"
                disabled={!title.trim()}
              >
                Save
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};