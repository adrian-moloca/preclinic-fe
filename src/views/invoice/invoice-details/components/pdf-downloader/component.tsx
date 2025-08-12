import { useImperativeHandle, forwardRef } from 'react';
import { IInvoice } from '../../../../../providers/invoices';
import InvoicePDFGenerator from '../pdf-generator';

interface InvoicePDFDownloaderProps {
    invoice: IInvoice;
    patientName: string;
    totals: {
        subtotal: number;
        tax: number;
        taxAmount: number;
        total: number;
    };
    formatCurrency: (amount: string | number) => string;
    formatDate: (dateString: string) => string;
    appointmentInfo?: any;
    onDownloadStart: () => void;
    onDownloadEnd: () => void;
}

export interface InvoicePDFDownloaderRef {
    downloadPDF: () => Promise<void>;
}

export const InvoicePDFDownloader = forwardRef<InvoicePDFDownloaderRef, InvoicePDFDownloaderProps>(({
    invoice,
    patientName,
    totals,
    formatCurrency,
    formatDate,
    appointmentInfo,
    onDownloadStart,
    onDownloadEnd
}, ref) => {
    
    const downloadPDF = async () => {
        onDownloadStart();

        try {
            const htmlContent = InvoicePDFGenerator.generateHTML({
                invoice,
                patientName,
                subtotal: totals.subtotal,
                tax: totals.tax,
                taxAmount: totals.taxAmount,
                total: totals.total,
                formatCurrency,
                formatDate,
                appointmentInfo
            });

            const fileName = `Invoice_${invoice.invoiceNumber}_${patientName.replace(/\s+/g, '_')}.html`;

            InvoicePDFGenerator.downloadAndPrint(htmlContent, fileName);

        } catch (error) {
            console.error('Error generating invoice PDF:', error);
            alert('Failed to generate invoice PDF. Please try again.');
        } finally {
            onDownloadEnd();
        }
    };

    useImperativeHandle(ref, () => ({
        downloadPDF
    }));

    return null;
});

InvoicePDFDownloader.displayName = 'InvoicePDFDownloader';