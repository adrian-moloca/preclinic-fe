import React, { useState } from "react";
import { Box, TextField, Button, Stack, Typography, Chip, Alert } from "@mui/material";

export interface CheckIn {
  id: string;
  patientId: string;
  appointmentId: string;
  checkInTime: string;
  symptoms: string[];
  notes?: string;
}

interface CheckInFormProps {
  patientId: string;
  appointmentId: string;
  onSubmit: (data: CheckIn) => void;
}

export const CheckInForm: React.FC<CheckInFormProps> = ({
  patientId,
  appointmentId,
  onSubmit,
}) => {
  const [checkInTime, setCheckInTime] = useState<string>(
    new Date().toISOString().slice(0, 16) // Default to current time
  );
  const [symptomInput, setSymptomInput] = useState<string>("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>("");

  const handleAddSymptom = () => {
    if (symptomInput.trim() !== "") {
      setSymptoms((prev) => [...prev, symptomInput.trim()]);
      setSymptomInput("");
    }
  };

  const handleRemoveSymptom = (symptom: string) => {
    setSymptoms((prev) => prev.filter((s) => s !== symptom));
  };

  const handleSymptomsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSymptomInput(value);
    if (value.includes(",")) {
      const newSymptoms = value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !symptoms.includes(s));
      if (newSymptoms.length > 0) {
        setSymptoms((prev) => [...prev, ...newSymptoms]);
        setSymptomInput("");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkInTime) {
      alert("Please select a check-in time");
      return;
    }

    const checkInData: CheckIn = {
      id: `${appointmentId}-${Date.now()}`,
      patientId,
      appointmentId,
      checkInTime,
      symptoms,
      notes,
    };
    
    console.log("📋 Check-in form submitted:", checkInData);
    onSubmit(checkInData);
  };

  if (!patientId || !appointmentId) {
    return (
      <Alert severity="error">
        <Typography variant="h6">Check-In Form Error</Typography>
        <Typography variant="body2">
          Missing patient ID or appointment ID. Cannot proceed with check-in.
        </Typography>
      </Alert>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Patient Check-In
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Patient ID: {patientId} | Appointment ID: {appointmentId}
          </Typography>
        </Box>

        <TextField
          label="Check-In Time"
          type="datetime-local"
          value={checkInTime}
          onChange={(e) => setCheckInTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />
        
        <Box>
          <TextField
            label="Add Symptoms"
            value={symptomInput}
            onChange={handleSymptomsInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSymptom();
              }
            }}
            helperText="Press Enter or use comma to add multiple symptoms"
            fullWidth
            placeholder="e.g., headache, fever, cough"
          />
          <Button
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={handleAddSymptom}
            disabled={!symptomInput.trim()}
          >
            Add Symptom
          </Button>
        </Box>

        {symptoms.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Reported Symptoms:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {symptoms.map((symptom) => (
                <Chip
                  key={symptom}
                  label={symptom}
                  onDelete={() => handleRemoveSymptom(symptom)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        <TextField
          label="Additional Notes"
          multiline
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes about the patient's condition or concerns..."
          fullWidth
        />

        <Button 
          type="submit" 
          variant="contained" 
          size="large"
          sx={{ py: 1.5 }}
        >
          Complete Check-In & Continue to Medical Case
        </Button>
      </Stack>
    </Box>
  );
};