import { 
    Box, 
    Typography, 
    Avatar, 
    IconButton, 
    Menu, 
    MenuItem, 
    Chip,
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
import { useRecentItems } from "../../../hooks/recent-items";
import FavoriteButton from "../../../components/favorite-buttons";

export const AllDoctors: FC = () => {
    const { doctors, deleteDoctor } = useDoctorsContext();
    const navigate = useNavigate();
    const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [filteredDoctors, setFilteredDoctors] = useState<IDoctor[]>(doctors);
    const [searchQuery, setSearchQuery] = useState("");

    const { addRecentItem } = useRecentItems();

    useEffect(() => {
        setFilteredDoctors(doctors);
    }, [doctors]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (!query) {
            setFilteredDoctors(doctors);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = doctors.filter((doctor) =>
            doctor.firstName?.toLowerCase().includes(lowerQuery) ||
            doctor.lastName?.toLowerCase().includes(lowerQuery) ||
            doctor.email?.toLowerCase().includes(lowerQuery) ||
            doctor.phoneNumber?.toLowerCase().includes(lowerQuery)
        );

        setFilteredDoctors(filtered);
    };

    const handleRowClick = (doctor: IDoctor) => {
        addRecentItem({
            id: doctor.id,
            type: 'doctor',
            title: `Dr. ${doctor.firstName} ${doctor.lastName}`,
            subtitle: doctor.email || '',
            url: `/doctors/${doctor.id}`,
            metadata: {
                email: doctor.email,
                phone: doctor.phoneNumber,
            },
        });
        
        navigate(`/doctors/${doctor.id}`);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, doctor: IDoctor) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedDoctor(doctor);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedDoctor(null);
    };

    const handleEditDoctor = () => {
        if (selectedDoctor) {
            navigate(`/doctors/edit/${selectedDoctor.id}`);
            handleMenuClose();
        }
    };

    const handleDeleteClick = () => {
        if (selectedDoctor) {
            setDeleteModalOpen(true);
            setAnchorEl(null);
        }
    };

    const handleDeleteConfirm = async () => {
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
        }
    };

    const columns = [
        {
            id: 'doctor',
            label: 'Doctor',
            minWidth: 200,
            render: (value: any, row: IDoctor) => (
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={row.profileImg}>
                        {row.firstName?.[0]}{row.lastName?.[0]}
                    </Avatar>
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Dr. {row.firstName} {row.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            ID: {row.id}
                        </Typography>
                    </Box>
                </Box>
            ),
        },
        {
            id: 'specialization',
            label: 'Specialization',
            minWidth: 150,
            render: (value: string) => (
                <Chip label={value} size="small" color="primary" variant="outlined" />
            ),
        },
        {
            id: 'email',
            label: 'Email',
            minWidth: 200,
        },
        {
            id: 'phoneNumber',
            label: 'Phone',
            minWidth: 130,
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 140,
            align: 'right' as const,
            sortable: false,
            render: (_: unknown, row: IDoctor) => {
                const favoriteItem = {
                    id: row.id,
                    type: 'doctor' as const,
                    title: `Dr. ${row.firstName} ${row.lastName}`,
                    subtitle: row.email || '',
                    url: `/doctors/${row.id}`,
                    metadata: {
                        email: row.email,
                        phone: row.phoneNumber,
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
                                    type: 'doctor',
                                    title: `Dr. ${row.firstName} ${row.lastName}`,
                                    subtitle: row.email || '',
                                    url: `/doctors/${row.id}`,
                                    metadata: {
                                        email: row.email,
                                        phone: row.phoneNumber,
                                    },
                                });
                                navigate(`/doctors/${row.id}`);
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
                All Doctors ({filteredDoctors.length})
            </Typography>
            <Box sx={{ mb: 2 }}>
                <SearchBar onSearch={handleSearch} />
            </Box>

            <ReusableTable
                columns={columns}
                data={filteredDoctors}
                onRowClick={handleRowClick}
                searchQuery={searchQuery}
                emptyMessage="No Doctors Found"
                emptyDescription="There are currently no doctors registered."
            />

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEditDoctor}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit Doctor
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete Doctor
                </MenuItem>
            </Menu>

            <DeleteModal
                open={deleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Doctor"
                itemName={selectedDoctor ? `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}` : undefined}
                isDeleting={isDeleting}
            />
        </Box>
    );
};