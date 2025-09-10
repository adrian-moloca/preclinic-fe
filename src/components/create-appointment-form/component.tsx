import {
    Box,
    Button,
    MenuItem,
    TextField,
    Avatar,
    Typography,
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { FormFieldWrapper } from "../create-patient-form/style";
import { useAppointmentsContext } from "../../providers/appointments";
import { usePatientsContext } from "../../providers/patients";
import { IDepartments, useDepartmentsContext } from "../../providers/departments";
import { useNavigate } from "react-router-dom";
import { PaperFormWrapper } from "../create-leaves-form/style";

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

interface CreateAppointmentFormProps {
    defaultDate?: string;
    defaultTime?: string;
    onSave?: () => void;
    onCancel?: () => void;
    embedded?: boolean;
}

export const CreateAppointmentForm: FC<CreateAppointmentFormProps> = ({
    defaultDate,
    defaultTime,
    onSave,
    onCancel,
    embedded = false
}) => {
    const { addAppointment } = useAppointmentsContext();
    const { patients } = usePatientsContext();
    const { departments } = useDepartmentsContext();
    const navigate = useNavigate();

    const patientsArray: Patient[] = Array.isArray(patients)
        ? (patients as unknown as Patient[])
        : Array.isArray((Object.values(patients)[0] as unknown as Patient[]))
            ? (Object.values(patients)[0] as unknown as Patient[])
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
        date: defaultDate || "", 
        time: defaultTime || "", 
        reason: "",
        status: "scheduled",
        department: undefined,
    });

    useEffect(() => {
        if (defaultDate) {
            setAppointment(prev => ({ ...prev, date: defaultDate }));
        }
        if (defaultTime) {
            setAppointment(prev => ({ ...prev, time: defaultTime }));
        }
    }, [defaultDate, defaultTime]);

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

        if (embedded && onSave) {
            onSave();
        } else {
            setAppointment({
                id: generateId(),
                patientId: "",
                appointmentType: "",
                type: "",
                date: defaultDate || "",
                time: defaultTime || "",
                reason: "",
                status: "scheduled",
                department: undefined,
            });
            navigate("/appointments/all");
        }
    };

    const handleCancel = () => {
        if (embedded && onCancel) {
            onCancel();
        } else {
            navigate("/appointments/all");
        }
    };

    const isFormValid =
        appointment.patientId !== "" &&
        appointment.appointmentType !== "" &&
        appointment.type !== "" &&
        appointment.date !== "" &&
        appointment.time !== "" &&
        appointment.reason !== "" &&
        appointment.status !== "" &&
        appointment.department;

    const FormWrapper = embedded ? Box : PaperFormWrapper;
    const wrapperProps = embedded ? {} : { elevation: 3 };

    return (
        <Box>
            <FormWrapper {...wrapperProps}>
                {!embedded && (
                    <Typography variant="h4" textAlign="center" mb={3}>
                        Create Appointment
                    </Typography>
                )}

                <Box>
                    <FormFieldWrapper>
                        <TextField
                            select
                            label="Patient"
                            value={appointment.patientId}
                            onChange={(e) => handleChange("patientId", e.target.value)}
                            error={errors.patientId}
                            helperText={errors.patientId && "Patient is required"}
                            fullWidth
                            sx={{ width: embedded ? "100%" : 500, marginY: 1 }}
                            required
                        >
                            {patientsArray.map((patient) => (
                                <MenuItem key={patient.id} value={patient.id}>
                                    <Box display="flex" alignItems="center">
                                        <Avatar
                                            src={patient.profileImg}
                                            sx={{ width: 30, height: 30, mr: 2 }}
                                        >
                                            {patient.firstName?.[0]}{patient.lastName?.[0]}
                                        </Avatar>
                                        <Typography>
                                            {patient.firstName} {patient.lastName}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Department"
                            value={appointment.department?.id || ""}
                            onChange={(e) => handleDepartmentChange(e.target.value)}
                            error={errors.department}
                            helperText={errors.department && "Department is required"}
                            fullWidth
                            sx={{ width: embedded ? "100%" : 500, marginY: 1 }}
                            required
                        >
                            {departmentsArray.map((department) => (
                                <MenuItem key={department.id} value={department.id}>
                                    {department.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Appointment Type"
                            value={appointment.appointmentType}
                            onChange={(e) => handleChange("appointmentType", e.target.value)}
                            error={errors.appointmentType}
                            helperText={errors.appointmentType && "Appointment type is required"}
                            fullWidth
                            sx={{ width: embedded ? "100%" : 500, marginY: 1 }}
                            required
                        >
                            {appointmentTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Consultation Type"
                            value={appointment.type}
                            onChange={(e) => handleChange("type", e.target.value)}
                            error={errors.type}
                            helperText={errors.type && "Consultation type is required"}
                            fullWidth
                            sx={{ width: embedded ? "100%" : 500, marginY: 1 }}
                            required
                        >
                            {consultationTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Status"
                            value={appointment.status}
                            onChange={(e) => handleChange("status", e.target.value)}
                            error={errors.status}
                            helperText={errors.status && "Status is required"}
                            fullWidth
                            sx={{ width: embedded ? "100%" : 500, marginY: 1 }}
                            required
                        >
                            {appointmentStatuses.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
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
                            sx={{ width: embedded ? "100%" : 500, marginY: 1 }}
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
                            sx={{ width: embedded ? "100%" : 500, marginY: 1 }}
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
                            sx={{ width: embedded ? "100%" : 500, marginY: 1 }}
                            multiline
                            rows={3}
                            required
                        />
                    </FormFieldWrapper>
                </Box>

                <Box display="flex" justifyContent="center" gap={2} mt={3}>
                    {embedded && (
                        <Button
                            variant="outlined"
                            onClick={handleCancel}
                            sx={{ width: 300 }}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        sx={{ width: 300 }}
                    >
                        Create Appointment
                    </Button>
                </Box>
            </FormWrapper>
        </Box>
    );
};