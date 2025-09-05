import React, { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ProductBasicInfo from './components/basic-info';
import MedicationDetails from './components/medications-details';
import InventoryPricing from './components/inventory-component';
import SupplierInfo from './components/supplier-info';
import AdditionalInfo from './components/additional-info';
import ProductFormActions from './components/form-actions';
import { DosageForm, MeasurementUnit, Product, ProductType, StockBatch } from '../../providers/products/types';
import { useProductsContext } from '../../providers/products/provider';

interface FormData {
  name: string;
  type: ProductType;
  category: string;
  manufacturer: string;
  activeIngredient: string;
  dosageForm: DosageForm;
  strength: string;
  unit: MeasurementUnit;
  description: string;
  prescriptionRequired: boolean;
  storageConditions: string;
  barcode: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unitPrice: number;
  supplierInfo: {
    name: string;
    contactNumber: string;
    email: string;
    address: string;
  };
  status: 'active' | 'discontinued';
}

export const CreateProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { addProduct, addStockBatch, getAllProductsWithStock } = useProductsContext();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: 'medication',
    category: '',
    manufacturer: '',
    activeIngredient: '',
    dosageForm: 'tablet',
    strength: '',
    unit: 'pieces',
    description: '',
    prescriptionRequired: false,
    storageConditions: '',
    barcode: '',
    batchNumber: '',
    expiryDate: '',
    quantity: 0,
    unitPrice: 0,
    supplierInfo: {
      name: '',
      contactNumber: '',
      email: '',
      address: ''
    },
    status: 'active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = 'Product name is required';
    if (!formData.category?.trim()) newErrors.category = 'Category is required';
    if (!formData.manufacturer?.trim()) newErrors.manufacturer = 'Manufacturer is required';
    if (!formData.batchNumber?.trim()) newErrors.batchNumber = 'Batch number is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (!formData.unitPrice || formData.unitPrice <= 0) newErrors.unitPrice = 'Unit price must be greater than 0';
    if (!formData.supplierInfo?.name?.trim()) newErrors.supplierName = 'Supplier name is required';
    if (!formData.supplierInfo?.contactNumber?.trim()) newErrors.supplierContact = 'Supplier contact is required';

    if (formData.supplierInfo?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.supplierInfo.email)) {
      newErrors.supplierEmail = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('supplier.')) {
      const supplierField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        supplierInfo: {
          ...prev.supplierInfo,
          [supplierField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const productId = uuidv4();
      const newProduct: Product = {
        id: productId,
        name: formData.name.trim(),
        type: formData.type,
        category: formData.category.trim(),
        manufacturer: formData.manufacturer.trim(),
        activeIngredient: formData.activeIngredient?.trim(),
        dosageForm: formData.dosageForm,
        strength: formData.strength?.trim(),
        unit: formData.unit,
        description: formData.description.trim(),
        prescriptionRequired: formData.prescriptionRequired,
        storageConditions: formData.storageConditions.trim(),
        barcode: formData.barcode?.trim(),
        supplierInfo: {
          name: formData.supplierInfo.name.trim(),
          contactNumber: formData.supplierInfo.contactNumber.trim(),
          email: formData.supplierInfo.email.trim(),
          address: formData.supplierInfo.address.trim()
        },
        status: formData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      addProduct(newProduct);

      const batchId = uuidv4();
      const newBatch: StockBatch = {
        id: batchId,
        productId,
        batchNumber: formData.batchNumber.trim(),
        expiryDate: formData.expiryDate,
        quantity: formData.quantity,
        unitPrice: formData.unitPrice,
        receivedDate: new Date().toISOString(),
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      addStockBatch(newBatch);

      setTimeout(() => {
        getAllProductsWithStock();
        navigate('/products/all');
      }, 300);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData({
      name: '',
      type: 'medication',
      category: '',
      manufacturer: '',
      activeIngredient: '',
      dosageForm: 'tablet',
      strength: '',
      unit: 'pieces',
      description: '',
      prescriptionRequired: false,
      storageConditions: '',
      barcode: '',
      batchNumber: '',
      expiryDate: '',
      quantity: 0,
      unitPrice: 0,
      supplierInfo: {
        name: '',
        contactNumber: '',
        email: '',
        address: ''
      },
      status: 'active'
    });
    setErrors({});
    setError(null);
  };

  const isFormValid = (): boolean => {
    return Boolean(
      formData.name?.trim() &&
      formData.category?.trim() &&
      formData.manufacturer?.trim() &&
      formData.batchNumber?.trim() &&
      formData.expiryDate &&
      formData.quantity && formData.quantity > 0 &&
      formData.unitPrice && formData.unitPrice > 0 &&
      formData.supplierInfo?.name?.trim() &&
      formData.supplierInfo?.contactNumber?.trim() &&
      (!formData.supplierInfo?.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.supplierInfo.email))
    );
  };

  const isMedication = formData.type === 'medication';

  return (
    <Box>
      <Box p={3}>
        <Box display="flex" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight={600}>
            Add Medical Product
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <ProductBasicInfo
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
        />

        {isMedication && (
          <MedicationDetails
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
          />
        )}

        <InventoryPricing
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
        />

        <SupplierInfo
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
        />

        <AdditionalInfo
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
        />

        <ProductFormActions
          isSubmitting={isSubmitting}
          onSave={handleSubmit}
          onClear={handleClear}
          isFormValid={isFormValid()}
        />
      </Box>
    </Box>
  );
};