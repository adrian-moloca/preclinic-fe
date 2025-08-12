import React from "react";
import {
    Grid,
    TextField,
    Typography,
    InputAdornment,
    Paper,
} from "@mui/material";
import { DividerFormWrapper } from "../create-leaves-form/style";
import { InputsWrapper, StyledGrid } from "./style";

const vitals = [
    { label: "Temperature", unit: "F" },
    { label: "Pulse", unit: "mmHg" },
    { label: "Respiratory Rate", unit: "rpm" },
    { label: "SPO2", unit: "%" },
    { label: "Height", unit: "cm" },
    { label: "Weight", unit: "kg" },
    { label: "BMI", unit: "%" },
    { label: "Waist", unit: "cm" },
    { label: "Weight", unit: "kg" },
];

export const VitalsForm: React.FC = () => {
    return (
        <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
                Vitals
            </Typography>
            <DividerFormWrapper />
            <InputsWrapper>
                <StyledGrid container spacing={2}>
                    {vitals.map((vital, index) => (
                        <Grid key={index}>
                            <Typography variant="body2" gutterBottom>
                                {vital.label}
                            </Typography>
                            <TextField
                                fullWidth
                                sx={{ width: "300px" }}
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">{vital.unit}</InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                            />
                        </Grid>
                    ))}
                </StyledGrid>
            </InputsWrapper>
        </Paper>
    );
};