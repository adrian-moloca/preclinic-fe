import {
    Box,
    Typography,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Chip,
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
import { useRecentItems } from "../../../hooks/recent-items";
import FavoriteButton from "../../../components/favorite-buttons";

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

    const { addRecentItem } = useRecentItems();

    const allPatients = Object.values(patients || {}).flat();
    const prescriptionList = Object.values(prescription);

    useEffect(() => {
        setFilteredPrescriptions(prescriptionList);
    }, [prescriptionList]);

    const getPatientName = (patientId: string) => {
        const patient = allPatients.find(p => p._id === patientId);
        return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (!query) {
            setFilteredPrescriptions(prescriptionList);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = prescriptionList.filter((prescription) => {
            const patientName = getPatientName(prescription.patientId);
            return (
                patientName.toLowerCase().includes(lowerQuery) ||
                prescription.diagnosis?.toLowerCase().includes(lowerQuery) ||
                prescription.medications?.some(med => 
                    med.name.toLowerCase().includes(lowerQuery)
                ) ||
                prescription.notes?.toLowerCase().includes(lowerQuery)
            );
        });

        setFilteredPrescriptions(filtered);
    };

    const handleRowClick = (prescription: Prescription) => {
        const patientName = getPatientName(prescription.patientId);
        
        // NEW: Add to recent items
        addRecentItem({
            id: prescription.id,
            type: 'prescription',
            title: `Prescription for ${patientName}`,
            subtitle: prescription.diagnosis || 'Medical prescription',
            url: `/prescriptions/${prescription.id}`,
            metadata: {
                patientId: prescription.patientId,
                dateIssued: prescription.dateIssued,
                diagnosis: prescription.diagnosis,
            },
        });
        
        navigate(`/prescriptions/${prescription.id}`);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, prescription: Prescription) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedPrescription(prescription);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedPrescription(null);
    };

    const handleEdit = () => {
        if (selectedPrescription) {
            navigate(`/prescriptions/edit/${selectedPrescription.id}`);
            handleMenuClose();
        }
    };

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

    const columns: Column[] = [
        {
            id: 'patient',
            label: 'Patient',
            minWidth: 200,
            render: (value, row: Prescription) => {
                const patient = allPatients.find(p => p._id === row.patientId);
                return (
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src={patient?.profileImg}>
                            {patient?.firstName?.[0]}{patient?.lastName?.[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {getPatientName(row.patientId)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Patient ID: {row.patientId}
                            </Typography>
                        </Box>
                    </Box>
                );
            },
        },
        {
            id: 'dateIssued',
            label: 'Date Issued',
            minWidth: 120,
            render: (value: string) => new Date(value).toLocaleDateString(),
        },
        {
            id: 'diagnosis',
            label: 'Diagnosis',
            minWidth: 200,
        },
        {
            id: 'medications',
            label: 'Medications',
            minWidth: 200,
            render: (value: any[]) => (
                <Box>
                    {value?.slice(0, 2).map((med, index) => (
                        <Chip 
                            key={index}
                            label={med.name} 
                            size="small" 
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                        />
                    ))}
                    {value?.length > 2 && (
                        <Typography variant="caption" color="text.secondary">
                            +{value.length - 2} more
                        </Typography>
                    )}
                </Box>
            ),
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 140,
            align: 'right',
            sortable: false,
            render: (_: unknown, row: Prescription) => {
                const patientName = getPatientName(row.patientId);
                const favoriteItem = {
                    id: row.id,
                    type: 'prescription' as const,
                    title: `Prescription for ${patientName}`,
                    subtitle: row.diagnosis || 'Medical prescription',
                    url: `/prescriptions/${row.id}`,
                    metadata: {
                        patientId: row.patientId,
                        dateIssued: row.dateIssued,
                        diagnosis: row.diagnosis,
                    },
                };

                return (
                    <Box display="flex" alignItems="center">
                        <FavoriteButton item={favoriteItem} size="small" />
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                addRecentItem({
                                    id: row.id,
                                    type: 'prescription',
                                    title: `Prescription for ${patientName}`,
                                    subtitle: row.diagnosis || 'Medical prescription',
                                    url: `/prescriptions/${row.id}`,
                                    metadata: {
                                        patientId: row.patientId,
                                        dateIssued: row.dateIssued,
                                        diagnosis: row.diagnosis,
                                    },
                                });
                                navigate(`/prescriptions/${row.id}`);
                            }}
                            color="primary"
                            size="small"
                        >
                            <InfoIcon />
                        </IconButton>
                        <IconButton onClick={(e) => handleMenuOpen(e, row)} size="small">
                            <MoreVertIcon />
                        </IconButton>
                    </Box>
                );
            },
        },
    ];

    return (
        <Box p={3}>
            <Typography variant="h4" mb={2}>
                All Prescriptions ({filteredPrescriptions.length})
            </Typography>
            <Box sx={{ mb: 2 }}>
                <SearchBar onSearch={handleSearch} />
            </Box>

            <ReusableTable
                columns={columns}
                data={filteredPrescriptions}
                onRowClick={handleRowClick}
                searchQuery={searchQuery}
                emptyMessage="No Prescriptions Found"
                emptyDescription="There are currently no prescriptions issued."
            />

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit Prescription
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete Prescription
                </MenuItem>
            </Menu>

            <DeleteModal
                open={deleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Prescription"
                itemName={selectedPrescription ? `Prescription for ${getPatientName(selectedPrescription.patientId)}` : undefined}
                isDeleting={isDeleting}
            />
        </Box>
    );
};