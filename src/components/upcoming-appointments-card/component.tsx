import { Box, Button, Divider, FormControl, MenuItem, Select, Typography, Dialog, Avatar } from "@mui/material";
import { FC, useState, useMemo } from "react";
import { format, isToday, isThisWeek, isThisMonth, parseISO } from "date-fns";
import User from "../../assets/user.png";
import AppointmentIcon from "../../assets/appointment.png";
import ClockIcon from "../../assets/clock.png";
import ChatIcon from "../../assets/messenger.png";
import VideoIcon from "../../assets/cam-recorder.png";
import { Chat } from "../../views/chat/component";
import { useAppointmentsContext } from "../../providers/appointments/context";
import { usePatientsContext } from "../../providers/patients/context";
import { AppointmentsEntry } from "../../providers/appointments/types";
import { PatientsEntry } from "../../providers/patients/types";
import {
  ButtonContentWrapper,
  ButtonsWrapper,
  DepartmentWrapper,
  HeaderWrapper,
  InfonWrapper,
  UpcomingAppointmentsWrapper,
  UserWrapper,
} from "./styled";

export const UpcomingAppointmentsCard: FC = () => {
  const [period, setPeriod] = useState("Today");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { appointments } = useAppointmentsContext();
  const { patients } = usePatientsContext();

  const handleChatOpen = () => {
    setIsChatOpen(true);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
  };

  const allAppointments = useMemo(() => {
    if (!appointments) return [];
    return Array.isArray(appointments) ? appointments : [];
  }, [appointments]);

  const allPatients = useMemo(() => {
    if (!patients) return [];
    return Array.isArray(patients) ? patients : Object.values(patients).flat();
  }, [patients]);

  const nextAppointment = useMemo(() => {
    if (!allAppointments || allAppointments.length === 0) return null;

    const now = new Date();

    const filteredAppointments = allAppointments.filter((appointment: AppointmentsEntry) => {
      if (!appointment.date || !appointment.time) return false;

      try {
        const appointmentDate = parseISO(appointment.date);
        const [hours, minutes] = appointment.time.split(':');
        const appointmentDateTime = new Date(
          appointmentDate.getFullYear(),
          appointmentDate.getMonth(),
          appointmentDate.getDate(),
          parseInt(hours) || 0,
          parseInt(minutes) || 0
        );

        if (appointmentDateTime <= now) return false;

        switch (period) {
          case "Today":
            return isToday(appointmentDate);
          case "This week":
            return isThisWeek(appointmentDate);
          case "This month":
            return isThisMonth(appointmentDate);
          default:
            return true;
        }
      } catch {
        return false;
      }
    });

    return filteredAppointments.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    })[0] || null;
  }, [allAppointments, period]);

  const appointmentPatient = useMemo(() => {
    if (!nextAppointment || !allPatients) return null;

    const patientId = nextAppointment.patientId ||
      (nextAppointment.patients && nextAppointment.patients.length > 0 ? nextAppointment.patients[0] : null);

    return (allPatients as PatientsEntry[]).find((p) => p._id === patientId) || null;
  }, [nextAppointment, allPatients]);

  const formatAppointmentTime = (time: string) => {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getAppointmentType = (type: string) => {
    if (!type) return 'General Visit';
    switch (type.toLowerCase()) {
      case 'online':
        return 'Online Consultation';
      case 'consultation':
      case 'in person':
        return 'In-Person Visit';
      default:
        return type;
    }
  };

  if (!nextAppointment) {
    return (
      <UpcomingAppointmentsWrapper>
        <HeaderWrapper>
          <Typography variant="h6" fontWeight={600}>
            Upcoming Appointment
          </Typography>
          <FormControl size="small">
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="This week">This week</MenuItem>
              <MenuItem value="This month">This month</MenuItem>
            </Select>
          </FormControl>
        </HeaderWrapper>

        <Divider />

        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            color: 'text.secondary'
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            No upcoming appointments {period.toLowerCase()}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Check a different time period or schedule a new appointment
          </Typography>
        </Box>
      </UpcomingAppointmentsWrapper>
    );
  }

  return (
    <>
      <UpcomingAppointmentsWrapper>
        <HeaderWrapper>
          <Typography variant="h6" fontWeight={600}>
            Upcoming Appointment
          </Typography>
          <FormControl size="small">
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="This week">This week</MenuItem>
              <MenuItem value="This month">This month</MenuItem>
            </Select>
          </FormControl>
        </HeaderWrapper>

        <Divider />

        <UserWrapper>
          <Avatar
            src={appointmentPatient?.profileImg || User}
            alt={appointmentPatient ? `${appointmentPatient.firstName} ${appointmentPatient.lastName}` : 'Patient'}
            sx={{ width: 50, height: 50 }}
          >
            {appointmentPatient && !appointmentPatient.profileImg &&
              `${appointmentPatient.firstName?.[0] || ''}${appointmentPatient.lastName?.[0] || ''}`
            }
          </Avatar>
          <Box>
            <Typography fontWeight={600} fontSize={16}>
              {appointmentPatient
                ? `${appointmentPatient.firstName || ''} ${appointmentPatient.lastName || ''}`.trim()
                : 'Unknown Patient'
              }
            </Typography>
            <Typography variant="body2" color="text.secondary">
              #{appointmentPatient?._id || nextAppointment.patientId || 'N/A'}
            </Typography>
          </Box>
        </UserWrapper>

        <Box>
          <Typography fontWeight={600} mb={1}>
            {nextAppointment.reason || getAppointmentType(nextAppointment.appointmentType)}
          </Typography>
          <InfonWrapper>
            <img
              src={AppointmentIcon}
              alt="Appointment"
              style={{ width: 18, height: 18 }}
            />
            <Typography variant="body2" color="text.secondary">
              {format(parseISO(nextAppointment.date), 'EEEE, dd MMM yyyy')}
            </Typography>
          </InfonWrapper>
          <InfonWrapper>
            <img
              src={ClockIcon}
              alt="Time"
              style={{ width: 18, height: 18 }}
            />
            <Typography variant="body2" color="text.secondary">
              {formatAppointmentTime(nextAppointment.time)}
            </Typography>
          </InfonWrapper>
        </Box>

        <DepartmentWrapper>
          <Box>
            <Typography fontWeight={600} fontSize={14}>
              Department
            </Typography>
            <Typography variant="body2" color="text.secondary">
              General Medicine
            </Typography>
          </Box>
          <Box>
            <Typography fontWeight={600} fontSize={14}>
              Type
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getAppointmentType(nextAppointment.appointmentType)}
            </Typography>
          </Box>
        </DepartmentWrapper>

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 1,
            textTransform: "none",
            fontWeight: 600
          }}
        >
          {nextAppointment.appointmentType?.toLowerCase() === 'online' ? 'Join Online' : 'Start Appointment'}
        </Button>

        <Divider />

        <ButtonsWrapper>
          <Button
            variant="outlined"
            fullWidth
            sx={{ textTransform: "none", fontWeight: 500 }}
            onClick={handleChatOpen}
          >
            <ButtonContentWrapper>
              <img src={ChatIcon} alt="Chat" style={{ width: 20, height: 20 }} />
              <Typography color="text.primary">Chat</Typography>
            </ButtonContentWrapper>
          </Button>

          {nextAppointment.appointmentType?.toLowerCase() === 'online' && (
            <Button
              variant="outlined"
              fullWidth
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              <ButtonContentWrapper>
                <img src={VideoIcon} alt="Video" style={{ width: 20, height: 20 }} />
                <Typography color="text.primary">Video Call</Typography>
              </ButtonContentWrapper>
            </Button>
          )}
        </ButtonsWrapper>
      </UpcomingAppointmentsWrapper>

      {/* Chat Dialog - No props needed for your Chat component */}
      <Dialog
        open={isChatOpen}
        onClose={handleChatClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '80vh',
          }
        }}
      >
        <Chat />
      </Dialog>
    </>
  );
};
