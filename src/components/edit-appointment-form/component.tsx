import {
    Box,
    Button,
    MenuItem,
    TextField,
    Avatar,
    Typography,
    CircularProgress,
} from "@mui/material";
import { FC, useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormFieldWrapper } from "../create-patient-form/style";
import { useAppointmentsContext } from "../../providers/appointments";
import { usePatientsContext } from "../../providers/patients";
import { IDepartments, useDepartmentsContext } from "../../providers/departments";
import { useAuthContext } from "../../providers/auth";
import { useAssistentsContext } from "../../providers/assistent";
import { PaperFormWrapper } from "../create-leaves-form/style";
import { useDoctorsContext } from "../../providers/doctor/context";

interface Patient {
    id: string;
    _id?: string;
    profileImg?: string;
    firstName: string;
    lastName: string;
}

interface Doctor {
    id: string;
    _id?: string;
    userId?: string;
    profileImg?: string;
    firstName: string;
    lastName: string;
    department: string;
}

interface Appointment {
    id?: string;
    patientId: string;
    doctorId: string;
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

export const EditAppointmentForm: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { 
        appointments,
        updateAppointment,
        fetchAppointments,
        hasLoaded: appointmentsHasLoaded
    } = useAppointmentsContext();
    const { user } = useAuthContext();
    const { 
        patients, 
        getAllPatients, 
        loading: patientsLoading,
        hasLoaded: patientsHasLoaded 
    } = usePatientsContext();
    const { 
        departments, 
        fetchDepartments, 
        loading: departmentsLoading,
        hasLoaded: departmentsHasLoaded 
    } = useDepartmentsContext();
    const {
        doctors,
        fetchDoctors,
        loading: doctorsLoading,
        hasLoaded: doctorsHasLoaded
    } = useDoctorsContext();
    const {
        assistents,
        fetchAssistents,
        hasLoaded: assistentsHasLoaded
    } = useAssistentsContext();

    // Get user role and info
    const userRole = user?.role;
    const userId = user?.id;

    const [appointment, setAppointment] = useState<Appointment>({
        patientId: "",
        doctorId: "",
        appointmentType: "",
        type: "",
        date: "", 
        time: "", 
        reason: "",
        status: "scheduled",
        department: undefined,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({
        patientId: false,
        doctorId: false,
        appointmentType: false,
        type: false,
        date: false,
        time: false,
        reason: false,
        status: false,
        department: false,
    });

    // Fetch all data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            const promises = [];
            
            if (!appointmentsHasLoaded) {
                promises.push(fetchAppointments());
            }
            
            if (!patientsHasLoaded) {
                promises.push(getAllPatients());
            }
            
            if (!departmentsHasLoaded) {
                promises.push(fetchDepartments());
            }

            if (!doctorsHasLoaded) {
                promises.push(fetchDoctors());
            }

            if (!assistentsHasLoaded && userRole === 'assistant') {
                promises.push(fetchAssistents());
            }
            
            if (promises.length > 0) {
                await Promise.all(promises);
            }
            setIsLoading(false);
        };
        
        fetchData();
    }, [appointmentsHasLoaded, patientsHasLoaded, departmentsHasLoaded, doctorsHasLoaded, assistentsHasLoaded, 
        fetchAppointments, getAllPatients, fetchDepartments, fetchDoctors, fetchAssistents, userRole]);

    const patientsArray: Patient[] = Array.isArray(patients)
        ? (patients as unknown as Patient[])
        : Array.isArray((Object.values(patients)[0] as unknown as Patient[]))
            ? (Object.values(patients)[0] as unknown as Patient[])
            : [];

    const departmentsArray: IDepartments[] = useMemo(() => {
        return Array.isArray(departments)
            ? departments
            : Array.isArray((Object.values(departments)[0] as IDepartments[]))
                ? (Object.values(departments)[0] as IDepartments[])
                : [];
    }, [departments]);

    const doctorsArray: Doctor[] = Array.isArray(doctors)
        ? (doctors as unknown as Doctor[])
        : [];

    // Load existing appointment data
    useEffect(() => {
        if (id && appointments && appointments.length > 0 && departmentsArray.length > 0) {
            const existingAppointment = appointments.find(apt => apt.id === id);
            if (existingAppointment) {
                // Find the department object
                let departmentObj: IDepartments | undefined;
                if (existingAppointment.department) {
                    if (typeof existingAppointment.department === 'string') {
                        // Store in a variable to help TypeScript understand the type
                        const deptString = existingAppointment.department;
                        departmentObj = departmentsArray.find(dept => 
                            dept.id === deptString || 
                            dept.name === deptString
                        );
                    } else if (typeof existingAppointment.department === 'object') {
                        const deptId = (existingAppointment.department as any).id || (existingAppointment.department as any)._id;
                        departmentObj = departmentsArray.find(dept => 
                            dept.id === deptId
                        );
                    }
                }

                setAppointment({
                    id: existingAppointment.id,
                    patientId: existingAppointment.patientId || "",
                    doctorId: existingAppointment.doctorId || "",
                    appointmentType: existingAppointment.appointmentType || "",
                    type: existingAppointment.type || "",
                    date: existingAppointment.date || "",
                    time: existingAppointment.time || "",
                    reason: existingAppointment.reason || "",
                    status: existingAppointment.status || "scheduled",
                    department: departmentObj,
                });
            }
        }
    }, [id, appointments, departmentsArray]);

    // Get current user's department if they are doctor or assistant
    const getCurrentUserDepartment = () => {
        if (userRole === 'doctor') {
            const currentDoctor = doctorsArray.find((d: Doctor) => d.userId === userId || d.id === userId);
            if (currentDoctor?.department) {
                return departmentsArray.find(dept => dept.id === currentDoctor.department || dept.name === currentDoctor.department);
            }
        } else if (userRole === 'assistant') {
            const currentAssistant = assistents.find((a: any) => a.userId === userId || a.id === userId);
            if (currentAssistant?.department) {
                return departmentsArray.find(dept => dept.id === currentAssistant.department || dept.name === currentAssistant.department);
            }
        }
        return undefined;
    };

    // Get current doctor's ID if user is a doctor
    // const getCurrentDoctorId = () => {
    //     if (userRole === 'doctor') {
    //         const currentDoctor = doctorsArray.find((d: Doctor) => d.userId === userId || d.id === userId);
    //         return currentDoctor?.id || currentDoctor?._id || '';
    //     }
    //     return '';
    // };

    // Filter doctors by department
    const getFilteredDoctors = () => {
        if (!appointment.department) return [];
        
        return doctorsArray.filter(doctor => 
            doctor.department === appointment.department?.id || 
            doctor.department === appointment.department?.name
        );
    };

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
        // Reset doctor selection when department changes (for owner_doctor role)
        if (userRole === 'doctor_owner') {
            handleChange("doctorId", "");
        }
    };

    const handleSubmit = async () => {
    const newErrors = {
        patientId: appointment.patientId === "",
        doctorId: appointment.doctorId === "",
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

    if (appointment.department && appointment.id) {
        try {
            // Create update data with only the department ID
            const updateData = {
                id: appointment.id,
                patientId: appointment.patientId,
                doctorId: appointment.doctorId,
                appointmentType: appointment.appointmentType,
                type: appointment.type,
                date: appointment.date,
                time: appointment.time,
                reason: appointment.reason,
                status: appointment.status || "scheduled",
                // FIX: Check for both id and _id
                department: appointment.department.id || appointment.department.id,
            };
            
            console.log("Updating appointment with data:", updateData); // Add this for debugging
            
            await updateAppointment(updateData as any);
            navigate("/appointments/all");
        } catch (error) {
            console.error("Failed to update appointment:", error);
            // Optional: Add error notification here
        }
    } else {
        console.log("Missing department or appointment ID:", { 
            department: appointment.department, 
            id: appointment.id 
        }); // Add this for debugging
    }
};

    const handleCancel = () => {
        navigate(`/appointments/${id}`);
    };

    const isFormValid =
        appointment.patientId !== "" &&
        appointment.doctorId !== "" &&
        appointment.appointmentType !== "" &&
        appointment.type !== "" &&
        appointment.date !== "" &&
        appointment.time !== "" &&
        appointment.reason !== "" &&
        appointment.status !== "" &&
        appointment.department;

    // Loading state
    if (isLoading || patientsLoading || departmentsLoading || doctorsLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (!appointment.id) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography variant="h6">Appointment not found</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <PaperFormWrapper elevation={3}>
                <Typography variant="h4" textAlign="center" mb={3}>
                    Edit Appointment
                </Typography>

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
                            sx={{ width: 500, marginY: 1 }}
                            required
                        >
                            {patientsArray.map((patient) => (
                                <MenuItem key={patient._id || patient.id} value={patient._id || patient.id}>
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

                        {/* Show department selector only for doctor_owner */}
                        {userRole === 'doctor_owner' && (
                            <TextField
                                select
                                label="Department"
                                value={appointment.department?.id || ""}
                                onChange={(e) => handleDepartmentChange(e.target.value)}
                                error={errors.department}
                                helperText={errors.department && "Department is required"}
                                fullWidth
                                sx={{ width: 500, marginY: 1 }}
                                required
                            >
                                {departmentsArray.map((department) => (
                                    <MenuItem key={department.id} value={department.id}>
                                        {department.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}

                        {/* Show doctor selector for doctor_owner and assistant roles */}
                        {(userRole === 'doctor_owner' || userRole === 'assistant') && (
                            <TextField
                                select
                                label="Doctor"
                                value={appointment.doctorId}
                                onChange={(e) => handleChange("doctorId", e.target.value)}
                                error={errors.doctorId}
                                helperText={errors.doctorId && "Doctor is required"}
                                fullWidth
                                sx={{ width: 500, marginY: 1 }}
                                required
                                disabled={userRole === 'doctor_owner' && !appointment.department}
                            >
                                {(userRole === 'doctor_owner' ? getFilteredDoctors() : 
                                  doctorsArray.filter((d: Doctor) => d.department === getCurrentUserDepartment()?.id || 
                                                          d.department === getCurrentUserDepartment()?.name))
                                    .map((doctor) => (
                                    <MenuItem key={doctor.id || doctor._id} value={doctor.id || doctor._id}>
                                        <Box display="flex" alignItems="center">
                                            <Avatar
                                                src={doctor.profileImg}
                                                sx={{ width: 30, height: 30, mr: 2 }}
                                            >
                                                {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                                            </Avatar>
                                            <Typography>
                                                Dr. {doctor.firstName} {doctor.lastName}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}

                        {/* For regular doctors, show their name as read-only */}
                        {userRole === 'doctor' && (
                            <TextField
                                label="Doctor"
                                value={`Dr. ${user?.firstName || ''} ${user?.lastName || ''}`}
                                fullWidth
                                sx={{ width: 500, marginY: 1 }}
                                disabled
                            />
                        )}

                        <TextField
                            select
                            label="Appointment Type"
                            value={appointment.appointmentType}
                            onChange={(e) => handleChange("appointmentType", e.target.value)}
                            error={errors.appointmentType}
                            helperText={errors.appointmentType && "Appointment type is required"}
                            fullWidth
                            sx={{ width: 500, marginY: 1 }}
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
                            sx={{ width: 500, marginY: 1 }}
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
                            sx={{ width: 500, marginY: 1 }}
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
                            multiline
                            rows={3}
                            required
                        />
                    </FormFieldWrapper>
                </Box>

                <Box display="flex" justifyContent="center" gap={2} mt={3}>
                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                        sx={{ width: 300 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        sx={{ width: 300 }}
                    >
                        Update Appointment
                    </Button>
                </Box>
            </PaperFormWrapper>
        </Box>
    );
};