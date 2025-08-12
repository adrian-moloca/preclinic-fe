import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
} from "@mui/material";
import { FC, useState, useMemo, useEffect, useCallback } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/search-bar";
import { useServicesContext } from "../../../providers/services/context";
import { IServices } from "../../../providers/services/types";
import { useDepartmentsContext } from "../../../providers/departments/context";
import { useProductsContext } from "../../../providers/products/context";
import DeleteModal from "../../../components/delete-modal";
import { Column, ReusableTable } from "../../../components/table/component";

const getStatusColor = (status: string) => {
  const colors = {
    active: 'success',
    inactive: 'warning',
    maintenance: 'error'
  };
  return colors[status as keyof typeof colors] || 'default';
};

export const AllServices: FC = () => {
  const { services, deleteService } = useServicesContext();
  const { departments } = useDepartmentsContext();
  const { products } = useProductsContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedService, setSelectedService] = useState<IServices | null>(null);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filteredServices, setFilteredServices] = useState<IServices[]>(services);

  useEffect(() => {
    setFilteredServices(services);
  }, [services]);

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
      deleteService(selectedService.id);
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

  const handleDeleteMultiple = async (selectedIds: string[]) => {
    try {
      selectedIds.forEach(id => deleteService(id));
    } catch (error) {
      console.error('Error deleting services:', error);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, service: IServices) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedService(service);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    if (!deleteModalOpen) {
      setSelectedService(null);
    }
  };

  const handleEditService = () => {
    if (selectedService) {
      navigate(`/services/edit/${selectedService.id}`);
      handleMenuClose();
    }
  };

  const handleServiceDetails = (service: IServices) => {
    navigate(`/services/${service.id}`);
  };

  const handleRowClick = (service: IServices) => {
    navigate(`/services/${service.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredServices(services);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = services.filter((service) =>
      service.name.toLowerCase().includes(lowerQuery) ||
      service.description.toLowerCase().includes(lowerQuery) ||
      service.department.toLowerCase().includes(lowerQuery) ||
      service.status.toLowerCase().includes(lowerQuery) ||
      service.price.toString().includes(lowerQuery) ||
      service.duration.toString().includes(lowerQuery)
    );

    setFilteredServices(filtered);
  };

  const getDepartmentName = (departmentName: string) => {
    const department = departments.find(dept => dept.name === departmentName);
    return department ? department.name : departmentName;
  };

  const calculateTotalCost = useCallback((service: IServices) => {
    const productsCost = service.products
      .map(id => products.find(product => product.id === id))
      .filter(Boolean)
      .reduce((total, product) => total + product!.unitPrice, 0);
    
    return service.price + productsCost;
  }, [products]);

  const columns: Column[] = [
    {
      id: 'service',
      label: 'Service',
      minWidth: 200,
      sortable: true,
      render: (_, row: IServices) => (
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {getDepartmentName(row.department)}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'duration',
      label: 'Duration',
      minWidth: 100,
      sortable: true,
      render: (value: number) => (
        <Typography variant="body2">
          {value} min
        </Typography>
      ),
    },
    {
      id: 'price',
      label: 'Base Price',
      minWidth: 120,
      sortable: true,
      render: (value: number) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          ${value.toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 'totalCost',
      label: 'Total Cost',
      minWidth: 120,
      sortable: false,
      render: (_, row: IServices) => {
        const totalCost = calculateTotalCost(row);
        return (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
              ${totalCost.toFixed(2)}
            </Typography>
            {row.products.length > 0 && (
              <Typography variant="caption" color="text.secondary">
                +{row.products.length} product{row.products.length !== 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      sortable: true,
      render: (value: string) => (
        <Chip
          label={value.toUpperCase()}
          size="small"
          color={getStatusColor(value) as any}
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 120,
      align: 'right',
      sortable: false,
      render: (_, row: IServices) => (
        <Box>
          <Tooltip title="View Service Details">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleServiceDetails(row);
              }}
              size="small"
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
          <IconButton onClick={(e) => handleMenuOpen(e, row)}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const serviceStats = useMemo(() => {
    const totalRevenue = filteredServices.reduce((total, service) => 
      total + calculateTotalCost(service), 0
    );
    const activeServices = filteredServices.filter(service => service.status === 'active').length;
    const averagePrice = filteredServices.length > 0 
      ? totalRevenue / filteredServices.length 
      : 0;

    return { totalRevenue, activeServices, averagePrice };
  }, [filteredServices, calculateTotalCost]);

  return (
    <Box p={3} sx={{ overflowX: "auto" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            All Services ({filteredServices.length})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery && `Showing ${filteredServices.length} of ${services.length} services`}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
        <SearchBar onSearch={handleSearch} placeholder="Search services..." />
      </Box>

      <ReusableTable
        columns={columns}
        data={filteredServices}
        onRowClick={handleRowClick}
        onDeleteSelected={handleDeleteMultiple}
        searchQuery={searchQuery}
        emptyMessage={
          searchQuery 
            ? `No services found matching "${searchQuery}"`
            : "No services found. Add your first service to get started."
        }
        emptyDescription={
          searchQuery
            ? "Try adjusting your search criteria or clear the search to see all services."
            : "There are currently no services registered in the system."
        }
        enableSelection={true}
        enablePagination={true}
        enableSorting={true}
        rowsPerPageOptions={[5, 10, 25, 50]}
        defaultRowsPerPage={10}
      />

      {filteredServices.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Active Services: {serviceStats.activeServices} | 
            Total Revenue Potential: ${serviceStats.totalRevenue.toFixed(2)} | 
            Average Service Cost: ${serviceStats.averagePrice.toFixed(2)}
          </Typography>
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEditService}>
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
        title="Delete Service"
        itemName={selectedService?.name}
        message={selectedService ? `Are you sure you want to delete "${selectedService.name}"? This action cannot be undone.` : undefined}
        isDeleting={isDeleting}
      />
    </Box>
  );
};