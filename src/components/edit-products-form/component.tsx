import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  Button,
  IconButton
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import EditProductFormActions from './components/form-actions';
import { DosageForm, MeasurementUnit, Product, ProductType, StockBatch } from '../../providers/products/types';
import { useProductsContext } from '../../providers/products/provider';
import ProductBasicInfo from '../add-products-form/components/basic-info';
import MedicationDetails from '../add-products-form/components/medications-details';
import InventoryPricing from '../add-products-form/components/inventory-component';
import SupplierInfo from '../add-products-form/components/supplier-info';
import AdditionalInfo from '../add-products-form/components/additional-info';

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
  supplierInfo: {
    name: string;
    contactNumber: string;
    email: string;
    address: string;
  };
  status: 'active' | 'discontinued';
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unitPrice: number;
}

export const EditProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, getBatchesForProduct, updateProduct, updateStockBatch, getAllProductsWithStock } = useProductsContext();

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
    supplierInfo: {
      name: '',
      contactNumber: '',
      email: '',
      address: ''
    },
    status: 'active',
    batchNumber: '',
    expiryDate: '',
    quantity: 0,
    unitPrice: 0
  });

  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);
  const [originalBatches, setOriginalBatches] = useState<StockBatch[]>([]);
  const [primaryBatch, setPrimaryBatch] = useState<StockBatch | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const product = getProduct(id);
      const batches = getBatchesForProduct(id);

      if (product) {
        setOriginalProduct(product);
        setOriginalBatches(batches);

        const activeBatches = batches.filter(b => b.status === 'active');
        const latestBatch = activeBatches.length > 0 
          ? activeBatches.sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime())[0]
          : null;

        setPrimaryBatch(latestBatch);

        setFormData({
          name: product.name,
          type: product.type,
          category: product.category,
          manufacturer: product.manufacturer,
          activeIngredient: product.activeIngredient || '',
          dosageForm: product.dosageForm || 'tablet',
          strength: product.strength || '',
          unit: product.unit,
          description: product.description,
          prescriptionRequired: product.prescriptionRequired,
          storageConditions: product.storageConditions,
          barcode: product.barcode || '',
          supplierInfo: product.supplierInfo,
          status: product.status,
          batchNumber: latestBatch?.batchNumber || '',
          expiryDate: latestBatch?.expiryDate.split('T')[0] || '',
          quantity: latestBatch?.quantity || 0,
          unitPrice: latestBatch?.unitPrice || 0
        });

        setIsLoading(false);
      } else {
        setProductNotFound(true);
        setIsLoading(false);
      }
    }
  }, [id, getProduct, getBatchesForProduct]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = 'Product name is required';
    if (!formData.category?.trim()) newErrors.category = 'Category is required';
    if (!formData.manufacturer?.trim()) newErrors.manufacturer = 'Manufacturer is required';
    if (!formData.supplierInfo?.name?.trim()) newErrors.supplierName = 'Supplier name is required';
    if (!formData.supplierInfo?.contactNumber?.trim()) newErrors.supplierContact = 'Supplier contact is required';

    if (!formData.batchNumber?.trim()) newErrors.batchNumber = 'Batch number is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (!formData.unitPrice || formData.unitPrice <= 0) newErrors.unitPrice = 'Unit price must be greater than 0';

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
    if (!validateForm() || !id || !originalProduct) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const updatedProduct: Partial<Product> = {
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
        updatedAt: new Date().toISOString()
      };

      updateProduct(id, updatedProduct);

      if (primaryBatch) {
        const updatedBatch: Partial<StockBatch> = {
          batchNumber: formData.batchNumber.trim(),
          expiryDate: formData.expiryDate,
          quantity: formData.quantity,
          unitPrice: formData.unitPrice,
          updatedAt: new Date().toISOString()
        };

        updateStockBatch(primaryBatch.id, updatedBatch);
      }

      setTimeout(() => {
        getAllProductsWithStock();
        navigate('/products');
      }, 500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/products/all');
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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (productNotFound) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Product not found or invalid ID.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/products')}
        >
          Back to Products
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box p={3}>
        <Box display="flex" alignItems="center" mb={3} gap={2}>
          <IconButton onClick={() => navigate('/products')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight={600}>
            Edit Medical Product
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

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

        <EditProductFormActions
          isSubmitting={isSubmitting}
          isValid={isFormValid()}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />

        {originalBatches.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              All Stock Batches for this Product
            </Typography>
            {originalBatches.map((batch) => (
              <Box
                key={batch.id}
                sx={{
                  mb: 2,
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  background: batch.status === 'active' ? '#e3fcec' : '#f8f9fa'
                }}
              >
                <Typography variant="subtitle2" fontWeight={500}>
                  Batch: {batch.batchNumber} ({batch.status})
                </Typography>
                <Typography variant="body2">
                  Expiry: {batch.expiryDate.split('T')[0]} | Qty: {batch.quantity} | Price: ${batch.unitPrice}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Received: {batch.receivedDate ? batch.receivedDate.split('T')[0] : 'N/A'}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};