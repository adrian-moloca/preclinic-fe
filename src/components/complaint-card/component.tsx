import { Paper, TextField, Typography } from "@mui/material";
import { FC } from "react";
import { DividerFormWrapper } from "../create-leaves-form/style";

export const ComplaintCard: FC = () => {
    return (
        <Paper sx={{ marginTop: 2, padding: 2 }}>
            <Typography variant="h5" fontWeight={600}>Complaint</Typography>
            <DividerFormWrapper />
            <TextField
                fullWidth
                rows={4}
                variant="outlined"
                placeholder="Describe patient complaint"
            />
        </Paper>
    )
}