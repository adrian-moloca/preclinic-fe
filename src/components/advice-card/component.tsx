import { Paper, TextField, Typography } from "@mui/material";
import { FC } from "react";
import { DividerFormWrapper } from "../create-leaves-form/style";

export const AdviceCard: FC = () => {
    return (
        <Paper sx={{ marginTop: 2, padding: 2 }}>
            <Typography variant="h5" fontWeight={600}>Advice</Typography>
            <DividerFormWrapper />
            <TextField
                fullWidth
                rows={4}
                variant="outlined"
                placeholder="Provide advice to the patient"
            />
        </Paper>
    )
}