import React from 'react';
import { Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { LocalShipping, Business } from '@mui/icons-material';
import { IInvoice } from '../../../../../providers/invoices';

interface ServiceDetailsCardProps {
    invoice: IInvoice;
    formatCurrency: (amount: string | number) => string;
    subtotal: number;
}

export const ServiceDetailsCard: React.FC<ServiceDetailsCardProps> = ({
    invoice,
    formatCurrency,
    subtotal
}) => {
    return (
        <Card sx={{ boxShadow: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocalShipping color="primary" />
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        Service Details
                    </Typography>
                </Box>

                <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.main' }}>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Service/Product</TableCell>
                                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                                <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow sx={{ '&:nth-of-type(odd)': { bgcolor: 'grey.50' } }}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Business sx={{ color: 'grey.500', fontSize: 20 }} />
                                        {invoice.department || 'N/A'}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'medium' }}>
                                    {invoice.productName || 'N/A'}
                                </TableCell>
                                <TableCell align="center">
                                    {invoice.quantity || '1'}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                    {formatCurrency(subtotal)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};