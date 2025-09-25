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
    CircularProgress,
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { usePrescriptionContext } from "../../../providers/prescriptions";
import { usePatientsContext } from "../../../providers/patients";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import { PatientInfoWrapper, SecondSectionWarpper } from "./style";
import DeleteModal from "../../../components/delete-modal";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const PrescriptionDetails: FC = () => {
    const { prescription, deletePrescription } = usePrescriptionContext();
    const { patients, getAllPatients } = usePatientsContext();
    const navigate = useNavigate();
    const { id } = useParams(); // Get the prescription ID from the URL
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoadingPatients, setIsLoadingPatients] = useState(false);

    const allPatients = Object.values(patients || {}).flat();

    // Load patients if not already loaded
    useEffect(() => {
        if (allPatients.length === 0 && !isLoadingPatients) {
            setIsLoadingPatients(true);
            (async () => {
                try {
                     getAllPatients();
                } catch (error) {
                    console.error('Error loading patients:', error);
                } finally {
                    setIsLoadingPatients(false);
                }
            })();
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Find the specific prescription by ID
    const prescriptionDetails = (() => {
        if (!prescription || !id) return null;
        
        if (Array.isArray(prescription)) {
            return prescription.find(p => p.id === id || p._id === id);
        } else if (typeof prescription === "object") {
            // If prescription is an object with IDs as keys
            return prescription[id] || Object.values(prescription).find(p => p.id === id || p.id === id);
        }
        return null;
    })();

    // Find the patient for this prescription - use _id not id
    const patient = prescriptionDetails 
        ? allPatients.find((p: any) => p._id === prescriptionDetails.patientId)
        : null;

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!prescriptionDetails) return;

        setIsDeleting(true);
        try {
            await deletePrescription(prescriptionDetails.id || prescriptionDetails._id);
            setDeleteModalOpen(false);
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
        }
    };

    const handleEdit = () => {
        if (prescriptionDetails) {
            navigate(`/prescriptions/edit/${prescriptionDetails.id || prescriptionDetails._id}`);
        }
    };

    const handleBack = () => {
        navigate('/prescriptions/all');
    };

    if (isLoadingPatients) {
        return (
            <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (!prescriptionDetails) {
        return (
            <Box p={3}>
                <Typography variant="h6">Prescription not found.</Typography>
                <Box mt={2}>
                    <IconButton onClick={handleBack} color="primary">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography component="span">Back to prescriptions</Typography>
                </Box>
            </Box>
        );
    }

    const patientName = patient 
        ? `${patient.firstName} ${patient.lastName}` 
        : "Unknown Patient";

    return (
        <Box p={3}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <IconButton onClick={handleBack} color="primary">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" fontWeight="bold">
                    Prescription Details
                </Typography>
            </Stack>

            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    backgroundColor: "#fff",
                }}
            >
                <Stack direction="row" justifyContent={"space-between"} spacing={3} alignItems="center">
                    <PatientInfoWrapper>
                        <Avatar
                            src={patient?.profileImg}
                            alt={patientName}
                            sx={{ width: 72, height: 72 }}
                        >
                            {patient?.firstName?.[0]}{patient?.lastName?.[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                {patientName}
                            </Typography>
                            {patient && (
                                <>
                                    <Typography variant="body2" color="text.secondary">
                                        {patient.email}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {patient.phoneNumber}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </PatientInfoWrapper>
                    <Box sx={{ marginLeft: "auto" }}>
                        <Tooltip title="Edit">
                            <IconButton onClick={handleEdit} color="primary">
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton onClick={handleDeleteClick} color="error">
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
                            <strong>ID:</strong> {prescriptionDetails.id || prescriptionDetails._id}
                        </Typography>
                        <Typography>
                            <strong>Date Issued:</strong> {new Date(prescriptionDetails.dateIssued).toLocaleDateString()}
                        </Typography>
                        <Typography>
                            <strong>Diagnosis:</strong> {prescriptionDetails.diagnosis}
                        </Typography>
                        {prescriptionDetails.notes && (
                            <Typography>
                                <strong>Notes:</strong> {prescriptionDetails.notes}
                            </Typography>
                        )}
                    </Box>

                    {prescriptionDetails.medications && prescriptionDetails.medications.length > 0 && (
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                                Medications
                            </Typography>
                            <Grid container spacing={2} mt={1}>
                                {prescriptionDetails.medications.map((med: any, idx: number) => (
                                    <Grid key={idx}>
                                        <Paper 
                                            elevation={1} 
                                            sx={{ 
                                                p: 2, 
                                                backgroundColor: "#f5f5f5",
                                                borderRadius: 2
                                            }}
                                        >
                                            <Typography variant="h6" gutterBottom>
                                                {med.name}
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
                                                <Typography variant="body2" mt={1}>
                                                    <strong>Instructions:</strong> {med.instructions}
                                                </Typography>
                                            )}
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </SecondSectionWarpper>
            </Paper>
            
            <DeleteModal
                open={deleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Prescription"
                itemName={`prescription for ${patientName}`}
                message={`Are you sure you want to delete this prescription for ${prescriptionDetails.diagnosis}? This action cannot be undone.`}
                isDeleting={isDeleting}
            />
        </Box>
    );
};