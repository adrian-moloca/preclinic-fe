import {
    Box,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    Chip,
    Avatar,
} from "@mui/material";
import { FC, useState, useMemo, useCallback } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from '@mui/icons-material/Info';
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/search-bar";
import { useLeavesContext } from "../../../providers/leaves";
import { Leaves } from "../../../providers/leaves/types";
import DeleteModal from "../../../components/delete-modal";
import { Column, ReusableTable } from "../../../components/table/component";
import { useRecentItems } from "../../../hooks/recent-items";
import FavoriteButton from "../../../components/favorite-buttons";

export const AllLeaves: FC = () => {
    const { leaves, deleteLeave } = useLeavesContext();
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState<Leaves | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const { addRecentItem } = useRecentItems();

    const handleDeleteClick = () => {
        if (selectedLeave) {
            setDeleteModalOpen(true);
            setAnchorEl(null);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedLeave) return;

        setIsDeleting(true);
        try {
            await deleteLeave(selectedLeave.id);
            setDeleteModalOpen(false);
            setSelectedLeave(null);
            setAnchorEl(null);
        } catch (error) {
            console.error('Error deleting leave:', error);
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
            await Promise.all(selectedIds.map(id => deleteLeave(id)));
        } catch (error) {
            console.error('Error deleting leaves:', error);
        }
    };

    const filteredLeaves = useMemo(() => {
        if (!searchQuery.trim()) {
            return leaves;
        }

        const queryLower = searchQuery.toLowerCase().trim();
        return leaves.filter((leave) => {
            return (
                leave.leaveType?.toLowerCase().includes(queryLower) ||
                leave.status?.toLowerCase().includes(queryLower) ||
                leave.appliedOn?.toLowerCase().includes(queryLower) ||
                leave.fromDate?.toLowerCase().includes(queryLower) ||
                leave.toDate?.toLowerCase().includes(queryLower)
            );
        });
    }, [leaves, searchQuery]);

    const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>, leave: Leaves) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedLeave(leave);
    }, []);

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
        if (!deleteModalOpen) {
            setSelectedLeave(null);
        }
    }, [deleteModalOpen]);

    const handleEditLeave = useCallback(() => {
        if (selectedLeave) {
            navigate(`/leaves/edit/${selectedLeave.id}`);
            handleMenuClose();
        }
    }, [selectedLeave, navigate, handleMenuClose]);

    const handleRowClick = (leave: Leaves) => {
        addRecentItem({
            id: leave.id,
            type: 'leave',
            title: `Leave Request - ${leave.leaveType}`,
            subtitle: `${leave.fromDate || ''} - ${leave.toDate || ''} (${leave.status || 'Pending'})`,
            url: `/leaves/${leave.id}`,
            metadata: {
                leaveType: leave.leaveType,
                status: leave.status,
                fromDate: leave.fromDate,
                toDate: leave.toDate,
                days: leave.days,
            },
        });
        
        navigate(`/leaves/${leave.id}`);
    };

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'success';
            case 'rejected':
                return 'error';
            case 'pending':
                return 'warning';
            default:
                return 'default';
        }
    };

    const addToRecentAndNavigate = useCallback((leave: Leaves) => {
        addRecentItem({
            id: leave.id,
            type: 'leave',
            title: `Leave Request - ${leave.leaveType}`,
            subtitle: `${leave.fromDate || ''} - ${leave.toDate || ''} (${leave.status || 'Pending'})`,
            url: `/leaves/${leave.id}`,
            metadata: {
                leaveType: leave.leaveType,
                status: leave.status,
                fromDate: leave.fromDate,
                toDate: leave.toDate,
                days: leave.days,
            },
        });
        navigate(`/leaves/${leave.id}`);
    }, [addRecentItem, navigate]);

    const columns: Column[] = [
        {
            id: 'leaveInfo',
            label: 'Leave Request',
            minWidth: 200,
            sortable: false,
            render: (_, row: Leaves) => (
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar>
                        <EventBusyIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {row.leaveType || 'Leave Request'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            ID: {row.id}
                        </Typography>
                    </Box>
                </Box>
            ),
        },
        {
            id: 'leaveDate',
            label: 'Leave Date',
            minWidth: 200,
            sortable: false,
            render: (_, row: Leaves) => (
                <Box>
                    <Typography variant="body2">
                        {`${row.fromDate || ''} - ${row.toDate || ''}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {row.days || 0} days
                    </Typography>
                </Box>
            ),
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            render: (value: string) => (
                <Chip
                    label={value || 'Pending'}
                    size="small"
                    color={getStatusColor(value) as any}
                    variant="outlined"
                />
            ),
        },
        {
            id: 'appliedOn',
            label: 'Applied On',
            minWidth: 120,
            render: (value: string) => (
                <Typography variant="body2">
                    {value ? value.split("T")[0] : 'N/A'}
                </Typography>
            ),
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 140, 
            align: 'right',
            sortable: false,
            render: (_, row: Leaves) => {
                const favoriteItem = {
                    id: row.id,
                    type: 'leave' as const,
                    title: `Leave Request - ${row.leaveType}`,
                    subtitle: `${row.fromDate || ''} - ${row.toDate || ''} (${row.status || 'Pending'})`,
                    url: `/leaves/${row.id}`,
                    metadata: {
                        leaveType: row.leaveType,
                        status: row.status,
                        fromDate: row.fromDate,
                        toDate: row.toDate,
                        days: row.days,
                    },
                };

                return (
                    <Box display="flex" alignItems="center">
                        <FavoriteButton item={favoriteItem} size="small" />
                        
                        <Tooltip title="View Leave Details">
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToRecentAndNavigate(row);
                                }}
                                color="primary"
                                size="small"
                            >
                                <InfoIcon />
                            </IconButton>
                        </Tooltip>
                        <IconButton onClick={(e) => handleMenuOpen(e, row)} size="small">
                            <MoreVertIcon />
                        </IconButton>
                    </Box>
                );
            },
        },
    ];

    return (
        <Box p={3} sx={{ overflowX: "auto" }}>
            <Typography variant="h4" mb={2}>
                All Leaves ({filteredLeaves.length})
            </Typography>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
                <SearchBar onSearch={handleSearch} />
            </Box>

            <ReusableTable
                columns={columns}
                data={filteredLeaves}
                onRowClick={handleRowClick}
                onDeleteSelected={handleDeleteMultiple}
                searchQuery={searchQuery}
                emptyMessage="No Leaves Found"
                emptyDescription="There are currently no leave requests."
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
                <MenuItem onClick={handleEditLeave}>
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
                title="Delete Leave"
                itemName={selectedLeave ? `${selectedLeave.leaveType} leave request` : undefined}
                message={selectedLeave ? `Are you sure you want to delete this ${selectedLeave.leaveType} leave request? This action cannot be undone.` : undefined}
                isDeleting={isDeleting}
            />
        </Box>
    );
};