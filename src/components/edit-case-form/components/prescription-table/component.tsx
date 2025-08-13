import { FC } from "react";
import {
  Accordion, AccordionSummary, AccordionDetails, Box, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField
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
}) => (
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
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Medication</TableCell>
                <TableCell>Dosage</TableCell>
                <TableCell>Frequency</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Instructions</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell>{prescription.medication}</TableCell>
                  <TableCell>{prescription.dosage}</TableCell>
                  <TableCell>{prescription.frequency}</TableCell>
                  <TableCell>{prescription.duration}</TableCell>
                  <TableCell>{prescription.instructions}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemovePrescription(prescription.id)}
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
      <Dialog
        open={openPrescriptionDialog}
        onClose={() => setOpenPrescriptionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Prescription</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Medication Name"
              value={newPrescription.medication}
              onChange={(e) =>
                setNewPrescription((prev: any) => ({
                  ...prev,
                  medication: e.target.value,
                }))
              }
              fullWidth
              required
            />
            <TextField
              label="Dosage"
              value={newPrescription.dosage}
              onChange={(e) =>
                setNewPrescription((prev: any) => ({
                  ...prev,
                  dosage: e.target.value,
                }))
              }
              fullWidth
              placeholder="e.g., 500mg"
              required
            />
            <TextField
              label="Frequency"
              value={newPrescription.frequency}
              onChange={(e) =>
                setNewPrescription((prev: any) => ({
                  ...prev,
                  frequency: e.target.value,
                }))
              }
              fullWidth
              placeholder="e.g., Twice daily"
            />
            <TextField
              label="Duration"
              value={newPrescription.duration}
              onChange={(e) =>
                setNewPrescription((prev: any) => ({
                  ...prev,
                  duration: e.target.value,
                }))
              }
              fullWidth
              placeholder="e.g., 7 days"
            />
            <TextField
              label="Special Instructions"
              value={newPrescription.instructions}
              onChange={(e) =>
                setNewPrescription((prev: any) => ({
                  ...prev,
                  instructions: e.target.value,
                }))
              }
              fullWidth
              multiline
              rows={2}
              placeholder="e.g., Take with food"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPrescriptionDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddPrescription}
            variant="contained"
            disabled={!newPrescription.medication || !newPrescription.dosage}
          >
            Add Prescription
          </Button>
        </DialogActions>
      </Dialog>
    </AccordionDetails>
  </Accordion>
);