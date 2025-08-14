import {
    Box,
    Button,
    MenuItem,
    TextField,
    Avatar,
    Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FormFieldWrapper } from "../create-patient-form/style";
import { useAppointmentsContext } from "../../providers/appointments";
import { usePatientsContext } from "../../providers/patients";
import { IDepartments, useDepartmentsContext } from "../../providers/departments";
import { useNavigate } from "react-router-dom";
import { DividerFormWrapper, PaperFormWrapper } from "../create-leaves-form/style";

interface Patient {
    id: string;
    profileImg?: string;
    firstName: string;
    lastName: string;
}

interface Appointment {
    id: string;
    patientId: string;
    appointmentType: string;
    type: string;
    date: string;
    time: string;
    reason: string;
    status?: string;
    department?: IDepartments;
}

const appointmentTypes = [
    "In person",
    "Online"
];

const consultationTypes = [
    "consultation",
    "follow-up",
    "emergency",
    "routine",
    "procedure",
    "checkup"
];

const appointmentStatuses = [
    "scheduled",
    "confirmed",
    "in_progress",
    "completed",
    "cancelled",
    "no_show"
];

export const CreateAppointmentForm: FC = () => {
    const { addAppointment } = useAppointmentsContext();
    const { patients } = usePatientsContext();
    const { departments } = useDepartmentsContext(); // <-- get departments
    const navigate = useNavigate();

    const patientsArray: Patient[] = Array.isArray(patients)
        ? (patients as Patient[])
        : Array.isArray((Object.values(patients)[0] as Patient[]))
            ? (Object.values(patients)[0] as Patient[])
            : [];

    const departmentsArray: IDepartments[] = Array.isArray(departments)
        ? departments
        : Array.isArray((Object.values(departments)[0] as IDepartments[]))
            ? (Object.values(departments)[0] as IDepartments[])
            : [];

    const generateId = () => uuidv4();

    const [appointment, setAppointment] = useState<Appointment>({
        id: generateId(),
        patientId: "",
        appointmentType: "",
        type: "",
        date: "",
        time: "",
        reason: "",
        status: "scheduled",
        department: undefined,
    });

    const [errors, setErrors] = useState({
        patientId: false,
        appointmentType: false,
        type: false,
        date: false,
        time: false,
        reason: false,
        status: false,
        department: false,
    });

    const handleChange = (field: keyof Appointment, value: any) => {
        setAppointment((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: false,
        }));
    };

    const handleDepartmentChange = (departmentId: string) => {
        const selectedDepartment = departmentsArray.find(dep => dep.id === departmentId);
        handleChange("department", selectedDepartment || undefined);
    };

    const handleSubmit = () => {
        const newErrors = {
            patientId: appointment.patientId === "",
            appointmentType: appointment.appointmentType === "",
            type: appointment.type === "",
            date: appointment.date === "",
            time: appointment.time === "",
            reason: appointment.reason === "",
            status: appointment.status === "",
            department: !appointment.department,
        };

        const hasErrors = Object.values(newErrors).some(Boolean);

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        if (appointment.department) {
            addAppointment({
                ...appointment,
                patients: [appointment.patientId],
                status: appointment.status || "scheduled",
                department: appointment.department,
            });
        }

        setAppointment({
            id: generateId(),
            patientId: "",
            appointmentType: "",
            type: "",
            date: "",
            time: "",
            reason: "",
            status: "scheduled",
            department: undefined,
        });

        navigate("/appointments/all");
    };

    const isFormValid =
        appointment.patientId !== "" &&
        appointment.appointmentType !== "" &&
        appointment.type !== "" &&
        appointment.date !== "" &&
        appointment.time !== "" &&
        appointment.reason !== "" &&
        appointment.status !== "" &&
        !!appointment.department;

    const menuProps = {
        PaperProps: {
            style: {
                maxHeight: 224,
                width: 250,
            },
        },
    };

    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ');
    };

    return (
        <Box display={"flex"} justifyContent={"center"}>
            <PaperFormWrapper>
                <Typography variant="h4" gutterBottom>
                    Create Appointment
                </Typography>

                <DividerFormWrapper />

                <Box display="flex" flexDirection="column" alignItems="center">
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
                                    const patient = patientsArray.find(
                                        (p: Patient) => p.id === selected
                                    );
                                    return patient
                                        ? `${patient.firstName} ${patient.lastName}`
                                        : "";
                                },
                            }}
                        >
                            {patientsArray.length > 0 ? (
                                patientsArray.map((patient: Patient) => (
                                    <MenuItem
                                        key={patient.id}
                                        value={patient.id}
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
                            label="Department"
                            value={appointment.department?.id || ""}
                            onChange={(e) => handleDepartmentChange(e.target.value)}
                            error={errors.department}
                            helperText={errors.department && "Please select a department"}
                            fullWidth
                            sx={{ width: 500, marginY: 1 }}
                            required
                            SelectProps={{
                                MenuProps: menuProps,
                            }}
                        >
                            {departmentsArray.length > 0 ? (
                                departmentsArray.map((dep: IDepartments) => (
                                    <MenuItem key={dep.id} value={dep.id}>
                                        {dep.name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No departments available</MenuItem>
                            )}
                        </TextField>

                        <TextField
                            select
                            label="Appointment Type"
                            value={appointment.appointmentType}
                            onChange={(e) => handleChange("appointmentType", e.target.value)}
                            error={errors.appointmentType}
                            helperText={
                                errors.appointmentType && "Please select an appointment type"
                            }
                            fullWidth
                            sx={{ width: 500, marginY: 1 }}
                            required
                            SelectProps={{
                                MenuProps: menuProps,
                            }}
                        >
                            {appointmentTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Type"
                            value={appointment.type}
                            onChange={(e) => handleChange("type", e.target.value)}
                            error={errors.type}
                            helperText={
                                errors.type && "Please select a type"
                            }
                            fullWidth
                            sx={{ width: 500, marginY: 1 }}
                            required
                            SelectProps={{
                                MenuProps: menuProps,
                            }}
                        >
                            {consultationTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {capitalizeFirstLetter(type)}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Status"
                            value={appointment.status}
                            onChange={(e) => handleChange("status", e.target.value)}
                            error={errors.status}
                            helperText={errors.status && "Please select a status"}
                            fullWidth
                            sx={{ width: 500, marginY: 1 }}
                            required
                            SelectProps={{
                                MenuProps: menuProps,
                            }}
                        >
                            {appointmentStatuses.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {capitalizeFirstLetter(status)}
                                </MenuItem>
                            ))}
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
                </Box>

                <Box display="flex" justifyContent="center" mt={3}>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        sx={{ width: 300 }}
                    >
                        Create Appointment
                    </Button>
                </Box>
            </PaperFormWrapper>
        </Box>
    );
};