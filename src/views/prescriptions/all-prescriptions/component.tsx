import {
    Box,
    Typography,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { usePrescriptionContext } from "../../../providers/prescriptions";
import { usePatientsContext } from "../../../providers/patients";
import { Prescription } from "../../../providers/prescriptions/types";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/search-bar";
import DeleteModal from "../../../components/delete-modal";
import { Column, ReusableTable } from "../../../components/table/component";

export const AllPrescriptions: FC = () => {
    const { prescription, deletePrescription } = usePrescriptionContext();
    const { patients } = usePatientsContext();
    const [filteredPrescriptions, setFilteredPrescriptions] = useState<Prescription[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
    const navigate = useNavigate();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const allPatients = Object.values(patients || {}).flat();
    const prescriptionList = Object.values(prescription);

    const handleDeleteClick = () => {
        if (selectedPrescription) {
            setDeleteModalOpen(true);
            setAnchorEl(null);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedPrescription) return;

        setIsDeleting(true);
        try {
            await deletePrescription(selectedPrescription.id);
            setDeleteModalOpen(false);
            setSelectedPrescription(null);
            setAnchorEl(null);
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

    const handleDeleteMultiple = async (selectedIds: string[]) => {
        try {
            await Promise.all(selectedIds.map(id => deletePrescription(id)));
        } catch (error) {
            console.error('Error deleting prescriptions:', error);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, presc: Prescription) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedPrescription(presc);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        if (!deleteModalOpen) {
            setSelectedPrescription(null);
        }
    };

    const handleEditPrescription = () => {
        if (selectedPrescription) {
            navigate(`/prescriptions/edit/${selectedPrescription.id}`);
            handleMenuClose();
        }
    };

    const handleRowClick = (prescription: Prescription) => {
        navigate(`/prescriptions/${prescription.id}`);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (!query) {
            setFilteredPrescriptions(prescriptionList);
            return;
        }

        const lowerQuery = query.toLowerCase();

        const filtered = prescriptionList.filter((presc) => {
            const patient = allPatients.find((p: any) => p.id === presc.patientId);
            return (
                (patient &&
                    (`${patient.firstName} ${patient.lastName}`.toLowerCase().includes(lowerQuery) ||
                        patient.phoneNumber?.toLowerCase().includes(lowerQuery) ||
                        patient.address?.toLowerCase().includes(lowerQuery) ||
                        patient.birthDate?.toLowerCase().includes(lowerQuery))) ||
                presc.diagnosis.toLowerCase().includes(lowerQuery) ||
                presc.medications.some((med) => med.name.toLowerCase().includes(lowerQuery))
            );
        });

        setFilteredPrescriptions(filtered);
    };

    useEffect(() => {
        setFilteredPrescriptions(prescriptionList);
    }, [patients, prescription, prescriptionList]);

    const getPatient = (patientId: string) => {
        return allPatients.find((p: any) => p.id === patientId);
    };

    const columns: Column[] = [
        {
            id: 'patient',
            label: 'Patient',
            minWidth: 200,
            sortable: false,
            render: (_, row: Prescription) => {
                const patient = getPatient(row.patientId);
                return patient ? (
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                            src={patient.profileImg}
                            alt={`${patient.firstName} ${patient.lastName}`}
                            sx={{ width: 40, height: 40 }}
                        >
                            {patient.firstName?.[0]}{patient.lastName?.[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {patient.firstName} {patient.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                ID: {patient.id}
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    <Typography color="text.secondary">Unknown Patient</Typography>
                );
            },
        },
        {
            id: 'dateIssued',
            label: 'Date Issued',
            minWidth: 120,
            render: (value: string) => (
                <Typography variant="body2">
                    {value || 'N/A'}
                </Typography>
            ),
        },
        {
            id: 'diagnosis',
            label: 'Diagnosis',
            minWidth: 150,
            render: (value: string) => (
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {value || 'N/A'}
                </Typography>
            ),
        },
        {
            id: 'medications',
            label: 'Medications',
            minWidth: 200,
            sortable: false,
            render: (value: any[], row: Prescription) => (
                <Box>
                    {row.medications && row.medications.length > 0 ? (
                        <>
                            {row.medications.slice(0, 2).map((med, idx) => (
                                <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                                    {med.name}
                                </Typography>
                            ))}
                            {row.medications.length > 2 && (
                                <Typography variant="caption" color="primary.main">
                                    +{row.medications.length - 2} more
                                </Typography>
                            )}
                        </>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No medications
                        </Typography>
                    )}
                </Box>
            ),
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 120,
            align: 'right',
            sortable: false,
            render: (_, row: Prescription) => (
                <Box>
                    <Tooltip title="View Prescription Detail">
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/prescriptions/${row.id}`);
                            }}
                            color="primary"
                            size="small"
                        >
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                    <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                        <MoreVertIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box p={3} sx={{ overflowX: "auto" }}>
            <Typography variant="h4" mb={2}>
                All Prescriptions ({filteredPrescriptions.length})
            </Typography>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
                <SearchBar onSearch={handleSearch} />
            </Box>

            <ReusableTable
                columns={columns}
                data={filteredPrescriptions}
                onRowClick={handleRowClick}
                onDeleteSelected={handleDeleteMultiple}
                searchQuery={searchQuery}
                emptyMessage="No Prescriptions Found"
                emptyDescription="There are currently no prescriptions available."
                enableSelection={true}
                enablePagination={true}
                enableSorting={true}
                rowsPerPageOptions={[5, 10, 25, 50]}
                defaultRowsPerPage={10}
            />

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleEditPrescription}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1, color: "error.main" }} />
                    Delete
                </MenuItem>
            </Menu>

            <DeleteModal
                open={deleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Prescription"
                itemName={selectedPrescription ? `Prescription for ${getPatient(selectedPrescription.patientId)?.firstName} ${getPatient(selectedPrescription.patientId)?.lastName}` : undefined}
                message={selectedPrescription ? `Are you sure you want to delete this prescription? This action cannot be undone.` : undefined}
                isDeleting={isDeleting}
            />
        </Box>
    );
};