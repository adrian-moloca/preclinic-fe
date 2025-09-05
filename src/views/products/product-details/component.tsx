import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InventoryIcon from '@mui/icons-material/Inventory';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import { useProductsContext } from "../../../providers/products/provider";
import { ProductWithStock } from "../../../providers/products/types";

export const ProductDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAllProductsWithStock, deleteProduct } = useProductsContext();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductWithStock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      
      const productsWithStock = getAllProductsWithStock();
      
      const foundProduct = productsWithStock.find(p => p.id === id);
      
      if (foundProduct) {
        setProduct(foundProduct);
        setIsLoading(false);
      } else {
        console.log('❌ Product not found with ID:', id);
        setProductNotFound(true);
        setIsLoading(false);
      }
    }
  }, [id, getAllProductsWithStock]);

  const handleBack = () => {
    navigate('/products');
  };

  const handleEdit = () => {
    navigate(`/products/edit/${id}`);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      deleteProduct(id);
      navigate('/products');
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStockStatusColor = () => {
    if (!product) return 'default';
    if (product.totalQuantity === 0) return 'error';
    if (product.totalQuantity <= 10) return 'warning';
    return 'success';
  };

  const getStockStatusText = () => {
    if (!product) return 'Unknown';
    if (product.totalQuantity === 0) return 'Out of Stock';
    if (product.totalQuantity <= 10) return 'Low Stock';
    return 'In Stock';
  };

  const isExpiring = () => {
    if (!product || !product.nearestExpiry) return false;
    const expiryDate = new Date(product.nearestExpiry);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow;
  };

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
          onClick={handleBack}
        >
          Back to Products
        </Button>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Product data could not be loaded.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Products
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {product.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {product.manufacturer}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Product Information */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Product Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Product Type
                </Typography>
                <Chip 
                  label={product.type.replace('_', ' ')} 
                  color="primary" 
                  variant="outlined" 
                  size="small" 
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Category
                </Typography>
                <Typography variant="body1">
                  {product.category}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Manufacturer
                </Typography>
                <Typography variant="body1">
                  {product.manufacturer}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Unit
                </Typography>
                <Typography variant="body1">
                  {product.unit}
                </Typography>
              </Box>
            </Grid>

            <Grid>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label={product.status} 
                  color={product.status === 'active' ? 'success' : 'default'} 
                  size="small" 
                />
              </Box>

              {product.barcode && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Barcode
                  </Typography>
                  <Typography variant="body1">
                    {product.barcode}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Storage Conditions
                </Typography>
                <Typography variant="body1">
                  {product.storageConditions || 'Not specified'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body1">
                  {formatDate(product.createdAt)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {product.description && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1">
                {product.description}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Medication Details */}
      {product.type === 'medication' && (
        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocalPharmacyIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Medication Details
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid>
                <Typography variant="subtitle2" color="text.secondary">
                  Active Ingredient
                </Typography>
                <Typography variant="body1">
                  {product.activeIngredient || 'Not specified'}
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="subtitle2" color="text.secondary">
                  Dosage Form
                </Typography>
                <Typography variant="body1">
                  {product.dosageForm || 'Not specified'}
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="subtitle2" color="text.secondary">
                  Strength
                </Typography>
                <Typography variant="body1">
                  {product.strength || 'Not specified'}
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="subtitle2" color="text.secondary">
                  Prescription Required
                </Typography>
                <Chip
                  label={product.prescriptionRequired ? 'Yes' : 'No'}
                  color={product.prescriptionRequired ? 'warning' : 'success'}
                  size="small"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Inventory & Stock Information */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <InventoryIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Inventory & Stock
            </Typography>
          </Box>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid>
              <Typography variant="subtitle2" color="text.secondary">
                Total Stock
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {product.totalQuantity} {product.unit}
              </Typography>
              <Chip
                label={getStockStatusText()}
                color={getStockStatusColor()}
                size="small"
              />
            </Grid>

            <Grid>
              <Typography variant="subtitle2" color="text.secondary">
                Total Batches
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {product.batchCount}
              </Typography>
            </Grid>

            <Grid>
              <Typography variant="subtitle2" color="text.secondary">
                Average Price
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                ${product.averagePrice.toFixed(2)}
              </Typography>
            </Grid>

            <Grid>
              <Typography variant="subtitle2" color="text.secondary">
                Next Expiry
              </Typography>
              <Typography variant="body1">
                {product.nearestExpiry ? formatDate(product.nearestExpiry) : 'N/A'}
              </Typography>
              {isExpiring() && (
                <Chip
                  label="Expiring Soon"
                  color="warning"
                  size="small"
                  icon={<CalendarTodayIcon />}
                />
              )}
            </Grid>
          </Grid>

          {/* Stock Batches */}
          {product.batches && product.batches.length > 0 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Stock Batches ({product.batches.length})
              </Typography>
              <Grid container spacing={2}>
                {product.batches.map((batch) => (
                  <Grid key={batch.id}>
                    <Card variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {batch.batchNumber}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Quantity: {batch.quantity} {product.unit}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${batch.unitPrice}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Expires: {formatDate(batch.expiryDate)}
                          </Typography>
                          <Chip
                            label={batch.status}
                            color={batch.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Supplier Information */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Supplier Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Supplier Name
                </Typography>
                <Typography variant="body1">
                  {product.supplierInfo.name || 'Not specified'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Contact Number
                </Typography>
                <Typography variant="body1">
                  {product.supplierInfo.contactNumber || 'Not specified'}
                </Typography>
              </Box>
            </Grid>

            <Grid>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {product.supplierInfo.email || 'Not specified'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1">
                  {product.supplierInfo.address || 'Not specified'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{product.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};