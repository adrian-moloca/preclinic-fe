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
  CircularProgress
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
    // hasLoaded: appointmentsHasLoaded 
  } = useAppointmentsContext();
  const { 
    patients, 
    getAllPatients,
    // loading: patientsLoading,
    // hasLoaded: patientsHasLoaded
  } = usePatientsContext();
  const { 
    doctors,
    fetchDoctors,
    // loading: doctorsLoading,
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogColor, setDialogColor] = useState("#2196F3");

  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentFormDate, setAppointmentFormDate] = useState<string>("");

  // Force fetch data when component mounts, regardless of hasLoaded status
  useEffect(() => {
    const initializeData = async () => {
      console.log('ScheduleCalendar: Initializing data fetch...');
      
      try {
        // Always fetch appointments when calendar loads
        const appointmentsPromise = fetchAppointments(true); // Force refresh
        console.log('Fetching appointments...');
        
        // Fetch patients if needed or force refresh
        const patientsPromise = getAllPatients ? getAllPatients() : Promise.resolve();
        console.log('Fetching patients...');
        
        // Fetch doctors if needed
        const doctorsPromise = (!doctorsHasLoaded && fetchDoctors) ? fetchDoctors() : Promise.resolve();
        console.log('Fetching doctors...');
        
        await Promise.all([appointmentsPromise, patientsPromise, doctorsPromise]);
        console.log('All data fetched successfully');
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing calendar data:', error);
        setIsInitialized(true); // Set as initialized even on error to prevent infinite retries
      }
    };
    
    initializeData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

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

  // Normalize patients data to always get an array
  const normalizedPatientsData = useMemo(() => {
    if (!patients) {
      console.log('No patients data available');
      return [];
    }

    let patientsArray = [];

    // If it's already an array, use it directly
    if (Array.isArray(patients)) {
      patientsArray = patients;
    }
    // If it's an object, check for common response structures
    else if (typeof patients === 'object') {
      // Check if the first value is an array (like in CreateAppointmentForm)
      const values = Object.values(patients);
      if (values.length > 0 && Array.isArray(values[0])) {
        patientsArray = values[0] as any[];
      } else {
        // Otherwise, flatten all values
        patientsArray = Object.values(patients).flat();
      }
    }

    console.log(`Normalized ${patientsArray.length} patients`);
    if (patientsArray.length > 0) {
      console.log('Sample patient structure:', patientsArray[0]);
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

  const appointmentEvents = useMemo(() => {
    if (!appointments || !Array.isArray(appointments)) {
      console.log('No appointments available');
      return [];
    }

    if (normalizedPatientsData.length === 0) {
      console.log('No patients data available yet');
      // Don't return empty - show appointments even without patient names initially
    }

    console.log(`Processing ${appointments.length} appointments with ${normalizedPatientsData.length} patients`);

    return appointments.map((appointment: any) => {
      // Try to find the patient
      let patient = null;
      let patientName = 'Loading...';

      if (normalizedPatientsData.length > 0) {
        patient = normalizedPatientsData.find((p: any) => {
          // Try multiple ID field combinations
          const patientId = p._id || p.id;
          const appointmentPatientId = appointment.patientId;
          
          if (!patientId || !appointmentPatientId) return false;
          
          // Direct comparison
          if (patientId === appointmentPatientId) return true;
          
          // String comparison (in case one is object)
          if (String(patientId) === String(appointmentPatientId)) return true;
          
          // Case insensitive comparison
          if (String(patientId).toLowerCase() === String(appointmentPatientId).toLowerCase()) return true;
          
          return false;
        });

        if (patient) {
          patientName = `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Unnamed Patient';
        } else {
          console.warn(`Patient not found for appointment:`, {
            appointmentId: appointment.id,
            patientIdSearched: appointment.patientId,
            samplePatientIds: normalizedPatientsData.slice(0, 3).map((p: any) => ({ _id: p._id, id: p.id }))
          });
          patientName = 'Patient Not Found';
        }
      }

      const startDateTime = new Date(`${appointment.date}T${appointment.time}`);
      const endDateTime = new Date(startDateTime.getTime() + (parseInt(appointment.duration) || 30) * 60000);

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
      };
    });
  }, [appointments, normalizedPatientsData, getAppointmentColor, refreshKey, colorBy]);

  useEffect(() => {
    setEvents([...appointmentEvents, ...customEvents]);
  }, [appointmentEvents, customEvents]);

  const handleColorByChange = (newColorBy: 'type' | 'doctor' | 'department') => {
    console.log(`🔄 Changing color mode from ${colorBy} to ${newColorBy}`);
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
    // Refresh appointments after saving
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

  // Show loading state only on initial load
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

                  // const expectedColor = props.expectedColor;
                  // const actualColor = info.event.backgroundColor;

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
          <Typography variant="h6">
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
          background-color: rgba(63, 61, 255, 0.05) !important;
          cursor: pointer !important;
        }
        
        .fc-day-today {
          background-color: rgba(63, 61, 255, 0.1) !important;
        }
      `}</style>
    </Box>
  );
};