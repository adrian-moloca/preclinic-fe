import React, { useState } from "react";
import { Box, Button, Stack, Paper } from "@mui/material";
import CheckInForm from "./components/check-in-form";
import { CheckOutForm } from "./components/check-out-form/component";
import { MedicalCaseForm } from "./components/medical-case-form/component";
import { useCasesContext } from "../../../providers/cases/context";

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

  // Step 1: Save check-in data and go to next step
  const handleCheckInSubmit = (data: any) => {
    setCheckInData(data);
    setSelected("case");
  };

  // Step 2: Save medical case data and go to next step
  const handleMedicalCaseSave = (data: any) => {
    setMedicalCaseData(data);
    setSelected("checkout");
  };

  // Step 3: Save check-out data and create the case in context
  const handleCheckOutSubmit = async (data: any) => {

    // Compose the case data
    const caseToCreate = {
      appointmentId,
      patientId,
      ...medicalCaseData,
      checkIn: checkInData,
      checkOut: data,
    };

    await createCase(caseToCreate);

    if (onClose) onClose();
    // Optionally reset state or show a message here
  };

  return (
    <Box sx={{ display: "flex", minHeight: 500 }}>
      <Paper
        elevation={2}
        sx={{
          minWidth: 180,
          p: 2,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          mr: 3,
        }}
      >
        <Stack spacing={2}>
          <Button
            variant={selected === "checkin" ? "contained" : "outlined"}
            onClick={() => setSelected("checkin")}
            fullWidth
          >
            Check-In
          </Button>
          <Button
            variant={selected === "case" ? "contained" : "outlined"}
            onClick={() => setSelected("case")}
            fullWidth
            disabled={!checkInData}
          >
            Medical Case
          </Button>
          <Button
            variant={selected === "checkout" ? "contained" : "outlined"}
            onClick={() => setSelected("checkout")}
            fullWidth
            disabled={!medicalCaseData}
          >
            Check-Out
          </Button>
        </Stack>
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
            onSubmit={handleCheckOutSubmit}
          />
        )}
      </Box>
    </Box>
  );
};