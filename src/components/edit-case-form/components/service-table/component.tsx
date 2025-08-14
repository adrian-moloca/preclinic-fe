import { FC } from "react";
import {
  Accordion, AccordionSummary, AccordionDetails, Box, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Chip, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent, Grid
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const ServicesSection: FC<{
  services: any[];
  servicesList: any[];
  openServiceDialog: boolean;
  setOpenServiceDialog: (v: boolean) => void;
  selectedService: any;
  setSelectedService: (v: any) => void;
  handleAddService: () => void;
  handleRemoveService: (id: string) => void;
  calculateTotal: () => number;
}> = ({
  services,
  servicesList,
  openServiceDialog,
  setOpenServiceDialog,
  selectedService,
  setSelectedService,
  handleAddService,
  handleRemoveService,
  calculateTotal,
}) => (
  <Accordion defaultExpanded>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h6">Services Provided</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setOpenServiceDialog(true)}
        >
          Add Service
        </Button>
      </Box>
      {services.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Service</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {service.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {service.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={service.category || "General"} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    {service.price ? `${service.price} €` : "-"}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveService(service.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2}>
                  <strong>Total</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>{calculateTotal().toFixed(2)} €</strong>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog
        open={openServiceDialog}
        onClose={() => setOpenServiceDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select Service</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {servicesList.map((service) => (
              <Grid key={service.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    border:
                      selectedService?.id === service.id
                        ? "2px solid #1976d2"
                        : "1px solid #e0e0e0",
                  }}
                  onClick={() => setSelectedService(service)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {service.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {service.description}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      <Typography variant="h6" color="primary">
                        {service.price ? `${service.price} €` : "-"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenServiceDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddService}
            variant="contained"
            disabled={!selectedService}
          >
            Add Service
          </Button>
        </DialogActions>
      </Dialog>
    </AccordionDetails>
  </Accordion>
);