import React, { useState } from "react";
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
    onSubmit: (data: CheckOut) => void;
}

export const CheckOutForm: React.FC<CheckOutFormProps> = ({
    patientId,
    appointmentId,
    onSubmit,
}) => {
    const [checkOutTime, setCheckOutTime] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [showInvoiceForm, setShowInvoiceForm] = useState<boolean>(false);
    const [invoiceGenerated, setInvoiceGenerated] = useState<boolean>(false);

    const handleInvoiceFormClosed = () => {
        setShowInvoiceForm(false);
        setInvoiceGenerated(true);
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
            billing: {} as IInvoice,
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowInvoiceForm(true)}
                    disabled={invoiceGenerated}
                >
                    {invoiceGenerated ? "Invoice Generated" : "Generate Invoice"}
                </Button>
                {showInvoiceForm && (
                    <Box>
                        <AddInvoiceForm
                        />
                        <Button
                            variant="outlined"
                            sx={{ mt: 2 }}
                            onClick={handleInvoiceFormClosed}
                        >
                            Done
                        </Button>
                    </Box>
                )}
                <Button type="submit" variant="contained" disabled={!invoiceGenerated}>
                    Save Check-Out
                </Button>
            </Stack>
        </Box>
    );
};