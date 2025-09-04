import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Avatar, 
  Button, 
  Divider,
  Paper,
  Stack,
} from "@mui/material";
import { FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppointmentsContext } from "../../../providers/appointments/context";
import { usePatientsContext } from "../../../providers/patients/context";
import { 
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  MedicalServices as MedicalIcon,
  Assignment as AssignmentIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import MedicalCase from "../../../components/patient-casies/create-case";
import { useCasesContext } from "../../../providers/cases/context";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
  address: string;
  profileImg?: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
}

interface Appointment {
  id: string;
  patientId: string;
  appointmentType: string;
  type: string;
  date: string;
  time: string;
  reason: string;
  status: string;
  notes?: string;
}

export const AppointmentDetails: FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { appointments } = useAppointmentsContext();
  const { patients } = usePatientsContext();
  const { cases } = useCasesContext();
  const appointmentId = params.appointmentId || params.id || params.appointmentid;
  
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showMedicalCase, setShowMedicalCase] = useState(false);

  // Find the medical case for this appointment
  const medicalCase = cases.find(
    (c) => String(c.appointmentId) === String(appointmentId)
  );

  useEffect(() => {
    if (appointmentId && appointments.length > 0) {
      const foundAppointment = appointments.find(apt => {
        const aptId = String(apt.id).trim();
        const searchId = String(appointmentId).trim();
        return aptId === searchId;
      });
      
      setAppointment(foundAppointment || null);
      
      if (foundAppointment?.patientId) {
        let patientsArray = patients;
        if (!Array.isArray(patients)) {
          const patientsValues = Object.values(patients);
          if (patientsValues.length > 0 && Array.isArray(patientsValues[0])) {
            patientsArray = patientsValues[0] as any[];
          }
        }
        
        const foundPatient = patientsArray.find(p => p.id === foundAppointment.patientId);
        setPatient((foundPatient as unknown as Patient) || null);
      }
    }
  }, [appointmentId, appointments, patients, params]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled': return 'info';
      case 'confirmed': return 'success';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'no_show': return 'error';
      default: return 'default';
    }
  };

  const getConsultationTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'consultation': return '#1976d2';
      case 'follow-up': return '#2e7d32';
      case 'emergency': return '#d32f2f';
      case 'routine': return '#ed6c02';
      case 'procedure': return '#722ed1';
      case 'checkup': return '#388e3c';
      default: return '#1976d2';
    }
  };

  const handleStartCase = () => {
    console.log("🚀 Starting medical case for:", {
      appointmentId,
      patientId: appointment?.patientId,
      patient: patient?.firstName + " " + patient?.lastName
    });
    setShowMedicalCase(true);
  };

  const handleCloseMedicalCase = () => {
    console.log("❌ Closing medical case");
    setShowMedicalCase(false);
  };

  const handleEditAppointment = () => {
    navigate(`/appointments/${appointmentId}/edit`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!appointmentId) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          No Appointment ID Found
        </Typography>
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/appointments/all')}
        >
          Back to Appointments
        </Button>
      </Box>
    );
  }

  if (appointments.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Loading appointments...</Typography>
      </Box>
    );
  }

  if (!appointment) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Appointment not found</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Appointment ID: {appointmentId}
        </Typography>
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/appointments/all')}
        >
          Back to Appointments
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
      {/* Appointment Details Section */}
      <Box sx={{ mb: showMedicalCase ? 2 : 3 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Appointment Details
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Appointment ID: {appointment.id}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button 
              variant="outlined" 
              startIcon={<EditIcon />}
              onClick={handleEditAppointment}
            >
              Edit Appointment
            </Button>
            {!showMedicalCase ? (
              <Button 
                variant="contained" 
                startIcon={<MedicalIcon />}
                onClick={handleStartCase}
                color="primary"
                disabled={!appointment.patientId}
              >
                Start Medical Case
              </Button>
            ) : (
              <Button 
                variant="outlined" 
                startIcon={<CloseIcon />}
                onClick={handleCloseMedicalCase}
                color="error"
              >
                Close Medical Case
              </Button>
            )}
          </Stack>
        </Box>

        <Grid container spacing={3}>
          <Grid>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={patient?.profileImg} 
                    sx={{ width: 60, height: 60, mr: 2 }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {patient ? `${patient.firstName} ${patient.lastName}` : 'Patient Not Found'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Patient ID: {appointment.patientId}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                {patient ? (
                  <Grid container spacing={2}>
                    <Grid>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{patient.email}</Typography>
                      </Box>
                    </Grid>
                    <Grid>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{patient.phoneNumber}</Typography>
                      </Box>
                    </Grid>
                    <Grid>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{patient.address}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="body2" color="error">
                    Patient information not available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Appointment Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {formatDate(appointment.date)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {formatTime(appointment.time)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Status:</Typography>
                      <Chip 
                        label={appointment.status} 
                        color={getStatusColor(appointment.status)}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Grid>
                  <Grid>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Type:</Typography>
                      <Chip 
                        label={appointment.type}
                        size="small"
                        sx={{ 
                          mt: 0.5,
                          backgroundColor: getConsultationTypeColor(appointment.type),
                          color: 'white'
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="text.secondary">Reason:</Typography>
                    <Typography variant="body2">{appointment.reason}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Existing Medical Case Info */}
          {medicalCase && (
            <Grid>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Existing Medical Case
                  </Typography>
                  <Grid container spacing={2}>
                    <>
                      <Grid>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Diagnosis:</strong> {medicalCase.diagnosis || "-"}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Services:</strong> {medicalCase.services?.length || 0} items
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body2" color="text.secondary">
                          BP: {medicalCase.vitalSigns?.bloodPressure || "-"}, HR: {medicalCase.vitalSigns?.heartRate || "-"}, Temp: {medicalCase.vitalSigns?.temperature || "-"}, Weight: {medicalCase.vitalSigns?.weight || "-"}, Height: {medicalCase.vitalSigns?.height || "-"}
                        </Typography>
                      </Grid>
                    </>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {!showMedicalCase && (
            <Grid>
              <Paper sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button 
                    variant="contained" 
                    size="large"
                    startIcon={<AssignmentIcon />}
                    onClick={handleStartCase}
                    sx={{ minWidth: 200 }}
                    disabled={!appointment.patientId}
                  >
                    Start Medical Case
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    startIcon={<ViewIcon />}
                    onClick={() => navigate(`/patients/${appointment.patientId}`)}
                  >
                    View Patient Profile
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    startIcon={<EditIcon />}
                    onClick={handleEditAppointment}
                  >
                    Edit Appointment
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Medical Case Section - Fixed PatientId Issue */}
      {showMedicalCase && appointment && appointment.patientId ? (
        <Box sx={{ mt: 3, pt: 3, borderTop: '2px solid #e0e0e0' }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Medical Case Management
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<CloseIcon />}
              onClick={handleCloseMedicalCase}
              color="error"
            >
              Close Medical Case
            </Button>
          </Box>
          <MedicalCase 
            appointmentId={appointmentId!}
            patientId={appointment.patientId}  // ← FIXED! No longer empty string
            onClose={handleCloseMedicalCase} 
          />
        </Box>
      ) : showMedicalCase && (!appointment || !appointment.patientId) && (
        <Box sx={{ mt: 3, pt: 3, borderTop: '2px solid #e0e0e0' }}>
          <Typography variant="h6" color="error">
            Cannot start medical case: Patient information not found
          </Typography>
          <Button 
            variant="outlined" 
            onClick={handleCloseMedicalCase}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      )}
    </Box>
  );
};