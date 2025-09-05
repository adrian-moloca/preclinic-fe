import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useProductsContext } from '../../../providers/products/provider';
import { ProductWithStock, ProductType } from '../../../providers/products/types';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../../components/search-bar';
import DeleteModal from '../../../components/delete-modal';
import { Column, ReusableTable } from '../../../components/table/component';

export const AllProducts: React.FC = () => {
  const navigate = useNavigate();
  const { getAllProductsWithStock, deleteProduct } = useProductsContext();
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithStock | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filteredServices, setFilteredServices] = useState<ProductWithStock[]>([]);

  const productList = useMemo(() => {
    const products = getAllProductsWithStock();
    return products;
  }, [getAllProductsWithStock]);

   const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredServices(productList);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = productList.filter((product) =>
      product.name?.toLowerCase().includes(lowerQuery) ||
      product.description?.toLowerCase().includes(lowerQuery) ||
      product.category?.toLowerCase().includes(lowerQuery)
    );

    setFilteredServices(filtered);
  };

  const columns: Column[] = [
    {
      id: 'name',
      label: 'Product Name',
      minWidth: 200,
      sortable: true,
      render: (value: string, row: ProductWithStock) => (
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {row.manufacturer}
          </Typography>
        </Box>
      )
    },
    {
      id: 'type',
      label: 'Type',
      minWidth: 150,
      sortable: true,
      render: (value: ProductType) => (
        <Chip
          label={value.replace('_', ' ')}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      id: 'category',
      label: 'Category',
      minWidth: 150,
      sortable: true,
      render: (value: string) => (
        <Chip
          label={value}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      id: 'totalQuantity',
      label: 'Stock',
      minWidth: 120,
      align: 'center',
      sortable: true,
      render: (value: number, row: ProductWithStock) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">
            {value} {row.unit}
          </Typography>
        </Box>
      )
    },
    {
      id: 'averagePrice',
      label: 'Avg Price',
      minWidth: 100,
      align: 'right',
      sortable: true,
      render: (value: number) => (
        <Typography variant="body2">
          ${value.toFixed(2)}
        </Typography>
      )
    },
    {
      id: 'nearestExpiry',
      label: 'Next Expiry',
      minWidth: 120,
      sortable: true,
      render: (value: string) => (
        <Typography variant="body2">
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </Typography>
      )
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 150,
      render: (_: any, row: ProductWithStock) => {
        const getStockStatusColor = () => {
          if (row.totalQuantity === 0) return 'error';
          if (row.totalQuantity <= 10) return 'warning';
          return 'success';
        };

        const getStockStatusText = () => {
          if (row.totalQuantity === 0) return 'Out of Stock';
          if (row.totalQuantity <= 10) return 'Low Stock';
          return 'In Stock';
        };

        const isExpiring = () => {
          if (!row.nearestExpiry) return false;
          const expiryDate = new Date(row.nearestExpiry);
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
          return expiryDate <= thirtyDaysFromNow;
        };

        return (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            <Chip
              icon={
                row.totalQuantity === 0 ? <WarningIcon /> :
                row.totalQuantity <= 10 ? <WarningIcon /> :
                <CheckCircleIcon />
              }
              label={getStockStatusText()}
              color={getStockStatusColor()}
              size="small"
            />
            {isExpiring() && (
              <Chip
                icon={<WarningIcon />}
                label="Expiring Soon"
                color="warning"
                size="small"
              />
            )}
          </Box>
        );
      }
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 80,
      align: 'center',
      render: (_: any, row: ProductWithStock) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuClick(e, row)}
        >
          <MoreVertIcon />
        </IconButton>
      )
    }
  ];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, product: ProductWithStock) => {
    event.stopPropagation();
    setSelectedProduct(product);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleRowClick = (row: ProductWithStock) => {
    navigate(`/products/${row.id}`);
  };

  const handleEditProduct = () => {
    if (selectedProduct) {
      navigate(`/products/edit/${selectedProduct.id}`);
    }
    handleMenuClose();
  };

  const handleViewDetails = () => {
    if (selectedProduct) {
      navigate(`/products/${selectedProduct.id}`);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (selectedProduct) {
      setDeleteModalOpen(true);
      setAnchorEl(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    setIsDeleting(true);
    try {
      deleteProduct(selectedProduct.id);
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            All Products
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Manage your clinic's product inventory
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/products/create')}
          sx={{ borderRadius: 2 }}
        >
          Add Product
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search products..."
        />
      </Box>

      {productList.length === 0 ? (
        <Alert severity="info" sx={{ mt: 3 }}>
          No products found. Start by adding your first product.
        </Alert>
      ) : (
        <ReusableTable
          columns={columns}
          data={filteredServices}
          onRowClick={handleRowClick}
          searchQuery={searchQuery}
          emptyMessage="No products found"
          emptyDescription="No products match your search criteria."
          enablePagination={true}
          enableSorting={true}
          enableColumnCustomization={true}
          enableExport={true}
          defaultRowsPerPage={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <InfoIcon fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEditProduct}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Product
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Product
        </MenuItem>
      </Menu>

      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        isDeleting={isDeleting}
      />
    </Box>
  );
};