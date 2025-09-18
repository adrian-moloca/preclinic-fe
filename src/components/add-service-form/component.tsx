import React, { useState, useMemo } from 'react';
import { Box, Paper, Typography } from "@mui/material";
import { FC } from "react";
import { useNavigate } from 'react-router-dom';
import { useServicesContext } from '../../providers/services/context';
import { IServices } from '../../providers/services/types';
import { useDepartmentsContext } from '../../providers/departments/context';
import { useProductsContext } from '../../providers/products'; // Updated import
import ServiceBasicInfo from './components/basic-information';
import ServicePricingDuration from './components/service-priceing';
import ServiceProductsAssignment from './components/products-assigment';
import ServiceFormActions from './components/form-actions';

const initialFormData = {
  name: '',
  description: '',
  price: 0,
  duration: 30,
  status: 'active',
  department: '',
  products: [] as string[],
};

export const AddServiceForm: FC = () => {
  const { addService } = useServicesContext();
  const { departments } = useDepartmentsContext();
  const { getAllProductsWithStock } = useProductsContext(); // Updated to use new method
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get all products with stock data
  const productsWithStock = useMemo(() => getAllProductsWithStock(), [getAllProductsWithStock]);

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validateForm()) {
      const newService: IServices = {
        ...formData,
        id: `srv_${Date.now()}`,
      };
      
      addService(newService);
      
      setFormData(initialFormData);
      setErrors({});
      
      navigate('/services/all');
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setErrors({});
    navigate('/services/all');
  };

  const activeDepartments = departments
    .filter(dept => dept.status === 'active' && typeof dept.id === 'string' && dept.id !== undefined)
    .map(dept => ({
      ...dept,
      id: dept.id as string
    }));

  // Updated to work with ProductWithStock objects
  const productOptions = productsWithStock
    .filter(product => product.status === 'active' && product.totalQuantity > 0) // Only show active products with stock
    .map(product => ({
      id: product.id,
      label: `${product.name} - ${product.manufacturer} (Stock: ${product.totalQuantity} ${product.unit})`, // Enhanced label with stock info
      price: product.averagePrice, // Use averagePrice from ProductWithStock
      category: product.category || 'General',
      totalQuantity: product.totalQuantity,
      unit: product.unit,
      manufacturer: product.manufacturer
    }));

  const selectedProducts = productOptions.filter(product => formData.products.includes(product.id));
  const totalProductsCost = selectedProducts.reduce((total, product) => total + product.price, 0);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={600} mb={4} textAlign="center">
          Add New Service
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

          <ServiceFormActions
            isFormValid={isFormValid}
            onCancel={handleCancel}
          />
        </form>

        {/* Additional info section */}
        {selectedProducts.length > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Selected Products Summary:
            </Typography>
            {selectedProducts.map((product, index) => (
              <Box key={product.id} sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {index + 1}. {product.label} - ${product.price.toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
              Total Products Cost: ${totalProductsCost.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Service Base Price: ${formData.price.toFixed(2)}
            </Typography>
            <Typography variant="h6" color="primary.main" fontWeight={600}>
              Total Service Value: ${(formData.price + totalProductsCost).toFixed(2)}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};