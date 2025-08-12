import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { Person } from '@mui/icons-material';
import { IInvoice } from '../../../../../providers/invoices';

interface PatientInfoCardProps {
    invoice: IInvoice;
    patientName: string;
}

export const PatientInfoCard: React.FC<PatientInfoCardProps> = ({
    invoice,
    patientName
}) => {
    return (
        <Card sx={{ boxShadow: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Person color="primary" />
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        Patient Information
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid>
                        <Typography variant="caption" color="text.secondary">
                            Full Name
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'semibold', color: 'primary.main' }}>
                            {patientName}
                        </Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="caption" color="text.secondary">
                            Email
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
                            {invoice.email || 'N/A'}
                        </Typography>
                    </Grid>
                    {invoice.patientAddress && (
                        <Grid>
                            <Typography variant="caption" color="text.secondary">
                                Address
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
                                {invoice.patientAddress}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );
};