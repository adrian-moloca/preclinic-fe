import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { FC, useState, useMemo, useEffect } from "react";
import { usePatientsContext } from "../../../providers/patients";
import { PatientsEntry } from "../../../providers/patients/types";
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/search-bar";
import DeleteModal from "../../../components/delete-modal";
import { Column, ReusableTable } from "../../../components/table/component";
import { useRecentItems } from "../../../hooks/recent-items";
import FavoriteButton from "../../../components/favorite-buttons";

export const AllPatients: FC = () => {
  const { patients, deletePatient } = usePatientsContext();
  const allPatients = useMemo(() => Object.values(patients).flat(), [patients]);
  const [filteredPatients, setFilteredPatients] = useState<PatientsEntry[]>(allPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientsEntry | null>(null);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { addRecentItem } = useRecentItems();

  useEffect(() => {
    setFilteredPatients(allPatients);
  }, [allPatients]);

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
      await deletePatient(selectedPatient.id);
      setDeleteModalOpen(false);
      setSelectedPatient(null);
      setAnchorEl(null);
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
      navigate(`/patients/edit/${selectedPatient.id}`);
      handleMenuClose();
    }
  };

  const handleRowClick = (patient: PatientsEntry) => {
    addRecentItem({
      id: patient.id,
      type: 'patient',
      title: `${patient.firstName} ${patient.lastName}`,
      subtitle: patient.email || patient.phoneNumber || '',
      url: `/patients/${patient.id}`,
      metadata: {
        gender: patient.gender,
        email: patient.email,
        phone: patient.phoneNumber,
      },
    });
    
    navigate(`/patients/${patient.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredPatients(allPatients);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = allPatients.filter((patient) =>
      patient.firstName?.toLowerCase().includes(lowerQuery) ||
      patient.lastName?.toLowerCase().includes(lowerQuery) ||
      patient.email?.toLowerCase().includes(lowerQuery) ||
      patient.phoneNumber?.toLowerCase().includes(lowerQuery) ||
      patient.address?.toLowerCase().includes(lowerQuery)
    );

    setFilteredPatients(filtered);
  };

  const columns: Column[] = [
    {
      id: 'patient',
      label: 'Patient',
      minWidth: 200,
      render: (value, row: PatientsEntry) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={row.profileImg}>
            {row.firstName?.[0]}{row.lastName?.[0]}
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {row.firstName} {row.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {row.id}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'birthDate',
      label: 'Birth Date',
      minWidth: 120,
    },
    {
      id: 'phoneNumber',
      label: 'Phone',
      minWidth: 130,
    },
    {
      id: 'address',
      label: 'Address',
      minWidth: 200,
      render: (value: string) => (
        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 140,
      align: 'right',
      sortable: false,
      render: (_: unknown, row: PatientsEntry) => {
        const favoriteItem = {
          id: row.id,
          type: 'patient' as const,
          title: `${row.firstName} ${row.lastName}`,
          subtitle: row.email || row.phoneNumber || '',
          url: `/patients/${row.id}`,
          metadata: {
            gender: row.gender,
            email: row.email,
            phone: row.phoneNumber,
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
                    id: row.id,
                    type: 'patient',
                    title: `${row.firstName} ${row.lastName}`,
                    subtitle: row.email || row.phoneNumber || '',
                    url: `/patients/${row.id}`,
                    metadata: {
                      gender: row.gender,
                      email: row.email,
                      phone: row.phoneNumber,
                    },
                  });
                  navigate(`/patients/${row.id}`);
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
        All Patients ({filteredPatients.length})
      </Typography>
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
        itemName={selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : undefined}
        message={selectedPatient ? `Are you sure you want to delete ${selectedPatient.firstName} ${selectedPatient.lastName}? This action cannot be undone.` : undefined}
        isDeleting={isDeleting}
      />
    </Box>
  );
};