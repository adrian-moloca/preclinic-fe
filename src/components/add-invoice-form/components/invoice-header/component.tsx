import React, { FC } from "react";
import { Box, Typography } from "@mui/material";

interface InvoiceHeaderProps {
    title?: string;
}

export const InvoiceHeader: FC<InvoiceHeaderProps> = ({ title = "Create Invoice" }) => {
    return (
        <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" fontWeight={700} sx={{ color: "#1a1a1a", mb: 1 }}>
                {title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                {title === "Edit Invoice" 
                    ? "Modify existing invoice details and update information"
                    : "Generate a new invoice for patient services and products"
                }
            </Typography>
        </Box>
    );
};