import { FC, useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useLeavesContext } from "../../providers/leaves";
import { Leaves } from "../../providers/leaves/types";
import { DividerFormWrapper, FieldsWrapper, PaperFormWrapper } from "../create-leaves-form/style";

export const EditLeaveForm: FC = () => {
  const { leaves, updateLeave } = useLeavesContext();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Leaves | null>(null);
  const [errors, setErrors] = useState<any>(null);

  useEffect(() => {
  if (Array.isArray(leaves) && id) {
    const selectedLeave = leaves.find((leave) => leave.id === id);

    if (selectedLeave) {
      setForm((prevForm) => {
        if (prevForm?.id === selectedLeave.id) {
          return prevForm; // Prevent re-setting the same object and causing re-render
        }
        return selectedLeave;
      });

      setErrors({
        fromDate: false,
        toDate: false,
        leaveType: false,
        days: false,
        reason: false,
      });
    }
  }
}, [id, leaves]);

  const handleChange = (field: keyof Leaves, value: string) => {
    if (!form) return;
    setForm({ ...form, [field]: value });
    setErrors((prev: any) => ({ ...prev, [field]: false }));
  };

  const validate = (): boolean => {
    if (!form) return false;

    const newErrors = {
      fromDate: !form.fromDate,
      toDate: !form.toDate,
      leaveType: !form.leaveType,
      days: !form.days,
      reason: !form.reason,
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((val) => !val);
  };

  const handleSubmit = () => {
    if (!form) return;
    if (!validate()) return;

    updateLeave(form.id, form);
    navigate("/leaves/all-leaves");
  };

  if (!form || !errors) return <Typography>Loading...</Typography>;

  return (
    <PaperFormWrapper>
      <Typography variant="h5" gutterBottom>
        Edit Leave
      </Typography>
      <DividerFormWrapper />

        <FieldsWrapper>
      <TextField
        label="From"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={form.fromDate}
        onChange={(e) => handleChange("fromDate", e.target.value)}
        sx={{ width: 500, marginY: 1 }}
        required
        error={errors.fromDate}
      />

      <TextField
        label="To"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={form.toDate}
        onChange={(e) => handleChange("toDate", e.target.value)}
        sx={{ width: 500, marginY: 1 }}
        required
        error={errors.toDate}
      />

      <FormControl sx={{ width: 500, marginY: 1 }} required error={errors.leaveType}>
        <InputLabel id="leave-type">Leave Type</InputLabel>
        <Select
          labelId="leave-type"
          value={form.leaveType}
          label="Leave Type"
          onChange={(e) => handleChange("leaveType", e.target.value)}
        >
          <MenuItem value="Sick">Sick Leave</MenuItem>
          <MenuItem value="Vacation">Vacation Leave</MenuItem>
          <MenuItem value="Personal">Personal Leave</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Days"
        value={form.days}
        type="number"
        InputLabelProps={{ shrink: true }}
        onChange={(e) => handleChange("days", e.target.value)}
        sx={{ width: 500, marginY: 1 }}
        required
        error={errors.days}
      />

      <TextField
        label="Reason"
        value={form.reason}
        InputLabelProps={{ shrink: true }}
        onChange={(e) => handleChange("reason", e.target.value)}
        sx={{ width: 1070, marginY: 1 }}
        required
        error={errors.reason}
      />
        </FieldsWrapper>

      <Box mt={2}>
        <Button variant="contained" color="primary" sx={{ width: "200px" }} onClick={handleSubmit}>
          Save Lave
        </Button>
      </Box>
    </PaperFormWrapper>
  );
};
