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
import { useServicesContext } from "../../../providers/services/context";
import { IServices } from "../../../providers/services/types";
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/search-bar";
import DeleteModal from "../../../components/delete-modal";
import { Column, ReusableTable } from "../../../components/table/component";
import { useRecentItems } from "../../../hooks/recent-items";
import FavoriteButton from "../../../components/favorite-buttons";

export const AllServices: FC = () => {
  const { services, deleteService } = useServicesContext();
  const [filteredServices, setFilteredServices] = useState<IServices[]>(services);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedService, setSelectedService] = useState<IServices | null>(null);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { addRecentItem } = useRecentItems();

  useEffect(() => {
    setFilteredServices(services);
  }, [services]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredServices(services);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = services.filter((service) =>
      service.name?.toLowerCase().includes(lowerQuery) ||
      service.description?.toLowerCase().includes(lowerQuery) ||
      service.department?.toLowerCase().includes(lowerQuery)
    );

    setFilteredServices(filtered);
  };

  const handleRowClick = (service: IServices) => {
    addRecentItem({
      id: service.id,
      type: 'service',
      title: service.name,
      subtitle: `${service.department} - $${service.price}`,
      url: `/services/${service.id}`,
      metadata: {
        department: service.department,
        price: service.price,
        duration: service.duration,
        status: service.status,
      },
    });
    
    navigate(`/services/${service.id}`);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, service: IServices) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedService(service);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedService(null);
  };

  const handleEdit = () => {
    if (selectedService) {
      navigate(`/services/edit/${selectedService.id}`);
      handleMenuClose();
    }
  };

  const handleDeleteClick = () => {
    if (selectedService) {
      setDeleteModalOpen(true);
      setAnchorEl(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedService) return;

    setIsDeleting(true);
    try {
      await deleteService(selectedService.id);
      setDeleteModalOpen(false);
      setSelectedService(null);
    } catch (error) {
      console.error('Error deleting service:', error);
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

  const columns: Column[] = [
    {
      id: 'service',
      label: 'Service',
      minWidth: 200,
      render: (value, row: IServices) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar>
            <MedicalServicesIcon />
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
      id: 'department',
      label: 'Department',
      minWidth: 150,
      render: (value: string) => (
        <Chip label={value} size="small" color="primary" variant="outlined" />
      ),
    },
    {
      id: 'price',
      label: 'Price',
      minWidth: 100,
      render: (value: number) => (
        <Typography variant="body2" fontWeight={500}>
          ${value?.toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 'duration',
      label: 'Duration',
      minWidth: 100,
      render: (value: number) => (
        <Typography variant="body2">
          {value} min
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      render: (value: string) => (
        <Chip 
          label={value} 
          size="small" 
          color={getStatusColor(value) as any}
        />
      ),
    },
    {
      id: 'description',
      label: 'Description',
      minWidth: 200,
      render: (value: string) => (
        <Typography 
          variant="body2" 
          sx={{ 
            maxWidth: 200, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
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
      render: (_: unknown, row: IServices) => {
        const favoriteItem = {
          id: row.id,
          type: 'service' as const,
          title: row.name,
          subtitle: `${row.department} - $${row.price}`,
          url: `/services/${row.id}`,
          metadata: {
            department: row.department,
            price: row.price,
            duration: row.duration,
            status: row.status,
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
                  type: 'service',
                  title: row.name,
                  subtitle: `${row.department} - $${row.price}`,
                  url: `/services/${row.id}`,
                  metadata: {
                    department: row.department,
                    price: row.price,
                    duration: row.duration,
                    status: row.status,
                  },
                });
                navigate(`/services/${row.id}`);
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
        All Services ({filteredServices.length})
      </Typography>
      <Box sx={{ mb: 2 }}>
        <SearchBar onSearch={handleSearch} placeholder="Search services..." />
      </Box>

      <ReusableTable
        columns={columns}
        data={filteredServices}
        onRowClick={handleRowClick}
        searchQuery={searchQuery}
        emptyMessage="No Services Found"
        emptyDescription="There are currently no services configured."
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Service
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Service
        </MenuItem>
      </Menu>

      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Service"
        itemName={selectedService ? selectedService.name : undefined}
        isDeleting={isDeleting}
      />
    </Box>
  );
};