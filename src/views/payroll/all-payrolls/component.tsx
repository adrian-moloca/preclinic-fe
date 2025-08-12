import {
    Box,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    Chip,
} from "@mui/material";
import { FC, useState, useMemo, useEffect } from "react";
import { usePayrollsContext } from "../../../providers/payroll/context";
import { IPayroll } from "../../../providers/payroll/types";
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/search-bar";
import DeleteModal from "../../../components/delete-modal";
import { Column, ReusableTable } from "../../../components/table/component";

export const AllPayrolls: FC = () => {
    const { payrolls, deletePayroll } = usePayrollsContext();
    const navigate = useNavigate();

    // Simplified payroll list since we know payrolls is always an array now
    const payrollList = useMemo(() => {
        if (!payrolls || !Array.isArray(payrolls)) {
            console.log("No payrolls found or invalid format");
            return [];
        }
        
        return payrolls;
    }, [payrolls]);

    const [filteredPayrolls, setFilteredPayrolls] = useState<IPayroll[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedPayroll, setSelectedPayroll] = useState<IPayroll | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setFilteredPayrolls(payrollList);
    }, [payrollList]);

    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = payrollList.filter(payroll => {
                if (!payroll) return false;
                
                const employeeName = payroll.employee?.toLowerCase() || '';
                const payrollDate = payroll.date || '';
                const netSalary = payroll.netSalary?.toString() || '';
                const basicSalary = payroll.basicSalary?.toString() || '';
                const payrollId = payroll.id?.toLowerCase() || '';

                const query = searchQuery.toLowerCase();

                return (
                    employeeName.includes(query) ||
                    payrollDate.includes(searchQuery) ||
                    netSalary.includes(searchQuery) ||
                    basicSalary.includes(searchQuery) ||
                    payrollId.includes(query)
                );
            });
            setFilteredPayrolls(filtered);
        } else {
            setFilteredPayrolls(payrollList);
        }
    }, [payrollList, searchQuery]);

    const handleDeleteClick = () => {
        if (selectedPayroll) {
            setDeleteModalOpen(true);
            setAnchorEl(null);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedPayroll) return;

        setIsDeleting(true);
        try {
            await deletePayroll(selectedPayroll.id);
            setDeleteModalOpen(false);
            setSelectedPayroll(null);
        } catch (error) {
            console.error('Error deleting payroll:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        if (!isDeleting) {
            setDeleteModalOpen(false);
            setSelectedPayroll(null);
        }
    };

    const handleDeleteMultiple = async (selectedIds: string[]) => {
        if (!selectedIds.length) return;
        
        try {
            // Use Promise.allSettled to handle any potential failures gracefully
            const results = await Promise.allSettled(
                selectedIds.map(id => deletePayroll(id))
            );
            
            // Log any failures for debugging
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Failed to delete payroll ${selectedIds[index]}:`, result.reason);
                }
            });
        } catch (error) {
            console.error('Error deleting multiple payrolls:', error);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, payroll: IPayroll) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedPayroll(payroll);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        if (!deleteModalOpen) {
            setSelectedPayroll(null);
        }
    };

    const handleEditPayroll = () => {
        if (selectedPayroll) {
            navigate(`/payroll/edit/${selectedPayroll.id}`);
            handleMenuClose();
        }
    };

    const handleRowClick = (payroll: IPayroll) => {
        if (payroll?.id) {
            navigate(`/payroll/${payroll.id}`);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const formatCurrency = (amount: number | undefined | null) => {
        if (amount === undefined || amount === null || isNaN(amount)) {
            return '$0.00';
        }

        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        } catch (error) {
            return `$${amount.toFixed(2)}`;
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';

            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const getNetSalaryChip = (netSalary: number | undefined) => {
        const salary = netSalary || 0;
        let color: 'success' | 'warning' | 'error' = 'error';
        
        if (salary >= 5000) {
            color = 'success';
        } else if (salary >= 3000) {
            color = 'warning';
        }

        return (
            <Chip
                label={formatCurrency(salary)}
                color={color}
                size="small"
                sx={{ 
                    fontWeight: 600,
                    minWidth: '80px'
                }}
            />
        );
    };

    const calculateTotalEarnings = (row: IPayroll): number => {
        if (!row) return 0;
        
        return (row.basicSalary || 0) +
               (row.da || 0) +
               (row.hra || 0) +
               (row.conveyance || 0) +
               (row.medicalAllowance || 0) +
               (row.otherEarnings || 0);
    };

    const calculateTotalDeductions = (row: IPayroll): number => {
        if (!row) return 0;
        
        return (row.tds || 0) +
               (row.pf || 0) +
               (row.esi || 0) +
               (row.profTax || 0) +
               (row.labourWelfareFund || 0) +
               (row.otherDeductions || 0);
    };

    const columns: Column[] = [
        {
            id: "employee",
            label: "Employee",
            minWidth: 200,
            sortable: false,
            render: (_, row: IPayroll) => {
                if (!row) return <Typography variant="body2">N/A</Typography>;
                
                const employeeName = row.employee || 'Unknown Employee';
                const nameParts = employeeName.split('(');
                const name = nameParts[0]?.trim() || 'Unknown';
                const role = nameParts.length > 1
                    ? nameParts[1]?.replace(')', '').trim()
                    : 'Employee';

                return (
                    <Box>
                        <Typography variant="body2" fontWeight={500}>
                            {name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {role}
                        </Typography>
                    </Box>
                );
            },
        },
        {
            id: "basicSalary",
            label: "Basic Salary",
            minWidth: 120,
            align: "right",
            sortable: true,
            render: (_, row: IPayroll) => (
                <Typography variant="body2" fontWeight={500}>
                    {formatCurrency(row?.basicSalary)}
                </Typography>
            ),
        },
        {
            id: "totalEarnings",
            label: "Total Earnings",
            minWidth: 140,
            align: "right",
            sortable: false,
            render: (_, row: IPayroll) => {
                const totalEarnings = calculateTotalEarnings(row);
                return (
                    <Typography variant="body2" fontWeight={500} color="success.main">
                        {formatCurrency(totalEarnings)}
                    </Typography>
                );
            },
        },
        {
            id: "totalDeductions",
            label: "Total Deductions",
            minWidth: 140,
            align: "right",
            sortable: false,
            render: (_, row: IPayroll) => {
                const totalDeductions = calculateTotalDeductions(row);
                return (
                    <Typography variant="body2" fontWeight={500} color="error.main">
                        {formatCurrency(totalDeductions)}
                    </Typography>
                );
            },
        },
        {
            id: "netSalary",
            label: "Net Salary",
            minWidth: 120,
            align: "right",
            sortable: true,
            render: (_, row: IPayroll) => getNetSalaryChip(row?.netSalary),
        },
        {
            id: "date",
            label: "Date",
            minWidth: 100,
            sortable: true,
            render: (_, row: IPayroll) => (
                <Typography variant="body2">
                    {formatDate(row?.date)}
                </Typography>
            ),
        },
        {
            id: "actions",
            label: "Actions",
            minWidth: 100,
            align: "center",
            sortable: false,
            render: (_, row: IPayroll) => (
                <Box display="flex" gap={0.5} justifyContent="center">
                    <Tooltip title="View Details" arrow>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (row?.id) {
                                    navigate(`/payroll/${row.id}`);
                                }
                            }}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                    color: 'primary.dark'
                                }
                            }}
                        >
                            <InfoIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="More Options" arrow>
                        <IconButton
                            size="small"
                            onClick={(event) => handleMenuOpen(event, row)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'grey.100'
                                }
                            }}
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
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h4" fontWeight={600}>
                    All Payrolls ({payrollList.length})
                </Typography>
            </Box>

            <Box mb={3}>
                <SearchBar
                    onSearch={handleSearch}
                    placeholder="Search by employee name, date, salary, or ID..."
                />
            </Box>

            {payrollList.length === 0 ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="400px"
                    flexDirection="column"
                >
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Payrolls Found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        There are currently no payroll records available.
                    </Typography>
                </Box>
            ) : (
                <ReusableTable
                    data={filteredPayrolls}
                    columns={columns}
                    onRowClick={handleRowClick}
                    onDeleteSelected={handleDeleteMultiple}
                    searchQuery={searchQuery}
                    emptyMessage="No Payrolls Found"
                    emptyDescription="No payrolls match your current search criteria."
                    enableSelection={true}
                    enablePagination={true}
                    enableSorting={true}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    defaultRowsPerPage={10}
                />
            )}

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
                <MenuItem 
                    onClick={handleEditPayroll}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'primary.light',
                            color: 'primary.dark'
                        }
                    }}
                >
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit Payroll
                </MenuItem>
                <MenuItem 
                    onClick={handleDeleteClick}
                    sx={{
                        color: 'error.main',
                        '&:hover': {
                            backgroundColor: 'error.light',
                            color: 'error.dark'
                        }
                    }}
                >
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete Payroll
                </MenuItem>
            </Menu>

            <DeleteModal
                open={deleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Payroll"
                itemName={selectedPayroll 
                    ? `${selectedPayroll.employee}'s payroll` 
                    : 'this payroll'
                }
                message={selectedPayroll
                    ? `Are you sure you want to delete the payroll for ${selectedPayroll.employee} dated ${formatDate(selectedPayroll.date)}? This action cannot be undone.`
                    : 'Are you sure you want to delete this payroll? This action cannot be undone.'
                }
                isDeleting={isDeleting}
            />
        </Box>
    );
};