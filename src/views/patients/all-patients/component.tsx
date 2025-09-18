import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { FC, useState, useMemo, useEffect } from "react";
import { usePatientsContext } from "../../../providers/patients";
import { PatientsEntry } from "../../../providers/patients/types";
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/search-bar";
import DeleteModal from "../../../components/delete-modal";
import { Column, ReusableTable } from "../../../components/table/component";
import { useRecentItems } from "../../../hooks/recent-items";
import FavoriteButton from "../../../components/favorite-buttons";

export const AllPatients: FC = () => {
  const { patients, deletePatient, getAllPatients, loading, hasLoaded } = usePatientsContext();
  const [error, setError] = useState<string | null>(null);
  const allPatients = useMemo(() => Object.values(patients).flat(), [patients]);
  const [filteredPatients, setFilteredPatients] = useState<PatientsEntry[]>(allPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientsEntry | null>(null);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { addRecentItem } = useRecentItems();

  // Fetch patients when component mounts if not already loaded
  useEffect(() => {
    if (!hasLoaded) {
      const fetchPatients = async () => {
        setError(null);
        try {
          await getAllPatients();
        } catch (err) {
          console.error('Error fetching patients:', err);
          setError('Failed to load patients. Please try again.');
        }
      };
      fetchPatients();
    }
  }, [hasLoaded, getAllPatients]);

  // Update filtered patients when patients data changes
  useEffect(() => {
    setFilteredPatients(allPatients);
  }, [allPatients]);

  const handleRefresh = async () => {
    setError(null);
    try {
       getAllPatients(); // Force refresh
    } catch (err) {
      console.error('Error refreshing patients:', err);
      setError('Failed to refresh patients. Please try again.');
    }
  };

  const handleDeleteClick = () => {
    if (selectedPatient) {
      setDeleteModalOpen(true);
      setAnchorEl(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPatient) return;

    setIsDeleting(true);
    try {
       deletePatient(selectedPatient._id);
      setDeleteModalOpen(false);
      setSelectedPatient(null);
      setAnchorEl(null);
      // Refresh patients list after deletion
       getAllPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
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
      await Promise.all(selectedIds.map(id => deletePatient(id)));
      // Refresh patients list after deletion
       getAllPatients();
    } catch (error) {
      console.error('Error deleting patients:', error);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, patient: PatientsEntry) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedPatient(patient);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    if (!deleteModalOpen) {
      setSelectedPatient(null);
    }
  };

  const handleEditPatient = () => {
    if (selectedPatient) {
      navigate(`/patients/edit/${selectedPatient._id}`);
      handleMenuClose();
    }
  };

  const handleRowClick = (patient: PatientsEntry) => {
    const patientData = (patient as any).user || patient;
    addRecentItem({
      id: patient._id,
      type: 'patient',
      title: `${patientData.firstName} ${patientData.lastName}`,
      subtitle: patientData.email || patientData.phoneNumber || '',
      url: `/patients/${patient._id}`,
      metadata: {
        gender: patientData.gender,
        email: patientData.email,
        phone: patientData.phoneNumber,
      },
    });
    
    navigate(`/patients/${patient._id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredPatients(allPatients);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = allPatients.filter((patient: any) => {
      const patientData = patient.user || patient;
      return (
        patientData.firstName?.toLowerCase().includes(lowerQuery) ||
        patientData.lastName?.toLowerCase().includes(lowerQuery) ||
        patientData.email?.toLowerCase().includes(lowerQuery) ||
        patientData.phoneNumber?.toLowerCase().includes(lowerQuery) ||
        patientData.address?.toLowerCase().includes(lowerQuery)
      );
    });

    setFilteredPatients(filtered);
  };

  const columns: Column[] = [
    {
      id: 'patient',
      label: 'Patient',
      minWidth: 200,
      render: (value, row: any) => {
        const patientData = row.user || row;
        return (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={patientData.profileImg}>
              {patientData.firstName?.[0]}{patientData.lastName?.[0]}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {patientData.firstName} {patientData.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {row._id}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      id: 'birthDate',
      label: 'Birth Date',
      minWidth: 120,
      render: (value, row: any) => {
        const patientData = row.user || row;
        return (
          <Typography variant="body2">
            {patientData.birthDate || 'N/A'}
          </Typography>
        );
      },
    },
    {
      id: 'phoneNumber',
      label: 'Phone',
      minWidth: 130,
      render: (value, row: any) => {
        const patientData = row.user || row;
        return (
          <Typography variant="body2">
            {patientData.phoneNumber || 'N/A'}
          </Typography>
        );
      },
    },
    {
      id: 'address',
      label: 'Address',
      minWidth: 200,
      render: (value, row: any) => {
        const patientData = row.user || row;
        return (
          <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {patientData.address || 'N/A'}
          </Typography>
        );
      },
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 140,
      align: 'right',
      sortable: false,
      render: (_: unknown, row: any) => {
        const patientData = row.user || row;
        const favoriteItem = {
          id: row._id,
          type: 'patient' as const,
          title: `${patientData.firstName} ${patientData.lastName}`,
          subtitle: patientData.email || patientData.phoneNumber || '',
          url: `/patients/${row._id}`,
          metadata: {
            gender: patientData.gender,
            email: patientData.email,
            phone: patientData.phoneNumber,
          },
        };

        return (
          <Box display="flex" alignItems="center">
            <FavoriteButton item={favoriteItem} size="small" />
            
            <Tooltip title="View Patient Detail">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                   addRecentItem({
                    id: row._id,
                    type: 'patient',
                    title: `${patientData.firstName} ${patientData.lastName}`,
                    subtitle: patientData.email || patientData.phoneNumber || '',
                    url: `/patients/${row._id}`,
                    metadata: {
                      gender: patientData.gender,
                      email: patientData.email,
                      phone: patientData.phoneNumber,
                    },
                  });
                  navigate(`/patients/${row._id}`);
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

  // Show loading spinner while fetching patients
  if (loading) {
    return (
      <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Show error message if fetch failed
  if (error) {
    return (
      <Box p={3}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3} sx={{ overflowX: "auto" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          All Patients ({filteredPatients.length})
        </Typography>
        <IconButton onClick={handleRefresh} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
        <SearchBar onSearch={handleSearch} />
      </Box>

      <ReusableTable
        columns={columns}
        data={filteredPatients}
        onRowClick={handleRowClick}
        onDeleteSelected={handleDeleteMultiple}
        searchQuery={searchQuery}
        emptyMessage="No Patients Found"
        emptyDescription="There are currently no patients registered."
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleEditPatient}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Patient
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Patient
        </MenuItem>
      </Menu>

      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient"
        itemName={selectedPatient ? `${(selectedPatient as any).user?.firstName || ''} ${(selectedPatient as any).user?.lastName || ''}` : undefined}
        message={selectedPatient ? `Are you sure you want to delete ${(selectedPatient as any).user?.firstName || ''} ${(selectedPatient as any).user?.lastName || ''}? This action cannot be undone.` : undefined}
        isDeleting={isDeleting}
      />
    </Box>
  );
};