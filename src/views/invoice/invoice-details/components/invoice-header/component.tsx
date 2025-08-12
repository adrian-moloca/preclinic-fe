import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { ArrowBack, Edit, Download } from '@mui/icons-material';
import { IInvoice } from '../../../../../providers/invoices';

interface InvoiceHeaderProps {
    invoice: IInvoice;
    patientName: string;
    onEdit: () => void;
    onBack: () => void;
    onDownload: () => void;
    isDownloading: boolean;
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
    invoice,
    patientName,
    onEdit,
    onBack,
    onDownload,
    isDownloading
}) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton 
                    onClick={onBack}
                    sx={{ 
                        bgcolor: 'grey.100',
                        '&:hover': { bgcolor: 'grey.200' }
                    }}
                >
                    <ArrowBack />
                </IconButton>
                <Box>
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'grey.900' }}>
                        Invoice #{invoice.invoiceNumber}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'grey.600', mt: 0.5 }}>
                        Patient: {patientName}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={onEdit}
                    sx={{
                        borderColor: 'grey.400',
                        color: 'grey.700',
                        '&:hover': {
                            borderColor: 'grey.600',
                            bgcolor: 'grey.50'
                        }
                    }}
                >
                    Edit Invoice
                </Button>
                <Button
                    variant="contained"
                    startIcon={<Download />}
                    onClick={onDownload}
                    disabled={isDownloading}
                    sx={{
                        bgcolor: '#1976d2',
                        '&:hover': { bgcolor: '#1565c0' }
                    }}
                >
                    {isDownloading ? "Generating..." : "Download PDF"}
                </Button>
            </Box>
        </Box>
    );
};