import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { useAssistentsContext } from "../../../providers/assistent/context";
import { IAssistent } from "../../../providers/assistent/types";
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/search-bar";
import DeleteModal from "../../../components/delete-modal";
import { Column, ReusableTable } from "../../../components/table/component";

export const AllAssistents: FC = () => {
  const { assistents, deleteAssistent } = useAssistentsContext();
  const [filteredAssistents, setFilteredAssistents] = useState<IAssistent[]>(assistents);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAssistent, setSelectedAssistent] = useState<IAssistent | null>(null);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setFilteredAssistents(assistents);
  }, [assistents]);

  const handleDeleteClick = () => {
    if (selectedAssistent) {
      setDeleteModalOpen(true);
      setAnchorEl(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAssistent) return;

    setIsDeleting(true);
    try {
      await deleteAssistent(selectedAssistent.id);
      setDeleteModalOpen(false);
      setSelectedAssistent(null);
      setAnchorEl(null);
    } catch (error) {
      console.error('Error deleting assistent:', error);
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
      await Promise.all(selectedIds.map(id => deleteAssistent(id)));
    } catch (error) {
      console.error('Error deleting assistents:', error);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, assistent: IAssistent) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedAssistent(assistent);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    if (!deleteModalOpen) {
      setSelectedAssistent(null);
    }
  };

  const handleEditAssistent = () => {
    if (selectedAssistent) {
      navigate(`/assistents/edit/${selectedAssistent.id}`);
      handleMenuClose();
    }
  };

  const handleRowClick = (assistent: IAssistent) => {
    navigate(`/assistents/${assistent.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredAssistents(assistents);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = assistents.filter((assistent) =>
      assistent.firstName.toLowerCase().includes(lowerQuery) ||
      assistent.lastName.toLowerCase().includes(lowerQuery) ||
      assistent.email.toLowerCase().includes(lowerQuery) ||
      assistent.phoneNumber.toLowerCase().includes(lowerQuery) ||
      assistent.department.toLowerCase().includes(lowerQuery) ||
      assistent.medLicenteNumber.toLowerCase().includes(lowerQuery) ||
      assistent.languages.some(lang => lang.toLowerCase().includes(lowerQuery)) ||
      assistent.about?.toLowerCase().includes(lowerQuery) ||
      assistent.city?.toLowerCase().includes(lowerQuery) ||
      assistent.country?.toLowerCase().includes(lowerQuery)
    );

    setFilteredAssistents(filtered);
  };

  const columns: Column[] = [
    {
      id: 'profile',
      label: 'Profile',
      minWidth: 80,
      sortable: false,
      render: (_, row: IAssistent) => (
        <Avatar
          src={row.profileImg}
          alt={`${row.firstName} ${row.lastName}`}
          sx={{ width: 40, height: 40 }}
        >
          {`${row.firstName[0]}${row.lastName[0]}`}
        </Avatar>
      ),
    },
    {
      id: 'name',
      label: 'Name',
      minWidth: 200,
      sortable: true,
      render: (_, row: IAssistent) => (
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {row.firstName} {row.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {row.email}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'contact',
      label: 'Contact',
      minWidth: 150,
      sortable: false,
      render: (_, row: IAssistent) => (
        <Box>
          <Typography variant="body2">{row.phoneNumber}</Typography>
          <Typography variant="body2" color="text.secondary">
            {row.city}, {row.country}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'department',
      label: 'Department',
      minWidth: 150,
      sortable: true,
      render: (_, row: IAssistent) => (
        <Typography variant="body2">{row.department}</Typography>
      ),
    },
    {
      id: 'experience',
      label: 'Experience',
      minWidth: 120,
      sortable: true,
      render: (_, row: IAssistent) => (
        <Typography variant="body2">
          {row.yearsOfExperience} {row.yearsOfExperience === 1 ? 'year' : 'years'}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 120,
      sortable: false,
      align: 'center' as const,
      render: (_, row: IAssistent) => (
        <Box display="flex" gap={1}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/assistents/${row.id}`);
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
            All Assistents ({filteredAssistents.length})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery && `Showing ${filteredAssistents.length} of ${assistents.length} assistents`}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
        <SearchBar onSearch={handleSearch} placeholder="Search assistents..." />
      </Box>
      
      <ReusableTable
        data={filteredAssistents} 
        columns={columns}
        onRowClick={handleRowClick} 
        onDeleteSelected={handleDeleteMultiple}
        searchQuery={searchQuery}
        emptyMessage={
          searchQuery 
            ? `No assistents found matching "${searchQuery}"`
            : "No assistents found. Add your first assistent to get started."
        }
        emptyDescription={
          searchQuery
            ? "Try adjusting your search criteria or clear the search to see all assistents."
            : "There are currently no assistents registered in the system."
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
        <MenuItem onClick={handleEditAssistent}>
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
        title="Delete Assistent"
        itemName={selectedAssistent ? `${selectedAssistent.firstName} ${selectedAssistent.lastName}` : undefined}
        message={selectedAssistent ? `Are you sure you want to delete ${selectedAssistent.firstName} ${selectedAssistent.lastName}? This action cannot be undone.` : undefined}
        isDeleting={isDeleting}
      />
    </Box>
  );
};