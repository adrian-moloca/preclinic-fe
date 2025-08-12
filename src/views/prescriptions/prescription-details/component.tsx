import {
    Avatar,
    Box,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { usePrescriptionContext } from "../../../providers/prescriptions";
import { usePatientsContext } from "../../../providers/patients";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { PatientInfoWrapper, SecondSectionWarpper } from "./style";
import DeleteModal from "../../../components/delete-modal";

export const PrescriptionDetails: FC = () => {
    const { prescription, deletePrescription } = usePrescriptionContext();
    const { patients } = usePatientsContext();
    const navigate = useNavigate();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null); 
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (prescriptionItem: any) => {
        setSelectedItem(prescriptionItem);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedItem) return;

        setIsDeleting(true);
        try {
            await deletePrescription(selectedItem.id);
            setDeleteModalOpen(false);
            setSelectedItem(null);
            navigate('/prescriptions/all');
        } catch (error) {
            console.error('Error deleting prescription:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        if (!isDeleting) {
            setDeleteModalOpen(false);
            setSelectedItem(null);
        }
    };

    const allPatients = Object.values(patients || {}).flat();

    const prescriptions = prescription
        ? Array.isArray(prescription)
            ? prescription
            : typeof prescription === "object"
                ? Object.values(prescription)
                : []
        : [];

    const handleEdit = (id: string) => {
        navigate(`/prescriptions/edit/${id}`);
    };

    if (prescriptions.length === 0) {
        return (
            <Box p={3}>
                <Typography variant="h6">No prescription data available.</Typography>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Prescription Details
            </Typography>

            {prescriptions.map((presc) => {
                const patient = allPatients.find((p: any) => p.id === presc.patientId);

                return (
                    <Paper
                        key={presc.id}
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                            mt: 4,
                            backgroundColor: "#fff",
                        }}
                    >
                        <Stack direction="row" justifyContent={"space-between"} spacing={3} alignItems="center">
                            <PatientInfoWrapper>
                                <Avatar
                                    src={patient?.profileImg}
                                    alt={`${patient?.firstName} ${patient?.lastName}`}
                                    sx={{ width: 72, height: 72 }}
                                />
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {patient
                                            ? `${patient.firstName} ${patient.lastName}`
                                            : "Unknown Patient"}
                                    </Typography>
                                </Box>
                            </PatientInfoWrapper>
                            <Box sx={{ marginLeft: "auto" }}>
                                <Tooltip title="Edit">
                                    <IconButton onClick={() => handleEdit(presc.id)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton onClick={() => handleDeleteClick(presc)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Stack>

                        <Divider />

                        <SecondSectionWarpper>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" mt={1}>
                                    Prescription Info
                                </Typography>
                                <Typography>
                                    <strong>ID:</strong> {presc.id}
                                </Typography>
                                <Typography>
                                    <strong>Date Issued:</strong> {presc.dateIssued}
                                </Typography>
                                <Typography>
                                    <strong>Diagnosis:</strong> {presc.diagnosis}
                                </Typography>
                                {presc.notes && (
                                    <Typography>
                                        <strong>Notes:</strong> {presc.notes}
                                    </Typography>
                                )}
                            </Box>

                            {presc.medications.length > 0 && (
                                <Box >
                                    <Typography variant="subtitle1" fontWeight="bold" mt={1}>
                                        Medications
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {presc.medications.map(
                                            (
                                                med: {
                                                    name: string;
                                                    dosage: string;
                                                    frequency: string;
                                                    duration: string;
                                                    instructions?: string;
                                                },
                                                idx: number
                                            ) => (
                                                <Grid key={idx}>
                                                    <Box>
                                                        <Typography variant="body2">
                                                            <strong>Name:</strong> {med.name}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            <strong>Dosage:</strong> {med.dosage}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            <strong>Frequency:</strong> {med.frequency}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            <strong>Duration:</strong> {med.duration}
                                                        </Typography>
                                                        {med.instructions && (
                                                            <Typography variant="body2">
                                                                <strong>Instructions:</strong> {med.instructions}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Grid>
                                            )
                                        )}
                                    </Grid>
                                </Box>
                            )}
                        </SecondSectionWarpper>
                    </Paper>
                );
            })}
            
            <DeleteModal
                open={deleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Prescription"
                itemName={selectedItem?.id ? `Prescription ${selectedItem.id}` : undefined}
                message={selectedItem ? `Are you sure you want to delete this prescription for ${selectedItem.diagnosis}? This action cannot be undone.` : undefined}
                isDeleting={isDeleting}
            />
        </Box>
    );
};