import {
  Box,
  Typography,
  Divider,
  Alert,
  Button,
  Tabs,
  Tab
} from "@mui/material";
import { FC, useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Product } from "../../providers/products/types";
import { useProductsContext } from "../../providers/products";
import ProductBasicInfo from "../add-products-form/components/basic-info";
import MedicationDetails from "../add-products-form/components/medications-details";
import SupplierInfo from "../add-products-form/components/supplier-info";
import AdditionalInfo from "../add-products-form/components/additional-info";
import EditProductFormActions from "./components/form-actions";
import ProductNotFound from "./components/not-found";
import LoadingState from "./components/loading-state";
import { StockBatchesList } from "../stock-batches-list/component";
import { StockBatchForm } from "../stock-batch-form/component";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const EditProductForm: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProduct, getProductWithStock, updateProduct, deleteStockBatch } = useProductsContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    type: 'medication',
    category: '',
    manufacturer: '',
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
  const [activeTab, setActiveTab] = useState(0);
  const [showAddBatchForm, setShowAddBatchForm] = useState(false);

  const productWithStock = getProductWithStock(id || '');

  useEffect(() => {
    if (id) {
      const product = getProduct(id);
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
      } else {
        setProductNotFound(true);
        setIsLoading(false);
      }
    }
  }, [id, getProduct]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = 'Product name is required';
    if (!formData.category?.trim()) newErrors.category = 'Category is required';
    if (!formData.manufacturer?.trim()) newErrors.manufacturer = 'Manufacturer is required';
    if (!formData.supplierInfo?.name?.trim()) newErrors['supplier.name'] = 'Supplier name is required';
    if (!formData.supplierInfo?.contactNumber?.trim()) newErrors['supplier.contactNumber'] = 'Supplier contact is required';

    if (formData.supplierInfo?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.supplierInfo.email)) {
      newErrors['supplier.email'] = 'Invalid email format';
    }

    if (formData.type === 'medication') {
      if (!formData.activeIngredient?.trim()) newErrors.activeIngredient = 'Active ingredient is required for medications';
      if (!formData.dosageForm) newErrors.dosageForm = 'Dosage form is required for medications';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: string, value: any) => {
    if (field.startsWith('supplier.')) {
      const supplierField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        supplierInfo: {
          ...prev.supplierInfo!,
          [supplierField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      if (field.startsWith('supplier.')) {
        const supplierField = field.split('.')[1];
        delete newErrors[`supplier.${supplierField}`];
      }
      return newErrors;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateForm() || !id) return;

    setIsSubmitting(true);
    
    try {
      const updatedProduct: Partial<Product> = {
        ...formData,
        name: formData.name?.trim(),
        category: formData.category?.trim(),
        manufacturer: formData.manufacturer?.trim(),
        description: formData.description?.trim(),
        storageConditions: formData.storageConditions?.trim(),
        activeIngredient: formData.activeIngredient?.trim() || undefined,
        strength: formData.strength?.trim() || undefined,
        barcode: formData.barcode?.trim() || undefined,
        supplierInfo: {
          name: formData.supplierInfo?.name?.trim() || '',
          contactNumber: formData.supplierInfo?.contactNumber?.trim() || '',
          email: formData.supplierInfo?.email?.trim() || '',
          address: formData.supplierInfo?.address?.trim() || ''
        },
        updatedAt: new Date().toISOString()
      };

      updateProduct(id, updatedProduct);
      navigate(`/products/${id}`);
    } catch (error) {
      console.error('Error updating product:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to update product. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, id, updateProduct, navigate, validateForm]);

  const handleCancel = useCallback(() => {
    navigate(`/products/${id}`);
  }, [navigate, id]);

  const handleDeleteBatch = useCallback((batchId: string) => {
    deleteStockBatch(batchId);
  }, [deleteStockBatch]);

  const isFormValid = useCallback(() => {
    const requiredFieldsValid = 
      !!formData.name?.trim() &&
      !!formData.category?.trim() &&
      !!formData.manufacturer?.trim() &&
      !!formData.supplierInfo?.name?.trim() &&
      !!formData.supplierInfo?.contactNumber?.trim();

    const emailValid = !formData.supplierInfo?.email || 
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.supplierInfo.email);

    const medicationValid = formData.type !== 'medication' || 
      (!!formData.activeIngredient?.trim() && !!formData.dosageForm);

    return Boolean(requiredFieldsValid && emailValid && medicationValid);
  }, [formData]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (productNotFound) {
    return <ProductNotFound onBackClick={() => navigate('/products/all')} />;
  }

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/products/${id}`)}
          sx={{ mr: 2 }}
        >
          Back to Product
        </Button>
        <Typography variant="h4" fontWeight={600}>
          Edit Product: {formData.name}
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        You are editing the product definition. Stock batches are managed separately and can be viewed in the Stock Batches tab.
      </Alert>

      <Divider sx={{ mb: 4 }} />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Product Information" />
          <Tab label={`Stock Batches (${productWithStock?.batchCount || 0})`} />
        </Tabs>
      </Box>

      {/* Product Information Tab */}
      <TabPanel value={activeTab} index={0}>
        <ProductBasicInfo
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
        />

        <Divider sx={{ my: 3 }} />

        {formData.type === 'medication' && (
          <>
            <MedicationDetails
              formData={{
                dosageForm: formData.dosageForm,
                activeIngredient: formData.activeIngredient,
                strength: formData.strength,
                prescriptionRequired: formData.prescriptionRequired
              }}
              errors={errors}
              onInputChange={handleInputChange}
            />
            <Divider sx={{ my: 3 }} />
          </>
        )}

        <SupplierInfo
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
        />

        <Divider sx={{ my: 3 }} />

        <AdditionalInfo
          formData={{
            description: formData.description,
            storageConditions: formData.storageConditions,
            prescriptionRequired: formData.prescriptionRequired,
            barcode: formData.barcode
          }}
          errors={errors}
          onInputChange={handleInputChange}
        />

        {errors.submit && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography color="error">
              {errors.submit}
            </Typography>
          </Box>
        )}

        <EditProductFormActions
          isSubmitting={isSubmitting}
          isFormValid={isFormValid()}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </TabPanel>

      {/* Stock Batches Tab */}
      <TabPanel value={activeTab} index={1}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Stock Batches for {formData.name}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setShowAddBatchForm(true)}
          >
            Add New Batch
          </Button>
        </Box>

        {showAddBatchForm && (
          <StockBatchForm
            productId={id!}
            onBatchAdded={() => setShowAddBatchForm(false)}
            onCancel={() => setShowAddBatchForm(false)}
          />
        )}

        {productWithStock && (
          <StockBatchesList
            batches={productWithStock.batches}
            onDeleteBatch={handleDeleteBatch}
          />
        )}
      </TabPanel>
    </Box>
  );
};