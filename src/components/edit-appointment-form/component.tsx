import {
    Box,
    Button,
    MenuItem,
    TextField,
    Avatar,
    Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppointmentsContext } from "../../providers/appointments";
import { usePatientsContext } from "../../providers/patients";
import { FormFieldWrapper } from "../create-patient-form/style";
import { DividerFormWrapper, PaperFormWrapper } from "../create-leaves-form/style";
import { AppointmentsEntry } from "../../providers/appointments/types";
import { PatientsEntry } from "../../providers/patients/types";

export const EditAppointmentForm: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { appointments, updateAppointment } = useAppointmentsContext();
    const { patients } = usePatientsContext();

    const patientsArray: PatientsEntry[] = Array.isArray(patients)
        ? patients
        : (Array.isArray(Object.values(patients)[0]) ? Object.values(patients)[0] as PatientsEntry[] : []);

    const [appointment, setAppointment] = useState<AppointmentsEntry | null>(null);
    const [errors, setErrors] = useState({
        patientId: false,
        appointmentType: false,
        date: false,
        time: false,
        reason: false,
    });

    useEffect(() => {
        const appointmentsArray: AppointmentsEntry[] = Array.isArray(appointments)
            ? (appointments as AppointmentsEntry[])
            : (Array.isArray(Object.values(appointments)[0]) ? (Object.values(appointments)[0] as AppointmentsEntry[]) : []);
        const found = appointmentsArray.find((appt: AppointmentsEntry) => appt.id === id);
        if (found) {
            setAppointment(found);
        }
    }, [id, appointments]);

    const handleChange = (field: keyof AppointmentsEntry, value: any) => {
        if (!appointment) return;

        setAppointment((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                [field]: value,
            };
        });

        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    const handleSubmit = () => {
        if (!appointment) return;

        const updatedAppointment: AppointmentsEntry = {
            ...appointment,
            patients: [appointment.patientId],
        };

        updateAppointment(updatedAppointment);
        navigate("/appointments/all");
    };

    if (!appointment) return <Box>Loading...</Box>;

    const isFormValid =
        appointment.patientId !== "" &&
        appointment.appointmentType !== "" &&
        appointment.date !== "" &&
        appointment.time !== "" &&
        appointment.reason !== "";

    const menuProps = {
        PaperProps: {
            style: {
                maxHeight: 224,
                width: 250,
            },
        },
    };

    return (
        <Box display={"flex"} justifyContent={"center"}>
            <PaperFormWrapper>
                <Typography variant="h4">Edit Appointment</Typography>
                <DividerFormWrapper />
                <FormFieldWrapper>
                    <TextField
                        label="Appointment ID"
                        value={appointment.id}
                        fullWidth
                        disabled
                        sx={{ width: 500, marginY: 1 }}
                    />

                    <TextField
                        select
                        label="Select Patient"
                        value={appointment.patientId}
                        onChange={(e) => handleChange("patientId", e.target.value)}
                        error={errors.patientId}
                        helperText={errors.patientId && "Please select a patient"}
                        fullWidth
                        sx={{ width: 500, marginY: 1 }}
                        required
                        SelectProps={{
                            MenuProps: menuProps,
                            renderValue: (selected) => {
                                if (!selected) return <em>Select a patient</em>;
                                const patient = patientsArray.find((p) => p._id === selected);
                                return patient ? `${patient.firstName} ${patient.lastName}` : "";
                            },
                        }}
                    >
                        {patientsArray.length > 0 ? (
                            patientsArray.map((patient: PatientsEntry) => (
                                <MenuItem
                                    key={patient._id}
                                    value={patient._id}
                                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                                >
                                    <Avatar
                                        alt={`${patient.firstName} ${patient.lastName}`}
                                        src={patient.profileImg || ""}
                                        sx={{ width: 30, height: 30 }}
                                    />
                                    {patient.firstName} {patient.lastName}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No patients available</MenuItem>
                        )}
                    </TextField>

                    <TextField
                        select
                        label="Appointment Type"
                        value={appointment.appointmentType}
                        onChange={(e) => handleChange("appointmentType", e.target.value)}
                        error={errors.appointmentType}
                        helperText={errors.appointmentType && "Please select an appointment type"}
                        fullWidth
                        sx={{ width: 500, marginY: 1 }}
                        required
                        SelectProps={{ MenuProps: menuProps }}
                    >
                        <MenuItem value="Consultation">In person</MenuItem>
                        <MenuItem value="Online">Online</MenuItem>
                    </TextField>

                    <TextField
                        type="date"
                        label="Date"
                        value={appointment.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                        error={errors.date}
                        helperText={errors.date && "Date is required"}
                        fullWidth
                        sx={{ width: 500, marginY: 1 }}
                        InputLabelProps={{ shrink: true }}
                        required
                    />

                    <TextField
                        type="time"
                        label="Time"
                        value={appointment.time}
                        onChange={(e) => handleChange("time", e.target.value)}
                        error={errors.time}
                        helperText={errors.time && "Time is required"}
                        fullWidth
                        sx={{ width: 500, marginY: 1 }}
                        InputLabelProps={{ shrink: true }}
                        required
                    />

                    <TextField
                        label="Reason"
                        value={appointment.reason}
                        onChange={(e) => handleChange("reason", e.target.value)}
                        error={errors.reason}
                        helperText={errors.reason && "Reason is required"}
                        fullWidth
                        sx={{ width: 500, marginY: 1 }}
                        rows={3}
                        required
                    />
                </FormFieldWrapper>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                >
                    Save Changes
                </Button>
            </PaperFormWrapper>
        </Box>
    );
};
