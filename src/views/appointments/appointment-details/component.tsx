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
    setShowMedicalCase(true);
  };

  const handleCloseMedicalCase = () => {
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
            <Card sx={{ width: "300px", height: "300px" }}>
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
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {patient.phoneNumber || 'Not provided'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {patient.email || 'Not provided'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {patient.address || 'Not provided'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {patient.gender || 'Not specified'} • 
                        Born: {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString() : 'Not provided'}
                      </Typography>
                    </Box>
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Patient information not available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid>
            <Card sx={{ width: "300px", height: "300px" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Appointment Information
                </Typography>
                
                <Divider sx={{ mb: 2 }} />
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon color="action" fontSize="small" />
                    <Typography variant="body2">
                      {formatDate(appointment.date)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon color="action" fontSize="small" />
                    <Typography variant="body2">
                      {formatTime(appointment.time)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MedicalIcon color="action" fontSize="small" />
                    <Typography variant="body2">
                      Method: {appointment.appointmentType}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Type:
                    </Typography>
                    <Chip 
                      label={appointment.type?.charAt(0).toUpperCase() + appointment.type?.slice(1)} 
                      size="small"
                      sx={{ 
                        bgcolor: getConsultationTypeColor(appointment.type), 
                        color: 'white' 
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Status:
                    </Typography>
                    <Chip 
                      label={appointment.status?.replace('_', ' ').toUpperCase()} 
                      color={getStatusColor(appointment.status) as any}
                      size="small"
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid>
            <Card sx={{ width: "300px", height: "300px" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Appointment Details
                </Typography>
                
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid>
                    <Typography variant="subtitle2" gutterBottom>
                      Reason for Visit:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appointment.reason || 'Not specified'}
                    </Typography>
                  </Grid>
                  
                  <Grid>
                    <Typography variant="subtitle2" gutterBottom>
                      Additional Notes:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appointment.notes || 'No additional notes'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {patient && (
            <Grid>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Medical Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={3}>
                    <Grid>
                      <Typography variant="subtitle2" gutterBottom>
                        Medical History:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {medicalCase?.notes ||
                          patient.medicalHistory ||
                          "No medical history recorded"}
                      </Typography>
                    </Grid>
                    <Grid>
                      <Typography variant="subtitle2" gutterBottom>
                        Known Allergies:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {patient.allergies || "No known allergies"}
                      </Typography>
                    </Grid>
                    <Grid>
                      <Typography variant="subtitle2" gutterBottom>
                        Current Medications:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {patient.currentMedications || "No current medications"}
                      </Typography>
                    </Grid>
                    {medicalCase && (
                      <>
                        <Grid>
                          <Typography variant="subtitle2" gutterBottom>
                            Diagnosis:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {medicalCase.diagnosis || "No diagnosis recorded"}
                          </Typography>
                        </Grid>
                        <Grid>
                          <Typography variant="subtitle2" gutterBottom>
                            Treatment Plan:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {medicalCase.treatmentPlan || "No treatment plan recorded"}
                          </Typography>
                        </Grid>
                        <Grid>
                          <Typography variant="subtitle2" gutterBottom>
                            Vital Signs:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            BP: {medicalCase.vitalSigns?.bloodPressure || "-"}, HR: {medicalCase.vitalSigns?.heartRate || "-"}, Temp: {medicalCase.vitalSigns?.temperature || "-"}, Weight: {medicalCase.vitalSigns?.weight || "-"}, Height: {medicalCase.vitalSigns?.height || "-"}
                          </Typography>
                        </Grid>
                      </>
                    )}
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

      {showMedicalCase && (
        <Box sx={{ mt: 3, pt: 3, borderTop: '2px solid #e0e0e0' }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Medical Case Management
            </Typography>
          </Box>
          <MedicalCase 
            appointmentId={appointmentId!}
            onClose={handleCloseMedicalCase} 
            patientId={""}         
             />
        </Box>
      )}
    </Box>
  );
};