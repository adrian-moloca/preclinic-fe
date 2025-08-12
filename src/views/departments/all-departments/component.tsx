import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Chip,
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { useDepartmentsContext } from "../../../providers/departments/context";
import { IDepartments } from "../../../providers/departments/types";
import { useDoctorsContext } from "../../../providers/doctor/context";
import { useAssistentsContext } from "../../../providers/assistent/context";
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/search-bar";
import DeleteModal from "../../../components/delete-modal";
import { Column, ReusableTable } from "../../../components/table/component";

export const AllDepartments: FC = () => {
  const { departments, deleteDepartment } = useDepartmentsContext();
  const { doctors } = useDoctorsContext();
  const { assistents } = useAssistentsContext();
  const [filteredDepartments, setFilteredDepartments] = useState<IDepartments[]>(departments);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<IDepartments | null>(null);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setFilteredDepartments(departments);
  }, [departments]);

  const handleDeleteClick = () => {
    if (selectedDepartment) {
      setDeleteModalOpen(true);
      setAnchorEl(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDepartment) return;

    setIsDeleting(true);
    try {
      await deleteDepartment(selectedDepartment.id);
      setDeleteModalOpen(false);
      setSelectedDepartment(null);
      setAnchorEl(null);
    } catch (error) {
      console.error('Error deleting department:', error);
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
      await Promise.all(selectedIds.map(id => deleteDepartment(id)));
    } catch (error) {
      console.error('Error deleting departments:', error);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, department: IDepartments) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedDepartment(department);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    if (!deleteModalOpen) {
      setSelectedDepartment(null);
    }
  };

  const handleEditDepartment = () => {
    if (selectedDepartment) {
      navigate(`/departments/edit/${selectedDepartment.id}`);
      handleMenuClose();
    }
  };

  const handleRowClick = (department: IDepartments) => {
    navigate(`/departments/${department.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredDepartments(departments);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = departments.filter((department) =>
      department.name.toLowerCase().includes(lowerQuery) ||
      department.description.toLowerCase().includes(lowerQuery) ||
      department.status.toLowerCase().includes(lowerQuery)
    );

    setFilteredDepartments(filtered);
  };

  const getDoctorNames = (doctorIds: string[]) => {
    if (!doctorIds || doctorIds.length === 0) return [];
    return doctorIds
      .map(id => doctors.find(doctor => doctor.id === id))
      .filter(Boolean)
      .map(doctor => `Dr. ${doctor!.firstName} ${doctor!.lastName}`);
  };

  const getAssistantNames = (assistantIds: string[]) => {
    if (!assistantIds || assistantIds.length === 0) return [];
    return assistantIds
      .map(id => assistents.find(assistant => assistant.id === id))
      .filter(Boolean)
      .map(assistant => `${assistant!.firstName} ${assistant!.lastName}`);
  };

  const formatStaffDisplay = (doctorIds: string[], assistantIds: string[]) => {
    const doctorCount = doctorIds?.length || 0;
    const assistantCount = assistantIds?.length || 0;
    const totalStaff = doctorCount + assistantCount;

    if (totalStaff === 0) return "No staff assigned";
    
    return `${doctorCount} Doctor${doctorCount !== 1 ? 's' : ''} • ${assistantCount} Assistant${assistantCount !== 1 ? 's' : ''}`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  const columns: Column[] = [
    {
      id: 'name',
      label: 'Department',
      minWidth: 200,
      sortable: true,
      render: (_, row: IDepartments) => (
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {row.name}
          </Typography>
          <Chip 
            label={row.status} 
            color={getStatusColor(row.status) as any}
            size="small"
            sx={{ mt: 0.5, textTransform: 'capitalize' }}
          />
        </Box>
      ),
    },
    {
      id: 'staff',
      label: 'Staff',
      minWidth: 200,
      sortable: false,
      render: (_, row: IDepartments) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {formatStaffDisplay(row.doctors, row.assistants)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total: {(row.doctors?.length || 0) + (row.assistants?.length || 0)} members
          </Typography>
        </Box>
      ),
    },
    {
      id: 'doctors',
      label: 'Doctors',
      minWidth: 150,
      sortable: false,
      render: (_, row: IDepartments) => {
        const doctorNames = getDoctorNames(row.doctors);
        if (doctorNames.length === 0) {
          return <Typography variant="body2" color="text.secondary">None</Typography>;
        }
        if (doctorNames.length <= 2) {
          return (
            <Box>
              {doctorNames.map((name, index) => (
                <Typography key={index} variant="body2" sx={{ fontSize: '0.8rem' }}>
                  {name}
                </Typography>
              ))}
            </Box>
          );
        }
        return (
          <Tooltip title={doctorNames.join(', ')}>
            <Typography variant="body2">
              {doctorNames.slice(0, 2).join(', ')} +{doctorNames.length - 2}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      id: 'assistants',
      label: 'Assistants',
      minWidth: 150,
      sortable: false,
      render: (_, row: IDepartments) => {
        const assistantNames = getAssistantNames(row.assistants);
        if (assistantNames.length === 0) {
          return <Typography variant="body2" color="text.secondary">None</Typography>;
        }
        if (assistantNames.length <= 2) {
          return (
            <Box>
              {assistantNames.map((name, index) => (
                <Typography key={index} variant="body2" sx={{ fontSize: '0.8rem' }}>
                  {name}
                </Typography>
              ))}
            </Box>
          );
        }
        return (
          <Tooltip title={assistantNames.join(', ')}>
            <Typography variant="body2">
              {assistantNames.slice(0, 2).join(', ')} +{assistantNames.length - 2}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      id: 'createdAt',
      label: 'Created',
      minWidth: 120,
      sortable: true,
      render: (_, row: IDepartments) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(row.createdAt).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 120,
      sortable: false,
      align: 'center' as const,
      render: (_, row: IDepartments) => (
        <Box display="flex" gap={1}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/departments/${row.id}`);
              }}
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Actions">
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, row)}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            All Departments ({filteredDepartments.length})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery && `Showing ${filteredDepartments.length} of ${departments.length} departments`}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
        <SearchBar onSearch={handleSearch} placeholder="Search departments..." />
      </Box>
      
      <ReusableTable
        data={filteredDepartments} 
        columns={columns}
        onRowClick={handleRowClick} 
        onDeleteSelected={handleDeleteMultiple}
        searchQuery={searchQuery}
        emptyMessage={
          searchQuery 
            ? `No departments found matching "${searchQuery}"`
            : "No departments found. Add your first department to get started."
        }
        emptyDescription={
          searchQuery
            ? "Try adjusting your search criteria or clear the search to see all departments."
            : "There are currently no departments registered in the system."
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
      >
        <MenuItem onClick={handleEditDepartment}>
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
        title="Delete Department"
        itemName={selectedDepartment ? selectedDepartment.name : undefined}
        message={selectedDepartment ? `Are you sure you want to delete the "${selectedDepartment.name}" department? This action cannot be undone.` : undefined}
        isDeleting={isDeleting}
      />
    </Box>
  );
};