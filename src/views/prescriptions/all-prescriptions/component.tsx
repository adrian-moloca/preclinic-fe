import {
    Box,
    Typography,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Chip,
    CircularProgress,
} from "@mui/material";
import { FC, useState, useCallback, useMemo, useEffect, useRef } from "react";
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
// Import your clinic context if you have one
// import { useClinicContext } from "../../../providers/clinic";

export const AllPrescriptions: FC = () => {
    const { prescription, deletePrescription } = usePrescriptionContext();
    const { patients, getAllPatients } = usePatientsContext();
    // const { selectedClinic } = useClinicContext(); // Uncomment if you have this
    const [searchQuery, setSearchQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
    const navigate = useNavigate();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoadingPatients, setIsLoadingPatients] = useState(false);
    const hasInitialized = useRef(false);

    const { addRecentItem } = useRecentItems();

    const allPatients = useMemo(() => {
        const patientsArray = Object.values(patients || {}).flat();
        console.log('📋 Patients updated:', patientsArray.length, 'patients');
        return patientsArray;
    }, [patients]);

    const prescriptionList = useMemo(() => Object.values(prescription), [prescription]);

    // Load patients with proper clinic check
    useEffect(() => {
        const loadPatients = async () => {
            // Prevent multiple initialization attempts
            if (hasInitialized.current || isLoadingPatients) return;
            
            // Only load if we don't have patients yet
            if (allPatients.length === 0) {
                console.log('🔄 Attempting to load patients...');
                hasInitialized.current = true;
                setIsLoadingPatients(true);
                
                try {
                    await getAllPatients();
                    console.log('✅ Patients loaded successfully');
                } catch (error) {
                    console.error('❌ Failed to load patients:', error);
                    // Reset so we can retry
                    hasInitialized.current = false;
                } finally {
                    setIsLoadingPatients(false);
                }
            }
        };

        // Add a small delay to ensure clinic context is ready
        const timeoutId = setTimeout(loadPatients, 100);
        return () => clearTimeout(timeoutId);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    const getPatientName = useCallback((patientId: string) => {
        const patient = allPatients.find(p => p._id === patientId);
        return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
    }, [allPatients]);

    const filteredPrescriptions = useMemo(() => {
        if (!searchQuery) {
            return prescriptionList;
        }

        const lowerQuery = searchQuery.toLowerCase();
        return prescriptionList.filter((prescription) => {
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
    }, [prescriptionList, searchQuery, getPatientName]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const handleRowClick = useCallback((prescription: Prescription) => {
        const patientName = getPatientName(prescription.patientId);
        
        addRecentItem({
            id: prescription.id ?? '',
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
    }, [addRecentItem, getPatientName, navigate]);

    const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>, prescription: Prescription) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedPrescription(prescription);
    }, []);

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
        setSelectedPrescription(null);
    }, []);

    const handleEdit = useCallback(() => {
        if (selectedPrescription) {
            navigate(`/prescriptions/edit/${selectedPrescription.id}`);
            handleMenuClose();
        }
    }, [selectedPrescription, navigate, handleMenuClose]);

    const handleDeleteClick = useCallback(() => {
        if (selectedPrescription) {
            setDeleteModalOpen(true);
            setAnchorEl(null);
        }
    }, [selectedPrescription]);

    const handleDeleteConfirm = useCallback(async () => {
        if (!selectedPrescription) return;

        setIsDeleting(true);
        try {
            await deletePrescription(selectedPrescription.id ?? '');
            setDeleteModalOpen(false);
            setSelectedPrescription(null);
        } catch (error) {
            console.error('Error deleting prescription:', error);
        } finally {
            setIsDeleting(false);
        }
    }, [selectedPrescription, deletePrescription]);

    const handleDeleteCancel = useCallback(() => {
        if (!isDeleting) {
            setDeleteModalOpen(false);
        }
    }, [isDeleting]);

    // DON'T memoize columns - let them re-render when allPatients changes
    const columns: Column[] = [
        {
            id: 'patient',
            label: 'Patient',
            minWidth: 200,
            render: (value, row: Prescription) => {
                const patient = allPatients.find(p => p._id === row.patientId);
                const patientName = patient 
                    ? `${patient.firstName} ${patient.lastName}` 
                    : 'Unknown Patient';
                
                return (
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src={patient?.profileImg}>
                            {patient?.firstName?.[0]}{patient?.lastName?.[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {patientName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                ID: {row.patientId}
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
                const patient = allPatients.find(p => p._id === row.patientId);
                const patientName = patient 
                    ? `${patient.firstName} ${patient.lastName}` 
                    : 'Unknown Patient';
                    
                const favoriteItem = {
                    id: row.id ?? '',
                    type: 'prescription' as const,
                    title: `Prescription for ${patientName}`,
                    subtitle: row.diagnosis || 'Medical prescription',
                    url: `/prescriptions/${row.id ?? ''}`,
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
                                addRecentItem(favoriteItem);
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

    // Show loading while patients are being fetched
    if (isLoadingPatients && prescriptionList.length > 0) {
        return (
            <Box p={3}>
                <Typography variant="h4" mb={2}>
                    All Prescriptions
                </Typography>
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                </Box>
            </Box>
        );
    }

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