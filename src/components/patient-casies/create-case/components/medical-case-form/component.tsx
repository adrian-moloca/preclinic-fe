import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
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
    if (onSave) {
      onSave({
        ...caseData,
        appointmentId: appointment.id,
        patientId: patient.id,
      });
    }
  };

  const calculateTotal = () => {
    return caseData.services.reduce((total: number, service: any) => total + service.price, 0);
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
      <Stack spacing={3}>
        <PatientSummary patient={patient} />
        <VitalSignsForm vitalSigns={caseData.vitalSigns} setVitalSigns={vs => setCaseData((prev: typeof caseData) => ({ ...prev, vitalSigns: vs }))} />
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
      </Box>
  );
};