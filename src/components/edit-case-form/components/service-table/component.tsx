import { FC } from "react";
import {
  Accordion, AccordionSummary, AccordionDetails, Box, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Chip, Typography, IconButton, useTheme
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
}) => {
  const theme = useTheme(); 

  return (
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
                  <TableCell sx={{ color: theme.palette.text.primary }}>Service</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Category</TableCell>
                  <TableCell align="right" sx={{ color: theme.palette.text.primary }}>Price</TableCell>
                  <TableCell align="center" sx={{ color: theme.palette.text.primary }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service, index) => (
                  <TableRow 
                    key={service.id}
                    sx={{
                      backgroundColor: index % 2 === 0 
                        ? theme.palette.background.paper 
                        : theme.palette.action.hover, 
                      '&:hover': {
                        backgroundColor: theme.palette.action.selected,
                      }
                    }}
                  >
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
                        onClick={() => handleRemoveService(service.id)}
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