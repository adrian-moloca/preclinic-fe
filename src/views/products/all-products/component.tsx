import {
    Box,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Chip,
    Tooltip,
} from "@mui/material";
import { FC, useState, useMemo } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/search-bar";
import { useProductsContext } from "../../../providers/products";
import { MedicalProduct } from "../../../providers/products/types";
import DeleteModal from "../../../components/delete-modal";
import { Column, ReusableTable } from "../../../components/table/component";

const getStatusColor = (status: string) => {
    const colors = {
        active: 'success',
        discontinued: 'warning',
        out_of_stock: 'error',
        expired: 'error'
    };
    return colors[status as keyof typeof colors] || 'default';
};

export const AllProducts: FC = () => {
    const { products, deleteProduct } = useProductsContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedProduct, setSelectedProduct] = useState<MedicalProduct | null>(null);
    const navigate = useNavigate();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
            setAnchorEl(null); 
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

    const handleDeleteMultiple = async (selectedIds: string[]) => {
        try {
            await Promise.all(selectedIds.map(id => deleteProduct(id)));
        } catch (error) {
            console.error('Error deleting products:', error);
        }
    };

    const productList = useMemo(() => Object.values(products), [products]);

    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) {
            return productList;
        }

        const lowerQuery = searchQuery.toLowerCase();
        return productList.filter((product) =>
            product.name.toLowerCase().includes(lowerQuery) ||
            product.manufacturer.toLowerCase().includes(lowerQuery) ||
            product.category.toLowerCase().includes(lowerQuery) ||
            product.type.toLowerCase().includes(lowerQuery) ||
            product.batchNumber.toLowerCase().includes(lowerQuery)
        );
    }, [productList, searchQuery]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, product: MedicalProduct) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedProduct(product);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        if (!deleteModalOpen) {
            setSelectedProduct(null);
        }
    };

    const handleEditProduct = () => {
        if (selectedProduct) {
            navigate(`/products/edit/${selectedProduct.id}`);
            handleMenuClose();
        }
    };

    const handleProductDetails = (product: MedicalProduct) => {
        navigate(`/products/${product.id}`);
    };

    const handleRowClick = (product: MedicalProduct) => {
        navigate(`/products/${product.id}`);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const isExpiringSoon = (expiryDate: string) => {
        const expiry = new Date(expiryDate);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    };

    const isExpired = (expiryDate: string) => {
        return new Date(expiryDate) < new Date();
    };

    const isLowStock = (quantity: number) => {
        return quantity <= 10;
    };

    const columns: Column[] = [
        {
            id: 'product',
            label: 'Product',
            minWidth: 200,
            sortable: false,
            render: (_, row: MedicalProduct) => (
                <Box display="flex" alignItems="center" gap={2}>
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {row.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {row.manufacturer}
                        </Typography>
                    </Box>
                    {(isExpiringSoon(row.expiryDate) || isLowStock(row.quantity)) && (
                        <Tooltip title={
                            isExpiringSoon(row.expiryDate) ? "Expiring soon" :
                                isLowStock(row.quantity) ? "Low stock" : ""
                        }>
                            <WarningIcon color="warning" fontSize="small" />
                        </Tooltip>
                    )}
                </Box>
            ),
        },
        {
            id: 'batchNumber',
            label: 'Batch',
            minWidth: 120,
            render: (value: string) => (
                <Typography variant="body2">
                    {value}
                </Typography>
            ),
        },
        {
            id: 'quantity',
            label: 'Quantity',
            minWidth: 120,
            render: (value: number, row: MedicalProduct) => (
                <Typography
                    variant="body2"
                    color={isLowStock(value) ? "error" : "inherit"}
                    sx={{ fontWeight: isLowStock(value) ? 600 : 400 }}
                >
                    {value} {row.unit}
                </Typography>
            ),
        },
        {
            id: 'unitPrice',
            label: 'Price',
            minWidth: 100,
            render: (value: number) => (
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    ${value.toFixed(2)}
                </Typography>
            ),
        },
        {
            id: 'expiryDate',
            label: 'Expiry',
            minWidth: 120,
            render: (value: string) => (
                <Typography
                    variant="body2"
                    color={
                        isExpired(value) ? "error" :
                            isExpiringSoon(value) ? "warning.main" : "inherit"
                    }
                    sx={{
                        fontWeight:
                            isExpired(value) || isExpiringSoon(value)
                                ? 600 : 400
                    }}
                >
                    {value}
                </Typography>
            ),
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 120,
            render: (value: string) => (
                <Chip
                    label={value.replace('_', ' ').toUpperCase()}
                    size="small"
                    color={getStatusColor(value) as any}
                />
            ),
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 120,
            align: 'right',
            sortable: false,
            render: (_, row: MedicalProduct) => (
                <Box>
                    <Tooltip title="View Product Details">
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                handleProductDetails(row);
                            }}
                            size="small"
                        >
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                    <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                        <MoreVertIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box p={3} sx={{ overflowX: "auto" }}>
            <Typography variant="h4" mb={2}>
                Medical Products Inventory ({filteredProducts.length})
            </Typography>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
                <SearchBar onSearch={handleSearch} />
            </Box>

            <ReusableTable
                columns={columns}
                data={filteredProducts}
                onRowClick={handleRowClick}
                onDeleteSelected={handleDeleteMultiple}
                searchQuery={searchQuery}
                emptyMessage="No Products Found"
                emptyDescription="There are currently no products in inventory."
                enableSelection={true}
                enablePagination={true}
                enableSorting={true}
                rowsPerPageOptions={[5, 10, 25, 50]}
                defaultRowsPerPage={10}
            />

            {filteredProducts.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} |
                        Total Value: ${filteredProducts.reduce((acc, product) => acc + (product.quantity * product.unitPrice), 0).toFixed(2)}
                    </Typography>
                </Box>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleEditProduct}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1, color: "error.main" }} />
                    Delete
                </MenuItem>
            </Menu>
            
            <DeleteModal
                open={deleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Product"
                itemName={selectedProduct?.name}
                message={selectedProduct ? `Are you sure you want to delete "${selectedProduct.name}"? This action cannot be undone.` : undefined}
                isDeleting={isDeleting}
            />
        </Box>
    );
};