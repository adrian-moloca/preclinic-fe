import React from 'react';
import { Box } from '@mui/material';
import { IInvoice } from '../../../../../providers/invoices';
import InvoiceOverviewCard from '../overview-card';
import PatientInfoCard from '../patient-info-card';
import ServiceDetailsCard from '../service-details';
import AppointmentInfoCard from '../appointment-info-card';
import DescriptionCard from '../description-card';

interface InvoiceMainContentProps {
    invoice: IInvoice;
    patientName: string;
    appointmentInfo: any;
    formatDate: (date: string) => string;
    formatCurrency: (amount: string | number) => string;
    totals: {
        subtotal: number;
        tax: number;
        taxAmount: number;
        total: number;
    };
}

export const InvoiceMainContent: React.FC<InvoiceMainContentProps> = ({
    invoice,
    patientName,
    appointmentInfo,
    formatDate,
    formatCurrency,
    totals
}) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <InvoiceOverviewCard invoice={invoice} formatDate={formatDate} />
            <PatientInfoCard invoice={invoice} patientName={patientName} />
            <ServiceDetailsCard invoice={invoice} formatCurrency={formatCurrency} subtotal={totals.subtotal} />
            {appointmentInfo && (
                <AppointmentInfoCard appointmentInfo={appointmentInfo} formatDate={formatDate} />
            )}
            {invoice.description && (
                <DescriptionCard description={invoice.description} />
            )}
        </Box>
    );
};