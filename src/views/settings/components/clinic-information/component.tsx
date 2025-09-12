import { Box } from "@mui/material";
import { FC } from "react";
import CreateClinicWizard from "../../../clinic/create-clinic";
import { useClinicContext } from "../../../../providers/clinic/context";

export const ClinicInformationSettings: FC = () => {
  const { selectedClinic } = useClinicContext();
  return (
    <Box>
      <CreateClinicWizard editMode={true} existingClinic={selectedClinic} />;
    </Box>
  )
}