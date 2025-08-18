// src/components/add-invoice-form/components/services-section/component.tsx
import React, { FC } from "react";
import { 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Chip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface InvoiceService {
    serviceId: string;
    serviceName: string;
    description: string;
    unitCost: number;
    quantity: number;
    amount: number;
    department: string;
}

interface ServicesSectionProps {
    selectedServices: InvoiceService[];
    onRemoveService: (index: number) => void;
    isReadOnly?: boolean;
}

export const ServicesSection: FC<ServicesSectionProps> = ({
    selectedServices,
    onRemoveService,
    isReadOnly = false
}) => {
    const totalServicesAmount = selectedServices.reduce((sum, service) => sum + service.amount, 0);

    return (
        <Card variant="outlined" sx={{ mb: 4, border: "1px solid #e8e8e8" }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: "#424242" }}>
                    Medical Services
                </Typography>

                {selectedServices.length === 0 ? (
                    <Box sx={{ 
                        textAlign: 'center', 
                        py: 4, 
                        bgcolor: '#f8f9fa', 
                        borderRadius: 2,
                        border: '1px dashed #e9ecef'
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            No services provided for this medical case
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Service Name</TableCell>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Description</TableCell>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Department</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Quantity</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Unit Cost</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Amount</TableCell>
                                    {!isReadOnly && (
                                        <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Action</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedServices.map((service, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {service.serviceName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {service.description || 'Medical service'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={service.department || 'General'} 
                                                size="small" 
                                                variant="outlined"
                                                color="primary"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {service.quantity}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2">
                                                ${service.unitCost.toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                ${service.amount.toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                        {!isReadOnly && (
                                            <TableCell align="center">
                                                <IconButton
                                                    onClick={() => onRemoveService(index)}
                                                    size="small"
                                                    color="error"
                                                    sx={{ '&:hover': { bgcolor: 'error.light', color: 'white' } }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'flex-end', 
                            mt: 2, 
                            pt: 2, 
                            borderTop: '2px solid #e9ecef' 
                        }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                Services Total: ${totalServicesAmount.toFixed(2)}
                            </Typography>
                        </Box>
                    </>
                )}
            </CardContent>
        </Card>
    );
};