// src/components/patient-casies/create-case/components/check-out-form/component.tsx
import React, { useState, useMemo } from "react";
import { Box, TextField, Button, Stack, Typography } from "@mui/material";
import { IInvoice } from "../../../../../providers/invoices/types";
import AddInvoiceForm from "../../../../add-invoice-form";

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
    const [checkOutTime, setCheckOutTime] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [showInvoiceForm, setShowInvoiceForm] = useState<boolean>(false);
    const [invoiceGenerated, setInvoiceGenerated] = useState<boolean>(false);
    const [generatedInvoice, setGeneratedInvoice] = useState<IInvoice | null>(null);

    console.log("Medical Case Data received in CheckOut:", medicalCaseData);

    // Prepare initial data for invoice form with complete patient and appointment data
    const invoiceInitialData = useMemo(() => {
        if (!medicalCaseData) {
            console.log("No medical case data available");
            return undefined;
        }

        // Extract patient data from medical case data
        const patient = medicalCaseData.patient;
        const appointment = medicalCaseData.appointment;

        if (!patient) {
            console.log("No patient data in medical case");
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
            // Additional patient details for pre-filling
            patientAddress: patient.address || '',
            phoneNumber: patient.phoneNumber || ''
        };

        console.log("Prepared invoice initial data:", initialData);
        return initialData;
    }, [medicalCaseData, appointmentId, checkInData]);

    // Calculate total cost from services
    const totalCost = useMemo(() => {
        if (!medicalCaseData?.services) return 0;
        return medicalCaseData.services.reduce((total: number, service: any) => total + (service.price || 0), 0);
    }, [medicalCaseData]);

    const handleInvoiceCreated = (invoice: IInvoice) => {
        console.log("Invoice created:", invoice);
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
            id: `${appointmentId}-${Date.now()}`,
            patientId,
            appointmentId,
            checkOutTime,
            notes,
            billing: generatedInvoice || {} as IInvoice,
        };
        onSubmit(checkOutData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
            <Stack spacing={2}>
                <Typography variant="h6">Check-Out</Typography>
                
                <TextField
                    label="Check-Out Time"
                    type="datetime-local"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                />
                
                <TextField
                    label="Notes"
                    multiline
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                
                {/* Display case summary before generating invoice */}
                {medicalCaseData && (
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Case Summary:
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Patient: {medicalCaseData.patient ? 
                                `${medicalCaseData.patient.firstName} ${medicalCaseData.patient.lastName}` : 
                                'Unknown'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Email: {medicalCaseData.patient?.email || 'Not provided'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Services: {medicalCaseData.services?.length || 0} items
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
                            Total Cost: ${totalCost.toFixed(2)}
                        </Typography>
                        {medicalCaseData.diagnosis && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Diagnosis: {medicalCaseData.diagnosis}
                            </Typography>
                        )}
                        {medicalCaseData.appointment && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Appointment: {medicalCaseData.appointment.date} at {medicalCaseData.appointment.time}
                            </Typography>
                        )}
                    </Box>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowInvoiceForm(true)}
                    disabled={invoiceGenerated || !medicalCaseData || !invoiceInitialData}
                    sx={{ mt: 2 }}
                >
                    {invoiceGenerated ? "Invoice Generated ✓" : "Generate Invoice"}
                </Button>

                {!invoiceInitialData && medicalCaseData && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        Missing patient information. Cannot generate invoice.
                    </Typography>
                )}

                {invoiceGenerated && generatedInvoice && (
                    <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, color: 'success.contrastText' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Invoice Generated Successfully!
                        </Typography>
                        <Typography variant="body2">
                            Invoice #: {generatedInvoice.invoiceNumber}
                        </Typography>
                        <Typography variant="body2">
                            Amount: ${generatedInvoice.amount}
                        </Typography>
                    </Box>
                )}

                {showInvoiceForm && invoiceInitialData && (
                    <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
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
                            Cancel
                        </Button>
                    </Box>
                )}

                <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={!invoiceGenerated}
                    sx={{ mt: 2 }}
                >
                    Save Check-Out
                </Button>
            </Stack>
        </Box>
    );
};