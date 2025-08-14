import { FC } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Stack, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const DiagnosisForm: FC<{
  diagnosis: string;
  setDiagnosis: (v: string) => void;
  treatmentPlan: string;
  setTreatmentPlan: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
}> = ({
  diagnosis,
  setDiagnosis,
  treatmentPlan,
  setTreatmentPlan,
  notes,
  setNotes,
}) => (
  <Accordion defaultExpanded>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h6">Diagnosis & Treatment Plan</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Stack spacing={2}>
        <TextField
          label="Diagnosis"
          multiline
          rows={3}
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          fullWidth
          placeholder="Enter primary and secondary diagnoses..."
        />
        <TextField
          label="Treatment Plan"
          multiline
          rows={4}
          value={treatmentPlan}
          onChange={(e) => setTreatmentPlan(e.target.value)}
          fullWidth
          placeholder="Enter detailed treatment plan..."
        />
        <TextField
          label="Additional Notes"
          multiline
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
          placeholder="Any additional notes or observations..."
        />
      </Stack>
    </AccordionDetails>
  </Accordion>
);