import React, { FC } from "react";
import { Card, CardContent, Typography, Grid, TextField } from "@mui/material";
import { IInvoice } from "../../../../providers/invoices";

interface InvoiceBasicInfoProps {
    formData: Partial<IInvoice>;
    errors: Record<string, string>;
    onInputChange: (field: keyof IInvoice) => (event: any) => void;
    isEdit?: boolean;
}

export const InvoiceBasicInfo: FC<InvoiceBasicInfoProps> = ({
    formData,
    errors,
    onInputChange,
    isEdit = false
}) => {
    return (
        <Card variant="outlined" sx={{ mb: 4, border: "1px solid #e8e8e8" }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: "#424242" }}>
                    Invoice Information
                </Typography>
                <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
                    <Grid>
                        <TextField
                            fullWidth
                            label="Invoice Number"
                            value={formData.invoiceNumber}
                            onChange={onInputChange("invoiceNumber")}
                            disabled
                            variant="outlined"
                            sx={{ width: "340px" }}
                            helperText={isEdit ? "Invoice number cannot be changed" : ""}
                        />
                    </Grid>
                    <Grid>
                        <TextField
                            fullWidth
                            label="Invoice Date"
                            type="date"
                            value={formData.invoiceDate}
                            onChange={onInputChange("invoiceDate")}
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.invoiceDate}
                            helperText={errors.invoiceDate}
                            variant="outlined"
                            sx={{ width: "340px" }}
                        />
                    </Grid>
                    <Grid>
                        <TextField
                            fullWidth
                            label="Due Date"
                            type="date"
                            value={formData.dueDate}
                            onChange={onInputChange("dueDate")}
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.dueDate}
                            helperText={errors.dueDate}
                            variant="outlined"
                            sx={{ width: "340px" }}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};