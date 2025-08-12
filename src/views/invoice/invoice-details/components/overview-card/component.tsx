import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Grid } from '@mui/material';
import { Description, Tag, CalendarToday, Schedule, CreditCard } from '@mui/icons-material';
import { IInvoice } from '../../../../../providers/invoices';

interface InvoiceOverviewCardProps {
    invoice: IInvoice;
    formatDate: (date: string) => string;
}

export const InvoiceOverviewCard: React.FC<InvoiceOverviewCardProps> = ({
    invoice,
    formatDate
}) => {
    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'success';
            case 'pending':
                return 'warning';
            case 'overdue':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Card sx={{ boxShadow: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Description color="primary" />
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        Invoice Overview
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Tag sx={{ color: 'grey.500', fontSize: 20 }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Invoice Number
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
                                    {invoice.invoiceNumber}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarToday sx={{ color: 'grey.500', fontSize: 20 }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Invoice Date
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
                                    {formatDate(invoice.invoiceDate || "")}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Schedule sx={{ color: 'grey.500', fontSize: 20 }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Due Date
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
                                    {formatDate(invoice.dueDate || "")}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CreditCard sx={{ color: 'grey.500', fontSize: 20 }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Status
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>
                                    <Chip 
                                        label={invoice.paymentStatus || 'Pending'}
                                        color={getStatusColor(invoice.paymentStatus)}
                                        size="small"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};