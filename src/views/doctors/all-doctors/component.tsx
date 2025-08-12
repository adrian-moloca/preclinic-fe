import { 
    Box, 
    Typography, 
    Avatar, 
    IconButton, 
    Tooltip, 
    Menu, 
    MenuItem, 
    ListItemIcon, 
    ListItemText 
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDoctorsContext } from "../../../providers/doctor/context";
import { IDoctor } from "../../../providers/doctor/types";
import ReusableTable from "../../../components/table";
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteModal from "../../../components/delete-modal";
import SearchBar from "../../../components/search-bar";

export const AllDoctors: FC = () => {
    const { doctors, deleteDoctor } = useDoctorsContext();
    const navigate = useNavigate();
    const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [filteredDoctors, setFilteredDoctors] = useState<IDoctor[]>(doctors);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setFilteredDoctors(doctors);
    }, [doctors]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, doctor: IDoctor) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedDoctor(doctor);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditDoctor = () => {
        if (selectedDoctor) {
            navigate(`/doctors/edit/${selectedDoctor.id}`);
        }
        handleMenuClose();
        setSelectedDoctor(null);
    };

    const handleDeleteConfirm = () => {
        setDeleteModalOpen(true); 
        handleMenuClose(); 
    };

    const handleDeleteDoctor = async () => {
        if (!selectedDoctor) return;

        setIsDeleting(true);
        try {
            await deleteDoctor(selectedDoctor.id);
            setDeleteModalOpen(false);
            setSelectedDoctor(null);
        } catch (error) {
            console.error('Error deleting doctor:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        if (!isDeleting) {
            setDeleteModalOpen(false);
            setSelectedDoctor(null);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (!query) {
            setFilteredDoctors(doctors);
            return;
        }

        const filtered = doctors.filter((doctor) => {
            const searchTerm = query.toLowerCase();
            return (
                doctor.firstName.toLowerCase().includes(searchTerm) ||
                doctor.lastName.toLowerCase().includes(searchTerm) ||
                doctor.email.toLowerCase().includes(searchTerm) ||
                doctor.department.toLowerCase().includes(searchTerm) ||
                doctor.designation.toLowerCase().includes(searchTerm) ||
                doctor.phoneNumber.includes(searchTerm)
            );
        });

        setFilteredDoctors(filtered);
    };

    const handleRowClick = (doctor: IDoctor) => {
        navigate(`/doctors/${doctor.id}`);
    };

    const columns = [
        {
            id: 'photo',
            label: 'Photo',
            accessor: 'profileImg' as keyof IDoctor,
            render: (value: any, row: IDoctor) => (
                <Avatar 
                    src={row.profileImg} 
                    alt={`${row.firstName} ${row.lastName}`}
                    sx={{ width: 40, height: 40 }}
                >
                    {!row.profileImg && `${row.firstName.charAt(0)}${row.lastName.charAt(0)}`}
                </Avatar>
            )
        },
        {
            id: 'name',
            label: 'Name',
            accessor: 'firstName' as keyof IDoctor,
            render: (value: any, row: IDoctor) => (
                <Box>
                    <Typography variant="body2" fontWeight={600}>
                        {`${row.firstName} ${row.lastName}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {row.email}
                    </Typography>
                </Box>
            )
        },
        {
            id: 'department',
            label: 'Department',
            accessor: 'department' as keyof IDoctor,
        },
        {
            id: 'designation',
            label: 'Designation',
            accessor: 'designation' as keyof IDoctor,
        },
        {
            id: 'experience',
            label: 'Experience',
            accessor: 'yearsOfExperience' as keyof IDoctor,
            render: (value: any, row: IDoctor) => {
                const experience = row.yearsOfExperience;
                return experience !== undefined && experience !== null
                    ? `${experience} years`
                    : 'Not specified';
            }
        },
        {
            id: 'phone',
            label: 'Phone',
            accessor: 'phoneNumber' as keyof IDoctor,
            render: (value: any, row: IDoctor) => {
                const phone = row.phoneNumber;
                return phone && phone.trim() !== '' 
                    ? phone 
                    : 'Not provided';
            }
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 120,
            align: 'right' as const,
            sortable: false,
            render: (_: unknown, row: IDoctor) => (
                <Box>
                    <Tooltip title="View Doctor Detail">
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/doctors/${row.id}`);
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
        <Box sx={{ p: 3 }}>
            <Box mb={3}>
                <Typography variant="h4" fontWeight={600}>
                    All Doctors ({filteredDoctors.length})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {searchQuery && `Showing ${filteredDoctors.length} of ${doctors.length} doctors`}
                </Typography>
            </Box>
            
            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
                <SearchBar onSearch={handleSearch} />
            </Box>
            
            <ReusableTable
                data={filteredDoctors} 
                columns={columns}
                onRowClick={handleRowClick} 
                emptyMessage={
                    searchQuery 
                        ? `No doctors found matching "${searchQuery}"`
                        : "No doctors found. Add your first doctor to get started."
                }
            />

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleEditDoctor}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeleteConfirm} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

            <DeleteModal
                open={deleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteDoctor}
                title="Delete Doctor"
                itemName={selectedDoctor ? `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}` : undefined}
                message={selectedDoctor ? `Are you sure you want to delete Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}? This action cannot be undone.` : undefined}
                isDeleting={isDeleting}
            />
        </Box>
    );
};