import { Box, Button, Typography } from "@mui/material";
import { FC } from "react";
import BasicInformationCard from "../../../../components/basic-information-card";
import VitalsForm from "../../../../components/vitals-card";
import ComplaintCard from "../../../../components/complaint-card";
import DiagnosisCard from "../../../../components/diagnosis-card";
import MedicationsCard from "../../../../components/medications-card";
import { AdviceCard } from "../../../../components/advice-card/component";
import InvestigationsAndProcedures from "../../../../components/investigations-and-procedures";
import FollowUpCard from "../../../../components/follow-up-card";
import InvoiceForm from "../../../../components/invoice-card";
import { CompleteButtonWrapper } from "./style";

export const ManageOnlineAppointment: FC = () => {
  return (
    <Box>
      <Typography variant="h5">Online Consultation</Typography>
      <BasicInformationCard />
      <VitalsForm />
      <ComplaintCard />
      <DiagnosisCard />
      <MedicationsCard />
      <AdviceCard />
      <InvestigationsAndProcedures />
      <FollowUpCard />
      <InvoiceForm />
      <CompleteButtonWrapper>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
          }}
        >
          Complete Appointment
        </Button>
      </CompleteButtonWrapper>
    </Box>
  );
};