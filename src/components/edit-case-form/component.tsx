import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppointmentsContext } from "../../providers/appointments";
import { usePatientsContext } from "../../providers/patients";
import { useServicesContext } from "../../providers/services";
import { useCasesContext } from "../../providers/cases/context";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import PatientSummary from "./components/patient-summary";
import VitalSignsForm from "./components/vital-signs";
import DiagnosisForm from "./components/diagnosis-form";
import SaveIcon from "@mui/icons-material/Save";
import ServicesSection from "./components/service-table";
import PrescriptionsSection from "./components/prescription-table";

export const EditCaseForm: FC = () => {
  const params = useParams();
  const caseId = params.caseId || params.id;
  const navigate = useNavigate();
  const { appointments } = useAppointmentsContext();
  const { patients } = usePatientsContext();
  const { services } = useServicesContext();
  const { cases, updateCase } = useCasesContext();

  const [appointment, setAppointment] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);
  const [caseData, setCaseData] = useState<any>(null);

  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [openPrescriptionDialog, setOpenPrescriptionDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [newPrescription, setNewPrescription] = useState<any>({
    id: "",
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  });

  const medicalCase = cases.find((c) => String(c.id) === String(caseId));

  useEffect(() => {
    if (medicalCase) {
      setCaseData({
        appointmentId: medicalCase.appointmentId,
        patientId: medicalCase.patientId,
        services: medicalCase.services || [],
        prescriptions: medicalCase.prescriptions || [],
        diagnosis: medicalCase.diagnosis || "",
        treatmentPlan: medicalCase.treatmentPlan || "",
        notes: medicalCase.notes || "",
        vitalSigns: {
          bloodPressure: medicalCase.vitalSigns?.bloodPressure || "",
          heartRate: medicalCase.vitalSigns?.heartRate || "",
          temperature: medicalCase.vitalSigns?.temperature || "",
          weight: medicalCase.vitalSigns?.weight || "",
          height: medicalCase.vitalSigns?.height || "",
        },
        symptoms: medicalCase.symptoms || [],
        followUpRequired: medicalCase.followUpRequired || false,
        followUpDate: medicalCase.followUpDate || "",
        status: medicalCase.status || "completed",
      });
    }
  }, [medicalCase]);

  useEffect(() => {
    if (caseData && appointments.length > 0) {
      const foundAppointment = appointments.find(
        (apt) => apt.id === caseData.appointmentId
      );
      setAppointment(foundAppointment || null);

      if (foundAppointment?.patientId) {
        let patientsArray = patients;
        if (!Array.isArray(patients)) {
          const patientsValues = Object.values(patients);
          if (
            patientsValues.length > 0 &&
            Array.isArray(patientsValues[0])
          ) {
            patientsArray = patientsValues[0] as any[];
          }
        }
        const foundPatient = patientsArray.find(
          (p) => p.id === foundAppointment.patientId
        );
        setPatient(foundPatient || null);
      }
    }
  }, [caseData, appointments, patients]);

  if (!cases || cases.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Loading case data...</Typography>
      </Box>
    );
  }

  if (!medicalCase) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          No case found for ID: {caseId}
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (!caseData) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Loading case data...</Typography>
      </Box>
    );
  }

  // --- Handlers ---
  const handleAddService = () => {
    if (selectedService) {
      setCaseData((prev: any) =>
        prev
          ? {
              ...prev,
              services: [...prev.services, selectedService],
            }
          : prev
      );
      setSelectedService(null);
      setOpenServiceDialog(false);
    }
  };

  const handleRemoveService = (serviceId: string) => {
    setCaseData((prev: any) =>
      prev
        ? {
            ...prev,
            services: prev.services.filter((s: any) => s.id !== serviceId),
          }
        : prev
    );
  };

  const handleAddPrescription = () => {
    if (newPrescription.medication && newPrescription.dosage) {
      const prescriptionWithId = {
        ...newPrescription,
        id: Date.now().toString(),
      };

      setCaseData((prev: any) =>
        prev
          ? {
              ...prev,
              prescriptions: [...prev.prescriptions, prescriptionWithId],
            }
          : prev
      );

      setNewPrescription({
        id: "",
        medication: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      });
      setOpenPrescriptionDialog(false);
    }
  };

  const handleRemovePrescription = (prescriptionId: string) => {
    setCaseData((prev: any) =>
      prev
        ? {
            ...prev,
            prescriptions: prev.prescriptions.filter(
              (p: any) => p.id !== prescriptionId
            ),
          }
        : prev
    );
  };

  const handleSaveCase = async () => {
    if (!medicalCase || !caseData) return;
    try {
      await updateCase(medicalCase.id, { ...caseData, id: medicalCase.id });
      alert("Medical case updated successfully!");
      navigate(`/cases/details/${medicalCase.id}`);
    } catch (error) {
      alert("Failed to update medical case. Please try again.");
    }
  };

  const calculateTotal = () => {
    return caseData.services.reduce(
      (total: number, service: any) => total + service.price,
      0
    );
  };

  // --- Render ---
  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Edit Medical Case
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Patient: {patient?.firstName} {patient?.lastName} • Appointment:{" "}
            {appointment?.date} at {appointment?.time}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/cases/details/${medicalCase?.id}`)}
          > 
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveCase}
          >
            Save Changes
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid>
          <PatientSummary patient={patient} />
        </Grid>
        <Grid>
          <Stack spacing={3}>
            <VitalSignsForm
              vitalSigns={caseData.vitalSigns}
              setVitalSigns={(vs) =>
                setCaseData((prev: any) =>
                  prev ? { ...prev, vitalSigns: vs } : prev
                )
              }
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
              setDiagnosis={(v) =>
                setCaseData((prev: any) =>
                  prev ? { ...prev, diagnosis: v } : prev
                )
              }
              treatmentPlan={caseData.treatmentPlan}
              setTreatmentPlan={(v) =>
                setCaseData((prev: any) =>
                  prev ? { ...prev, treatmentPlan: v } : prev
                )
              }
              notes={caseData.notes}
              setNotes={(v) =>
                setCaseData((prev: any) =>
                  prev ? { ...prev, notes: v } : prev
                )
              }
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};