// src/components/patient-casies/create-case/components/check-in-form/component.tsx
import React, { useState } from "react";
import { Box, TextField, Button, Stack, Typography, Chip } from "@mui/material";

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
  const [checkInTime, setCheckInTime] = useState<string>("");
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
    const checkInData: CheckIn = {
      id: `${appointmentId}-${Date.now()}`,
      patientId,
      appointmentId,
      checkInTime,
      symptoms,
      notes,
    };
    onSubmit(checkInData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Check-In</Typography>
        <TextField
          label="Check-In Time"
          type="datetime-local"
          value={checkInTime}
          onChange={(e) => setCheckInTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
        <Box>
          <TextField
            label="Add Symptom"
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
          />
          <Button
            variant="outlined"
            sx={{ ml: 1, mt: 1 }}
            onClick={handleAddSymptom}
          >
            Add
          </Button>
        </Box>
        <Box>
          {symptoms.map((symptom) => (
            <Chip
              key={symptom}
              label={symptom}
              onDelete={() => handleRemoveSymptom(symptom)}
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
        <TextField
          label="Notes"
          multiline
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button type="submit" variant="contained">
          Save Check-In
        </Button>
      </Stack>
    </Box>
  );
};