import React, { useState, useEffect, useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateClickArg } from "@fullcalendar/interaction";
import type { EventClickArg, EventDropArg } from "@fullcalendar/core";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Chip,
  Typography,
  Fab,
  Zoom,
  ButtonGroup,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  useTheme
} from "@mui/material";
import {
  Keyboard as KeyboardIcon,
  Warning as ConflictIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { format } from "date-fns";
import { useAppointmentsContext } from "../../providers/appointments/context";
import { usePatientsContext } from "../../providers/patients/context";
import { useDoctorsContext } from "../../providers/doctor/context";
import { APPOINTMENT_TYPE_COLORS, CalendarEvent, DEPARTMENT_COLORS, DOCTOR_COLORS } from "./components/types/types";
import MiniCalendarWidget from "./components/mini-calendar-widget";
import ConflictDetector from "./components/conflict-detector";
import EventDialog from "./components/event-dialog";
import CalendarShortcuts from "./components/calendar-shortcuts";
import CreateAppointmentForm from "../create-appointment-form";

export const ScheduleCalendar: React.FC = () => {
  const {
    appointments,
    fetchAppointments,
    loading: appointmentsLoading,
  } = useAppointmentsContext();
  const {
    patients,
    getAllPatients,
  } = usePatientsContext();
  const {
    doctors,
    fetchDoctors,
    hasLoaded: doctorsHasLoaded
  } = useDoctorsContext();
  const navigate = useNavigate();

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [colorBy, setColorBy] = useState<'type' | 'doctor' | 'department'>('doctor');
  const [showConflicts, setShowConflicts] = useState(true);
  const [showMiniCalendar, setShowMiniCalendar] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [calendarRef, setCalendarRef] = useState<FullCalendar | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const theme = useTheme();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogColor, setDialogColor] = useState("#2196F3");

  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentFormDate, setAppointmentFormDate] = useState<string>("");

  useEffect(() => {
    const initializeData = async () => {

      try {
        const appointmentsPromise = fetchAppointments(true);

        const patientsPromise = getAllPatients ? getAllPatients() : Promise.resolve();

        const doctorsPromise = (!doctorsHasLoaded && fetchDoctors) ? fetchDoctors() : Promise.resolve();

        await Promise.all([appointmentsPromise, patientsPromise, doctorsPromise]);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing calendar data:', error);
        setIsInitialized(true);
      }
    };

    initializeData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const normalizedPatientsData = useMemo(() => {
    if (!patients) {
      console.log('No patients data available');
      return [];
    }

    let patientsArray = [];

    if (Array.isArray(patients)) {
      patientsArray = patients;
    }
    else if (typeof patients === 'object') {
      const values = Object.values(patients);
      if (values.length > 0 && Array.isArray(values[0])) {
        patientsArray = values[0] as any[];
      } else {
        patientsArray = Object.values(patients).flat();
      }
    }

    return patientsArray;
  }, [patients]);

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

  const orderedDoctorIds = useMemo(() => {
    if (!appointments || !Array.isArray(appointments)) return [];

    const uniqueIds = Array.from(new Set(
      appointments
        .map(apt => apt.doctorId)
        .filter(id => id && id.trim() !== '')
    ));

    return uniqueIds.sort();
  }, [appointments]);

  const orderedDepartments = useMemo(() => {
    if (!appointments || !Array.isArray(appointments)) return [];

    const uniqueDepartments = Array.from(new Set(
      appointments
        .map(apt => {
          if (typeof apt.department === 'string') {
            return apt.department;
          } else if (apt.department && typeof apt.department === 'object' && apt.department.name) {
            return apt.department.name;
          }
          return '';
        })
        .filter(dept => dept && dept.trim() !== '')
    ));

    return uniqueDepartments.sort();
  }, [appointments]);

  const getAppointmentColor = useCallback((appointment: { appointmentType: keyof typeof APPOINTMENT_TYPE_COLORS; doctorId?: string; department?: any }) => {
    switch (colorBy) {
      case 'type':
        return APPOINTMENT_TYPE_COLORS[appointment.appointmentType] || '#2196F3';

      case 'doctor':
        const doctorIndex = orderedDoctorIds.indexOf(appointment.doctorId ?? '');
        return DOCTOR_COLORS[doctorIndex % DOCTOR_COLORS.length] || '#2196F3';

      case 'department':
        let departmentName = '';
        if (typeof appointment.department === 'string') {
          departmentName = appointment.department;
        } else if (appointment.department && typeof appointment.department === 'object' && appointment.department.name) {
          departmentName = appointment.department.name;
        }
        const departmentIndex = orderedDepartments.indexOf(departmentName);
        const departmentColorsArray = Object.values(DEPARTMENT_COLORS);
        return departmentColorsArray[departmentIndex % departmentColorsArray.length] || '#2196F3';

      default:
        return '#2196F3';
    }
  }, [colorBy, orderedDoctorIds, orderedDepartments]);

  const appointmentEvents = useMemo<CalendarEvent[]>(() => {
    if (!appointments || !Array.isArray(appointments)) return [];
    const now = new Date();

    return appointments
      .map((appointment: any) => {
        let patient = null;
        let patientName = 'Loading...';

        if (normalizedPatientsData.length > 0) {
          patient = normalizedPatientsData.find((p: any) => {
            const patientId = p._id || p.id;
            const appointmentPatientId = appointment.patientId;
            if (!patientId || !appointmentPatientId) return false;
            return String(patientId).toLowerCase() === String(appointmentPatientId).toLowerCase();
          });

          if (patient) {
            patientName = `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Unnamed Patient';
          } else {
            patientName = 'Patient Not Found';
          }
        }

        const startDateTime = new Date(`${appointment.date}T${appointment.time}`);
        const endDateTime = new Date(startDateTime.getTime() + (parseInt(appointment.duration) || 30) * 60000);

        if (endDateTime < now) return null;

        const eventColor = getAppointmentColor(appointment);

        let departmentName = '';
        if (typeof appointment.department === 'string') {
          departmentName = appointment.department;
        } else if (appointment.department && typeof appointment.department === 'object' && appointment.department.name) {
          departmentName = appointment.department.name;
        }

        return {
          id: `appointment-${appointment.id}-${refreshKey}`,
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
            expectedColor: eventColor,
            colorMode: colorBy,
          }
        } as CalendarEvent;
      })
      .filter((e): e is CalendarEvent => e !== null);
  }, [appointments, normalizedPatientsData, getAppointmentColor, refreshKey, colorBy]);

  useEffect(() => {
    setEvents([...appointmentEvents, ...customEvents]);
  }, [appointmentEvents, customEvents]);

  useEffect(() => {
    const styleWeekendHeaders = () => {
      const allHeaderCells = document.querySelectorAll('.fc-col-header-cell');

      allHeaderCells.forEach((cell, index) => {
        if (cell instanceof HTMLElement) {
          const isWeekend = index === 0 || index === allHeaderCells.length - 1;

          if (isWeekend) {
            cell.style.setProperty('background-color',
              theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : '#f5f5f5',
              'important'
            );
          } else {
            cell.style.setProperty('background-color', 'transparent', 'important');
          }
        }
      });
    };

    const timer = setTimeout(styleWeekendHeaders, 100);

    return () => clearTimeout(timer);
  }, [theme.palette.mode, refreshKey, colorBy]);

  const handleColorByChange = (newColorBy: 'type' | 'doctor' | 'department') => {
    setColorBy(newColorBy);
    setRefreshKey(prev => prev + 1);
  };

  const handleDateClick = (info: DateClickArg) => {
    const clickedDate = info.dateStr;
    setSelectedDate(clickedDate);
    setAppointmentFormDate(clickedDate);
    setShowAppointmentForm(true);
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

  const handleAppointmentFormSave = async () => {
    setShowAppointmentForm(false);
    setAppointmentFormDate("");
    await fetchAppointments(true);
  };

  const handleAppointmentFormCancel = () => {
    setShowAppointmentForm(false);
    setAppointmentFormDate("");
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
          fontWeight: isAppointment ? 500 : 400,
          fontSize: '0.7rem',
          lineHeight: 1.2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {event.title}
        </Typography>
      </Box>
    );
  };

  const colorModeOptions = [
    { value: 'doctor', label: 'By Doctor' },
    { value: 'type', label: 'By Type' },
    { value: 'department', label: 'By Department' }
  ];

  if (!isInitialized && appointmentsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', width: '100%', marginTop: "10px" }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          Schedule Calendar
        </Typography>

        <Box display="flex" gap={1} alignItems="center">
          <ButtonGroup variant="outlined" size="small">
            {colorModeOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => handleColorByChange(option.value as 'type' | 'doctor' | 'department')}
                variant={colorBy === option.value ? 'contained' : 'outlined'}
              >
                {option.label}
              </Button>
            ))}
          </ButtonGroup>

          <Button
            variant={showConflicts ? "contained" : "outlined"}
            size="small"
            onClick={() => setShowConflicts(!showConflicts)}
            startIcon={<ConflictIcon />}
          >
            Conflicts
          </Button>

          <Button
            variant={showMiniCalendar ? "contained" : "outlined"}
            size="small"
            onClick={() => setShowMiniCalendar(!showMiniCalendar)}
          >
            Mini Calendar
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 2, p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Color Legend
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {colorBy === 'doctor' && orderedDoctorIds.map((doctorId, index) => {
            const doctor = normalizeDoctorsData.find((d: any) =>
              (d._id && d._id === doctorId) || (d.id && d.id === doctorId)
            );
            const doctorName = doctor && typeof doctor === 'object' && 'firstName' in doctor && 'lastName' in doctor
              ? `Dr. ${(doctor as any).firstName} ${(doctor as any).lastName}`
              : `Doctor ${doctorId}`;
            const color = DOCTOR_COLORS[index % DOCTOR_COLORS.length];

            return (
              <Chip
                key={doctorId}
                label={doctorName}
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

          {colorBy === 'type' && Object.entries(APPOINTMENT_TYPE_COLORS).map(([type, color]) => {
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

          {colorBy === 'department' && orderedDepartments.map((department, index) => {
            const departmentColorsArray = Object.values(DEPARTMENT_COLORS);
            const color = departmentColorsArray[index % departmentColorsArray.length];

            return (
              <Chip
                key={department}
                label={department.charAt(0).toUpperCase() + department.slice(1)}
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
              key={`calendar-${colorBy}-${refreshKey}`}
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
                  const doctor = normalizeDoctorsData.find((d: any) =>
                    (d._id && d._id === props.doctorId) || (d.id && d.id === props.doctorId)
                  );
                  const doctorName = doctor && typeof doctor === 'object' && 'firstName' in doctor && 'lastName' in doctor
                    ? `Dr. ${(doctor as any).firstName} ${(doctor as any).lastName}`
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
                  info.el.classList.add('fc-weekend-cell');
                }
              }}

              viewDidMount={() => {
                setTimeout(() => {
                  const headers = document.querySelectorAll('.fc-col-header-cell');
                  headers.forEach((cell, index) => {
                    if (index === 0 || index === headers.length - 1) {
                      (cell as HTMLElement).style.setProperty(
                        'background-color',
                        theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : '#f5f5f5',
                        'important'
                      );
                    } else {
                      (cell as HTMLElement).style.setProperty(
                        'background-color',
                        'transparent',
                        'important'
                      );
                    }
                  });
                }, 10);
              }}

              datesSet={() => {
                setTimeout(() => {
                  const headers = document.querySelectorAll('.fc-col-header-cell');
                  headers.forEach((cell, index) => {
                    if (index === 0 || index === headers.length - 1) {
                      (cell as HTMLElement).style.setProperty(
                        'background-color',
                        theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : '#f5f5f5',
                        'important'
                      );
                    } else {
                      (cell as HTMLElement).style.setProperty(
                        'background-color',
                        'transparent',
                        'important'
                      );
                    }
                  });
                }, 10);
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

      <Dialog
        open={showAppointmentForm}
        onClose={handleAppointmentFormCancel}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'primary.main',
          color: 'primary.contrastText'
        }}>
          <Typography variant="h6" component="div">
            Create Appointment - {appointmentFormDate && format(new Date(appointmentFormDate), 'MMM d, yyyy')}
          </Typography>
          <IconButton
            onClick={handleAppointmentFormCancel}
            sx={{ color: 'primary.contrastText' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box>
            <CreateAppointmentForm
              defaultDate={appointmentFormDate}
              onSave={handleAppointmentFormSave}
              onCancel={handleAppointmentFormCancel}
              embedded={true}
            />
          </Box>
        </DialogContent>
      </Dialog>

      <style>{`
  /* Event styles */
  .fc-event.custom-event,
  .fc-event.appointment-event {
    border-radius: 6px !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    font-size: 12px !important;
    padding: 2px 4px !important;
  }
  
  .fc-event:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
    transform: translateY(-1px) !important;
    transition: all 0.2s ease !important;
  }
  
  .fc-daygrid-day:hover {
    background-color: ${theme.palette.mode === 'dark'
          ? 'rgba(63, 61, 255, 0.08)'
          : 'rgba(63, 61, 255, 0.05)'} !important;
    cursor: pointer !important;
  }
  
  .fc-day-today {
    background-color: ${theme.palette.mode === 'dark'
          ? 'rgba(63, 61, 255, 0.2)'
          : 'rgba(63, 61, 255, 0.1)'} !important;
  }
  
  /* Weekend BODY cells */
  .fc-weekend-cell {
    background-color: ${theme.palette.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : '#f5f5f5'} !important;
  }
  
  /* ALL header cells - remove white background */
  .fc-col-header-cell {
    background-color: ${theme.palette.mode === 'dark'
          ? 'transparent'
          : 'transparent'} !important;
  }
  
  /* Weekend HEADER cells specifically */
  .fc-col-header-cell.fc-day-sun,
  .fc-col-header-cell.fc-day-sat,
  .fc-col-header-cell:first-child,
  .fc-col-header-cell:last-child {
    background-color: ${theme.palette.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : '#f5f5f5'} !important;
  }
  
  /* Weekday HEADER cells (Mon-Fri) - fix white background */
  .fc-col-header-cell:not(.fc-day-sun):not(.fc-day-sat):not(:first-child):not(:last-child) {
    background-color: ${theme.palette.mode === 'dark'
          ? 'transparent'
          : 'transparent'} !important;
  }
  
  /* Override any inline styles on weekend elements */
  [class*="fc-day-sun"],
  [class*="fc-day-sat"] {
    background-color: ${theme.palette.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : '#f5f5f5'} !important;
  }
  
  /* Ensure child elements are transparent */
  .fc-weekend-cell .fc-daygrid-day-frame,
  .fc-weekend-cell .fc-daygrid-day-bg,
  .fc-weekend-cell .fc-daygrid-day-top,
  .fc-weekend-cell .fc-daygrid-day-bottom {
    background-color: transparent !important;
  }
  
  /* Dark mode specific adjustments */
  ${theme.palette.mode === 'dark' ? `
    /* Remove white from ALL header components */
    .fc-col-header,
    .fc-scrollgrid-sync-inner,
    .fc-col-header-cell-cushion,
    .fc-scrollgrid-section-header,
    .fc-scrollgrid-sync-table {
      background-color: transparent !important;
      background: transparent !important;
    }
    
    /* Force weekday headers to be transparent */
    .fc th:not(.fc-day-sun):not(.fc-day-sat) {
      background-color: transparent !important;
      background: transparent !important;
    }
    
    /* Borders */
    .fc-theme-standard td,
    .fc-theme-standard th {
      border-color: rgba(255, 255, 255, 0.1);
    }
    
    /* Ensure text is visible */
    .fc-col-header-cell-cushion {
      color: rgba(255, 255, 255, 0.9);
    }
  ` : ''}
`}</style>
    </Box>
  );
};