import { FC } from "react";
import {
  Accordion, AccordionSummary, AccordionDetails, Box, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography, IconButton, useTheme
} from "@mui/material";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const PrescriptionsSection: FC<{
  prescriptions: any[];
  openPrescriptionDialog: boolean;
  setOpenPrescriptionDialog: (v: boolean) => void;
  newPrescription: any;
  setNewPrescription: (v: any) => void;
  handleAddPrescription: () => void;
  handleRemovePrescription: (id: string) => void;
}> = ({
  prescriptions,
  openPrescriptionDialog,
  setOpenPrescriptionDialog,
  newPrescription,
  setNewPrescription,
  handleAddPrescription,
  handleRemovePrescription,
}) => {
  const theme = useTheme();

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Prescriptions</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<LocalPharmacyIcon />}
            onClick={() => setOpenPrescriptionDialog(true)}
          >
            Add Prescription
          </Button>
        </Box>
        {prescriptions.length > 0 && (
          <TableContainer 
            component={Paper} 
            variant="outlined"
            sx={{
              backgroundColor: theme.palette.background.paper, 
              color: theme.palette.text.primary, 
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{
                  backgroundColor: theme.palette.background.paper, 
                }}>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Medication</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Dosage</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Frequency</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Duration</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Instructions</TableCell>
                  <TableCell align="center" sx={{ color: theme.palette.text.primary }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prescriptions.map((prescription, index) => (
                  <TableRow 
                    key={prescription.id}
                    sx={{
                      backgroundColor: index % 2 === 0 
                        ? theme.palette.background.paper 
                        : theme.palette.action.hover, 
                      '&:hover': {
                        backgroundColor: theme.palette.action.selected, 
                      }
                    }}
                  >
                    <TableCell>{prescription.medication}</TableCell>
                    <TableCell>{prescription.dosage}</TableCell>
                    <TableCell>{prescription.frequency}</TableCell>
                    <TableCell>{prescription.duration}</TableCell>
                    <TableCell>{prescription.instructions}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleRemovePrescription(prescription.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </AccordionDetails>
    </Accordion>
  );
};