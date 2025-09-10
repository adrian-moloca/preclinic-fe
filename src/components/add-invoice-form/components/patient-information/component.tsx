// src/components/add-invoice-form/patient-information/component.tsx
import React, { FC } from "react";
import { Card, CardContent, Typography, Grid, TextField, MenuItem, Avatar, Box } from "@mui/material";
import { IInvoice } from "../../../../providers/invoices/types";
import { PatientsEntry } from "../../../../providers/patients/types";
import { AppointmentsEntry } from "../../../../providers/appointments/types";

interface PatientInformationProps {
    formData: Partial<IInvoice>;
    selectedPatient: PatientsEntry | null;
    patientsArray: PatientsEntry[];
    filteredAppointments: AppointmentsEntry[];
    appointmentFilter: string;
    errors: Record<string, string>;
    onPatientChange: (patient: PatientsEntry | null) => void;
    onInputChange: (field: string, value: string) => void;
    onAppointmentFilterChange: (filter: string) => void;
}

export const PatientInformation: FC<PatientInformationProps> = ({
    formData,
    selectedPatient,
    patientsArray,
    filteredAppointments,
    appointmentFilter,
    errors,
    onPatientChange,
    onInputChange,
    onAppointmentFilterChange
}) => {
    const handlePatientSelection = (patientId: string) => {
        const patient = patientsArray.find(p => p.id === patientId) || null;
        onPatientChange(patient);
    };

    return (
        <Card variant="outlined" sx={{ mb: 4, border: "1px solid #e8e8e8" }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: "#424242" }}>
                    Patient Information
                </Typography>
                <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
                    <Grid>
                        <TextField
                            select
                            fullWidth
                            label="Select Patient"
                            value={formData.patientId || ""}
                            onChange={(e) => handlePatientSelection(e.target.value)}
                            error={!!errors.patientId}
                            helperText={errors.patientId}
                            variant="outlined"
                            sx={{ width: 340 }}
                            SelectProps={{
                                renderValue: (selected) => {
                                    if (!selected) return <em>Select a patient</em>;
                                    const patient = patientsArray.find(p => p.id === selected);
                                    return patient ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar 
                                                src={patient.profileImg} 
                                                sx={{ width: 24, height: 24, mr: 1 }}
                                            />
                                            <Typography>
                                                {patient.firstName} {patient.lastName}
                                            </Typography>
                                        </Box>
                                    ) : <span>{String(selected)}</span>;
                                }
                            }}
                        >
                            {patientsArray.map((patient) => (
                                <MenuItem key={patient.id} value={patient.id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar 
                                            src={patient.profileImg} 
                                            sx={{ width: 32, height: 32, mr: 2 }}
                                        />
                                        <Box>
                                            <Typography>{patient.firstName} {patient.lastName}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {patient.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid>
                        <TextField
                            fullWidth
                            label="Patient Name"
                            value={formData.patientName || ""}
                            onChange={(e) => onInputChange("patientName", e.target.value)}
                            error={!!errors.patientName}
                            helperText={errors.patientName}
                            variant="outlined"
                            sx={{ width: 340 }}
                            disabled={!!selectedPatient}
                        />
                    </Grid>
                    <Grid>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={formData.email || ""}
                            onChange={(e) => onInputChange("email", e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                            variant="outlined"
                            sx={{ width: 340 }}
                            disabled={!!selectedPatient}
                        />
                    </Grid>
                    <Grid>
                        <TextField
                            fullWidth
                            label="Patient Address"
                            value={formData.patientAddress || ""}
                            onChange={(e) => onInputChange("patientAddress", e.target.value)}
                            variant="outlined"
                            sx={{ width: 340 }}
                            disabled={!!selectedPatient}
                        />
                    </Grid>
                    <Grid>
                        <TextField
                            select
                            fullWidth
                            label="Related Appointment"
                            value={formData.appointment || ""}
                            onChange={(e) => onInputChange("appointment", e.target.value)}
                            variant="outlined"
                            sx={{ width: 340 }}
                            disabled={filteredAppointments.length === 0}
                        >
                            {filteredAppointments.map((appointment) => (
                                <MenuItem key={appointment.id} value={appointment.id}>
                                    {appointment.date} at {appointment.time} - {appointment.reason}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid>
                        <TextField
                            fullWidth
                            label="Search Appointments"
                            value={appointmentFilter}
                            onChange={(e) => onAppointmentFilterChange(e.target.value)}
                            placeholder="Filter appointments by ID or reason"
                            variant="outlined"
                            sx={{ width: 340 }}
                            disabled={!selectedPatient}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};