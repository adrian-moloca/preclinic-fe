import { FC } from "react";
import CreatePatientForm from "../../../components/create-patient-form";
import { Box } from "@mui/material";

export const CreatePatient: FC = () => {
    return (
        <Box>
            <CreatePatientForm />
        </Box>
    )
}