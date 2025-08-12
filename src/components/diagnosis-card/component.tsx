import { Box, Paper, TextField, Typography, IconButton } from "@mui/material";
import { FC, useState } from "react";
import { DividerFormWrapper } from "../create-leaves-form/style";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { AddDiagnosticWrapper, InputsWrapper, InputWrapper } from "./style";

interface DiagnosisEntry {
    id: number;
    diagnosisType: string;
    complaintHistory: string;
}

export const DiagnosisCard: FC = () => {
    const [diagnosisEntries, setDiagnosisEntries] = useState<DiagnosisEntry[]>(
        [{ id: 1, diagnosisType: '', complaintHistory: '' }]
    );
    const [nextId, setNextId] = useState(2);

    const handleAddEntry = () => {
        const newEntry: DiagnosisEntry = {
            id: nextId,
            diagnosisType: '',
            complaintHistory: ''
        };
        setDiagnosisEntries([...diagnosisEntries, newEntry]);
        setNextId(nextId + 1);
    };

    const handleDeleteEntry = (id: number) => {
        if (diagnosisEntries.length > 1) {
            setDiagnosisEntries(diagnosisEntries.filter(entry => entry.id !== id));
        }
    };

    const handleInputChange = (id: number, field: 'diagnosisType' | 'complaintHistory', value: string) => {
        setDiagnosisEntries(diagnosisEntries.map(entry => 
            entry.id === id ? { ...entry, [field]: value } : entry
        ));
    };

    return (
        <Paper sx={{ marginTop: 2, padding: 3 }}>
            <AddDiagnosticWrapper>
                <Typography variant="h5" fontWeight={600}>
                    Diagnosis
                </Typography>
                <IconButton 
                    onClick={handleAddEntry}
                    color="primary"
                >
                    <AddIcon />
                </IconButton>
            </AddDiagnosticWrapper>
            
            <DividerFormWrapper />

            {diagnosisEntries.map((entry, index) => (
                <Box key={entry.id} sx={{ mb: 3 }}>
                    <AddDiagnosticWrapper>
                        <Typography variant="h6" color="#000" fontWeight={500}>
                            Diagnosis #{index + 1}
                        </Typography>
                        {diagnosisEntries.length > 1 && (
                            <IconButton 
                                onClick={() => handleDeleteEntry(entry.id)}
                                color="error"
                                size="small"
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}
                    </AddDiagnosticWrapper>

                    <InputsWrapper>
                        <InputWrapper>
                            <Typography variant="body2" gutterBottom fontWeight={500}>
                                Diagnosis Type
                            </Typography>
                            <TextField
                                fullWidth
                                rows={4}
                                placeholder="Enter diagnosis type"
                                variant="outlined"
                                value={entry.diagnosisType}
                                onChange={(e) => handleInputChange(entry.id, 'diagnosisType', e.target.value)}
                            />
                        </InputWrapper>

                        <InputWrapper>
                            <Typography variant="body2" gutterBottom fontWeight={500}>
                                Complaint History
                            </Typography>
                            <TextField
                                fullWidth
                                rows={4}
                                placeholder="Enter complaint history"
                                variant="outlined"
                                value={entry.complaintHistory}
                                onChange={(e) => handleInputChange(entry.id, 'complaintHistory', e.target.value)}
                            />
                        </InputWrapper>
                    </InputsWrapper>
                </Box>
            ))}
        </Paper>
    );
};