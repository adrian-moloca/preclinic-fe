import React, { FC } from "react";
import { 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    Grid, 
    TextField, 
    MenuItem, 
    Button, 
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    useTheme
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { InvoiceProduct } from "../../component";
import { ProductWithStock } from "../../../../providers/products/types";

interface ProductsSectionProps {
    currentProduct: { productId: string; quantity: number };
    selectedProducts: InvoiceProduct[];
    productsArray: ProductWithStock[];
    errors: Record<string, string>;
    onCurrentProductChange: React.Dispatch<React.SetStateAction<{ productId: string; quantity: number }>>;
    onAddProduct: () => void;
    onRemoveProduct: (index: number) => void;
}

export const ProductsSection: FC<ProductsSectionProps> = ({
    currentProduct,
    selectedProducts,
    productsArray,
    errors,
    onCurrentProductChange,
    onAddProduct,
    onRemoveProduct
}) => {
    const theme = useTheme();

    const cardBg = theme.palette.mode === "dark" ? theme.palette.background.paper : "#fff";
    const sectionBg = theme.palette.mode === "dark" ? "rgba(102,126,234,0.08)" : "#f8f9fa";
    const borderColor = theme.palette.mode === "dark" ? theme.palette.divider : "#e9ecef";
    const tableHeadBg = theme.palette.mode === "dark" ? "rgba(102,126,234,0.10)" : "#f8f9fa";

    return (
        <Card sx={{ mb: 3, boxShadow: 2, backgroundColor: cardBg }}>
            <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                    Products Selection
                </Typography>

                <Box sx={{ p: 2, backgroundColor: sectionBg, borderRadius: 1, mb: 2, border: `1px solid ${borderColor}` }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Add Product
                    </Typography>
                    
                    <Grid container spacing={2} alignItems="center">
                        <Grid>
                            <TextField
                                select
                                fullWidth
                                label="Select Product"
                                value={currentProduct.productId}
                                onChange={(e) => onCurrentProductChange(prev => ({ ...prev, productId: e.target.value }))}
                                error={!!errors.products}
                                helperText={errors.products}
                                size="small"
                            >
                                <MenuItem value="">
                                    <em>Choose a product</em>
                                </MenuItem>
                                {productsArray
                                    .filter(product => product.totalQuantity > 0)
                                    .map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {product.name} - {product.manufacturer} (Stock: {product.totalQuantity} {product.unit})
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid>
                            <TextField
                                type="number"
                                fullWidth
                                label="Quantity"
                                value={currentProduct.quantity}
                                onChange={(e) => onCurrentProductChange(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                                inputProps={{ min: 1 }}
                                size="small"
                            />
                        </Grid>

                        <Grid>
                            <Button
                                variant="contained"
                                onClick={onAddProduct}
                                startIcon={<AddIcon />}
                                fullWidth
                                disabled={!currentProduct.productId}
                                sx={{ height: 40 }}
                            >
                                Add Product
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                {selectedProducts.length > 0 && (
                    <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                            Selected Products ({selectedProducts.length})
                        </Typography>
                        
                        <Table size="small" sx={{ border: `1px solid ${borderColor}` }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: tableHeadBg }}>
                                    <TableCell><strong>Product</strong></TableCell>
                                    <TableCell align="right"><strong>Quantity</strong></TableCell>
                                    <TableCell align="right"><strong>Unit Price</strong></TableCell>
                                    <TableCell align="right"><strong>Total</strong></TableCell>
                                    <TableCell align="center"><strong>Action</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedProducts.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.productName}</TableCell>
                                        <TableCell align="right">{product.quantity}</TableCell>
                                        <TableCell align="right">${product.unitCost.toFixed(2)}</TableCell>
                                        <TableCell align="right">
                                            <Typography fontWeight={600}>
                                                ${product.amount.toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                onClick={() => onRemoveProduct(index)}
                                                color="error"
                                                size="small"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Box sx={{ mt: 2, p: 2, backgroundColor: sectionBg, borderRadius: 1 }}>
                            <Typography variant="h6" align="right">
                                Products Total: ${selectedProducts.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};