import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  Stack, 
  Typography, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Grid
} from "@mui/material";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { useAppointmentsContext } from "../../../providers/appointments";
import { usePatientsContext } from "../../../providers/patients";
import { useServicesContext } from "../../../providers/services";
import PatientSummary from "../../edit-case-form/components/patient-summary";
import VitalSignsForm from "../../edit-case-form/components/vital-signs";
import ServicesSection from "../../edit-case-form/components/service-table";
import PrescriptionsSection from "../../edit-case-form/components/prescription-table";
import DiagnosisForm from "../../edit-case-form/components/diagnosis-form";
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
  const [selectedService, setSelectedService] = useState<any>(null);
  const [newPrescription, setNewPrescription] = useState<any>({
    id: '',
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');

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
      setCaseData((prev: typeof caseData) => ({
        ...prev,
        services: [...prev.services, selectedService]
      }));
      setSelectedService(null);
      setOpenServiceDialog(false);
      setServiceSearchQuery('');
    }
  };

  const handleRemoveService = (serviceId: string) => {
    setCaseData((prev: any) => ({
      ...prev,
      services: prev.services.filter((s: any) => s.id !== serviceId)
    }));
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
    setCaseData((prev: typeof caseData) => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((p: any) => p.id !== prescriptionId)
    }));
  };

  const handleSaveCase = () => {
    if (!appointment || !patient) return;
    
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
    }
  };

  const calculateTotal = () => {
    return caseData.services.reduce((total: number, service: any) => total + (service.price || 0), 0);
  };

  const filteredServices = services.filter(service => 
    service.name?.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(serviceSearchQuery.toLowerCase())
  );

  if (!appointment || !patient) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={3}>
        <PatientSummary patient={patient} />
        <VitalSignsForm 
          vitalSigns={caseData.vitalSigns} 
          setVitalSigns={vs => setCaseData((prev: typeof caseData) => ({ ...prev, vitalSigns: vs }))} 
        />
        <ServicesSection
          services={caseData.services}
          servicesList={services}
          openServiceDialog={openServiceDialog}
          setOpenServiceDialog={setOpenServiceDialog}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          handleAddService={handleAddService}
          handleRemoveService={handleRemoveService}
          calculateTotal={calculateTotal}
        />
        <PrescriptionsSection
          prescriptions={caseData.prescriptions}
          openPrescriptionDialog={openPrescriptionDialog}
          setOpenPrescriptionDialog={setOpenPrescriptionDialog}
          newPrescription={newPrescription}
          setNewPrescription={setNewPrescription}
          handleAddPrescription={handleAddPrescription}
          handleRemovePrescription={handleRemovePrescription}
        />
        <DiagnosisForm
          diagnosis={caseData.diagnosis}
          setDiagnosis={v => setCaseData((prev: typeof caseData) => ({ ...prev, diagnosis: v }))}
          treatmentPlan={caseData.treatmentPlan}
          setTreatmentPlan={v => setCaseData((prev: typeof caseData) => ({ ...prev, treatmentPlan: v }))}
          notes={caseData.notes}
          setNotes={v => setCaseData((prev: typeof caseData) => ({ ...prev, notes: v }))}
        />
        <Box>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveCase}
          >
            Save Case
          </Button>
        </Box>
      </Stack>

      {/* Service Selection Dialog */}
      <Dialog 
        open={openServiceDialog}
        onClose={() => setOpenServiceDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Select Medical Service</Typography>
          <Typography variant="body2" color="text.secondary">
            Choose from available services
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Search services by name, description, or category..."
            value={serviceSearchQuery}
            onChange={(e) => setServiceSearchQuery(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            autoFocus
          />

          {filteredServices.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Services Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {serviceSearchQuery ? 'Try adjusting your search terms' : 'No services available in the system'}
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredServices.map((service, index) => (
                <React.Fragment key={service.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => setSelectedService(service)}
                      selected={selectedService?.id === service.id}
                    >
                      <ListItemText
                        primary={service.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {service.description}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                              <Typography variant="caption">
                                Products: {service.products || 'General'}
                              </Typography>
                              <Typography variant="caption" fontWeight="bold">
                                Price: {service.price ? `€${service.price}` : 'Free'}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < filteredServices.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setOpenServiceDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddService} 
            variant="contained"
            disabled={!selectedService}
          >
            Add Service
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPrescriptionDialog}
        onClose={() => setOpenPrescriptionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Prescription</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Grid>
              <TextField
                fullWidth
                label="Medication"
                value={newPrescription.medication}
                onChange={(e) => setNewPrescription({
                  ...newPrescription,
                  medication: e.target.value
                })}
                required
                sx={{ width: '250px' }}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="Dosage"
                value={newPrescription.dosage}
                onChange={(e) => setNewPrescription({
                  ...newPrescription,
                  dosage: e.target.value
                })}
                placeholder="e.g., 500mg"
                required
                sx={{ width: '250px' }}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="Frequency"
                value={newPrescription.frequency}
                onChange={(e) => setNewPrescription({
                  ...newPrescription,
                  frequency: e.target.value
                })}
                placeholder="e.g., Twice daily"
                sx={{ width: '250px' }}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="Duration"
                value={newPrescription.duration}
                onChange={(e) => setNewPrescription({
                  ...newPrescription,
                  duration: e.target.value
                })}
                placeholder="e.g., 7 days"
                sx={{ width: '250px' }}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="Instructions"
                value={newPrescription.instructions}
                onChange={(e) => setNewPrescription({
                  ...newPrescription,
                  instructions: e.target.value
                })}
                multiline
                rows={3}
                placeholder="Special instructions for the patient"
                sx={{ width: '520px' }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPrescriptionDialog(false)}>
            Cancel
          </Button>
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

export { MedicalCaseForm as MedicalCase };