import React, { useState, useMemo } from "react";
import { Box, TextField, Button, Stack, Typography, Alert, Paper, Divider } from "@mui/material";
import { IInvoice } from "../../../../../providers/invoices/types";
import AddInvoiceForm from "../../../../add-invoice-form";
import { CheckCircle } from "@mui/icons-material";

export interface CheckOut {
    id: string;
    patientId: string;
    appointmentId: string;
    checkOutTime: string;
    notes?: string;
    billing: IInvoice;
}

interface CheckOutFormProps {
    patientId: string;
    appointmentId: string;
    checkInData?: any;
    medicalCaseData?: any;
    onSubmit: (data: CheckOut) => void;
}

export const CheckOutForm: React.FC<CheckOutFormProps> = ({
    patientId,
    appointmentId,
    checkInData,
    medicalCaseData,
    onSubmit,
}) => {
    const [checkOutTime, setCheckOutTime] = useState<string>(
        new Date().toISOString().slice(0, 16)
    );
    const [notes, setNotes] = useState<string>("");
    const [showInvoiceForm, setShowInvoiceForm] = useState<boolean>(false);
    const [invoiceGenerated, setInvoiceGenerated] = useState<boolean>(false);
    const [generatedInvoice, setGeneratedInvoice] = useState<IInvoice | null>(null);


    const invoiceInitialData = useMemo(() => {
        if (!medicalCaseData) {
            console.log("❌ No medical case data available for invoice");
            return undefined;
        }

        const patient = medicalCaseData.patient;
        const appointment = medicalCaseData.appointment;

        if (!patient) {
            console.log("❌ No patient data in medical case");
            return undefined;
        }

        const initialData = {
            patientId: patient.id,
            patientName: `${patient.firstName || ''} ${patient.lastName || ''}`.trim(),
            email: patient.email || '',
            appointmentId: appointment?.id || appointmentId,
            services: medicalCaseData.services || [],
            prescriptions: medicalCaseData.prescriptions || [],
            checkInData,
            medicalCaseData,
            patientAddress: patient.address || '',
            phoneNumber: patient.phoneNumber || ''
        };

        console.log("📋 Prepared invoice initial data:", initialData);
        return initialData;
    }, [medicalCaseData, appointmentId, checkInData]);

    const totalCost = useMemo(() => {
        if (!medicalCaseData?.services) return 0;
        return medicalCaseData.services.reduce((total: number, service: any) => total + (service.price || 0), 0);
    }, [medicalCaseData]);

    const handleInvoiceCreated = (invoice: IInvoice) => {
        console.log("✅ Invoice created successfully:", invoice);
        setGeneratedInvoice(invoice);
        setInvoiceGenerated(true);
        setShowInvoiceForm(false);
    };

    const handleInvoiceFormClosed = () => {
        setShowInvoiceForm(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!invoiceGenerated) {
            alert("Please generate an invoice before checking out.");
            return;
        }
        
        const checkOutData: CheckOut = {
            id: `${appointmentId}-checkout-${Date.now()}`,
            patientId,
            appointmentId,
            checkOutTime,
            notes,
            billing: generatedInvoice || {} as IInvoice,
        };
        
        onSubmit(checkOutData);
    };

    if (!medicalCaseData) {
        return (
            <Alert severity="warning">
                <Typography variant="h6">Waiting for Medical Case Data</Typography>
                <Typography variant="body2">
                    Please complete the medical case form first before proceeding to checkout.
                </Typography>
            </Alert>
        );
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
            <Stack spacing={3}>
                <Box>
                    <Typography variant="h5" gutterBottom>
                        Patient Check-Out & Billing
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Complete the checkout process and generate invoice
                    </Typography>
                </Box>
                
                <TextField
                    label="Check-Out Time"
                    type="datetime-local"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                    fullWidth
                />
                
                <TextField
                    label="Checkout Notes"
                    multiline
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes for checkout..."
                    fullWidth
                />
                
                <Box>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                        Medical Case Summary:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Patient:</strong> {medicalCaseData.patient ? 
                            `${medicalCaseData.patient.firstName} ${medicalCaseData.patient.lastName}` : 
                            'Unknown'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Email:</strong> {medicalCaseData.patient?.email || 'Not provided'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Services:</strong> {medicalCaseData.services?.length || 0} items
                    </Typography>
                    {medicalCaseData.services?.length > 0 && (
                        <Box sx={{ ml: 2, mb: 1 }}>
                            {medicalCaseData.services.map((service: any, index: number) => (
                                <Typography key={index} variant="body2" sx={{ fontSize: '0.875rem' }}>
                                    • {service.name} - ${service.price || 0}
                                </Typography>
                            ))}
                        </Box>
                    )}
                    <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>
                        <strong>Total Cost:</strong> ${totalCost.toFixed(2)}
                    </Typography>
                    {medicalCaseData.diagnosis && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Diagnosis:</strong> {medicalCaseData.diagnosis}
                        </Typography>
                    )}
                    {medicalCaseData.appointment && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Appointment:</strong> {medicalCaseData.appointment.date} at {medicalCaseData.appointment.time}
                        </Typography>
                    )}
                </Box>

                <Divider />

                <Box>
                    <Typography variant="h6" gutterBottom>
                        Invoice Generation
                    </Typography>
                    
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setShowInvoiceForm(true)}
                        disabled={invoiceGenerated || !medicalCaseData || !invoiceInitialData}
                        sx={{ mb: 2 }}
                        size="large"
                    >
                        {invoiceGenerated ? "Invoice Generated ✓" : "Generate Invoice"}
                    </Button>

                    {!invoiceInitialData && medicalCaseData && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                            Missing patient information. Cannot generate invoice.
                        </Alert>
                    )}

                    {invoiceGenerated && generatedInvoice && (
                        <React.Fragment>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CheckCircle sx={{ mr: 1 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Invoice Generated Successfully!
                                </Typography>
                            </Box>
                            <Typography variant="body2">
                                <strong>Invoice #:</strong> {generatedInvoice.invoiceNumber}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Amount:</strong> ${generatedInvoice.amount}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Status:</strong> {generatedInvoice.paymentStatus}
                            </Typography>
                        </React.Fragment>
                    )}
                </Box>

                {showInvoiceForm && invoiceInitialData && (
                    <Paper sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Generate Invoice</Typography>
                        <AddInvoiceForm
                            initialData={invoiceInitialData}
                            onInvoiceCreated={handleInvoiceCreated}
                        />
                        <Button
                            variant="outlined"
                            sx={{ mt: 2 }}
                            onClick={handleInvoiceFormClosed}
                        >
                            Cancel Invoice Generation
                        </Button>
                    </Paper>
                )}

                <Divider />

                <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={!invoiceGenerated}
                    size="large"
                    sx={{ py: 1.5 }}
                    color="success"
                >
                    Complete Check-Out & Save Medical Case
                </Button>
                
                {!invoiceGenerated && (
                    <Alert severity="info">
                        Please generate an invoice before completing the checkout process.
                    </Alert>
                )}
            </Stack>
        </Box>
    );
};