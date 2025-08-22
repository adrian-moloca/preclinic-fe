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
import { usePayrollsContext } from "../../../providers/payroll/context";
import { IPayroll } from "../../../providers/payroll/types";
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/search-bar";
import DeleteModal from "../../../components/delete-modal";
import { Column, ReusableTable } from "../../../components/table/component";
import { useRecentItems } from "../../../hooks/recent-items";
import FavoriteButton from "../../../components/favorite-buttons";

export const AllPayrolls: FC = () => {
  const { payrolls, deletePayroll } = usePayrollsContext();
  const [filteredPayrolls, setFilteredPayrolls] = useState<IPayroll[]>(payrolls);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPayroll, setSelectedPayroll] = useState<IPayroll | null>(null);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { addRecentItem } = useRecentItems();

  useEffect(() => {
    setFilteredPayrolls(payrolls);
  }, [payrolls]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredPayrolls(payrolls);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = payrolls.filter((payroll) => {
      const employeeName = payroll.employee || '';
      return employeeName.toLowerCase().includes(lowerQuery);
    });

    setFilteredPayrolls(filtered);
  };

  const handleRowClick = (payroll: IPayroll) => {
    const employeeName = payroll.employee || 'Unknown Employee';
    const netSalary = calculateNetSalary(payroll);
    
    addRecentItem({
      id: payroll.id,
      type: 'payroll',
      title: `Payroll - ${employeeName}`,
      subtitle: `Net Salary: $${netSalary.toFixed(2)}`,
      url: `/payroll/${payroll.id}`,
      metadata: {
        employeeName,
        date: payroll.date,
        basicSalary: payroll.basicSalary,
        netSalary,
      },
    });
    
    navigate(`/payroll/${payroll.id}`);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, payroll: IPayroll) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedPayroll(payroll);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPayroll(null);
  };

  const handleEdit = () => {
    if (selectedPayroll) {
      navigate(`/payroll/edit/${selectedPayroll.id}`);
      handleMenuClose();
    }
  };

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
    }
  };

  const calculateTotalEarnings = (payroll: IPayroll): number => {
    return (payroll.basicSalary || 0) +
           (payroll.da || 0) +
           (payroll.hra || 0) +
           (payroll.conveyance || 0) +
           (payroll.medicalAllowance || 0) +
           (payroll.otherEarnings || 0);
  };

  const calculateTotalDeductions = (payroll: IPayroll): number => {
    return (payroll.tds || 0) +
           (payroll.pf || 0) +
           (payroll.esi || 0) +
           (payroll.profTax || 0) +
           (payroll.labourWelfareFund || 0) +
           (payroll.otherDeductions || 0);
  };

  const calculateNetSalary = (payroll: IPayroll): number => {
    return calculateTotalEarnings(payroll) - calculateTotalDeductions(payroll);
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };

  const getNetSalaryColor = (netSalary: number) => {
    if (netSalary >= 5000) return 'success';
    if (netSalary >= 3000) return 'warning';
    return 'error';
  };

  const columns: Column[] = [
    {
      id: 'employee',
      label: 'Employee',
      minWidth: 200,
      render: (value, row: IPayroll) => {
        const employeeName = row.employee || 'Unknown Employee';
        const nameParts = employeeName.split('(');
        const name = nameParts[0]?.trim() || 'Unknown';
        const role = nameParts.length > 1 
          ? nameParts[1]?.replace(')', '').trim() || 'Unknown'
          : 'Unknown';

        return (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar>
              <PaymentsIcon />
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {role}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      id: 'date',
      label: 'Payroll Date',
      minWidth: 120,
      render: (value: string) => (
        <Typography variant="body2">
          {new Date(value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      id: 'basicSalary',
      label: 'Basic Salary',
      minWidth: 120,
      render: (value: number) => (
        <Typography variant="body2" fontWeight={500}>
          {formatCurrency(value || 0)}
        </Typography>
      ),
    },
    {
      id: 'totalEarnings',
      label: 'Total Earnings',
      minWidth: 130,
      render: (value, row: IPayroll) => (
        <Typography variant="body2" color="success.main" fontWeight={500}>
          {formatCurrency(calculateTotalEarnings(row))}
        </Typography>
      ),
    },
    {
      id: 'totalDeductions',
      label: 'Total Deductions',
      minWidth: 140,
      render: (value, row: IPayroll) => (
        <Typography variant="body2" color="error.main" fontWeight={500}>
          {formatCurrency(calculateTotalDeductions(row))}
        </Typography>
      ),
    },
    {
      id: 'netSalary',
      label: 'Net Salary',
      minWidth: 120,
      render: (value, row: IPayroll) => {
        const netSalary = calculateNetSalary(row);
        return (
          <Chip
            label={formatCurrency(netSalary)}
            color={getNetSalaryColor(netSalary) as any}
            size="small"
            sx={{ fontWeight: 600, minWidth: '80px' }}
          />
        );
      },
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 140,
      align: 'right',
      sortable: false,
      render: (_: unknown, row: IPayroll) => {
        const employeeName = row.employee || 'Unknown Employee';
        const netSalary = calculateNetSalary(row);
        
        const favoriteItem = {
          id: row.id,
          type: 'payroll' as const,
          title: `Payroll - ${employeeName}`,
          subtitle: `Net Salary: ${formatCurrency(netSalary)}`,
          url: `/payroll/${row.id}`,
          metadata: {
            employeeName,
            date: row.date,
            basicSalary: row.basicSalary,
            netSalary,
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
                  type: 'payroll',
                  title: `Payroll - ${employeeName}`,
                  subtitle: `Net Salary: ${formatCurrency(netSalary)}`,
                  url: `/payroll/${row.id}`,
                  metadata: {
                    employeeName,
                    date: row.date,
                    basicSalary: row.basicSalary,
                    netSalary,
                  },
                });
                navigate(`/payroll/${row.id}`);
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
        All Payrolls ({filteredPayrolls.length})
      </Typography>
      <Box sx={{ mb: 2 }}>
        <SearchBar onSearch={handleSearch} placeholder="Search payrolls..." />
      </Box>

      <ReusableTable
        columns={columns}
        data={filteredPayrolls}
        onRowClick={handleRowClick}
        searchQuery={searchQuery}
        emptyMessage="No Payrolls Found"
        emptyDescription="There are currently no payroll records."
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Payroll
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Payroll
        </MenuItem>
      </Menu>

      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Payroll"
        itemName={selectedPayroll ? `Payroll for ${selectedPayroll.employee}` : undefined}
        isDeleting={isDeleting}
      />
    </Box>
  );
};