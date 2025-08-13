import { FC } from "react";
import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";

export const PatientSummary: FC<{ patient: any }> = ({ patient }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Patient
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={1}>
        <Typography variant="body2">
          <strong>Name:</strong> {patient?.firstName} {patient?.lastName}
        </Typography>
        <Typography variant="body2">
          <strong>Age:</strong>{" "}
          {patient?.birthDate
            ? new Date().getFullYear() - new Date(patient.birthDate).getFullYear()
            : "N/A"}{" "}
          years
        </Typography>
        <Typography variant="body2">
          <strong>Gender:</strong> {patient?.gender || "Not specified"}
        </Typography>
        <Typography variant="body2">
          <strong>Phone:</strong> {patient?.phoneNumber || "Not provided"}
        </Typography>
        <Typography variant="body2">
          <strong>Allergies:</strong> {patient?.allergies || "None known"}
        </Typography>
        <Typography variant="body2">
          <strong>Current Medications:</strong>{" "}
          {patient?.currentMedications || "None"}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);
