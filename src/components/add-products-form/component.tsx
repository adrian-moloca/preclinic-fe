import {
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MedicalProduct } from "../../providers/products/types";
import { useProductsContext } from "../../providers/products";
import ProductBasicInfo from "./components/basic-info";
import MedicationDetails from "./components/medications-details";
import InventoryPricing from "./components/inventory-component";
import SupplierInfo from "./components/supplier-info";
import AdditionalInfo from "./components/additional-info";
import ProductFormActions from "./components/form-actions";

export const CreateProductForm: FC = () => {
  const [formData, setFormData] = useState<Partial<MedicalProduct>>({
    name: '',
    type: 'medication',
    category: '',
    manufacturer: '',
    batchNumber: '',
    expiryDate: '',
    quantity: 0,
    unitPrice: 0,
    unit: 'pieces',
    description: '',
    activeIngredient: '',
    dosageForm: 'tablet',
    strength: '',
    prescriptionRequired: false,
    storageConditions: '',
    barcode: '',
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

  const { addProduct } = useProductsContext();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = 'Product name is required';
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
      setFormData((prev: Partial<MedicalProduct>) => ({
        ...prev,
        supplierInfo: {
          ...prev.supplierInfo!,
          [supplierField]: value
        }
      }));
    } else {
      setFormData((prev: Partial<MedicalProduct>) => ({
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

    try {
      const newProduct: MedicalProduct = {
        id: crypto.randomUUID(),
        ...formData as Omit<MedicalProduct, 'id' | 'createdAt' | 'updatedAt'>,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      addProduct(newProduct);
      navigate('/products/all');
    } catch (error) {
      console.error('Error adding product:', error);
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
      batchNumber: '',
      expiryDate: '',
      quantity: 0,
      unitPrice: 0,
      unit: 'pieces',
      description: '',
      activeIngredient: '',
      dosageForm: 'tablet',
      strength: '',
      prescriptionRequired: false,
      storageConditions: '',
      barcode: '',
      supplierInfo: {
        name: '',
        contactNumber: '',
        email: '',
        address: ''
      },
      status: 'active'
    });
    setErrors({});
  };

  const isFormValid = (): boolean => {
    const requiredFieldsValid = Boolean(
      formData.name?.trim() &&
      formData.manufacturer?.trim() &&
      formData.batchNumber?.trim() &&
      formData.expiryDate &&
      formData.quantity && formData.quantity > 0 &&
      formData.unitPrice && formData.unitPrice > 0 &&
      formData.supplierInfo?.name?.trim() &&
      formData.supplierInfo?.contactNumber?.trim()
    );

    const emailValid = !formData.supplierInfo?.email ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.supplierInfo.email);

    return requiredFieldsValid && emailValid;
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

        <ProductBasicInfo
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
        />

        {isMedication && (
          <MedicationDetails
            formData={formData}
            onInputChange={handleInputChange}
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
          onInputChange={handleInputChange}
        />

        <ProductFormActions
          isSubmitting={isSubmitting}
          isFormValid={isFormValid()}
          onClear={handleClear}
          onSubmit={handleSubmit}
        />
      </Box>
    </Box>
  );
};