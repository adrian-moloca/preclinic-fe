import {
    Box,
    Typography,
    Paper,
    FormControl,
    Select,
    MenuItem,
    TextField,
    IconButton,
    Divider,
    Grid
} from "@mui/material";
import { FC, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { frequencyOptions, medicationOptions, timingOptions } from "../../mock/medications";

interface MedicationEntry {
    id: number;
    medicationName: string;
    dosage: string;
    dosageUnit: 'mg' | 'ml';
    frequency: string;
    timing: string;
    instructions: string;
}

export const MedicationsCard: FC = () => {
    const [medicationEntries, setMedicationEntries] = useState<MedicationEntry[]>(
        [{
            id: 1,
            medicationName: '',
            dosage: '',
            dosageUnit: 'mg',
            frequency: '',
            timing: '',
            instructions: ''
        }]
    );
    const [nextId, setNextId] = useState(2);

    const handleAddEntry = () => {
        const newEntry: MedicationEntry = {
            id: nextId,
            medicationName: '',
            dosage: '',
            dosageUnit: 'mg',
            frequency: '',
            timing: '',
            instructions: ''
        };
        setMedicationEntries([...medicationEntries, newEntry]);
        setNextId(nextId + 1);
    };

    const handleDeleteEntry = (id: number) => {
        if (medicationEntries.length > 1) {
            setMedicationEntries(medicationEntries.filter(entry => entry.id !== id));
        }
    };

    const handleInputChange = (
        id: number,
        field: keyof MedicationEntry,
        value: string | 'mg' | 'ml'
    ) => {
        setMedicationEntries(medicationEntries.map(entry =>
            entry.id === id ? { ...entry, [field]: value } : entry
        ));
    };

    return (
        <Paper sx={{ marginTop: 2, padding: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight={600}>
                    Medications
                </Typography>
                <IconButton
                    onClick={handleAddEntry}
                    color="primary"
                >
                    <AddIcon />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {medicationEntries.map((entry, index) => (
                <Box key={entry.id} sx={{ mb: 4 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" color="#000" fontWeight={500}>
                            Prescription #{index + 1}
                        </Typography>
                        {medicationEntries.length > 1 && (
                            <IconButton
                                onClick={() => handleDeleteEntry(entry.id)}
                                color="error"
                                size="small"
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>

                    <Grid container spacing={3}>
                        <Grid>
                            <FormControl fullWidth required sx={{ width: "200px" }}>
                                <Typography>Medication Name</Typography>
                                <Select
                                    value={entry.medicationName}
                                    label="Medication Name"
                                    onChange={(e) => handleInputChange(entry.id, 'medicationName', e.target.value)}
                                >
                                    {medicationOptions.map((medication) => (
                                        <MenuItem key={medication} value={medication}>
                                            {medication}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid>
                            <Box display="flex" gap={1} alignItems="center">
                                <Box>
                                    <Typography>Dosage</Typography>
                                    <TextField
                                        value={entry.dosage}
                                        onChange={(e) => handleInputChange(entry.id, 'dosage', e.target.value)}
                                        type="number"
                                        sx={{ flex: 2, width: "200px" }}
                                        required
                                    />
                                </Box>
                                <FormControl sx={{
                                    width: "90px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }} required>
                                    <Typography>Unit</Typography>
                                    <Select
                                        value={entry.dosageUnit}
                                        onChange={(e) => handleInputChange(entry.id, 'dosageUnit', e.target.value as 'mg' | 'ml')}
                                        sx={{
                                            textAlign: "center",
                                            '& .MuiSelect-select': {
                                                textAlign: "center"
                                            }
                                        }}
                                    >
                                        <MenuItem value="mg">mg</MenuItem>
                                        <MenuItem value="ml">ml</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>

                        <Grid>
                            <FormControl fullWidth required sx={{ width: "200px" }}>
                                <Typography>Frequency</Typography>
                                <Select
                                    value={entry.frequency}
                                    onChange={(e) => handleInputChange(entry.id, 'frequency', e.target.value)}
                                >
                                    {frequencyOptions.map((frequency) => (
                                        <MenuItem key={frequency} value={frequency}>
                                            {frequency}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid>
                            <FormControl fullWidth required sx={{ width: "200px" }}>
                                <Typography>Timing</Typography>
                                <Select
                                    value={entry.timing}
                                    onChange={(e) => handleInputChange(entry.id, 'timing', e.target.value)}
                                >
                                    {timingOptions.map((timing) => (
                                        <MenuItem key={timing} value={timing}>
                                            {timing}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid>
                            <Typography>Instructions</Typography>
                            <TextField
                                fullWidth
                                rows={3}
                                value={entry.instructions}
                                onChange={(e) => handleInputChange(entry.id, 'instructions', e.target.value)}
                                placeholder="Enter additional instructions for the patient..."
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                    width: "200px"
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            ))}
        </Paper>
    );
};