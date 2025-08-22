import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { useProductsContext } from "../../../providers/products/context";
import { MedicalProduct } from "../../../providers/products/types";
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/search-bar";
import DeleteModal from "../../../components/delete-modal";
import { Column, ReusableTable } from "../../../components/table/component";
import { useRecentItems } from "../../../hooks/recent-items";
import FavoriteButton from "../../../components/favorite-buttons";

export const AllProducts: FC = () => {
  const { products, deleteProduct } = useProductsContext();
  const [filteredProducts, setFilteredProducts] = useState<MedicalProduct[]>(products || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<MedicalProduct | null>(null);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { addRecentItem } = useRecentItems();

  useEffect(() => {
    setFilteredProducts(products || []);
  }, [products]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredProducts(products || []);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = (products || []).filter((product) =>
      product.name?.toLowerCase().includes(lowerQuery) ||
      product.category?.toLowerCase().includes(lowerQuery) ||
      product.manufacturer?.toLowerCase().includes(lowerQuery) ||
      product.description?.toLowerCase().includes(lowerQuery)
    );

    setFilteredProducts(filtered);
  };

  const handleRowClick = (product: MedicalProduct) => {
    addRecentItem({
      id: product.id,
      type: 'product',
      title: product.name,
      subtitle: `${product.category} - $${product.unitPrice}`,
      url: `/products/${product.id}`,
      metadata: {
        category: product.category,
        price: product.unitPrice,
        manufacturer: product.manufacturer,
      },
    });
    
    navigate(`/products/${product.id}`);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, product: MedicalProduct) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleEdit = () => {
    if (selectedProduct) {
      navigate(`/products/edit/${selectedProduct.id}`);
      handleMenuClose();
    }
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
      await deleteProduct(selectedProduct.id);
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false);
    }
  };

  const getStockStatusColor = (stock: number) => {
    if (stock <= 10) return 'error';
    if (stock <= 50) return 'warning';
    return 'success';
  };

  const getStockStatusLabel = (stock: number) => {
    if (stock <= 0) return 'Out of Stock';
    if (stock <= 10) return 'Low Stock';
    if (stock <= 50) return 'Limited Stock';
    return 'In Stock';
  };

  const columns: Column[] = [
    {
      id: 'product',
      label: 'Product',
      minWidth: 200,
      render: (value, row: MedicalProduct) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar>
            <InventoryIcon />
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {row.id}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'category',
      label: 'Category',
      minWidth: 120,
      render: (value: string) => (
        <Chip label={value} size="small" variant="outlined" />
      ),
    },
    {
      id: 'price',
      label: 'Price',
      minWidth: 100,
      render: (value: number) => (
        <Typography variant="body2" fontWeight={500}>
          ${value?.toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 'stock',
      label: 'Stock',
      minWidth: 120,
      render: (value: number) => (
        <Chip 
          label={`${value} - ${getStockStatusLabel(value)}`}
          size="small" 
          color={getStockStatusColor(value) as any}
        />
      ),
    },
    {
      id: 'manufacturer',
      label: 'Manufacturer',
      minWidth: 150,
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 140,
      align: 'right',
      sortable: false,
      render: (_: unknown, row: MedicalProduct) => {
        const favoriteItem = {
          id: row.id,
          type: 'product' as const,
          title: row.name,
          subtitle: `${row.category} - $${row.unitPrice}`,
          url: `/products/${row.id}`,
          metadata: {
            category: row.category,
            price: row.unitPrice,
            manufacturer: row.manufacturer,
          },
        };

        return (
          <Box display="flex" alignItems="center">
            <FavoriteButton item={favoriteItem} size="small" />
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                addRecentItem({
                  id: row.id,
                  type: 'product',
                  title: row.name,
                  subtitle: `${row.category} - $${row.unitPrice}`,
                  url: `/products/${row.id}`,
                  metadata: {
                    category: row.category,
                    price: row.unitPrice,
                    manufacturer: row.manufacturer,
                  },
                });
                navigate(`/products/${row.id}`);
              }}
              color="primary"
              size="small"
            >
              <InfoIcon />
            </IconButton>
            <IconButton onClick={(e) => handleMenuOpen(e, row)} size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        All Products ({filteredProducts.length})
      </Typography>
      <Box sx={{ mb: 2 }}>
        <SearchBar onSearch={handleSearch} placeholder="Search products..." />
      </Box>

      <ReusableTable
        columns={columns}
        data={filteredProducts}
        onRowClick={handleRowClick}
        searchQuery={searchQuery}
        emptyMessage="No Products Found"
        emptyDescription="There are currently no products in inventory."
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
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
        itemName={selectedProduct ? selectedProduct.name : undefined}
        isDeleting={isDeleting}
      />
    </Box>
  );
};