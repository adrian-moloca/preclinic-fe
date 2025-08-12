import { FC } from "react";
import { CreatePatientWrapper } from "../create-patient/style";
import EditPatientForm from "../../../components/edit-patient-form";

export const EditPatient: FC = () => {
    return (
        <CreatePatientWrapper>
            <EditPatientForm />
        </CreatePatientWrapper>
    )
}