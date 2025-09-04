import React, { FC } from "react";
import { Card, CardContent, Typography, Grid, TextField, MenuItem, Box } from "@mui/material";
import { DepartmentEntry } from "../../component";
import { IInvoice } from "../../../../providers/invoices";

interface DepartmentPaymentInfoProps {
    formData: Partial<IInvoice>;
    departmentsArray: DepartmentEntry[];
    errors: Record<string, string>;
    onInputChange: (field: string, value: string) => void;
}

export const DepartmentPaymentInfo: FC<DepartmentPaymentInfoProps> = ({
    formData,
    departmentsArray,
    errors,
    onInputChange
}) => {
    return (
        <Card variant="outlined" sx={{ mb: 4, border: "1px solid #e8e8e8" }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: "#424242" }}>
                    Department & Payment Details
                </Typography>
                <Grid container spacing={3} sx={{ width: '100%', display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                    <Grid>
                        <TextField
                            select
                            fullWidth
                            label="Department"
                            value={formData.department}
                            onChange={(e) => onInputChange("department", e.target.value)}
                            error={!!errors.department}
                            helperText={errors.department}
                            variant="outlined"
                            sx={{ width: 250 }}
                        >
                            {departmentsArray.map((department) => (
                                <MenuItem key={department.id} value={department.name}>
                                    <Box>
                                        <Typography variant="body2" fontWeight={500}>
                                            {department.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {department.description}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    
                    <Grid>
                        <TextField
                            select
                            fullWidth
                            label="Payment Method"
                            value={formData.paymentMethod}
                            onChange={(e) => onInputChange("paymentMethod", e.target.value)}
                            error={!!errors.paymentMethod}
                            helperText={errors.paymentMethod}
                            variant="outlined"
                            sx={{ width: 250 }}
                        >
                            <MenuItem value="Cash">Cash</MenuItem>
                            <MenuItem value="Card">Credit/Debit Card</MenuItem>
                            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                            <MenuItem value="Insurance">Insurance</MenuItem>
                            <MenuItem value="Check">Check</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid>
                        <TextField
                            select
                            fullWidth
                            label="Payment Status"
                            value={formData.paymentStatus}
                            onChange={(e) => onInputChange("paymentStatus", e.target.value)}
                            variant="outlined"
                            sx={{ width: 250 }}
                        >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Paid">Paid</MenuItem>
                            <MenuItem value="Overdue">Overdue</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </TextField>
                    </Grid>
                    
                    <Grid>
                        <TextField
                            fullWidth
                            label="Tax (%)"
                            type="number"
                            value={formData.tax}
                            onChange={(e) => onInputChange("tax", e.target.value)}
                            inputProps={{ min: 0, max: 100, step: 0.1 }}
                            variant="outlined"
                            sx={{ width: 250 }}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};