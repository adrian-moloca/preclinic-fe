import { Avatar, Box, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import { useAppointmentsContext } from "../../providers/appointments";
import { usePatientsContext } from "../../providers/patients";
import { BesicInformationCardWrapper, FirstSectionWrapper, FourthSectionWrapper, SecondSectionWrapper, ThirdSectionWrapper } from "./style";

export const BasicInformationCard: FC = () => {
  const { appointments } = useAppointmentsContext();
  const { patients } = usePatientsContext();

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const onlineAppointments = useMemo(
    () =>
      Array.isArray(appointments)
        ? appointments.filter((a) => a.appointmentType === "Online")
        : [],
    [appointments]
  );

  const patientOnlineWithAppointments = useMemo(() => {
    if (!Array.isArray(patients) || !onlineAppointments.length) return [];

    return onlineAppointments
      .map((appointment) => {
        const patient = patients.find(
          (p) => String(p._id).trim() === String(appointment.patientId).trim()
        );
        return patient ? { appointment, patient } : null;
      })
      .filter(Boolean) as { appointment: any; patient: any }[];
  }, [onlineAppointments, patients]);

  return (
    <Box mt={2}>
      {patientOnlineWithAppointments.length > 0 ? (
        patientOnlineWithAppointments.map(({ patient, appointment }) => (
          <BesicInformationCardWrapper
            key={`${patient.id}-${appointment.id}`}
          >
            <FirstSectionWrapper>
              <Avatar
                alt={`${patient.firstName} ${patient.lastName}`}
                src={patient.profileImg}
                sx={{ width: 56, height: 56 }}
              />
              <Box ml={2}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {patient.firstName} {patient.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reason: {appointment.reason || "N/A"}
                </Typography>
              </Box>
            </FirstSectionWrapper>

            <SecondSectionWrapper>
              <Typography variant="body2">
                <strong>Age:</strong>{" "}
                {patient.birthDate ? calculateAge(patient.birthDate) : "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Gender:</strong> {patient.gender || "N/A"}
              </Typography>
            </SecondSectionWrapper>

            <ThirdSectionWrapper>
              <Typography variant="body2">
                <strong>Appointment Date:</strong> {appointment.date || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Time:</strong> {appointment.time || "N/A"}
              </Typography>
            </ThirdSectionWrapper>

            <FourthSectionWrapper>
              <Typography variant="body2">
                <strong>Type:</strong> {appointment.appointmentType || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Blood Group:</strong> {patient.bloodGroup || "N/A"}
              </Typography>
            </FourthSectionWrapper>
          </BesicInformationCardWrapper>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No online consultations found.
        </Typography>
      )}
    </Box>
  );
};
