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
import { MedicalProduct } from "../../../../providers/products/types";

interface ProductsSectionProps {
    currentProduct: { productId: string; quantity: number };
    selectedProducts: InvoiceProduct[];
    productsArray: MedicalProduct[];
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

    // Colors for dark mode
    const cardBg = theme.palette.mode === "dark" ? theme.palette.background.paper : "#fff";
    const sectionBg = theme.palette.mode === "dark" ? "rgba(102,126,234,0.08)" : "#f8f9fa";
    const borderColor = theme.palette.mode === "dark" ? theme.palette.divider : "#e9ecef";
    const tableHeadBg = theme.palette.mode === "dark" ? "rgba(102,126,234,0.10)" : "#f8f9fa";
    const tableRowOddBg = theme.palette.mode === "dark" ? "rgba(102,126,234,0.04)" : "#fafafa";
    const textColor = theme.palette.text.primary;

    return (
        <Card variant="outlined" sx={{ mb: 4, border: `1px solid ${borderColor}`, bgcolor: cardBg, color: textColor, transition: "background 0.3s, color 0.3s" }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: textColor }}>
                    Products & Services
                </Typography>

                {errors.products && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                        {errors.products}
                    </Typography>
                )}

                <Box sx={{ mb: 3, p: 3, bgcolor: sectionBg, borderRadius: 2, border: `1px solid ${borderColor}` }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: textColor, fontWeight: 600 }}>
                        Add New Product
                    </Typography>
                    <Grid container spacing={2} alignItems="end" sx={{ display: "flex", justifyContent: "center" }}>
                        <Grid>
                            <TextField
                                select
                                fullWidth
                                label="Select Product"
                                value={currentProduct.productId}
                                onChange={(e) => onCurrentProductChange(prev => ({
                                    ...prev,
                                    productId: e.target.value
                                }))}
                                variant="outlined"
                                size="small"
                                sx={{ width: 300 }}
                            >
                                {productsArray.map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                        <Box>
                                            <Typography variant="body2" fontWeight={500}>
                                                {product.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                ${product.unitPrice} - {product.category}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid>
                            <TextField
                                fullWidth
                                label="Quantity"
                                type="number"
                                value={currentProduct.quantity}
                                onChange={(e) => onCurrentProductChange(prev => ({
                                    ...prev,
                                    quantity: parseInt(e.target.value) || 1
                                }))}
                                inputProps={{ min: 1 }}
                                variant="outlined"
                                size="small"
                                sx={{ width: 300 }}
                            />
                        </Grid>
                        <Grid>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={onAddProduct}
                                startIcon={<AddIcon />}
                                disabled={!currentProduct.productId}
                                sx={{ 
                                    height: 40,
                                    fontWeight: 600,
                                    boxShadow: "none",
                                    "&:hover": {
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                                    }
                                }}
                            >
                                Add Product
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                {/* Products Table */}
                {selectedProducts.length > 0 && (
                    <Box sx={{ border: `1px solid ${borderColor}`, borderRadius: 2, overflow: "hidden" }}>
                        <Table>
                            <TableHead sx={{ bgcolor: tableHeadBg }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, color: textColor }}>Product Name</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, color: textColor }}>Unit Price</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, color: textColor }}>Quantity</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, color: textColor }}>Amount</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600, color: textColor }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedProducts.map((product, index) => (
                                    <TableRow key={index} sx={{ "&:nth-of-type(odd)": { bgcolor: tableRowOddBg } }}>
                                        <TableCell sx={{ fontWeight: 500 }}>{product.productName}</TableCell>
                                        <TableCell align="right">${product.unitCost.toFixed(2)}</TableCell>
                                        <TableCell align="right">{product.quantity}</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600 }}>${product.amount.toFixed(2)}</TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="error"
                                                onClick={() => onRemoveProduct(index)}
                                                size="small"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};