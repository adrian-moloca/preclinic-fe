import { Box, IconButton, Paper, TextField, Typography } from "@mui/material";
import { FC, useState } from "react";
import { DividerFormWrapper } from "../create-leaves-form/style";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface InvestigationEntry {
    id: number;
    description: string;
}

export const InvestigationsAndProcedures: FC = () => {
    const [investigationEntries, setInvestigationEntries] = useState<InvestigationEntry[]>([
        { id: 1, description: '' }
    ]);
    const [nextId, setNextId] = useState(2);

    const handleAddEntry = () => {
        const newEntry: InvestigationEntry = {
            id: nextId,
            description: ''
        };
        setInvestigationEntries([...investigationEntries, newEntry]);
        setNextId(nextId + 1);
    };

    const handleDeleteEntry = (id: number) => {
        if (investigationEntries.length > 1) {
            setInvestigationEntries(investigationEntries.filter(entry => entry.id !== id));
        }
    };

    const handleInputChange = (id: number, value: string) => {
        setInvestigationEntries(investigationEntries.map(entry => 
            entry.id === id ? { ...entry, description: value } : entry
        ));
    };

    return (
        <Paper sx={{ marginTop: 2, padding: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight={600}>
                    Investigations & Procedures
                </Typography>
                <IconButton 
                    onClick={handleAddEntry}
                    color="primary"
                >
                    <AddIcon />
                </IconButton>
            </Box>
            
            <DividerFormWrapper />

            {investigationEntries.map((entry, index) => (
                <Box key={entry.id} sx={{ mb: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" color="#000" fontWeight={500}>
                            Investigation #{index + 1}
                        </Typography>
                        {investigationEntries.length > 1 && (
                            <IconButton 
                                onClick={() => handleDeleteEntry(entry.id)}
                                color="error"
                                size="small"
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>

                    <TextField
                        fullWidth
                        rows={4}
                        variant="outlined"
                        placeholder="Describe investigations and procedures..."
                        value={entry.description}
                        onChange={(e) => handleInputChange(entry.id, e.target.value)}
                    />
                </Box>
            ))}
        </Paper>
    );
};