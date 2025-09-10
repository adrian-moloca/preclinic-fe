import { FC } from "react";
import { useCasesContext } from "../../../providers/cases/context";
import { usePatientsContext } from "../../../providers/patients/context";
import { useAppointmentsContext } from "../../../providers/appointments/context";
import { Box, Divider, List, ListItem, Typography } from "@mui/material";

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
};

export const CaseDetails: FC<{ caseId: string }> = ({ caseId }) => {
  const { cases } = useCasesContext();
  const { patients } = usePatientsContext();
  const { appointments } = useAppointmentsContext();

  const medicalCase = cases.find(c => c.id === caseId);

  let patient: Patient | undefined;
  let appointment;
  if (medicalCase) {
    const allPatients: Patient[] = Array.isArray(patients)
      ? patients
          .filter((p: any) => p && typeof p.id === "string" && typeof p.firstName === "string" && typeof p.lastName === "string")
          .map((p: any) => ({
            id: String(p.id),
            firstName: String(p.firstName),
            lastName: String(p.lastName)
          }))
      : Object.values(patients)
          .flat()
          .filter((p: any) => p && typeof p.id === "string" && typeof p.firstName === "string" && typeof p.lastName === "string")
          .map((p: any) => ({
            id: String(p.id),
            firstName: String(p.firstName),
            lastName: String(p.lastName)
          }));
    patient = allPatients.find(p => p.id === medicalCase.patientId);
    appointment = appointments.find(a => a.id === medicalCase.appointmentId);
  }

  if (!medicalCase) {
    return <Typography variant="body1">No case found.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5">Case Details</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1">
        Patient: {patient ? `${patient.firstName} ${patient.lastName}` : medicalCase.patientId}
      </Typography>
      <Typography variant="subtitle1">
        Appointment: {appointment ? `${appointment.date} ${appointment.time}` : medicalCase.appointmentId}
      </Typography>
      <Typography variant="subtitle1">Diagnosis: {medicalCase.diagnosis}</Typography>
      <Typography variant="subtitle1">Treatment Plan: {medicalCase.treatmentPlan}</Typography>
      <Typography variant="subtitle1">Notes: {medicalCase.notes}</Typography>
      <Typography variant="subtitle1">Vital Signs:</Typography>
      <List>
        <ListItem>Blood Pressure: {medicalCase.vitalSigns?.bloodPressure || "-"}</ListItem>
        <ListItem>Heart Rate: {medicalCase.vitalSigns?.heartRate || "-"}</ListItem>
        <ListItem>Temperature: {medicalCase.vitalSigns?.temperature || "-"}</ListItem>
        <ListItem>Weight: {medicalCase.vitalSigns?.weight || "-"}</ListItem>
        <ListItem>Height: {medicalCase.vitalSigns?.height || "-"}</ListItem>
      </List>
      <Typography variant="subtitle1">Symptoms:</Typography>
      <List>
        {medicalCase.symptoms && medicalCase.symptoms.length > 0 ? (
          medicalCase.symptoms.map(symptom => (
            <ListItem key={symptom}>{symptom}</ListItem>
          ))
        ) : (
          <ListItem>-</ListItem>
        )}
      </List>
      <Typography variant="subtitle1">
        Follow Up Required: {medicalCase.followUpRequired ? 'Yes' : 'No'}
      </Typography>
      {medicalCase.followUpRequired && (
        <Typography variant="subtitle1">Follow Up Date: {medicalCase.followUpDate}</Typography>
      )}
      <Typography variant="subtitle1">Created At: {medicalCase.createdAt ? new Date(medicalCase.createdAt).toLocaleString() : "-"}</Typography>
      <Typography variant="subtitle1">Status: {medicalCase.status}</Typography>
      <Typography variant="subtitle1">Total Amount: {medicalCase.totalAmount} €</Typography>
    </Box>
  );
};