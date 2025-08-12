import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { FC, useState } from "react";
import { useLeavesContext } from "../../providers/leaves";
import { DividerFormWrapper, FieldsWrapper, LeaveFormWrapper, PaperFormWrapper } from "./style";
import { useNavigate } from "react-router-dom";

export const CreateLeavesForm: FC = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [days, setDays] = useState("");
  const navigate = useNavigate();

  const { addLeave } = useLeavesContext();

  const handleSubmit = () => {
    addLeave({
      id: Math.random().toString(36).substr(2, 9),
      status: "pending",
      appliedOn: new Date().toISOString(),
      fromDate,
      toDate,
      leaveType,
      reason,
      days,
    });
    navigate("/leaves/all-leaves");
  };

  const isFormValid =
    fromDate.trim() !== "" &&
    toDate.trim() !== "" &&
    leaveType.trim() !== "" &&
    reason.trim() !== "" &&
    days.trim() !== "";

  return (
    <LeaveFormWrapper>
      <PaperFormWrapper>
        <Typography variant="h5">Create Leave</Typography>
        <DividerFormWrapper />
        <FieldsWrapper>
          <TextField
            label="From"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            sx={{ width: 550, marginY: 1 }}
            required
          />
          <TextField
            label="To"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            sx={{ width: 550, marginY: 1 }}
            required
          />
          <FormControl sx={{ width: 550, marginY: 1 }} required>
            <InputLabel id="leave-type">Leave Type</InputLabel>
            <Select
              labelId="leave-type"
              value={leaveType}
              label="Leave Type"
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <MenuItem value="Sick">Sick Leave</MenuItem>
              <MenuItem value="Vacation">Vacation Leave</MenuItem>
              <MenuItem value="Personal">Personal Leave</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Days"
            value={days}
            type="number"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setDays(e.target.value)}
            sx={{ width: 550, marginY: 1 }}
            required
          />
          <TextField
            label="Reason"
            value={reason}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setReason(e.target.value)}
            sx={{ width: 1120, marginY: 1 }}
            required
          />
        </FieldsWrapper>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ marginTop: 2, width: "200px" }}
          disabled={!isFormValid}
        >
          Create Leave
        </Button>
      </PaperFormWrapper>
    </LeaveFormWrapper>
  );
};
