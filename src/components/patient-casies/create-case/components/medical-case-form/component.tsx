import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  Stack, 
  Typography, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Card,
  CardContent
} from "@mui/material";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { useAppointmentsContext } from "../../../../../providers/appointments";
import { usePatientsContext } from "../../../../../providers/patients";
import { useServicesContext } from "../../../../../providers/services";
import PatientSummary from "../../../../edit-case-form/components/patient-summary";
import VitalSignsForm from "../../../../edit-case-form/components/vital-signs";
import ServicesSection from "../../../../edit-case-form/components/service-table";
import PrescriptionsSection from "../../../../edit-case-form/components/prescription-table";
import DiagnosisForm from "../../../../edit-case-form/components/diagnosis-form";
import SaveIcon from "@mui/icons-material/Save";

export const MedicalCaseForm: FC<any> = ({
  appointmentId: propAppointmentId,
  onSave,
  embedded = false
}) => {
  const { appointmentId: paramAppointmentId } = useParams<{ appointmentId: string }>();
  const { appointments } = useAppointmentsContext();
  const { patients } = usePatientsContext();
  const { services } = useServicesContext();

  const appointmentId = propAppointmentId || paramAppointmentId;

  const [appointment, setAppointment] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState<any>({
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
  const [serviceSearchQuery, setServiceSearchQuery] = useState("");
  const [newPrescription, setNewPrescription] = useState<any>({
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
        
        if (foundPatient) {
          setLoading(false);
        }
      }
    }
  }, [appointmentId, appointments, patients]);

  const handleOpenServiceDialog = () => {
    if (document.activeElement && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setTimeout(() => {
      setOpenServiceDialog(true);
    }, 10);
  };

  const handleCloseServiceDialog = () => {
    setOpenServiceDialog(false);
    setServiceSearchQuery("");
  };

  const handleAddService = (service: any) => {
    setCaseData((prev: typeof caseData) => ({
      ...prev,
      services: [...prev.services, service]
    }));
    handleCloseServiceDialog();
  };

  const handleRemoveService = (serviceId: string) => {
    setCaseData((prev: any) => ({
      ...prev,
      services: prev.services.filter((s: any) => s.id !== serviceId)
    }));
  };

  const handleOpenPrescriptionDialog = () => {
    if (document.activeElement && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setTimeout(() => {
      setOpenPrescriptionDialog(true);
    }, 10);
  };

  const handleClosePrescriptionDialog = () => {
    setOpenPrescriptionDialog(false);
    setNewPrescription({
      id: '',
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    });
  };

  const handleAddPrescription = () => {
    if (newPrescription.medication && newPrescription.dosage) {
      const prescriptionWithId = {
        ...newPrescription,
        id: Date.now().toString()
      };
      
      setCaseData((prev: typeof caseData) => ({
        ...prev,
        prescriptions: [...prev.prescriptions, prescriptionWithId]
      }));
      handleClosePrescriptionDialog();
    }
  };

  const handleRemovePrescription = (prescriptionId: string) => {
    setCaseData((prev: typeof caseData) => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((p: any) => p.id !== prescriptionId)
    }));
  };

  const handleSaveCase = () => {
    if (!appointment || !patient) {
      console.error("❌ Cannot save case - missing appointment or patient data");
      return;
    }
    
    const completeCaseData = {
      ...caseData,
      appointmentId: appointment.id,
      patientId: patient.id,
      patient: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phoneNumber: patient.phoneNumber,
        address: patient.address,
        birthDate: patient.birthDate,
        gender: patient.gender
      },
      appointment: {
        id: appointment.id,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        date: appointment.date,
        time: appointment.time,
        duration: appointment.duration,
        status: appointment.status,
        reason: appointment.reason,
        type: appointment.type
      }
    };

    if (onSave) {
      onSave(completeCaseData);
    } else {
      console.warn("⚠️ No onSave callback provided");
    }
  };

  const calculateTotal = () => {
    return caseData.services.reduce((total: number, service: any) => total + (service.price || 0), 0);
  };

  const filteredServices = services.filter((service: any) => 
    service.name?.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(serviceSearchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Loading appointment and patient data...</Typography>
      </Box>
    );
  }

  if (!appointment || !patient) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <Typography variant="h6">Cannot Load Medical Case Form</Typography>
          <Typography variant="body2">
            {!appointment && "Appointment not found. "}
            {!patient && "Patient not found. "}
            Please check the appointment and patient data.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: embedded ? 0 : 3, maxWidth: 1400, margin: '0 auto' }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Medical Case Form
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete the medical case for {patient.firstName} {patient.lastName}
          </Typography>
        </Box>

        <PatientSummary patient={patient} />
        
        <VitalSignsForm 
          vitalSigns={caseData.vitalSigns} 
          setVitalSigns={vs => {
            setCaseData((prev: typeof caseData) => ({ ...prev, vitalSigns: vs }));
          }} 
        />
        
        <ServicesSection
          services={caseData.services}
          servicesList={services}
          openServiceDialog={openServiceDialog}
          setOpenServiceDialog={handleOpenServiceDialog}
          selectedService={null}
          setSelectedService={() => {}}
          handleAddService={() => {}}
          handleRemoveService={handleRemoveService}
          calculateTotal={calculateTotal}
        />
        
        <PrescriptionsSection
          prescriptions={caseData.prescriptions}
          openPrescriptionDialog={openPrescriptionDialog}
          setOpenPrescriptionDialog={handleOpenPrescriptionDialog}
          newPrescription={newPrescription}
          setNewPrescription={setNewPrescription}
          handleAddPrescription={handleAddPrescription}
          handleRemovePrescription={handleRemovePrescription}
        />
        
        <DiagnosisForm
          diagnosis={caseData.diagnosis}
          setDiagnosis={v => {
            setCaseData((prev: typeof caseData) => ({ ...prev, diagnosis: v }));
          }}
          treatmentPlan={caseData.treatmentPlan}
          setTreatmentPlan={v => {
            setCaseData((prev: typeof caseData) => ({ ...prev, treatmentPlan: v }));
          }}
          notes={caseData.notes}
          setNotes={v => {
            setCaseData((prev: typeof caseData) => ({ ...prev, notes: v }));
          }}
        />
        
        <Box>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveCase}
            size="large"
            sx={{ px: 4 }}
          >
            Save Medical Case & Continue to Checkout
          </Button>
        </Box>
      </Stack>

      <Dialog 
        open={openServiceDialog} 
        onClose={handleCloseServiceDialog}
        maxWidth="md"
        fullWidth
        disableEnforceFocus={true}
        disableAutoFocus={false}
        disableRestoreFocus={true}
        keepMounted={false}
        aria-labelledby="service-dialog-title"
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle id="service-dialog-title" sx={{ pb: 2 }}>
          Add Medical Service
        </DialogTitle>
        
        <DialogContent sx={{ px: 3, py: 2 }}>
          <TextField
            fullWidth
            placeholder="Search services..."
            value={serviceSearchQuery}
            onChange={(e) => setServiceSearchQuery(e.target.value)}
            sx={{ mb: 3 }}
            autoFocus
          />
          
          <Box sx={{ maxHeight: 450, overflow: 'auto' }}>
            {filteredServices.length > 0 ? (
              <Stack spacing={1}>
                {filteredServices.map((service: any, index: number) => (
                  <Card 
                    key={service.id || index}
                    variant="outlined"
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        bgcolor: 'action.hover',
                        borderColor: 'primary.main',
                        transform: 'translateY(-1px)',
                        boxShadow: 2
                      }
                    }}
                    onClick={() => handleAddService(service)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleAddService(service);
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                          <Typography variant="h6" component="div" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                            {service.name}
                          </Typography>
                          <Chip 
                            label={`$${service.price || 0}`} 
                            color="primary" 
                            variant="filled"
                            size="small"
                            sx={{ ml: 2, fontWeight: 600 }}
                          />
                        </Box>
                        
                        {service.description && (
                          <Box sx={{ mb: 1.5 }}>
                            <Typography variant="body2" color="text.secondary" component="div">
                              {service.description}
                            </Typography>
                          </Box>
                        )}
                        
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip 
                            label={service.department || 'General'} 
                            size="small" 
                            variant="outlined"
                            color="secondary"
                          />
                          <Chip 
                            label={`${service.duration || 30} min`} 
                            size="small" 
                            variant="outlined"
                            color="info"
                          />
                          {service.status && (
                            <Chip 
                              label={service.status} 
                              size="small" 
                              variant="outlined"
                              color={service.status === 'active' ? 'success' : 'default'}
                            />
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No services found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {serviceSearchQuery ? `No services match "${serviceSearchQuery}"` : "No services available"}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseServiceDialog}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openPrescriptionDialog} 
        onClose={handleClosePrescriptionDialog}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus={true}
        disableAutoFocus={false}
        disableRestoreFocus={true}
        keepMounted={false}
        aria-labelledby="prescription-dialog-title"
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle id="prescription-dialog-title" sx={{ pb: 2 }}>
          Add Prescription
        </DialogTitle>
        
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Stack spacing={2.5}>
            <Grid spacing={2} container sx={{ display: "flex", alignItems: "center", flexDirection: 'column', marginTop: 100 }}>
            <TextField
              label="Medication Name"
              value={newPrescription.medication}
              onChange={(e) => setNewPrescription((prev: any) => ({
                ...prev,
                medication: e.target.value
              }))}
              fullWidth
              required
              placeholder="e.g., Amoxicillin"
              autoFocus
            />
            
                <TextField
                  label="Dosage"
                  value={newPrescription.dosage}
                  onChange={(e) => setNewPrescription((prev: any) => ({
                    ...prev,
                    dosage: e.target.value
                  }))}
                  fullWidth
                  required
                  placeholder="e.g., 500mg"
                />
                <TextField
                  label="Frequency"
                  value={newPrescription.frequency}
                  onChange={(e) => setNewPrescription((prev: any) => ({
                    ...prev,
                    frequency: e.target.value
                  }))}
                  fullWidth
                  required
                  placeholder="e.g., 3 times daily"
                />
            
            <TextField
              label="Duration"
              value={newPrescription.duration}
              onChange={(e) => setNewPrescription((prev: any) => ({
                ...prev,
                duration: e.target.value
              }))}
              fullWidth
              required
              placeholder="e.g., 7 days"
            />
            
            <TextField
              label="Instructions"
              value={newPrescription.instructions}
              onChange={(e) => setNewPrescription((prev: any) => ({
                ...prev,
                instructions: e.target.value
              }))}
              multiline
              rows={3}
              fullWidth
              placeholder="Additional instructions for the patient..."
            />
              </Grid>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button 
            onClick={handleClosePrescriptionDialog}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddPrescription}
            variant="contained"
            disabled={!newPrescription.medication || !newPrescription.dosage}
            sx={{ minWidth: 120 }}
          >
            Add Prescription
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};