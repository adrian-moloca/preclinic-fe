import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  Tooltip
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useProductsContext } from "../../../providers/products";
import { MedicalProduct } from "../../../providers/products/types";

export const ProductDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, deleteProduct } = useProductsContext();
  const navigate = useNavigate();

  const [product, setProduct] = useState<MedicalProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      const foundProduct = products.find(product => product.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setIsLoading(false);
      } else if (products.length > 0) {
        setProductNotFound(true);
        setIsLoading(false);
      }
    }
  }, [id, products]);

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
      navigate('/products/all');
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

  const handleBackToProducts = () => {
    navigate('/products/all');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'discontinued':
        return 'warning';
      case 'out_of_stock':
        return 'error';
      case 'expired':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading product details...
        </Typography>
      </Box>
    );
  }

  if (productNotFound || !product) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Product not found. The product may have been deleted or the ID is invalid.
        </Alert>
        <Button 
          variant="contained" 
          onClick={handleBackToProducts}
          startIcon={<ArrowBackIcon />}
        >
          Back to Products
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box p={3}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center">
            <Box display="flex" alignItems="center">
              <Typography variant="h4" fontWeight={600} sx={{ ml: 1 }}>
                {product.name}
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" gap={2}>
            <Tooltip title="Edit Product">
              <Button
                variant="outlined"
                onClick={handleEdit}
                startIcon={<EditIcon />}
                sx={{ minWidth: 120 }}
              >
                Edit
              </Button>
            </Tooltip>
            <Tooltip title="Delete Product">
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteClick}
                startIcon={<DeleteIcon />}
                sx={{ minWidth: 120 }}
              >
                Delete
              </Button>
            </Tooltip>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Basic Information
            </Typography>
            
            <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Grid>
                <Typography variant="subtitle2" color="text.secondary">
                  Product Type
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {product.type.replace('_', ' ')}
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="subtitle2" color="text.secondary">
                  Category
                </Typography>
                <Typography variant="body1">
                  {product.category || 'Not specified'}
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="subtitle2" color="text.secondary">
                  Manufacturer
                </Typography>
                <Typography variant="body1">
                  {product.manufacturer}
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label={product.status.replace('_', ' ').toUpperCase()}
                  color={getStatusColor(product.status) as any}
                  size="small"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {product.type === 'medication' && (
          <Card sx={{ mb: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Medication Details
              </Typography>
              
              <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Grid>
                  <Typography variant="subtitle2" color="text.secondary">
                    Dosage Form
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {product.dosageForm}
                  </Typography>
                </Grid>

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

        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Inventory & Pricing
            </Typography>
            
            <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Grid>
                <Typography variant="subtitle2" color="text.secondary">
                  Batch Number
                </Typography>
                <Typography variant="body1">
                  {product.batchNumber}
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="subtitle2" color="text.secondary">
                  Expiry Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(product.expiryDate)}
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="subtitle2" color="text.secondary">
                  Quantity
                </Typography>
                <Typography variant="body1">
                  {product.quantity} {product.unit}
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="subtitle2" color="text.secondary">
                  Unit Price
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  ${product.unitPrice.toFixed(2)}
                </Typography>
              </Grid>

              {product.barcode && (
                <Grid>
                  <Typography variant="subtitle2" color="text.secondary">
                    Barcode
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {product.barcode}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Supplier Information
            </Typography>
            
            <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Grid>
                <Typography variant="subtitle2" color="text.secondary">
                  Supplier Name
                </Typography>
                <Typography variant="body1">
                  {product.supplierInfo?.name || 'Not specified'}
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="subtitle2" color="text.secondary">
                  Contact Number
                </Typography>
                <Typography variant="body1">
                  {product.supplierInfo?.contactNumber || 'Not specified'}
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {product.supplierInfo?.email || 'Not specified'}
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1">
                  {product.supplierInfo?.address || 'Not specified'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Additional Information
            </Typography>
            
            <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Grid>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">
                  {product.description || 'No description provided'}
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Storage Conditions
                </Typography>
                <Typography variant="body1">
                  {product.storageConditions || 'No storage conditions specified'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Record Information
            </Typography>
            
            <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Grid>
                <Typography variant="subtitle2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body1">
                  {formatDate(product.createdAt)}
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body1">
                  {formatDate(product.updatedAt)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            Delete Product
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete "{product.name}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleDeleteCancel} 
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
              disabled={isDeleting}
              startIcon={isDeleting ? <CircularProgress size={20} /> : <DeleteIcon />}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};