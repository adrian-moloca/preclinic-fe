import React, { useState } from "react";
import { Box, Button, Stack, Paper, Typography, LinearProgress } from "@mui/material";
import CheckInForm from "./components/check-in-form";
import { CheckOutForm } from "./components/check-out-form/component";
import { MedicalCaseForm } from "./components/medical-case-form/component";
import { useCasesContext } from "../../../providers/cases/context";
import { CheckCircle, RadioButtonUnchecked, Schedule } from "@mui/icons-material";

interface CaseMenuProps {
  patientId: string;
  appointmentId: string;
  onClose?: () => void;
}

export const MedicalCase: React.FC<CaseMenuProps> = ({
  patientId,
  appointmentId,
  onClose,
}) => {
  const [selected, setSelected] = useState<"checkin" | "case" | "checkout">("checkin");
  const [checkInData, setCheckInData] = useState<any>(null);
  const [medicalCaseData, setMedicalCaseData] = useState<any>(null);

  const { createCase } = useCasesContext();

  const getProgress = () => {
    if (selected === "checkin") return 33;
    if (selected === "case") return 66;
    return 100;
  };

  const handleCheckInSubmit = (data: any) => {
    setCheckInData(data);
    setSelected("case");
  };

  const handleMedicalCaseSave = (data: any) => {
    setMedicalCaseData(data);
    setSelected("checkout");
  };

  const handleCheckOutSubmit = async (data: any) => {
    
    const caseToCreate = {
      appointmentId,
      patientId,
      ...medicalCaseData,
      checkIn: checkInData,
      checkOut: data,
    };

    try {
      await createCase(caseToCreate);
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      console.error("❌ Error creating medical case:", error);
    }
  };

  const getStepIcon = (step: "checkin" | "case" | "checkout") => {
    if (step === "checkin" && checkInData) return <CheckCircle color="success" />;
    if (step === "case" && medicalCaseData) return <CheckCircle color="success" />;
    if (step === "checkout") return selected === "checkout" ? <Schedule color="primary" /> : <RadioButtonUnchecked />;
    return selected === step ? <Schedule color="primary" /> : <RadioButtonUnchecked />;
  };

  const getStepText = (step: "checkin" | "case" | "checkout") => {
    if (step === "checkin" && checkInData) return "Check-In Complete ✓";
    if (step === "case" && medicalCaseData) return "Medical Case Complete ✓";
    if (step === "checkout") return "Check-Out & Invoice";
    return step === "checkin" ? "Check-In" : step === "case" ? "Medical Case" : "Check-Out";
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Medical Case Progress
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={getProgress()} 
          sx={{ height: 8, borderRadius: 4, mb: 2 }}
        />
        <Typography variant="body2" color="text.secondary">
          Step {selected === "checkin" ? "1" : selected === "case" ? "2" : "3"} of 3
        </Typography>
      </Box>

      <Box sx={{ display: "flex", minHeight: 500 }}>
        <Paper
          elevation={2}
          sx={{
            minWidth: 200,
            p: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            mr: 3,
          }}
        >
          <Stack spacing={2} sx={{ width: '100%' }}>
            <Button
              variant={selected === "checkin" ? "contained" : "outlined"}
              onClick={() => setSelected("checkin")}
              fullWidth
              startIcon={getStepIcon("checkin")}
              sx={{ justifyContent: 'flex-start' }}
            >
              {getStepText("checkin")}
            </Button>
            <Button
              variant={selected === "case" ? "contained" : "outlined"}
              onClick={() => setSelected("case")}
              fullWidth
              disabled={!checkInData}
              startIcon={getStepIcon("case")}
              sx={{ justifyContent: 'flex-start' }}
            >
              {getStepText("case")}
            </Button>
            <Button
              variant={selected === "checkout" ? "contained" : "outlined"}
              onClick={() => setSelected("checkout")}
              fullWidth
              disabled={!medicalCaseData}
              startIcon={getStepIcon("checkout")}
              sx={{ justifyContent: 'flex-start' }}
            >
              {getStepText("checkout")}
            </Button>
          </Stack>

          {/* Debug Info */}
          <Box sx={{ mt: 3, p: 1, bgcolor: 'grey.100', borderRadius: 1, width: '100%' }}>
            <Typography variant="caption" display="block">
              <strong>Patient:</strong> {patientId}
            </Typography>
            <Typography variant="caption" display="block">
              <strong>Appointment:</strong> {appointmentId}
            </Typography>
            <Typography variant="caption" display="block" color="success.main">
              <strong>Check-in:</strong> {checkInData ? "✓" : "✗"}
            </Typography>
            <Typography variant="caption" display="block" color="success.main">
              <strong>Case Data:</strong> {medicalCaseData ? "✓" : "✗"}
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ flex: 1 }}>
          {selected === "checkin" && (
            <CheckInForm
              patientId={patientId}
              appointmentId={appointmentId}
              onSubmit={handleCheckInSubmit}
            />
          )}
          {selected === "case" && (
            <MedicalCaseForm
              appointmentId={appointmentId}
              embedded
              onSave={handleMedicalCaseSave}
            />
          )}
          {selected === "checkout" && (
            <CheckOutForm
              patientId={patientId}
              appointmentId={appointmentId}
              checkInData={checkInData}
              medicalCaseData={medicalCaseData}
              onSubmit={handleCheckOutSubmit}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};