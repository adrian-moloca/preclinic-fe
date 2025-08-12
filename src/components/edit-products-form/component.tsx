import {
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MedicalProduct } from "../../providers/products/types";
import { useProductsContext } from "../../providers/products";
import ProductBasicInfo from "../add-products-form/components/basic-info";
import MedicationDetails from "../add-products-form/components/medications-details";
import InventoryPricing from "../add-products-form/components/inventory-component";
import SupplierInfo from "../add-products-form/components/supplier-info";
import AdditionalInfo from "../add-products-form/components/additional-info";
import EditProductFormActions from "./components/form-actions";
import ProductNotFound from "./components/not-found";
import LoadingState from "./components/loading-state";

export const EditProductForm: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, updateProduct } = useProductsContext();
  const navigate = useNavigate();

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
  const [isLoading, setIsLoading] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      const product = products.find(p => p.id === id);
      if (product) {
        setFormData({
          ...product,
          supplierInfo: product.supplierInfo || {
            name: '',
            contactNumber: '',
            email: '',
            address: ''
          }
        });
        setIsLoading(false);
      } else if (products.length > 0) {
        setProductNotFound(true);
        setIsLoading(false);
      }
    }
  }, [id, products]);

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
    if (!validateForm() || !id) return;

    setIsSubmitting(true);
    
    try {
      const updatedProduct: MedicalProduct = {
        ...formData as MedicalProduct,
        id,
        updatedAt: new Date().toISOString()
      };

      updateProduct(id, updatedProduct);
      navigate('/products/all');
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/products/all');
  };

  const isFormValid = () => {
    const requiredFieldsValid = 
      !!formData.name?.trim() &&
      !!formData.manufacturer?.trim() &&
      !!formData.batchNumber?.trim() &&
      !!formData.expiryDate &&
      !!formData.quantity && formData.quantity > 0 &&
      !!formData.unitPrice && formData.unitPrice > 0 &&
      !!formData.supplierInfo?.name?.trim() &&
      !!formData.supplierInfo?.contactNumber?.trim();

    const emailValid = !formData.supplierInfo?.email || 
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.supplierInfo.email);

    return Boolean(requiredFieldsValid && emailValid);
  };

  const isMedication = formData.type === 'medication';

  if (isLoading) {
    return <LoadingState />;
  }

  if (productNotFound) {
    return <ProductNotFound onBackClick={() => navigate('/products/all')} />;
  }

  return (
    <Box>
      <Box p={3}>
        <Box display="flex" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight={600}>
            Edit Medical Product
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

        <EditProductFormActions
          isSubmitting={isSubmitting}
          isFormValid={isFormValid()}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </Box>
    </Box>
  );
};