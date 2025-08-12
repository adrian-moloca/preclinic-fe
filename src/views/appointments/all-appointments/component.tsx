import {
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import { FC, useMemo, useState, useEffect, useCallback } from "react";
import { useAppointmentsContext } from "../../../providers/appointments";
import { usePatientsContext } from "../../../providers/patients";
import { AppointmentsEntry } from "../../../providers/appointments/types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/search-bar";
import DeleteModal from "../../../components/delete-modal";
import { Column, ReusableTable } from "../../../components/table/component";

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

    const allPatients = Object.values(patients || {}).flat();

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        if (!query) {
            setFilteredAppointments(allAppointments);
            return;
        }

        const lowerQuery = query.toLowerCase();

        const filtered = allAppointments.filter((appointment) => {
            const patientId = appointment.patientId || appointment.patients?.[0];
            const patient = allPatients.find((p: any) => p.id === patientId);

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

        setFilteredAppointments(filtered);
    }, [allAppointments, allPatients]);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredAppointments(allAppointments);
        } else {
            handleSearch(searchQuery);
        }
    }, [allAppointments, handleSearch, searchQuery]);

    const handleDeleteClick = () => {
        if (selectedAppointment) {
            setDeleteModalOpen(true);
            setAnchorEl(null);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedAppointment) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteAppointment(selectedAppointment.id);
            setDeleteModalOpen(false);
            setSelectedAppointment(null);
            setAnchorEl(null); 
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
        } catch (error) {
            console.error('Error deleting appointments:', error);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, appointment: AppointmentsEntry) => {
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
            navigate(`/appointments/edit/${selectedAppointment.id}`);
            handleMenuClose();
        }
    };

    const handleRowClick = (appointment: AppointmentsEntry) => {
        navigate(`/appointments/${appointment.id}`);
    };

    const getPatientName = (appointment: AppointmentsEntry) => {
        const patientId = appointment.patientId || appointment.patients?.[0];
        const patient = allPatients.find((p: any) => p.id === patientId);
        return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient";
    };

    const getPatient = (appointment: AppointmentsEntry) => {
        const patientId = appointment.patientId || appointment.patients?.[0];
        return allPatients.find((p: any) => p.id === patientId);
    };

    const columns: Column[] = [
        {
            id: 'patient',
            label: 'Patient',
            minWidth: 200,
            sortable: false,
            render: (_, row: AppointmentsEntry) => {
                const patient = getPatient(row);
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
            id: 'appointmentType',
            label: 'Appointment Type',
            minWidth: 150,
            render: (value: string) => (
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {value || 'N/A'}
                </Typography>
            ),
        },
        {
            id: 'reason',
            label: 'Reason',
            minWidth: 180,
            render: (value: string) => (
                <Typography 
                    variant="body2" 
                    sx={{ 
                        maxWidth: 180, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {value || 'N/A'}
                </Typography>
            ),
        },
        {
            id: 'date',
            label: 'Date',
            minWidth: 120,
            render: (value: string) => (
                <Typography variant="body2">
                    {value || 'N/A'}
                </Typography>
            ),
        },
        {
            id: 'time',
            label: 'Time',
            minWidth: 100,
            render: (value: string) => (
                <Typography variant="body2">
                    {value || 'N/A'}
                </Typography>
            ),
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 120,
            align: 'right',
            sortable: false,
            render: (_, row: AppointmentsEntry) => (
                <Box>
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
                All Appointments ({filteredAppointments.length})
            </Typography>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
                <SearchBar onSearch={handleSearch} />
            </Box>

            <ReusableTable
                columns={columns}
                data={filteredAppointments}
                onRowClick={handleRowClick}
                onDeleteSelected={handleDeleteMultiple}
                searchQuery={searchQuery}
                emptyMessage="No Appointments Found"
                emptyDescription="There are currently no appointments scheduled."
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
                title="Delete Appointment"
                itemName={selectedAppointment ? `${getPatientName(selectedAppointment)}'s appointment` : undefined}
                message={selectedAppointment ? `Are you sure you want to delete the appointment for ${getPatientName(selectedAppointment)} on ${selectedAppointment.date} at ${selectedAppointment.time}? This action cannot be undone.` : undefined}
                isDeleting={isDeleting}
            />
        </Box>
    );      
};