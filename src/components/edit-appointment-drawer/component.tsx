import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Drawer,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { useAppointmentsContext } from "../../providers/appointments"; 
import { AppointmentsEntry } from "../../providers/appointments/types";

interface Props {
  open: boolean;
  onClose: () => void;
  appointmentId: string | null;
  onSave: (updated: AppointmentsEntry) => void;
}

export const EditAppointmentDrawer: FC<Props> = ({ open, onClose, appointmentId, onSave }) => {
  const { appointments } = useAppointmentsContext();

  const appointment = Object.values(appointments)
    .flat()
    .find((a) => a.id === appointmentId) || null;

  const [formData, setFormData] = useState<AppointmentsEntry | null>(appointment);

  useEffect(() => {
    setFormData(appointment);
  }, [appointmentId, appointment]);

  const handleChange = (field: keyof AppointmentsEntry, value: any) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, padding: 3 }}>
        <Typography variant="h6" gutterBottom>Edit Appointment</Typography>

        <TextField
          label="Appointment ID"
          value={formData?.id || ""}
          disabled
          fullWidth
          margin="normal"
        />

        <TextField
          label="Patient"
          value={formData}
          fullWidth
          disabled
          margin="normal"
        />

        <TextField
          fullWidth
          margin="normal"
          select
          label="Appointment Type"
          value={formData?.appointmentType || ""}
          onChange={(e) => handleChange("appointmentType", e.target.value)}
        >
          <MenuItem value="In Person">In Person</MenuItem>
          <MenuItem value="Online">Online</MenuItem>
        </TextField>

        <TextField
          type="date"
          label="Date"
          value={formData?.date.split(" ")[0] || ""}
          onChange={(e) =>
            handleChange("date", `${e.target.value} ${formData?.date.split(" ")[1]}`)
          }
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          type="time"
          label="Time"
          value={formData?.time.split(" ")[1] || ""}
          onChange={(e) =>
            handleChange("time", `${formData?.time.split(" ")[0]} ${e.target.value}`)
          }
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Appointment Reason"
          value={formData?.reason || ""}
          onChange={(e) => handleChange("reason", e.target.value)}
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Save Changes
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
