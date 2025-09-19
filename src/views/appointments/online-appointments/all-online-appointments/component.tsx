import {
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    Typography,
    CircularProgress
} from "@mui/material";
import { FC, useMemo, useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from "react-router-dom";
import { useAppointmentsContext } from "../../../../providers/appointments";
import { usePatientsContext } from "../../../../providers/patients";
import { AppointmentsEntry } from "../../../../providers/appointments/types";
import SearchBar from "../../../../components/search-bar";
import DeleteModal from "../../../../components/delete-modal";
import { Column, ReusableTable } from "../../../../components/table/component";

export const AllOnlineAppointments: FC = () => {
    const { appointments, deleteAppointment, fetchAppointments, loading } = useAppointmentsContext();
    const { patients, getAllPatients } = usePatientsContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentsEntry | null>(null);
    const navigate = useNavigate();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Fetch appointments and patients when component mounts
    useEffect(() => {
        const initializeData = async () => {
            try {
                await Promise.all([
                    fetchAppointments(true), // Force refresh
                    getAllPatients ? getAllPatients() : Promise.resolve()
                ]);
                setIsInitialized(true);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsInitialized(true);
            }
        };
        
        initializeData();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeleteClick = () => {
        if (selectedAppointment) {
            setDeleteModalOpen(true);
            setAnchorEl(null);
        }
    };

    const handleDeleteConfirm = async () => {
        // Handle both id and _id formats
        const appointmentId = selectedAppointment?.id || selectedAppointment?.id;
        if (!selectedAppointment || !appointmentId) return;

        setIsDeleting(true);
        try {
            await deleteAppointment(appointmentId);
            await fetchAppointments(true); // Refresh after delete
            setDeleteModalOpen(false);
            setSelectedAppointment(null);
            setAnchorEl(null);
        } catch (error) {
            console.error('Error deleting appointment:', error);
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
            await Promise.all(selectedIds.map(id => deleteAppointment(id)));
            await fetchAppointments(true); // Refresh after delete
        } catch (error) {
            console.error('Error deleting appointments:', error);
        }
    };

    const handleMoreInfoClick = (appointment: any) => {
        const appointmentId = appointment._id || appointment.id;
        navigate(`/appointments/online-appointments/manage/${appointmentId}`);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, appointment: any) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedAppointment(appointment);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        if (!deleteModalOpen) {
            setSelectedAppointment(null);
        }
    };

    const handleEditAppointment = () => {
        if (selectedAppointment) {
            const appointmentId = selectedAppointment.id || selectedAppointment.id;
            navigate(`/appointments/edit/${appointmentId}`);
            handleMenuClose();
        }
    };

    const handleRowClick = (appointmentData: any) => {
        const appointmentId = appointmentData.appointment._id || appointmentData.appointment.id;
        navigate(`/appointments/online-appointments/manage/${appointmentId}`);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    // Get online appointments with patient data
    const onlineAppointmentsWithPatients = useMemo(() => {
        if (!appointments || !Array.isArray(appointments)) {
            return [];
        }

        const onlineAppointments = appointments.filter(
            (appointment: any) => {
                // Handle different field names from backend
                const type = appointment.appointmentType || 
                           appointment.appointment_type || 
                           appointment.type;
                return type === "Online";
            }
        );

        return onlineAppointments.map((appointment: any) => {
            // Handle backend ID format
            const appointmentId = appointment._id || appointment.id;
            
            // Handle different patient ID formats
            const patientId = appointment.patientId || 
                            appointment.patient_id ||
                            appointment.patient ||
                            appointment.patients?.[0];
            
            // Find patient with flexible ID matching
            const patient = patients.find((p: any) => {
                const pId = p._id || p.id;
                return String(pId).trim() === String(patientId).trim();
            });

            return {
                id: appointmentId, // For table selection
                appointment: {
                    ...appointment,
                    id: appointmentId, // Normalize ID field
                    _id: appointmentId  // Keep both for compatibility
                },
                patient
            };
        }).filter(item => item.patient);
    }, [appointments, patients]);

    // Filter appointments based on search query
    const filteredAppointmentList = useMemo(() => {
        if (!searchQuery.trim()) {
            return onlineAppointmentsWithPatients;
        }

        const lowerQuery = searchQuery.toLowerCase();

        return onlineAppointmentsWithPatients.filter(({ appointment, patient }) => {
            return (
                (patient && (
                    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(lowerQuery) ||
                    patient.phoneNumber?.toLowerCase().includes(lowerQuery) ||
                    patient.address?.toLowerCase().includes(lowerQuery)
                )) ||
                appointment.appointmentType?.toLowerCase().includes(lowerQuery) ||
                appointment.reason?.toLowerCase().includes(lowerQuery) ||
                appointment.date?.toLowerCase().includes(lowerQuery) ||
                appointment.time?.toLowerCase().includes(lowerQuery)
            );
        });
    }, [onlineAppointmentsWithPatients, searchQuery]);

    const getPatientName = (appointmentData: any) => {
        const { patient } = appointmentData;
        return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient";
    };

    const columns: Column[] = [
        {
            id: 'patient',
            label: 'Patient',
            minWidth: 200,
            sortable: false,
            render: (_, row: any) => {
                const { patient } = row;
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
                                ID: {patient._id || patient.id}
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    <Typography color="text.secondary">Unknown Patient</Typography>
                );
            },
        },
        {
            id: 'appointmentType',
            label: 'Appointment Type',
            minWidth: 150,
            render: (_, row: any) => (
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.appointment.appointmentType || 'N/A'}
                </Typography>
            ),
        },
        {
            id: 'reason',
            label: 'Reason',
            minWidth: 180,
            render: (_, row: any) => (
                <Typography 
                    variant="body2" 
                    sx={{ 
                        maxWidth: 180, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {row.appointment.reason || 'N/A'}
                </Typography>
            ),
        },
        {
            id: 'date',
            label: 'Date',
            minWidth: 120,
            render: (_, row: any) => (
                <Typography variant="body2">
                    {row.appointment.date || 'N/A'}
                </Typography>
            ),
        },
        {
            id: 'time',
            label: 'Time',
            minWidth: 100,
            render: (_, row: any) => (
                <Typography variant="body2">
                    {row.appointment.time || 'N/A'}
                </Typography>
            ),
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 120,
            align: 'right',
            sortable: false,
            render: (_, row: any) => (
                <Box>
                    <Tooltip title="View Online Appointment Details">
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                handleMoreInfoClick(row.appointment);
                            }}
                            color="primary"
                            size="small"
                        >
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                    <IconButton onClick={(e) => handleMenuOpen(e, row.appointment)}>
                        <MoreVertIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    // Show loading state on initial load
    if (!isInitialized && loading) {
        return (
            <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3} sx={{ overflowX: "auto" }}>
            <Typography variant="h4" mb={2}>
                Online Appointments ({filteredAppointmentList.length})
            </Typography>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
                <SearchBar onSearch={handleSearch} />
            </Box>

            <ReusableTable
                columns={columns}
                data={filteredAppointmentList}
                onRowClick={handleRowClick}
                onDeleteSelected={handleDeleteMultiple}
                searchQuery={searchQuery}
                emptyMessage="No Online Appointments Found"
                emptyDescription="There are currently no online appointments scheduled."
                enableSelection={true}
                enablePagination={true}
                enableSorting={true}
                rowsPerPageOptions={[5, 10, 25, 50]}
                defaultRowsPerPage={10}
            />

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEditAppointment}>
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
                title="Delete Online Appointment"
                itemName={selectedAppointment ? `${getPatientName({ 
                    appointment: selectedAppointment, 
                    patient: patients.find((p: any) => {
                        const pId = p._id || p.id;
                        const patientId = selectedAppointment.patientId || selectedAppointment.patientId || selectedAppointment.patients?.[0];
                        return String(pId).trim() === String(patientId).trim();
                    })
                })}'s online appointment` : undefined}
                message={selectedAppointment ? `Are you sure you want to delete this online appointment? This action cannot be undone.` : undefined}
                isDeleting={isDeleting}
            />
        </Box>
    );
};