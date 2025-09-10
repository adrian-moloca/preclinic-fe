import { FC, useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import {
  PatentDetailsWrapper,
} from "../prescription-form/style";
import { DividerFormWrapper, PaperFormWrapper } from "../create-leaves-form/style";
import { MedicalAlert } from '../../providers/medical-decision-support/types';
import PrescriptionSafetyChecker from "../prescription-safety-checker";

export const EditPrescriptionForm: FC = () => {
  const { prescription, updatePrescription } = usePrescriptionContext();
  const { patients } = usePatientsContext();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Prescription | null>(null);
  const [errors, setErrors] = useState<any>(null);
  const [safetyAlerts, setSafetyAlerts] = useState<MedicalAlert[]>([]);

  const patientsArray: PatientsEntry[] = Array.isArray(patients)
    ? (patients as PatientsEntry[])
    : Array.isArray(Object.values(patients)[0])
      ? (Object.values(patients)[0] as PatientsEntry[])
      : [];

  useEffect(() => {
    let selectedPrescription: Prescription | undefined;
    if (prescription && id) {
      if ((prescription as any).id === id) {
        selectedPrescription = (prescription as Record<string, Prescription>)[id];
      } else if (typeof prescription === "object" && !(prescription as any).id) {
        selectedPrescription = (prescription as Record<string, Prescription>)[id];
      }
    }
    if (selectedPrescription) {
      setForm(selectedPrescription);
      setErrors({
        patientId: false,
        dateIssued: false,
        diagnosis: false,
        notes: false,
        medications: selectedPrescription.medications.map(() => ({
          name: false,
          dosage: false,
          frequency: false,
          duration: false,
          instructions: false,
        })),
      });
    }
  }, [id, prescription]);

  const handleChange = (field: keyof Prescription, value: string) => {
    if (!form) return;
    setForm({ ...form, [field]: value });
    setErrors((prev: any) => ({ ...prev, [field]: false }));
  };

  const handleMedicationChange = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    if (!form) return;
    const updatedMeds = [...form.medications];
    updatedMeds[index] = { ...updatedMeds[index], [field]: value };
    setForm({ ...form, medications: updatedMeds });

    setErrors((prev: any) => {
      const updatedErrors = [...prev.medications];
      updatedErrors[index][field] = false;
      return { ...prev, medications: updatedErrors };
    });
  };

  const addMedication = () => {
    if (!form) return;
    const newMed: Medication = {
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    };
    setForm({ ...form, medications: [...form.medications, newMed] });
    setErrors((prev: any) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          name: false,
          dosage: false,
          frequency: false,
          duration: false,
          instructions: false,
        },
      ],
    }));
  };

  const removeMedication = (index: number) => {
    if (!form) return;
    const updatedMeds = form.medications.filter((_, i) => i !== index);
    setForm({ ...form, medications: updatedMeds });
    setErrors((prev: any) => ({
      ...prev,
      medications: prev.medications.filter((_: any, i: number) => i !== index),
    }));
  };

  const validate = (): boolean => {
    if (!form) return false;

    const newErrors = {
      patientId: !form.patientId,
      dateIssued: !form.dateIssued,
      diagnosis: !form.diagnosis,
      notes: !form.notes,
      medications: form.medications.map((med) => ({
        name: !med.name,
        dosage: !med.dosage,
        frequency: !med.frequency,
        duration: !med.duration,
        instructions: !med.instructions,
      })),
    };

    setErrors(newErrors);

    const isValid =
      !newErrors.patientId &&
      !newErrors.dateIssued &&
      !newErrors.diagnosis &&
      !newErrors.notes &&
      !newErrors.medications.some((med) =>
        Object.values(med).some((val) => val)
      );

    return isValid;
  };

  const handleSubmit = () => {
    if (!form) return;
    if (!validate()) return;

    updatePrescription(form.id, form);
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

  if (!form || !errors) return <Typography>Loading...</Typography>;

  return (
    <PaperFormWrapper>
      <Typography variant="h5" gutterBottom>
        Edit Prescription
      </Typography>
      <DividerFormWrapper />

      <PatentDetailsWrapper>
        <TextField
          select
          label="Select Patient"
          value={form.patientId}
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
              const patient = patientsArray.find((p) => p.id === selected);
              return patient ? `${patient.firstName} ${patient.lastName}` : "";
            },
          }}
        >
          {patientsArray.length > 0 ? (
            patientsArray.map((patient) => (
              <MenuItem
                key={patient.id}
                value={patient.id}
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
          value={form.dateIssued}
          onChange={(e) => handleChange("dateIssued", e.target.value)}
          error={errors.dateIssued}
          helperText={errors.dateIssued && "Date is required"}
          fullWidth
          sx={{ mb: 2, width: 500 }}
        />

        <TextField
          label="Diagnosis"
          value={form.diagnosis}
          onChange={(e) => handleChange("diagnosis", e.target.value)}
          error={errors.diagnosis}
          helperText={errors.diagnosis && "Diagnosis is required"}
          fullWidth
          sx={{ mb: 2, width: 500 }}
        />

        <TextField
          label="Notes"
          value={form.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          error={errors.notes}
          helperText={errors.notes && "Notes are required"}
          rows={3}
          fullWidth
          sx={{ mb: 3, width: 500 }}
        />
      </PatentDetailsWrapper>

      {form.patientId && (
        <Box sx={{ mb: 3, maxWidth: 1020, mx: 'auto' }}>
          <PrescriptionSafetyChecker
            patientId={form.patientId}
            medications={form.medications.map(med => med.name).filter(Boolean)}
            onAlertsChange={setSafetyAlerts}
          />
        </Box>
      )}

      <Typography variant="h5" gutterBottom>
        Medications
      </Typography>

      {form.medications.map((med, index) => (
        <Box key={index} sx={{ p: 2, mb: 2 }}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1">Medication {index + 1}</Typography>
            {form.medications.length > 1 && (
              <IconButton color="error" onClick={() => removeMedication(index)}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
          <PatentDetailsWrapper>
            <TextField
              label="Name"
              value={med.name}
              onChange={(e) =>
                handleMedicationChange(index, "name", e.target.value)
              }
              error={errors.medications[index]?.name}
              helperText={errors.medications[index]?.name && "Required"}
              fullWidth
              sx={{ mt: 1, width: 500 }}
            />
            <TextField
              label="Dosage"
              value={med.dosage}
              onChange={(e) =>
                handleMedicationChange(index, "dosage", e.target.value)
              }
              error={errors.medications[index]?.dosage}
              helperText={errors.medications[index]?.dosage && "Required"}
              fullWidth
              sx={{ mt: 1, width: 500 }}
            />
            <TextField
              label="Frequency"
              value={med.frequency}
              onChange={(e) =>
                handleMedicationChange(index, "frequency", e.target.value)
              }
              error={errors.medications[index]?.frequency}
              helperText={errors.medications[index]?.frequency && "Required"}
              fullWidth
              sx={{ mt: 1, width: 500 }}
            />
            <TextField
              label="Duration"
              value={med.duration}
              onChange={(e) =>
                handleMedicationChange(index, "duration", e.target.value)
              }
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
              helperText={
                errors.medications[index]?.instructions && "Required"
              }
              fullWidth
              sx={{ mt: 1, width: 1010 }}
            />
          </PatentDetailsWrapper>
        </Box>
      ))}

      {/* UPDATED BUTTON SECTION WITH SAFETY ALERTS */}
      <Box display="flex" gap={2} justifyContent={"center"} flexDirection="column" alignItems="center">
        <Box display="flex" gap={2}>
          <Button variant="outlined" onClick={addMedication}>
            + Add Medication
          </Button>
          <Button 
            variant="contained" 
            disabled={hasBlockingAlerts}
            onClick={handleSubmit}
            color={hasBlockingAlerts ? 'error' : 'primary'}
            sx={{ minWidth: 200 }}
          >
            {hasBlockingAlerts ? 'Resolve Critical Alerts First' : 'Update Prescription'}
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
  );
};