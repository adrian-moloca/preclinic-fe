import React, { useState, useMemo, useEffect } from 'react';
import { Box, Paper, Typography } from "@mui/material";
import { FC } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useServicesContext } from '../../providers/services/context';
import { IServices } from '../../providers/services/types';
import { useDepartmentsContext } from '../../providers/departments/context';
import { useProductsContext } from '../../providers/products/context';
import ServiceBasicInfo from '../add-service-form/components/basic-information';
import ServicePricingDuration from '../add-service-form/components/service-priceing';
import ServiceProductsAssignment from '../add-service-form/components/products-assigment';
import EditServiceFormActions from './components/form-actions';
import ServiceNotFound from './components/not-found';
import LoadingState from './components/loading-state';

const initialFormData = {
  name: '',
  description: '',
  price: 0,
  duration: 30,
  status: 'active',
  department: '',
  products: [] as string[],
};

export const EditServiceForm: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { services, updateService } = useServicesContext();
  const { departments } = useDepartmentsContext();
  const { products } = useProductsContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [serviceNotFound, setServiceNotFound] = useState(false);

  // Find the service to edit
  const serviceToEdit = useMemo(() => {
    return services.find(service => service.id === id);
  }, [services, id]);

  // Pre-fill form data when component mounts or service data changes
  useEffect(() => {
    if (serviceToEdit) {
      setFormData({
        name: serviceToEdit.name,
        description: serviceToEdit.description,
        price: serviceToEdit.price,
        duration: serviceToEdit.duration,
        status: serviceToEdit.status,
        department: serviceToEdit.department,
        products: serviceToEdit.products || [],
      });
      setIsLoading(false);
    } else if (services.length > 0) {
      setServiceNotFound(true);
      setIsLoading(false);
    }
  }, [serviceToEdit, services]);

  const isFormValid = useMemo(() => {
    const requiredFields = [
      formData.name.trim(),
      formData.description.trim(),
      formData.department.trim()
    ];

    const validNumbers = formData.price >= 0 && formData.duration > 0;

    return requiredFields.every(field => field.length > 0) && validNumbers;
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Service description is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }

    if (!formData.status) {
      newErrors.status = 'Service status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => {
    const value = event.target.value;
    
    if (field === 'price' || field === 'duration') {
      const numValue = parseFloat(value as string) || 0;
      setFormData(prev => ({ ...prev, [field]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value as string }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleProductsChange = (_: any, newValue: any[]) => {
    setFormData(prev => ({ ...prev, products: newValue.map(product => product.id) }));
  };

  const resetForm = () => {
    if (serviceToEdit) {
      setFormData({
        name: serviceToEdit.name,
        description: serviceToEdit.description,
        price: serviceToEdit.price,
        duration: serviceToEdit.duration,
        status: serviceToEdit.status,
        department: serviceToEdit.department,
        products: serviceToEdit.products || [],
      });
    }
    setErrors({});
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validateForm() && serviceToEdit) {
      const updatedService: IServices = {
        id: serviceToEdit.id,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        duration: formData.duration,
        status: formData.status,
        department: formData.department,
        products: formData.products,
      };
      
      updateService(updatedService);
      navigate(`/services/${serviceToEdit.id}`);
    }
  };

  const handleCancel = () => {
    if (serviceToEdit) {
      navigate(`/services/${serviceToEdit.id}`);
    } else {
      navigate('/services/all');
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (serviceNotFound || !serviceToEdit) {
    return (
      <ServiceNotFound 
        onBackClick={() => navigate('/services/all')} 
      />
    );
  }

  const activeDepartments = departments.filter(dept => dept.status === 'active');

  const productOptions = Array.isArray(products)
    ? products
        .filter(product => product.status === 'active')
        .map(product => ({
          id: product.id,
          label: product.name,
          price: product.unitPrice,
          category: product.category || 'General'
        }))
    : [];

  const selectedProducts = productOptions.filter(product => formData.products.includes(product.id));
  const totalProductsCost = selectedProducts.reduce((total, product) => total + product.price, 0);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={600} mb={4} textAlign="center">
          Edit Service: {serviceToEdit.name}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <ServiceBasicInfo
            formData={formData}
            errors={errors}
            activeDepartments={activeDepartments}
            onInputChange={handleInputChange}
          />

          <ServicePricingDuration
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />

          <ServiceProductsAssignment
            productOptions={productOptions}
            selectedProducts={selectedProducts}
            totalProductsCost={totalProductsCost}
            onProductsChange={handleProductsChange}
          />

          <EditServiceFormActions
            isFormValid={isFormValid}
            onCancel={handleCancel}
            onReset={resetForm}
          />
        </form>
      </Paper>
    </Box>
  );
};