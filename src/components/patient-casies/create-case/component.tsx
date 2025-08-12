import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import { FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppointmentsContext } from "../../../providers/appointments/context";
import { usePatientsContext } from "../../../providers/patients/context";
import { useServicesContext } from "../../../providers/services/context";
import {
  Add as AddIcon,
  LocalPharmacy as PharmacyIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon
} from "@mui/icons-material";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
}

interface PrescriptionItem {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface CaseData {
  appointmentId: string;
  services: Service[];
  prescriptions: PrescriptionItem[];
  diagnosis: string;
  treatmentPlan: string;
  notes: string;
  vitalSigns: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    weight: string;
    height: string;
  };
  symptoms: string[];
  followUpRequired: boolean;
  followUpDate: string;
}

interface MedicalCaseProps {
  appointmentId?: string;
  onClose?: () => void;
  embedded?: boolean;
}

export const MedicalCase: FC<MedicalCaseProps> = ({ 
  appointmentId: propAppointmentId, 
  onClose, 
  embedded = false 
}) => {
  const { appointmentId: paramAppointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { appointments } = useAppointmentsContext();
  const { patients } = usePatientsContext();
  const { services } = useServicesContext();

  // Use prop appointmentId if provided, otherwise use URL param
  const appointmentId = propAppointmentId || paramAppointmentId;

  const [appointment, setAppointment] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);
  const [caseData, setCaseData] = useState<CaseData>({
    appointmentId: appointmentId || '',
    services: [],
    prescriptions: [],
    diagnosis: '',
    treatmentPlan: '',
    notes: '',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      height: ''
    },
    symptoms: [],
    followUpRequired: false,
    followUpDate: ''
  });

  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [openPrescriptionDialog, setOpenPrescriptionDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [newPrescription, setNewPrescription] = useState<PrescriptionItem>({
    id: '',
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  useEffect(() => {
    if (appointmentId && appointments.length > 0) {
      const foundAppointment = appointments.find(apt => apt.id === appointmentId);
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
        setPatient(foundPatient || null);
      }
    }
  }, [appointmentId, appointments, patients]);

  const handleAddService = () => {
    if (selectedService) {
      setCaseData(prev => ({
        ...prev,
        services: [...prev.services, selectedService]
      }));
      setSelectedService(null);
      setOpenServiceDialog(false);
    }
  };

  const handleRemoveService = (serviceId: string) => {
    setCaseData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== serviceId)
    }));
  };

  const handleAddPrescription = () => {
    if (newPrescription.medication && newPrescription.dosage) {
      const prescriptionWithId = {
        ...newPrescription,
        id: Date.now().toString()
      };
      
      setCaseData(prev => ({
        ...prev,
        prescriptions: [...prev.prescriptions, prescriptionWithId]
      }));
      
      setNewPrescription({
        id: '',
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
      setOpenPrescriptionDialog(false);
    }
  };

  const handleRemovePrescription = (prescriptionId: string) => {
    setCaseData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.filter(p => p.id !== prescriptionId)
    }));
  };

  const handleSaveCase = () => {
    // Save logic here
    console.log('Saving case data:', caseData);
    
    if (embedded && onClose) {
      // If embedded, call onClose instead of navigate
      alert('Medical case saved successfully!');
      onClose();
    } else {
      // If not embedded, navigate back
      alert('Medical case saved successfully!');
      navigate(`/appointments/${appointmentId}`);
    }
  };

  const calculateTotal = () => {
    return caseData.services.reduce((total, service) => total + service.price, 0);
  };

  // Render header based on embedded mode
  const renderHeader = () => {
    if (embedded) {
      return (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              Patient: {patient?.firstName} {patient?.lastName} • Appointment: {appointment?.date} at {appointment?.time}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button 
              variant="contained" 
              startIcon={<SaveIcon />}
              onClick={handleSaveCase}
            >
              Save Case
            </Button>
            {onClose && (
              <Button 
                variant="outlined" 
                onClick={onClose}
              >
                Close
              </Button>
            )}
          </Stack>
        </Box>
      );
    }

    // Original header for standalone mode
    return (
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Medical Case
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Patient: {patient?.firstName} {patient?.lastName} • Appointment: {appointment?.date} at {appointment?.time}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            onClick={() => navigate(`/appointments/${appointmentId}`)}
          >
            Back to Appointment
          </Button>
          <Button 
            variant="contained" 
            startIcon={<SaveIcon />}
            onClick={handleSaveCase}
          >
            Save Case
          </Button>
        </Stack>
      </Box>
    );
  };

  if (!appointment || !patient) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: embedded ? 0 : 3, maxWidth: 1400, margin: '0 auto' }}>
      {renderHeader()}

      <Grid container spacing={3}>
        {/* Patient Summary */}
        <Grid>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Patient
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Name:</strong> {patient.firstName} {patient.lastName}
                </Typography>
                <Typography variant="body2">
                  <strong>Age:</strong> {patient.birthDate ? new Date().getFullYear() - new Date(patient.birthDate).getFullYear() : 'N/A'} years
                </Typography>
                <Typography variant="body2">
                  <strong>Gender:</strong> {patient.gender || 'Not specified'}
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> {patient.phoneNumber || 'Not provided'}
                </Typography>
                <Typography variant="body2">
                  <strong>Allergies:</strong> {patient.allergies || 'None known'}
                </Typography>
                <Typography variant="body2">
                  <strong>Current Medications:</strong> {patient.currentMedications || 'None'}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid>
          <Stack spacing={3}>
            {/* Vital Signs */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Vital Signs</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid>
                    <TextField
                      label="Blood Pressure"
                      placeholder="120/80"
                      value={caseData.vitalSigns.bloodPressure}
                      onChange={(e) => setCaseData(prev => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, bloodPressure: e.target.value }
                      }))}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      label="Heart Rate"
                      placeholder="72 bpm"
                      value={caseData.vitalSigns.heartRate}
                      onChange={(e) => setCaseData(prev => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, heartRate: e.target.value }
                      }))}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      label="Temperature"
                      placeholder="36.5°C"
                      value={caseData.vitalSigns.temperature}
                      onChange={(e) => setCaseData(prev => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, temperature: e.target.value }
                      }))}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      label="Weight"
                      placeholder="70 kg"
                      value={caseData.vitalSigns.weight}
                      onChange={(e) => setCaseData(prev => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, weight: e.target.value }
                      }))}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      label="Height"
                      placeholder="175 cm"
                      value={caseData.vitalSigns.height}
                      onChange={(e) => setCaseData(prev => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, height: e.target.value }
                      }))}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Services */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Services Provided</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenServiceDialog(true)}
                  >
                    Add Service
                  </Button>
                </Box>
                
                {caseData.services.length > 0 && (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Service</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {caseData.services.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {service.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {service.description}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={service.category || 'General'} size="small" />
                            </TableCell>
                            <TableCell align="right">
                              ${service.price.toFixed(2)}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleRemoveService(service.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={2}><strong>Total</strong></TableCell>
                          <TableCell align="right"><strong>${calculateTotal().toFixed(2)}</strong></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </AccordionDetails>
            </Accordion>

            {/* Prescriptions */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Prescriptions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<PharmacyIcon />}
                    onClick={() => setOpenPrescriptionDialog(true)}
                  >
                    Add Prescription
                  </Button>
                </Box>
                
                {caseData.prescriptions.length > 0 && (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Medication</TableCell>
                          <TableCell>Dosage</TableCell>
                          <TableCell>Frequency</TableCell>
                          <TableCell>Duration</TableCell>
                          <TableCell>Instructions</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {caseData.prescriptions.map((prescription) => (
                          <TableRow key={prescription.id}>
                            <TableCell>{prescription.medication}</TableCell>
                            <TableCell>{prescription.dosage}</TableCell>
                            <TableCell>{prescription.frequency}</TableCell>
                            <TableCell>{prescription.duration}</TableCell>
                            <TableCell>{prescription.instructions}</TableCell>
                            <TableCell align="center">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleRemovePrescription(prescription.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </AccordionDetails>
            </Accordion>

            {/* Diagnosis and Treatment */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Diagnosis & Treatment Plan</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <TextField
                    label="Diagnosis"
                    multiline
                    rows={3}
                    value={caseData.diagnosis}
                    onChange={(e) => setCaseData(prev => ({ ...prev, diagnosis: e.target.value }))}
                    fullWidth
                    placeholder="Enter primary and secondary diagnoses..."
                  />
                  
                  <TextField
                    label="Treatment Plan"
                    multiline
                    rows={4}
                    value={caseData.treatmentPlan}
                    onChange={(e) => setCaseData(prev => ({ ...prev, treatmentPlan: e.target.value }))}
                    fullWidth
                    placeholder="Enter detailed treatment plan..."
                  />
                  
                  <TextField
                    label="Additional Notes"
                    multiline
                    rows={3}
                    value={caseData.notes}
                    onChange={(e) => setCaseData(prev => ({ ...prev, notes: e.target.value }))}
                    fullWidth
                    placeholder="Any additional notes or observations..."
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Grid>
      </Grid>

      {/* Service Selection Dialog */}
      <Dialog open={openServiceDialog} onClose={() => setOpenServiceDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Select Service</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {services.map((service) => (
              <Grid key={service.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    border: selectedService?.id === service.id ? '2px solid #1976d2' : '1px solid #e0e0e0'
                  }}
                  onClick={() => setSelectedService(service)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {service.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {service.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      {/* <Chip label={service.category || 'General'} size="small" /> */}
                      <Typography variant="h6" color="primary">
                        ${service.price.toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenServiceDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddService} 
            variant="contained"
            disabled={!selectedService}
          >
            Add Service
          </Button>
        </DialogActions>
      </Dialog>

      {/* Prescription Dialog */}
      <Dialog open={openPrescriptionDialog} onClose={() => setOpenPrescriptionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Prescription</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Medication Name"
              value={newPrescription.medication}
              onChange={(e) => setNewPrescription(prev => ({ ...prev, medication: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Dosage"
              value={newPrescription.dosage}
              onChange={(e) => setNewPrescription(prev => ({ ...prev, dosage: e.target.value }))}
              fullWidth
              placeholder="e.g., 500mg"
              required
            />
            <TextField
              label="Frequency"
              value={newPrescription.frequency}
              onChange={(e) => setNewPrescription(prev => ({ ...prev, frequency: e.target.value }))}
              fullWidth
              placeholder="e.g., Twice daily"
            />
            <TextField
              label="Duration"
              value={newPrescription.duration}
              onChange={(e) => setNewPrescription(prev => ({ ...prev, duration: e.target.value }))}
              fullWidth
              placeholder="e.g., 7 days"
            />
            <TextField
              label="Special Instructions"
              value={newPrescription.instructions}
              onChange={(e) => setNewPrescription(prev => ({ ...prev, instructions: e.target.value }))}
              fullWidth
              multiline
              rows={2}
              placeholder="e.g., Take with food"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPrescriptionDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddPrescription} 
            variant="contained"
            disabled={!newPrescription.medication || !newPrescription.dosage}
          >
            Add Prescription
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};