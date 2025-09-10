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
import { FC, useState, useMemo, useEffect, useCallback } from "react";
import { useInvoicesContext } from "../../../providers/invoices";
import { IInvoice } from "../../../providers/invoices/types";
import { usePatientsContext } from "../../../providers/patients";
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/search-bar";
import DeleteModal from "../../../components/delete-modal";
import { Column, ReusableTable } from "../../../components/table/component";

export const AllInvoices: FC = () => {
    const { invoices, deleteInvoice } = useInvoicesContext();
    const { patients } = usePatientsContext();
    const navigate = useNavigate();

    const [filteredInvoices, setFilteredInvoices] = useState<IInvoice[]>(invoices);
    const [searchQuery, setSearchQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    interface Patient {
        id: string;
        firstName: string;
        lastName: string;
        profileImg?: string;
        [key: string]: any;
    }
    const patientsArray: Patient[] = useMemo(() => {
        if (Array.isArray(patients)) {
            return patients as Patient[];
        }
        return Object.values(patients).flat() as Patient[];
    }, [patients]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredInvoices(invoices);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = invoices.filter((invoice) => {
            const patient = patientsArray.find(p => p.id === invoice.patientId);
            const patientName = patient ? `${patient.firstName} ${patient.lastName}` : invoice.patientName;

            return (
                invoice.invoiceNumber?.toLowerCase().includes(lowerQuery) ||
                patientName?.toLowerCase().includes(lowerQuery) ||
                invoice.email?.toLowerCase().includes(lowerQuery) ||
                invoice.department?.toLowerCase().includes(lowerQuery) ||
                invoice.paymentMethod?.toLowerCase().includes(lowerQuery) ||
                invoice.paymentStatus?.toLowerCase().includes(lowerQuery) ||
                invoice.productName?.toLowerCase().includes(lowerQuery) ||
                invoice.description?.toLowerCase().includes(lowerQuery) ||
                invoice.invoiceDate?.toLowerCase().includes(lowerQuery) ||
                invoice.dueDate?.toLowerCase().includes(lowerQuery)
            );
        });

        setFilteredInvoices(filtered);
    }, [invoices, patientsArray]);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredInvoices(invoices);
        } else {
            handleSearch(searchQuery);
        }
    }, [invoices, handleSearch, searchQuery]);

    const handleDeleteClick = () => {
        if (selectedInvoice) {
            setDeleteModalOpen(true);
            setAnchorEl(null);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedInvoice) return;

        setIsDeleting(true);
        try {
            await deleteInvoice(selectedInvoice.id);
            setDeleteModalOpen(false);
            setSelectedInvoice(null);
            setAnchorEl(null);
        } catch (error) {
            console.error('Error deleting invoice:', error);
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
            await Promise.all(selectedIds.map(id => deleteInvoice(id)));
        } catch (error) {
            console.error('Error deleting invoices:', error);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, invoice: IInvoice) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedInvoice(invoice);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        if (!deleteModalOpen) {
            setSelectedInvoice(null);
        }
    };

    const handleEditInvoice = () => {
        if (selectedInvoice) {
            navigate(`/invoices/edit/${selectedInvoice.id}`);
            handleMenuClose();
        }
    };

    const handleRowClick = (invoice: IInvoice) => {
        if (invoice?.id) {
            navigate(`/invoices/${invoice.id}`);
        }
    };

    const getPatientName = (invoice: IInvoice) => {
        const patient = patientsArray.find(p => p.id === invoice.patientId);
        return patient ? `${patient.firstName} ${patient.lastName}` : invoice.patientName || "Unknown Patient";
    };

    const getPatientAvatar = (invoice: IInvoice) => {
        const patient = patientsArray.find(p => p.id === invoice.patientId);
        return patient?.profileImg || "";
    };

    const formatCurrency = (amount: string | number) => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return isNaN(numAmount) ? '$0.00' : `$${numAmount.toFixed(2)}`;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'success';
            case 'pending':
                return 'warning';
            case 'overdue':
                return 'error';
            case 'cancelled':
                return 'default';
            default:
                return 'default';
        }
    };

    const columns: Column[] = [
        {
            id: 'invoiceNumber',
            label: 'Invoice #',
            minWidth: 120,
            sortable: true,
            render: (value, row: IInvoice) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight={600} color="primary.main">
                        {row.invoiceNumber}
                    </Typography>
                </Box>
            ),
        },
        {
            id: 'patient',
            label: 'Patient',
            minWidth: 200,
            sortable: true,
            render: (_, row: IInvoice) => {
                const patientName = getPatientName(row);
                const avatarSrc = getPatientAvatar(row);
                const initials = patientName.split(' ').map(n => n[0]).join('').toUpperCase();

                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            src={avatarSrc}
                            alt={patientName}
                            sx={{ width: 36, height: 36, fontSize: '0.875rem' }}
                        >
                            {initials}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight={500}>
                                {patientName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {row.email}
                            </Typography>
                        </Box>
                    </Box>
                );
            },
        },
        {
            id: 'department',
            label: 'Department',
            minWidth: 140,
            sortable: true,
            render: (value) => (
                <Chip
                    label={value || 'N/A'}
                    size="small"
                    variant="outlined"
                    sx={{ 
                        borderRadius: 1,
                        fontWeight: 500,
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                        borderColor: 'rgba(25, 118, 210, 0.2)',
                        color: 'primary.main'
                    }}
                />
            ),
        },
        {
            id: 'invoiceDate',
            label: 'Invoice Date',
            minWidth: 120,
            sortable: true,
            render: (value) => (
                <Typography variant="body2">
                    {formatDate(value)}
                </Typography>
            ),
        },
        {
            id: 'amount',
            label: 'Amount',
            minWidth: 100,
            align: 'right',
            sortable: true,
            render: (value) => (
                <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(value)}
                </Typography>
            ),
        },
        {
            id: 'paymentStatus',
            label: 'Status',
            minWidth: 130,
            sortable: true,
            render: (value) => (
                <Chip
                    label={value || 'Pending'}
                    size="small"
                    color={getPaymentStatusColor(value) as any}
                    sx={{ 
                        borderRadius: 1,
                        fontWeight: 500,
                        minWidth: 80
                    }}
                />
            ),
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 100,
            align: 'center',
            render: (_, row: IInvoice) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Tooltip title="View Details">
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(row);
                            }}
                            sx={{ color: 'primary.main' }}
                        >
                            <InfoIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="More Actions">
                        <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, row)}
                            sx={{ color: 'text.secondary' }}
                        >
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <Box p={3} sx={{ overflowX: "auto" }}>
            <Typography variant="h4" mb={2} fontWeight={700}>
                All Invoices ({filteredInvoices.length})
            </Typography>
            
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <SearchBar onSearch={handleSearch} placeholder="Search invoices..." />
                <Typography variant="body2" color="text.secondary">
                    {searchQuery && `Showing ${filteredInvoices.length} of ${invoices.length} invoices`}
                </Typography>
            </Box>

            <ReusableTable
                columns={columns}
                data={filteredInvoices}
                onRowClick={handleRowClick}
                onDeleteSelected={handleDeleteMultiple}
                searchQuery={searchQuery}
                emptyMessage={
                    searchQuery 
                        ? `No invoices found matching "${searchQuery}"`
                        : "No invoices found. Create your first invoice to get started."
                }
                emptyDescription={
                    searchQuery
                        ? "Try adjusting your search criteria or clear the search to see all invoices."
                        : "There are currently no invoices in the system."
                }
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
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        borderRadius: 2,
                        mt: 1
                    }
                }}
            >
                <MenuItem onClick={handleEditInvoice}>
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
                title="Delete Invoice"
                itemName={selectedInvoice ? selectedInvoice.invoiceNumber : undefined}
                message={selectedInvoice 
                    ? `Are you sure you want to delete invoice ${selectedInvoice.invoiceNumber} for ${getPatientName(selectedInvoice)}? This action cannot be undone.` 
                    : undefined
                }
                isDeleting={isDeleting}
            />
        </Box>
    );
};