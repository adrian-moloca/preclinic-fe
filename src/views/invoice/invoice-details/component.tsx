import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Container, CircularProgress, Alert } from "@mui/material";
import { useInvoicesContext } from "../../../providers/invoices";
import { usePatientsContext } from "../../../providers/patients";
import { useAppointmentsContext } from "../../../providers/appointments";
import { IInvoice } from "../../../providers/invoices/types";
import InvoiceHeader from "./components/invoice-header";
import InvoiceMainContent from "./components/main-content";
import InvoicePDFDownloader from "./components/pdf-downloader";

interface InvoiceDetailsProps {}

export const InvoiceDetails: React.FC<InvoiceDetailsProps> = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const pdfDownloaderRef = useRef<any>(null);

    const [isDownloading, setIsDownloading] = useState(false);
    const [currentInvoice, setCurrentInvoice] = useState<IInvoice | null>(null);
    const [appointmentInfo, setAppointmentInfo] = useState<any>(null);

    const { invoices } = useInvoicesContext();
    const { patients } = usePatientsContext();
    const { appointments } = useAppointmentsContext();

    useEffect(() => {
        if (id && invoices.length > 0) {
            const invoice = invoices.find(inv => inv.id === id);
            setCurrentInvoice(invoice || null);
            
            if (invoice?.appointment && appointments.length > 0) {
                const appointment = appointments.find(app => app.id === invoice.appointment);
                if (appointment) {
                    setAppointmentInfo({
                        appointmentType: appointment.appointmentType || 'General Consultation',
                        date: appointment.date,
                        reason: appointment.reason
                    });
                }
            }
        }
    }, [id, invoices, appointments]);

    const getPatientName = (): string => {
        if (!currentInvoice?.patientId) return "Unknown Patient";
        const patient = patients.find(p => p.id === currentInvoice.patientId);
        return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient";
    };

    const formatCurrency = (amount: string | number): string => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(isNaN(numAmount) ? 0 : numAmount);
    };

    const formatDate = (dateString: string): string => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    const handleDownload = async () => {
        if (pdfDownloaderRef.current) {
            await pdfDownloaderRef.current.downloadPDF();
        }
    };

    const calculateTotals = () => {
        if (!currentInvoice) return { subtotal: 0, tax: 0, taxAmount: 0, total: 0 };
        
        const subtotal = parseFloat(currentInvoice.amount || "0");
        const tax = parseFloat(currentInvoice.tax || "0");
        const taxAmount = (subtotal * tax) / 100;
        const total = subtotal + taxAmount;
        
        return { subtotal, tax, taxAmount, total };
    };

    if (!currentInvoice) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                    {invoices.length === 0 ? (
                        <CircularProgress />
                    ) : (
                        <Alert severity="error">Invoice not found.</Alert>
                    )}
                </Box>
            </Container>
        );
    }

    const totals = calculateTotals();
    const patientName = getPatientName();

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <InvoiceHeader
                invoice={currentInvoice}
                patientName={patientName}
                onEdit={() => navigate(`/invoices/edit/${currentInvoice.id}`)}
                onBack={() => navigate('/invoices/all')}
                onDownload={handleDownload}
                isDownloading={isDownloading}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 3, mt: 4 }}>
                <Box>
                    <InvoiceMainContent
                        invoice={currentInvoice}
                        patientName={patientName}
                        appointmentInfo={appointmentInfo}
                        formatDate={formatDate}
                        formatCurrency={formatCurrency}
                        totals={totals}
                    />
                </Box>
            </Box>

            <InvoicePDFDownloader
                ref={pdfDownloaderRef}
                invoice={currentInvoice}
                patientName={patientName}
                totals={totals}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                appointmentInfo={appointmentInfo}
                onDownloadStart={() => setIsDownloading(true)}
                onDownloadEnd={() => setIsDownloading(false)}
            />
        </Container>
    );
};