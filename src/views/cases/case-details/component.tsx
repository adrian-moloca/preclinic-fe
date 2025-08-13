import { FC, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCasesContext } from "../../../providers/cases/context";
import { usePatientsContext } from "../../../providers/patients";
import { useAppointmentsContext } from "../../../providers/appointments";

export const CaseDetails: FC = () => {
  const params = useParams();
  const caseId = params.caseId || params.id;
  const { cases, deleteCase } = useCasesContext();
  const { patients } = usePatientsContext();
  const { appointments } = useAppointmentsContext();
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const medicalCase = cases.find((c) => String(c.id).trim() === String(caseId).trim());

  type Patient = {
    id: string;
    firstName: string;
    lastName: string;
    birthDate?: string;
    gender?: string;
    phoneNumber?: string;
    allergies?: string;
    currentMedications?: string;
  };

  let patient: Patient | undefined;
  let appointment;
  if (medicalCase) {
    const allPatients: Patient[] = Array.isArray(patients)
      ? patients
      : (Object.values(patients).flat() as Patient[]);
    patient = allPatients.find((p) => p.id === medicalCase.patientId);
    appointment = appointments.find((a) => a.id === medicalCase.appointmentId);
  }

  const handleEdit = () => {
    if (medicalCase) {
      navigate(`/cases/edit/${medicalCase.id}`);
    }
  };

  const handleDelete = async () => {
    if (medicalCase) {
      await deleteCase(medicalCase.id);
      setDeleteDialogOpen(false);
      navigate(-1);
    }
  };

  if (!medicalCase) {
    return (
      <Box p={3}>
        <Typography variant="h6">No case found for ID: {caseId}</Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>
    );
  }

  return (
    <Box maxWidth={800} mx="auto" mt={4}>
      <Card elevation={6} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h4" fontWeight={700}>
              Case Details
            </Typography>
            <Box>
              <IconButton color="primary" onClick={handleEdit}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => setDeleteDialogOpen(true)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            <Typography variant="subtitle1">
              <strong>Patient:</strong>{" "}
              {patient
                ? `${patient.firstName} ${patient.lastName}`
                : medicalCase.patientId}
            </Typography>
            {patient && (
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip label={`Birth Date: ${patient.birthDate || "-"}`} />
                <Chip label={`Gender: ${patient.gender || "-"}`} />
                <Chip label={`Phone: ${patient.phoneNumber || "-"}`} />
                <Chip label={`Allergies: ${patient.allergies || "-"}`} />
                <Chip label={`Current Medications: ${patient.currentMedications || "-"}`} />
              </Stack>
            )}
            <Typography variant="subtitle1">
              <strong>Appointment:</strong>{" "}
              {appointment
                ? `${appointment.date} ${appointment.time}`
                : medicalCase.appointmentId}
            </Typography>
            <Divider />
            <Typography variant="subtitle1">
              <strong>Diagnosis:</strong> {medicalCase.diagnosis || "-"}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Treatment Plan:</strong> {medicalCase.treatmentPlan || "-"}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Notes:</strong> {medicalCase.notes || "-"}
            </Typography>
            <Divider />
            <Typography variant="subtitle1" fontWeight={600}>
              Vital Signs
            </Typography>
            <List dense>
              <ListItem>
                Blood Pressure: {medicalCase.vitalSigns?.bloodPressure || "-"}
              </ListItem>
              <ListItem>
                Heart Rate: {medicalCase.vitalSigns?.heartRate || "-"}
              </ListItem>
              <ListItem>
                Temperature: {medicalCase.vitalSigns?.temperature || "-"}
              </ListItem>
              <ListItem>
                Weight: {medicalCase.vitalSigns?.weight || "-"}
              </ListItem>
              <ListItem>
                Height: {medicalCase.vitalSigns?.height || "-"}
              </ListItem>
            </List>
            <Divider />
            <Typography variant="subtitle1" fontWeight={600}>
              Symptoms
            </Typography>
            <List dense>
              {medicalCase.symptoms && medicalCase.symptoms.length > 0 ? (
                medicalCase.symptoms.map((symptom) => (
                  <ListItem key={symptom}>{symptom}</ListItem>
                ))
              ) : (
                <ListItem>-</ListItem>
              )}
            </List>
            <Divider />
            <Typography variant="subtitle1" fontWeight={600}>
              Services Provided
            </Typography>
            {medicalCase.services && medicalCase.services.length > 0 ? (
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Service</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medicalCase.services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <Typography fontWeight={500}>{service.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {service.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={service.category || "General"} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          {service.price ? `${service.price} €` : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="text.secondary">No services recorded.</Typography>
            )}
            <Divider />
            <Typography variant="subtitle1" fontWeight={600}>
              Prescriptions
            </Typography>
            {medicalCase.prescriptions && medicalCase.prescriptions.length > 0 ? (
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Medication</TableCell>
                      <TableCell>Dosage</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Instructions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medicalCase.prescriptions.map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell>{prescription.medication}</TableCell>
                        <TableCell>{prescription.dosage}</TableCell>
                        <TableCell>{prescription.frequency}</TableCell>
                        <TableCell>{prescription.duration}</TableCell>
                        <TableCell>{prescription.instructions}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="text.secondary">No prescriptions recorded.</Typography>
            )}
            <Divider />
            <Typography variant="subtitle1">
              <strong>Follow Up Required:</strong>{" "}
              {medicalCase.followUpRequired ? "Yes" : "No"}
            </Typography>
            {medicalCase.followUpRequired && (
              <Typography variant="subtitle1">
                <strong>Follow Up Date:</strong> {medicalCase.followUpDate}
              </Typography>
            )}
            <Typography variant="subtitle1">
              <strong>Status:</strong> {medicalCase.status}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Created At:</strong>{" "}
              {medicalCase.createdAt
                ? new Date(medicalCase.createdAt).toLocaleString()
                : "-"}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Total Amount:</strong> {medicalCase.totalAmount} €
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Case</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this case? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{ mt: 3 }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </Box>
  );
};