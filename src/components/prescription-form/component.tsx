import { FC, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  MenuItem,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { usePrescriptionContext } from "../../providers/prescriptions";
import { Medication, Prescription } from "../../providers/prescriptions/types";
import { PatientsEntry } from "../../providers/patients/types";
import { usePatientsContext } from "../../providers/patients";
import { PatentDetailsWrapper, PrescriptionFormWrapper } from "./style";
import { useNavigate } from "react-router-dom";
import { DividerFormWrapper, PaperFormWrapper } from "../create-leaves-form/style";
import { MedicalAlert } from '../../providers/medical-decision-support/types';
import PrescriptionSafetyChecker from "../prescription-safety-checker";
import { useWorkflowEvents } from "../../providers/workflow-automation/integrations";

export const PrescriptionForm: FC = () => {
  const { addPrescription } = usePrescriptionContext();
  const { patients } = usePatientsContext();
  const navigate = useNavigate();
  const { emitPrescriptionAdded } = useWorkflowEvents();

  const [safetyAlerts, setSafetyAlerts] = useState<MedicalAlert[]>([]);

  const isFormValid = () => {
    return (
      prescription.patientId &&
      prescription.dateIssued &&
      prescription.diagnosis &&
      prescription.notes &&
      prescription.medications.every((med) =>
        Object.values(med).every((val) => val)
      )
    );
  };

  const patientsArray: PatientsEntry[] = Array.isArray(patients)
    ? (patients as PatientsEntry[])
    : Array.isArray(Object.values(patients)[0])
      ? (Object.values(patients)[0] as PatientsEntry[])
      : [];

  const [prescription, setPrescription] = useState<Prescription>({
    id: crypto.randomUUID(),
    patientId: "",
    dateIssued: "",
    diagnosis: "",
    notes: "",
    medications: [
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" }
    ]
  });

  const [errors, setErrors] = useState({
    patientId: false,
    dateIssued: false,
    diagnosis: false,
    notes: false,
    medications: prescription.medications.map(() => ({
      name: false,
      dosage: false,
      frequency: false,
      duration: false,
      instructions: false
    }))
  });

  const handleChange = (field: keyof Prescription, value: string) => {
    setPrescription((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleMedicationChange = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    setPrescription((prev) => {
      const updated = [...prev.medications];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, medications: updated };
    });

    setErrors((prev) => {
      const meds = [...prev.medications];
      meds[index][field] = false;
      return { ...prev, medications: meds };
    });
  };

  const addMedication = () => {
    setPrescription((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" }
      ]
    }));

    setErrors((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          name: false,
          dosage: false,
          frequency: false,
          duration: false,
          instructions: false
        }
      ]
    }));
  };

  const removeMedication = (index: number) => {
    setPrescription((prev) => {
      const updated = prev.medications.filter((_, i) => i !== index);
      return { ...prev, medications: updated };
    });

    setErrors((prev) => {
      const updated = prev.medications.filter((_, i) => i !== index);
      return { ...prev, medications: updated };
    });
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {
      patientId: !prescription.patientId,
      dateIssued: !prescription.dateIssued,
      diagnosis: !prescription.diagnosis,
      notes: !prescription.notes,
      medications: prescription.medications.map((med) => ({
        name: !med.name,
        dosage: !med.dosage,
        frequency: !med.frequency,
        duration: !med.duration,
        instructions: !med.instructions
      }))
    };
    setErrors(newErrors);

    return !(
      newErrors.patientId ||
      newErrors.dateIssued ||
      newErrors.diagnosis ||
      newErrors.notes ||
      newErrors.medications.some((med) =>
        Object.values(med).some((val) => val === true)
      )
    );
  };

  const handleSubmit = () => {
    if (!validate()) return;

    addPrescription(prescription);

    const patient = patientsArray.find(p => p._id === prescription.patientId);
    if (patient) {
      emitPrescriptionAdded(prescription, patient);
    }
    setPrescription({
      id: crypto.randomUUID(),
      patientId: "",
      dateIssued: "",
      diagnosis: "",
      notes: "",
      medications: [
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" }
      ]
    });
    navigate("/prescriptions/all");
  };

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 224,
        width: 250,
      },
    },
  };

  const criticalAlerts = safetyAlerts.filter(alert => alert.severity === 'critical');
  const hasBlockingAlerts = criticalAlerts.length > 0;

  return (
    <PrescriptionFormWrapper>
      <PaperFormWrapper>
        <Typography variant="h5" gutterBottom>
          Create Prescription
        </Typography>
        <DividerFormWrapper />
        <PatentDetailsWrapper>
          <TextField
            select
            label="Select Patient"
            value={prescription.patientId}
            onChange={(e) => handleChange("patientId", e.target.value)}
            error={errors.patientId}
            helperText={errors.patientId && "Please select a patient"}
            fullWidth
            sx={{ width: 500, marginY: 1 }}
            required
            SelectProps={{
              MenuProps: menuProps,
              renderValue: (selected) => {
                if (!selected) return <em>Select a patient</em>;
                const patient = patientsArray.find(
                  (p: PatientsEntry) => p._id === selected
                );
                return patient ? `${patient.firstName} ${patient.lastName}` : "";
              },
            }}
          >
            {patientsArray.length > 0 ? (
              patientsArray.map((patient: PatientsEntry) => (
                <MenuItem
                  key={patient._id}
                  value={patient._id}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Avatar
                    alt={`${patient.firstName} ${patient.lastName}`}
                    src={patient.profileImg || ""}
                    sx={{ width: 30, height: 30 }}
                  />
                  {patient.firstName} {patient.lastName}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No patients available</MenuItem>
            )}
          </TextField>

          <TextField
            label="Date Issued"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={prescription.dateIssued}
            onChange={(e) => handleChange("dateIssued", e.target.value)}
            error={errors.dateIssued}
            helperText={errors.dateIssued && "Date is required"}
            fullWidth
            sx={{ mt: 1, width: 500 }}
          />

          <TextField
            label="Diagnosis"
            value={prescription.diagnosis}
            onChange={(e) => handleChange("diagnosis", e.target.value)}
            error={errors.diagnosis}
            helperText={errors.diagnosis && "Diagnosis is required"}
            fullWidth
            sx={{ mb: 2, width: 500 }}
          />

          <TextField
            label="Notes"
            value={prescription.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            error={errors.notes}
            helperText={errors.notes && "Notes are required"}
            rows={3}
            fullWidth
            sx={{ mb: 2, width: 500 }}
          />
        </PatentDetailsWrapper>

        {prescription.patientId && (
          <Box sx={{ mb: 3, maxWidth: 1020, mx: 'auto' }}>
            <PrescriptionSafetyChecker
              patientId={prescription.patientId}
              medications={prescription.medications.map(med => med.name).filter(Boolean)}
              onAlertsChange={setSafetyAlerts}
            />
          </Box>
        )}

        <Typography variant="h5" gutterBottom>
          Medications
        </Typography>

        {prescription.medications.map((med, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              mb: 2,
            }}
          >
            <Box display="flex" justifyContent="center" alignItems={"center"}>
              <Typography variant="subtitle1">Medication {index + 1}</Typography>
              {prescription.medications.length > 1 && (
                <IconButton color="error" onClick={() => removeMedication(index)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
            <PatentDetailsWrapper>

              <TextField
                label="Name"
                value={med.name}
                onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                error={errors.medications[index]?.name}
                helperText={errors.medications[index]?.name && "Required"}
                fullWidth
                sx={{ mt: 1, width: 500 }}
              />
              <TextField
                label="Dosage"
                value={med.dosage}
                onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                error={errors.medications[index]?.dosage}
                helperText={errors.medications[index]?.dosage && "Required"}
                fullWidth
                sx={{ mt: 1, width: 500 }}
              />
              <TextField
                label="Frequency"
                value={med.frequency}
                onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                error={errors.medications[index]?.frequency}
                helperText={errors.medications[index]?.frequency && "Required"}
                fullWidth
                sx={{ mt: 1, width: 500 }}
              />
              <TextField
                label="Duration"
                value={med.duration}
                onChange={(e) => handleMedicationChange(index, "duration", e.target.value)}
                error={errors.medications[index]?.duration}
                helperText={errors.medications[index]?.duration && "Required"}
                fullWidth
                sx={{ mt: 1, width: 500 }}
              />
              <TextField
                label="Instructions"
                value={med.instructions}
                onChange={(e) =>
                  handleMedicationChange(index, "instructions", e.target.value)
                }
                error={errors.medications[index]?.instructions}
                helperText={errors.medications[index]?.instructions && "Required"}
                fullWidth
                sx={{ mt: 1, width: 1010 }}
              />
            </PatentDetailsWrapper>
          </Box>
        ))}

        <Box display="flex" gap={2} justifyContent={"center"} flexDirection="column" alignItems="center">
          <Box display="flex" gap={2}>
            <Button variant="outlined" onClick={addMedication}>
              + Add Medication
            </Button>
            <Button
              variant="contained"
              disabled={!isFormValid() || hasBlockingAlerts}
              onClick={handleSubmit}
              color={hasBlockingAlerts ? 'error' : 'primary'}
              sx={{ minWidth: 200 }}
            >
              {hasBlockingAlerts ? 'Resolve Critical Alerts First' : 'Save Prescription'}
            </Button>
          </Box>

          {safetyAlerts.length > 0 && (
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Typography variant="body2" color="text.secondary">
                {safetyAlerts.length} safety alert{safetyAlerts.length > 1 ? 's' : ''} detected
              </Typography>
              {criticalAlerts.length > 0 && (
                <Typography variant="body2" color="error.main" fontWeight={600}>
                  ({criticalAlerts.length} critical)
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </PaperFormWrapper>
    </PrescriptionFormWrapper>
  );
};