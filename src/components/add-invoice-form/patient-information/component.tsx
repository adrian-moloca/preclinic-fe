import React, { FC } from "react";
import { Card, CardContent, Typography, Grid, TextField, MenuItem, Avatar, Box } from "@mui/material";
import { IInvoice } from "../../../providers/invoices/types";
import { PatientsEntry } from "../../../providers/patients/types";
import { AppointmentsEntry } from "../../../providers/appointments/types";

interface PatientInformationProps {
    formData: Partial<IInvoice>;
    selectedPatient: PatientsEntry | null;
    patientsArray: PatientsEntry[];
    filteredAppointments: AppointmentsEntry[];
    appointmentFilter: string;
    errors: Record<string, string>;
    onPatientChange: (patientId: string) => void;
    onInputChange: (field: keyof IInvoice) => (event: any) => void;
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
                            value={formData.patientId}
                            onChange={(e) => onPatientChange(e.target.value)}
                            error={!!errors.patientId}
                            helperText={errors.patientId}
                            variant="outlined"
                            sx={{ width: 340 }}
                            SelectProps={{
                                renderValue: (selected) => {
                                    if (!selected) return <em>Select a patient</em>;
                                    const patient = patientsArray.find(p => p.id === selected);
                                    return patient ? `${patient.firstName} ${patient.lastName}` : "";
                                }
                            }}
                        >
                            {patientsArray.map((patient) => (
                                <MenuItem
                                    key={patient.id}
                                    value={patient.id}
                                    sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5 }}
                                >
                                    <Avatar
                                        src={patient.profileImg}
                                        alt={`${patient.firstName} ${patient.lastName}`}
                                        sx={{ width: 36, height: 36 }}
                                    >
                                        {patient.firstName[0]}{patient.lastName[0]}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body2" fontWeight={500}>
                                            {patient.firstName} {patient.lastName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {patient.email}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {selectedPatient && (
                        <Grid>
                            <TextField
                                fullWidth
                                label="Patient Address"
                                value={formData.patientAddress}
                                onChange={onInputChange("patientAddress")}
                                rows={3}
                                variant="outlined"
                                sx={{ width: 340 }}
                            />
                        </Grid>
                    )}

                    <Grid>
                        <TextField
                            select
                            fullWidth
                            label="Select Appointment"
                            value={formData.appointment}
                            onChange={onInputChange("appointment")}
                            disabled={filteredAppointments.length === 0}
                            variant="outlined"
                            sx={{ width: 340 }}
                        >
                            <MenuItem value="">
                                <em>No specific appointment</em>
                            </MenuItem>
                            {filteredAppointments.length === 0 && appointmentFilter ? (
                                <MenuItem disabled>
                                    <Typography variant="caption" color="text.secondary">
                                        No appointments match your search
                                    </Typography>
                                </MenuItem>
                            ) : (
                                filteredAppointments.map((appointment) => (
                                    <MenuItem key={appointment.id} value={appointment.id}>
                                        <Box>
                                            <Typography variant="body2" fontWeight={500}>
                                                {appointment.appointmentType} - {appointment.date}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {appointment.reason}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))
                            )}
                        </TextField>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};