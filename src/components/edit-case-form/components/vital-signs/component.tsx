import { FC } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Grid, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const VitalSignsForm: FC<{
  vitalSigns: any;
  setVitalSigns: (vs: any) => void;
}> = ({ vitalSigns, setVitalSigns }) => (
  <Accordion defaultExpanded>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h6">Vital Signs</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Grid container spacing={2}>
        <Grid>
          <TextField
            label="Blood Pressure"
            placeholder="120/80"
            value={vitalSigns.bloodPressure}
            onChange={(e) =>
              setVitalSigns({ ...vitalSigns, bloodPressure: e.target.value })
            }
            fullWidth
            size="small"
          />
        </Grid>
        <Grid>
          <TextField
            label="Heart Rate"
            placeholder="72 bpm"
            value={vitalSigns.heartRate}
            onChange={(e) =>
              setVitalSigns({ ...vitalSigns, heartRate: e.target.value })
            }
            fullWidth
            size="small"
          />
        </Grid>
        <Grid>
          <TextField
            label="Temperature"
            placeholder="36.5°C"
            value={vitalSigns.temperature}
            onChange={(e) =>
              setVitalSigns({ ...vitalSigns, temperature: e.target.value })
            }
            fullWidth
            size="small"
          />
        </Grid>
        <Grid>
          <TextField
            label="Weight"
            placeholder="70 kg"
            value={vitalSigns.weight}
            onChange={(e) =>
              setVitalSigns({ ...vitalSigns, weight: e.target.value })
            }
            fullWidth
            size="small"
          />
        </Grid>
        <Grid>
          <TextField
            label="Height"
            placeholder="175 cm"
            value={vitalSigns.height}
            onChange={(e) =>
              setVitalSigns({ ...vitalSigns, height: e.target.value })
            }
            fullWidth
            size="small"
          />
        </Grid>
      </Grid>
    </AccordionDetails>
  </Accordion>
);