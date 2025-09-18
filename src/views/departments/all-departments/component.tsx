import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Avatar,
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { useDepartmentsContext } from "../../../providers/departments/context";
import { IDepartments } from "../../../providers/departments/types";
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BusinessIcon from "@mui/icons-material/Business";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/search-bar";
import DeleteModal from "../../../components/delete-modal";
import { Column, ReusableTable } from "../../../components/table/component";
import { useRecentItems } from "../../../hooks/recent-items";
import FavoriteButton from "../../../components/favorite-buttons";

export const AllDepartments: FC = () => {
  const { departments, deleteDepartment } = useDepartmentsContext();
  const [filteredDepartments, setFilteredDepartments] = useState<IDepartments[]>(departments);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<IDepartments | null>(null);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { addRecentItem } = useRecentItems();

  useEffect(() => {
    setFilteredDepartments(departments);
  }, [departments]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredDepartments(departments);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = departments.filter((department) =>
      department.name?.toLowerCase().includes(lowerQuery) ||
      department.description?.toLowerCase().includes(lowerQuery) ||
      department.status?.toLowerCase().includes(lowerQuery)
    );

    setFilteredDepartments(filtered);
  };

  const handleRowClick = (department: IDepartments) => {
    // NEW: Add to recent items
    addRecentItem({
      id: department.id ?? '',
      type: 'department',
      title: department.name,
      subtitle: department.description || '',
      url: `/departments/${department.id}`,
      metadata: {
        status: department.status,
        doctorsCount: department.doctors?.length || 0,
        assistantsCount: department.assistants?.length || 0,
      },
    });
    
    navigate(`/departments/${department.id}`);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, department: IDepartments) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedDepartment(department);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDepartment(null);
  };

  const handleEdit = () => {
    if (selectedDepartment) {
      navigate(`/departments/edit/${selectedDepartment.id}`);
      handleMenuClose();
    }
  };

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
       deleteDepartment(selectedDepartment.id!);
      setDeleteModalOpen(false);
      setSelectedDepartment(null);
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getTotalStaff = (department: IDepartments) => {
    const doctorsCount = department.doctors?.length || 0;
    const assistantsCount = department.assistants?.length || 0;
    return doctorsCount + assistantsCount;
  };

  const columns: Column[] = [
    {
      id: 'department',
      label: 'Department',
      minWidth: 200,
      render: (value, row: IDepartments) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar>
            <BusinessIcon />
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {row.id}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'description',
      label: 'Description',
      minWidth: 250,
      render: (value: string) => (
        <Typography 
          variant="body2" 
          sx={{ 
            maxWidth: 250, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {value || 'No description provided'}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      render: (value: string) => (
        <Chip 
          label={value?.toUpperCase()} 
          size="small" 
          color={getStatusColor(value) as any}
        />
      ),
    },
    {
      id: 'totalStaff',
      label: 'Total Staff',
      minWidth: 120,
      render: (value, row: IDepartments) => {
        const total = getTotalStaff(row);
        return (
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {total} members
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.doctors?.length || 0} doctors, {row.assistants?.length || 0} assistants
            </Typography>
          </Box>
        );
      },
    },
    {
      id: 'createdAt',
      label: 'Created',
      minWidth: 120,
      render: (value: string) => (
        <Typography variant="body2">
          {new Date(value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 140,
      align: 'right',
      sortable: false,
      render: (_: unknown, row: IDepartments) => {
        const favoriteItem = {
          id: row.id ?? '', // Ensure id is always a string
          type: 'department' as const,
          title: row.name,
          subtitle: row.description || '',
          url: `/departments/${row.id}`,
          metadata: {
            status: row.status,
            doctorsCount: row.doctors?.length || 0,
            assistantsCount: row.assistants?.length || 0,
          },
        };

        return (
          <Box display="flex" alignItems="center">
            <FavoriteButton item={favoriteItem} size="small" />
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                addRecentItem({
                  id: row.id ?? '',
                  type: 'department',
                  title: row.name,
                  subtitle: row.description || '',
                  url: `/departments/${row.id}`,
                  metadata: {
                    status: row.status,
                    doctorsCount: row.doctors?.length || 0,
                    assistantsCount: row.assistants?.length || 0,
                  },
                });
                navigate(`/departments/${row.id}`);
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
        All Departments ({filteredDepartments.length})
      </Typography>
      <Box sx={{ mb: 2 }}>
        <SearchBar onSearch={handleSearch} placeholder="Search departments..." />
      </Box>

      <ReusableTable
        columns={columns}
        data={filteredDepartments}
        onRowClick={handleRowClick}
        searchQuery={searchQuery}
        emptyMessage="No Departments Found"
        emptyDescription="There are currently no departments configured."
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Department
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Department
        </MenuItem>
      </Menu>

      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Department"
        itemName={selectedDepartment ? selectedDepartment.name : undefined}
        isDeleting={isDeleting}
      />
    </Box>
  );
};