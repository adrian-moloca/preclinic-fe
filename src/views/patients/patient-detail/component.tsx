import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Divider,
  Button,
} from "@mui/material";
import { FC, useState } from "react";
import { usePatientsContext } from "../../../providers/patients";
import { useNavigate, useParams } from "react-router-dom";
import { PatientDetailsWrapper } from "./style";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "../../../components/delete-modal";
import { useCasesContext } from "../../../providers/cases/context";
import ReusableTable from "../../../components/table";

export const PatientDetails: FC = () => {
  const { id } = useParams();
  const { patients, deletePatient } = usePatientsContext();
  const { getCasesByPatientId } = useCasesContext();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const allPatients = Object.values(patients).flat();
  const patient = allPatients.find((p) => p.id === id);

  // Get all cases for this patient
  const patientCases = patient ? getCasesByPatientId(patient.id) : [];

  // Debug log
  console.log("Patient ID:", patient?.id);
  console.log("Cases found for patient:", patientCases);

  // Define columns for the table
  const caseColumns = [
    { id: "id", label: "Case ID" },
    { id: "appointmentId", label: "Appointment ID" },
    { id: "diagnosis", label: "Diagnosis" },
    { id: "status", label: "Status" },
    { id: "createdAt", label: "Created At" },
    { id: "totalAmount", label: "Total (€)" }
  ];

  // Map cases to rows for the table
  const caseRows = patientCases.map(c => ({
    id: c.id,
    appointmentId: c.appointmentId,
    diagnosis: c.diagnosis,
    status: c.status,
    createdAt: new Date(c.createdAt).toLocaleDateString(),
    totalAmount: c.totalAmount
  }));

  const handleDeleteClick = () => {
    if (patient) {
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!patient) return;

    setIsDeleting(true);
    try {
      await deletePatient(patient.id);
      setDeleteModalOpen(false);
      navigate('/patients/all');
    } catch (error) {
      console.error('Error deleting patient:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false);
    }
  };

  const handleEditPatient = () => {
    if (patient) {
      navigate(`/patients/edit/${patient.id}`);
    }
  };

  if (!patient) {
    return (
      <Box p={3}>
        <Typography variant="h6">Patient not found</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Patient Details
      </Typography>

      <Card elevation={3} sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent={"space-between"} gap={3} mb={3}>
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <Avatar
              src={patient.profileImg}
              alt={`${patient.firstName} ${patient.lastName}`}
              sx={{ width: 100, height: 100 }}
            />
            <Box>
              <Typography variant="h5">
                {patient.firstName} {patient.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {patient.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {patient.gender}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            <Button variant="outlined" color="primary" sx={{ width: 100 }} onClick={handleEditPatient}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EditIcon sx={{ mr: 1 }} />
                Edit
              </Box>
            </Button>
            <Button variant="outlined" color="error" sx={{ width: 100 }} onClick={handleDeleteClick}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DeleteIcon sx={{ mr: 1 }} />
                Delete
              </Box>
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <CardContent>
          <PatientDetailsWrapper>
            <Box width={{ xs: "100%", sm: "45%" }}>
              <Typography variant="subtitle2">Birth Date</Typography>
              <Typography>{patient.birthDate}</Typography>
            </Box>

            <Box width={{ xs: "100%", sm: "45%" }}>
              <Typography variant="subtitle2">Phone</Typography>
              <Typography>{patient.phoneNumber}</Typography>
            </Box>

            <Box width={{ xs: "100%", sm: "45%" }}>
              <Typography variant="subtitle2">Address</Typography>
              <Typography>{patient.address}</Typography>
            </Box>

            <Box width={{ xs: "100%", sm: "45%" }}>
              <Typography variant="subtitle2">City</Typography>
              <Typography>{patient.city}</Typography>
            </Box>

            <Box width={{ xs: "100%", sm: "45%" }}>
              <Typography variant="subtitle2">State</Typography>
              <Typography>{patient.state}</Typography>
            </Box>

            <Box width={{ xs: "100%", sm: "45%" }}>
              <Typography variant="subtitle2">Country</Typography>
              <Typography>{patient.country}</Typography>
            </Box>

            <Box width={{ xs: "100%", sm: "45%" }}>
              <Typography variant="subtitle2">Blood Group</Typography>
              <Typography>{patient.bloodGroup}</Typography>
            </Box>

            <Box width={{ xs: "100%", sm: "45%" }}>
              <Typography variant="subtitle2">Zip Code</Typography>
              <Typography>{patient.zipCode}</Typography>
            </Box>
          </PatientDetailsWrapper>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Medical Cases
        </Typography>
        {caseRows.length > 0 ? (
          <ReusableTable columns={caseColumns} data={caseRows} />
        ) : (
          <Typography color="text.secondary" mt={2}>
            No cases found for this patient.
          </Typography>
        )}
      </Box>

      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient"
        itemName={patient ? `${patient.firstName} ${patient.lastName}` : undefined}
        message={patient ? `Are you sure you want to delete ${patient.firstName} ${patient.lastName}? This action cannot be undone.` : undefined}
        isDeleting={isDeleting}
      />
    </Box>
  );
};