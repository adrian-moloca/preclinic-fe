import React, { useState, useEffect, useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateClickArg } from "@fullcalendar/interaction";
import type { EventClickArg, EventDropArg } from "@fullcalendar/core";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Chip, Typography, Fab, Zoom, ButtonGroup, Button } from "@mui/material";
import { Keyboard as KeyboardIcon, Warning as ConflictIcon } from "@mui/icons-material";
import { useAppointmentsContext } from "../../providers/appointments/context";
import { usePatientsContext } from "../../providers/patients/context";
import { useDoctorsContext } from "../../providers/doctor/context";
import { APPOINTMENT_TYPE_COLORS, CalendarEvent, DEPARTMENT_COLORS, DOCTOR_COLORS } from "./components/types/types";
import MiniCalendarWidget from "./components/mini-calendar-widget";
import ConflictDetector from "./components/conflict-detector";
import EventDialog from "./components/event-dialog";
import CalendarShortcuts from "./components/calendar-shortcuts";

export const ScheduleCalendar: React.FC = () => {
  const { appointments } = useAppointmentsContext();
  const { patients } = usePatientsContext();
  const { doctors } = useDoctorsContext();
  const navigate = useNavigate();

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [colorBy, setColorBy] = useState<'type' | 'doctor' | 'department'>('doctor');
  const [showConflicts, setShowConflicts] = useState(true);
  const [showMiniCalendar, setShowMiniCalendar] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [calendarRef, setCalendarRef] = useState<FullCalendar | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogColor, setDialogColor] = useState("#2196F3");

  useEffect(() => {
    const saved = localStorage.getItem("enhanced-calendar-events");
    if (saved) {
      try {
        setCustomEvents(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load custom events:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("enhanced-calendar-events", JSON.stringify(customEvents));
  }, [customEvents]);

  const normalizeDoctorsData = useMemo(() => {
    if (!doctors) return [];
    
    if (Array.isArray(doctors)) {
      return doctors;
    }
    
    if (typeof doctors === 'object') {
      return Object.values(doctors).flat();
    }
    
    return [];
  }, [doctors]);

  const uniqueDepartments = useMemo(() => {
    if (!appointments) return [];
    
    const departments: string[] = [];
    
    appointments.forEach(apt => {
      let departmentName: string | null = null;
      
      if (apt.department) {
        if (typeof apt.department === 'string') {
          departmentName = apt.department;
        } else if (apt.department && typeof apt.department === 'object' && apt.department.name) {
          departmentName = apt.department.name;
        }
      }
      
      if (departmentName && typeof departmentName === 'string' && departmentName.trim() !== '') {
        departments.push(departmentName.toLowerCase());
      }
    });
    
    return Array.from(new Set(departments));
  }, [appointments]);

  const uniqueAppointmentTypes = useMemo(() => {
    if (!appointments) return [];
    
    const types: string[] = [];
    
    appointments.forEach(apt => {
      if (apt.type && typeof apt.type === 'string' && apt.type.trim() !== '') {
        types.push(apt.type);
      }
    });
    
    return Array.from(new Set(types));
  }, [appointments]);

  const getAppointmentColor = useCallback((appointment: any): string => {
    switch (colorBy) {
      case 'doctor':
        if (appointment.doctorId && normalizeDoctorsData.length > 0) {
          const doctorIndex = normalizeDoctorsData.findIndex(
            (doctor: any) => doctor.id === appointment.doctorId
          );
          
          if (doctorIndex !== -1) {
            const color = DOCTOR_COLORS[doctorIndex % DOCTOR_COLORS.length];
            return color;
          }
        }
        return '#9E9E9E';
      
      case 'department':
        let departmentName = '';
        if (typeof appointment.department === 'string') {
          departmentName = appointment.department.toLowerCase();
        } else if (appointment.department && appointment.department.name) {
          departmentName = appointment.department.name.toLowerCase();
        }
        
        if (departmentName && DEPARTMENT_COLORS[departmentName as keyof typeof DEPARTMENT_COLORS]) {
          const color = DEPARTMENT_COLORS[departmentName as keyof typeof DEPARTMENT_COLORS];
          return color;
        }
        
        return '#607D8B';
      
      case 'type':
        const appointmentType = appointment.type;
        
        if (appointmentType && APPOINTMENT_TYPE_COLORS[appointmentType as keyof typeof APPOINTMENT_TYPE_COLORS]) {
          const color = APPOINTMENT_TYPE_COLORS[appointmentType as keyof typeof APPOINTMENT_TYPE_COLORS];
          return color;
        }
        
        return '#2196F3';
      
      default:
        return '#2196F3';
    }
  }, [colorBy, normalizeDoctorsData]);

  const appointmentEvents = useMemo((): CalendarEvent[] => {
    if (!appointments || !Array.isArray(appointments)) return [];

    return appointments.map(appointment => {
      let patientsArray: any[] = [];
      if (Array.isArray(patients)) {
        patientsArray = patients;
      } else if (patients && typeof patients === 'object') {
        const patientsValues = Object.values(patients);
        if (patientsValues.length > 0 && Array.isArray(patientsValues[0])) {
          patientsArray = patientsValues[0] as any[];
        } else {
          patientsArray = patientsValues.flat();
        }
      }
      
      const patient = patientsArray.find((p: any) => p.id === appointment.patientId);
      const patientName = patient 
        ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim()
        : 'Unknown Patient';

      const startDateTime = new Date(`${appointment.date}T${appointment.time}`);
      const endDateTime = new Date(startDateTime.getTime() + (appointment.duration || 30) * 60000);

      const eventColor = getAppointmentColor(appointment);

      let departmentName: string = '';
      if (typeof appointment.department === 'string') {
        departmentName = appointment.department;
      } else if (appointment.department && typeof appointment.department === 'object' && appointment.department.name) {
        departmentName = appointment.department.name;
      }

      return {
        id: `appointment-${appointment.id}`,
        title: patientName,
        start: `${appointment.date}T${appointment.time}`,
        end: endDateTime.toISOString(),
        color: eventColor,
        backgroundColor: eventColor,
        borderColor: eventColor,
        textColor: '#ffffff',
        resourceId: appointment.doctorId || 'unassigned',
        extendedProps: {
          appointmentId: appointment.id,
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          department: departmentName,
          appointmentType: appointment.appointmentType,
          consultationType: appointment.type,
          type: 'appointment' as const,
          reason: appointment.reason,
        }
      };
    });
  }, [appointments, patients, getAppointmentColor]);

  useEffect(() => {
    setEvents([...appointmentEvents, ...customEvents]);
  }, [appointmentEvents, customEvents]);

  const resources = useMemo(() => {
    const defaultResource = { id: 'unassigned', title: 'Unassigned' };
    
    if (!normalizeDoctorsData || normalizeDoctorsData.length === 0) {
      return [defaultResource];
    }

    const doctorResources = normalizeDoctorsData.map((doctor: any) => ({
      id: doctor.id,
      title: `Dr. ${doctor.firstName || ''} ${doctor.lastName || ''}`.trim(),
      department: doctor.department,
    }));

    return [defaultResource, ...doctorResources];
  }, [normalizeDoctorsData]);

  const handleColorByChange = (newColorBy: 'type' | 'doctor' | 'department') => {
    setColorBy(newColorBy);
  };

  const handleDateClick = (info: DateClickArg) => {
    setSelectedDate(info.dateStr);
    setEditingEvent(null);
    setDialogTitle("");
    setDialogColor("#2196F3");
    setDialogOpen(true);
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
      color: info.event.backgroundColor || '',
      extendedProps: eventProps
    });
    setDialogTitle(info.event.title);
    setDialogColor(info.event.backgroundColor || "#2196F3");
    setDialogOpen(true);
  };

  const handleEventDrop = (info: EventDropArg) => {
    if (info.event.extendedProps.type === 'appointment') {
      info.revert();
      return;
    }

    setCustomEvents(prev =>
      prev.map(evt => evt.id === info.event.id
        ? { ...evt, start: info.event.startStr, end: info.event.endStr }
        : evt
      )
    );
  };

  const handleSaveEvent = () => {
    if (!dialogTitle.trim()) return;

    if (editingEvent && editingEvent.extendedProps?.type !== 'appointment') {
      setCustomEvents(prev =>
        prev.map(evt => evt.id === editingEvent.id
          ? { ...evt, title: dialogTitle, color: dialogColor }
          : evt
        )
      );
    } else if (!editingEvent) {
      const newEvent: CalendarEvent = {
        id: `custom-${Date.now()}`,
        title: dialogTitle,
        start: selectedDate,
        color: dialogColor,
        extendedProps: { type: 'custom' }
      };
      setCustomEvents(prev => [...prev, newEvent]);
    }
    setDialogOpen(false);
  };

  const handleDeleteEvent = () => {
    if (editingEvent && editingEvent.extendedProps?.type === 'custom') {
      setCustomEvents(prev => prev.filter(evt => evt.id !== editingEvent.id));
    }
    setDialogOpen(false);
  };

  const handleQuickDateJump = (date: Date) => {
    if (calendarRef) {
      calendarRef.getApi().gotoDate(date);
    }
  };

  const handleViewAppointment = (appointmentId: string) => {
    navigate(`/appointments/${appointmentId}`);
  };

  const renderEventContent = (eventInfo: any) => {
    const { event } = eventInfo;
    const isAppointment = event.extendedProps.type === 'appointment';
    const hasConflicts = event.extendedProps.conflictsWith?.length > 0;

    return (
      <Box sx={{ 
        p: 0.5, 
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {hasConflicts && showConflicts && (
          <ConflictIcon 
            sx={{ 
              position: 'absolute', 
              top: 2, 
              right: 2, 
              fontSize: '12px', 
              color: '#fff',
              backgroundColor: 'rgba(255,0,0,0.8)',
              borderRadius: '50%',
              padding: '1px'
            }} 
          />
        )}
        
        <Typography variant="caption" sx={{ 
          fontWeight: isAppointment ? 600 : 400,
          display: 'block',
          lineHeight: 1.1,
          fontSize: '0.75rem',
          color: 'white',
          textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
        }}>
          {event.title}
        </Typography>
        
        {isAppointment && event.extendedProps.reason && (
          <Typography variant="caption" sx={{ 
            fontSize: '0.65rem', 
            opacity: 0.9,
            display: 'block',
            fontStyle: 'italic',
            color: 'white',
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
            mt: 0.25
          }}>
            {event.extendedProps.reason}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 1400, margin: "auto", p: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Typography variant="h5" fontWeight={600}>
            Medical Schedule Calendar
          </Typography>
          
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <Box display="flex" gap={1} alignItems="center">
              <Typography variant="body2" sx={{ minWidth: 'max-content' }}>Color by:</Typography>
              <ButtonGroup variant="outlined" size="small">
                <Button 
                  variant={colorBy === 'doctor' ? 'contained' : 'outlined'}
                  onClick={() => handleColorByChange('doctor')}
                >
                  Doctor
                </Button>
                <Button 
                  variant={colorBy === 'department' ? 'contained' : 'outlined'}
                  onClick={() => handleColorByChange('department')}
                >
                  Department
                </Button>
                <Button 
                  variant={colorBy === 'type' ? 'contained' : 'outlined'}
                  onClick={() => handleColorByChange('type')}
                >
                  Type
                </Button>
              </ButtonGroup>
            </Box>

            <Button
              size="small"
              variant={showConflicts ? 'contained' : 'outlined'}
              color={showConflicts ? 'error' : 'inherit'}
              onClick={() => setShowConflicts(!showConflicts)}
              startIcon={<ConflictIcon />}
            >
              Conflicts
            </Button>

            <Button
              size="small"
              variant={showMiniCalendar ? 'contained' : 'outlined'}
              onClick={() => setShowMiniCalendar(!showMiniCalendar)}
            >
              Navigation
            </Button>
          </Box>
        </Box>

        <Box mt={2} display="flex" flexWrap="wrap" gap={1} alignItems="center">
          <Typography variant="subtitle2" sx={{ mr: 2, fontWeight: 600 }}>
            Color Legend:
          </Typography>
          
          {colorBy === 'doctor' && resources.filter(r => r.id !== 'unassigned').map((doctor, index) => {
            const color = DOCTOR_COLORS[index % DOCTOR_COLORS.length];
            return (
              <Chip
                key={doctor.id}
                label={doctor.title}
                size="small"
                sx={{ 
                  bgcolor: color, 
                  color: 'white', 
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}
              />
            );
          })}
          
          {colorBy === 'department' && uniqueDepartments.map((dept) => {
            const color = DEPARTMENT_COLORS[dept as keyof typeof DEPARTMENT_COLORS] || '#607D8B';
            return (
              <Chip
                key={dept}
                label={dept.charAt(0).toUpperCase() + dept.slice(1)}
                size="small"
                sx={{ 
                  bgcolor: color, 
                  color: 'white', 
                  fontSize: '0.75rem', 
                  fontWeight: 500 
                }}
              />
            );
          })}
          
          {colorBy === 'type' && uniqueAppointmentTypes.map((type) => {
            const color = APPOINTMENT_TYPE_COLORS[type as keyof typeof APPOINTMENT_TYPE_COLORS] || '#2196F3';
            return (
              <Chip
                key={type}
                label={type.charAt(0).toUpperCase() + type.slice(1)}
                size="small"
                sx={{ 
                  bgcolor: color, 
                  color: 'white', 
                  fontSize: '0.75rem', 
                  fontWeight: 500 
                }}
              />
            );
          })}
        </Box>
      </Paper>

      <Box display="flex" gap={2}>
        {showMiniCalendar && (
          <Box sx={{ minWidth: 300 }}>
            <MiniCalendarWidget
              selectedDate={selectedDate}
              onDateSelect={handleQuickDateJump}
              events={events}
              conflicts={showConflicts}
            />
            
            <ConflictDetector
              events={events}
              onConflictSelect={(eventId) => {
                const event = events.find(e => e.id === eventId);
                if (event && calendarRef) {
                  calendarRef.getApi().gotoDate(event.start);
                }
              }}
            />
          </Box>
        )}

        <Box sx={{ flex: 1 }}>
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <FullCalendar
              key={`calendar-${colorBy}`} 
              ref={setCalendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={events}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              eventDrop={handleEventDrop}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={3}
              moreLinkClick="popover"
              eventContent={renderEventContent}
              height="auto"
              aspectRatio={1.35}
              slotMinTime="07:00:00"
              slotMaxTime="20:00:00"
              slotDuration="00:30:00"
              slotLabelInterval="01:00:00"
              
              eventClassNames={() => ['custom-event', 'appointment-event']}
              
              eventDidMount={(info) => {
                const props = info.event.extendedProps;
                if (props.type === 'appointment') {
                  const doctor = normalizeDoctorsData.find((d: any) => d.id === props.doctorId);
                  const doctorName = doctor && typeof doctor === 'object' && 'firstName' in doctor && 'lastName' in doctor
                    ? `Dr. ${(doctor as any).firstName ?? ''} ${(doctor as any).lastName ?? ''}`.trim()
                    : 'Unassigned';
                  
                  const tooltip = `
Patient: ${info.event.title}
Doctor: ${doctorName}
Type: ${props.consultationType || 'N/A'}
Method: ${props.appointmentType || 'N/A'}
${props.reason ? `Reason: ${props.reason}` : ''}
Time: ${new Date(info.event.start!).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  `.trim();
                  info.el.title = tooltip;
                  
                  if (info.event.backgroundColor) {
                    info.el.style.backgroundColor = info.event.backgroundColor;
                    info.el.style.borderColor = info.event.backgroundColor;
                  }
                }
              }}
              
              dayCellDidMount={(info) => {
                if (info.date.getDay() === 0 || info.date.getDay() === 6) {
                  info.el.style.backgroundColor = '#fafafa';
                }
              }}
            />
          </Paper>
        </Box>
      </Box>

      <Zoom in>
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => setShowShortcuts(true)}
        >
          <KeyboardIcon />
        </Fab>
      </Zoom>

      <EventDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editingEvent={editingEvent}
        dialogTitle={dialogTitle}
        setDialogTitle={setDialogTitle}
        dialogColor={dialogColor}
        setDialogColor={setDialogColor}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        onViewAppointment={handleViewAppointment}
      />

      <CalendarShortcuts
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        calendarRef={calendarRef}
        onCreateEvent={(date) => {
          setSelectedDate(date);
          setEditingEvent(null);
          setDialogTitle("");
          setDialogOpen(true);
        }}
      />

      <style>{`
        .fc-event.custom-event,
        .fc-event.appointment-event {
          border-radius: 6px !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
          font-weight: 500 !important;
        }
        
        .fc-event.appointment-event:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
          transition: all 0.2s ease !important;
          filter: brightness(1.1) !important;
        }
        
        .fc-event.conflict-event {
          border: 2px solid #f44336 !important;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(244, 67, 54, 0); }
          100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
        }
        
        .fc-timegrid-slot-minor {
          border-top: 1px dotted #e0e0e0;
        }
        
        .fc-event-title {
          font-weight: 600 !important;
        }
        
        .fc-event {
          color: white !important;
        }
        
        .fc-event-main {
          color: inherit !important;
        }
      `}</style>
    </Box>
  );
};