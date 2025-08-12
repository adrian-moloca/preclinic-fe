import {
  Box,
  CircularProgress,
  Alert,
  Button,
  Typography,
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useServicesContext } from "../../../providers/services/context";
import { IServices } from "../../../providers/services/types";
import { useDepartmentsContext } from "../../../providers/departments/context";
import { useProductsContext } from "../../../providers/products/context";
import ServiceHeader from "./components/service-header";
import ServiceOverviewCard from "./components/service-overview-card";
import ServiceDescriptionCard from "./components/service-description-card";
import PricingInformationCard from "./components/pricing-information-card";
import RequiredProductsCard from "./components/required-products-card";
import DepartmentInformationCard from "./components/department-information-card";
import DeleteModal from "../../../components/delete-modal";
import { MedicalProduct } from "../../../providers/products/types";

export const ServiceDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { services, deleteService } = useServicesContext();
  const { departments } = useDepartmentsContext();
  const { products } = useProductsContext();
  const navigate = useNavigate();

  const [service, setService] = useState<IServices | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceNotFound, setServiceNotFound] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      const foundService = services.find(service => service.id === id);
      if (foundService) {
        setService(foundService);
        setIsLoading(false);
      } else if (services.length > 0) {
        setServiceNotFound(true);
        setIsLoading(false);
      }
    }
  }, [id, services]);

  const handleEdit = () => {
    navigate(`/services/edit/${id}`);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      deleteService(id);
      navigate('/services/all');
    } catch (error) {
      console.error('Error deleting service:', error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleBackToServices = () => {
    navigate('/services/all');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'maintenance':
        return 'error';
      default:
        return 'default';
    }
  };

  const getDepartmentInfo = () => {
    if (!service) return null;
    return departments.find(dept => dept.name === service.department);
  };

  const getServiceProducts = () => {
    if (!service || !service.products.length) return [];
    return service.products
      .map(productId => products.find(product => product.id === productId))
      .filter((product): product is MedicalProduct => product !== undefined);
  };

  const calculateTotalCost = () => {
    if (!service) return 0;
    const serviceProducts = getServiceProducts();
    const productsCost = serviceProducts.reduce((total, product) => total + (product?.unitPrice || 0), 0);
    return service.price + productsCost;
  };

  const departmentInfo = getDepartmentInfo();
  const serviceProducts = getServiceProducts();
  const totalCost = calculateTotalCost();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading service details...
        </Typography>
      </Box>
    );
  }

  if (serviceNotFound || !service) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Service not found. The service may have been deleted or the ID is invalid.
        </Alert>
        <Button 
          variant="contained" 
          onClick={handleBackToServices}
          startIcon={<ArrowBackIcon />}
        >
          Back to Services
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box p={3}>
        <ServiceHeader
          serviceName={service.name}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onBack={handleBackToServices}
        />

        <ServiceOverviewCard
          service={service}
          departmentInfo={departmentInfo}
          getStatusColor={getStatusColor}
        />

        <ServiceDescriptionCard
          description={service.description}
        />

        <PricingInformationCard
          servicePrice={service.price}
          serviceProducts={serviceProducts}
          totalCost={totalCost}
        />

        <RequiredProductsCard
          serviceProducts={serviceProducts}
        />

        {departmentInfo && (
          <DepartmentInformationCard
            departmentInfo={departmentInfo}
          />
        )}

        <DeleteModal
          open={deleteDialogOpen}
          isDeleting={isDeleting}
          onConfirm={handleDeleteConfirm}
          onClose={handleDeleteCancel}
        />
      </Box>
    </Box>
  );
};