import {
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Chip,
} from "@mui/material";
import { FC, useMemo, useState, useEffect, useCallback } from "react";
import { useAppointmentsContext } from "../../../providers/appointments";
import { usePatientsContext } from "../../../providers/patients";
import { AppointmentsEntry } from "../../../providers/appointments/types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/search-bar";
import DeleteModal from "../../../components/delete-modal";
import { Column, ReusableTable } from "../../../components/table/component";
import { useRecentItems } from "../../../hooks/recent-items";
import FavoriteButton from "../../../components/favorite-buttons";

export const AllAppointments: FC = () => {
    const { appointments, deleteAppointment } = useAppointmentsContext();
    const allAppointments = useMemo(() => Object.values(appointments).flat(), [appointments]);
    const [filteredAppointments, setFilteredAppointments] = useState<AppointmentsEntry[]>(allAppointments);
    const [searchQuery, setSearchQuery] = useState("");
    const { patients } = usePatientsContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentsEntry | null>(null);
    const navigate = useNavigate();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { addRecentItem } = useRecentItems();

    const allPatients = Object.values(patients || {}).flat();

    useEffect(() => {
        setFilteredAppointments(allAppointments);
    }, [allAppointments]);

    const getPatientName = useCallback((patientId: string) => {
        const patient = allPatients.find(p => p._id === patientId);
        return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
    }, [allPatients]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        if (!query) {
            setFilteredAppointments(allAppointments);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = allAppointments.filter((appointment) => {
            const patientName = getPatientName(appointment.patientId);
            return (
                patientName.toLowerCase().includes(lowerQuery) ||
                appointment.reason?.toLowerCase().includes(lowerQuery) ||
                appointment.type?.toLowerCase().includes(lowerQuery) ||
                appointment.status?.toLowerCase().includes(lowerQuery) ||
                appointment.date?.toLowerCase().includes(lowerQuery)
            );
        });

        setFilteredAppointments(filtered);
    }, [allAppointments, getPatientName]);

    const handleRowClick = (appointment: AppointmentsEntry) => {
        const patientName = getPatientName(appointment.patientId);
        
        // NEW: Add to recent items
        addRecentItem({
            id: appointment.id,
            type: 'appointment',
            title: `Appointment with ${patientName}`,
            subtitle: `${appointment.date} at ${appointment.time}`,
            url: `/appointments/${appointment.id}`,
            metadata: {
                patientId: appointment.patientId,
                status: appointment.status,
                type: appointment.type,
            },
        });
        
        navigate(`/appointments/${appointment.id}`);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, appointment: AppointmentsEntry) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedAppointment(appointment);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedAppointment(null);
    };

    const handleEdit = () => {
        if (selectedAppointment) {
            navigate(`/appointments/edit/${selectedAppointment.id}`);
            handleMenuClose();
        }
    };

    const handleDeleteClick = () => {
        if (selectedAppointment) {
            setDeleteModalOpen(true);
            setAnchorEl(null);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedAppointment) return;

        setIsDeleting(true);
        try {
            await deleteAppointment(selectedAppointment.id);
            setDeleteModalOpen(false);
            setSelectedAppointment(null);
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

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            case 'completed': return 'info';
            default: return 'default';
        }
    };

    const columns: Column[] = [
        {
            id: 'patient',
            label: 'Patient',
            minWidth: 200,
            render: (value, row: AppointmentsEntry) => {
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
                                ID: {row.patientId}
                            </Typography>
                        </Box>
                    </Box>
                );
            },
        },
        {
            id: 'date',
            label: 'Date',
            minWidth: 120,
        },
        {
            id: 'time',
            label: 'Time',
            minWidth: 100,
        },
        {
            id: 'type',
            label: 'Type',
            minWidth: 120,
            render: (value: string) => (
                <Chip label={value} size="small" variant="outlined" />
            ),
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 120,
            render: (value: string) => (
                <Chip 
                    label={value} 
                    size="small" 
                    color={getStatusColor(value) as any} 
                />
            ),
        },
        {
            id: 'reason',
            label: 'Reason',
            minWidth: 200,
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 140,
            align: 'right',
            sortable: false,
            render: (_: unknown, row: AppointmentsEntry) => {
                const patientName = getPatientName(row.patientId);
                const favoriteItem = {
                    id: row.id,
                    type: 'appointment' as const,
                    title: `Appointment with ${patientName}`,
                    subtitle: `${row.date} at ${row.time}`,
                    url: `/appointments/${row.id}`,
                    metadata: {
                        patientId: row.patientId,
                        status: row.status,
                        type: row.type,
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
                                    type: 'appointment',
                                    title: `Appointment with ${patientName}`,
                                    subtitle: `${row.date} at ${row.time}`,
                                    url: `/appointments/${row.id}`,
                                    metadata: {
                                        patientId: row.patientId,
                                        status: row.status,
                                        type: row.type,
                                    },
                                });
                                navigate(`/appointments/${row.id}`);
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
                All Appointments ({filteredAppointments.length})
            </Typography>
            <Box sx={{ mb: 2 }}>
                <SearchBar onSearch={handleSearch} />
            </Box>

            <ReusableTable
                columns={columns}
                data={filteredAppointments}
                onRowClick={handleRowClick}
                searchQuery={searchQuery}
                emptyMessage="No Appointments Found"
                emptyDescription="There are currently no appointments scheduled."
            />

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit Appointment
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete Appointment
                </MenuItem>
            </Menu>

            <DeleteModal
                open={deleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Appointment"
                itemName={selectedAppointment ? `Appointment with ${getPatientName(selectedAppointment.patientId)}` : undefined}
                isDeleting={isDeleting}
            />
        </Box>
    );
};