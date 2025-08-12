import React, { useState } from "react";
import {
  Box,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
  Paper,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AmountInput, TotalAmontWrapper } from "./style";
import { DividerFormWrapper } from "../create-leaves-form/style";

const services = [
  { label: "General Consultation", price: 50 },
  { label: "Dental Cleaning", price: 80 },
  { label: "Eye Checkup", price: 60 },
  { label: "Blood Test", price: 100 },
  { label: "Skin Allergy Test", price: 120 },
];

const paymentModes = ["Cash", "Card", "Insurance"];

export const InvoiceForm: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>("");
  const [amount, setAmount] = useState<number | string>("");
  const [items, setItems] = useState<{ service: string; amount: number }[]>([]);
  const [paymentMode, setPaymentMode] = useState<string>("");

  const handleAddItem = () => {
    const parsedAmount = parseFloat(amount as string);
    if (!selectedService || isNaN(parsedAmount)) return;

    setItems((prev) => [...prev, { service: selectedService, amount: parsedAmount }]);
    setSelectedService("");
    setAmount("");
  };

  const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
  const taxRate = 0.0; 
  const discountRate = 0.0;

  const tax = subtotal * taxRate;
  const discount = subtotal * discountRate;
  const total = subtotal + tax - discount;

  return (
    <Paper elevation={1} sx={{ p: 3, marginTop: 2 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Invoice
      </Typography>

      <DividerFormWrapper />

      <Grid container spacing={2} sx={{ display: "flex", alignItems: "center" }}>
        <Grid>
          <FormControl fullWidth size="small" sx={{ width: "300px" }}>
            <Typography variant="subtitle2" gutterBottom>
              Service
            </Typography>
            <Select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <MenuItem value="">
              </MenuItem>
              {services.map((s) => (
                <MenuItem key={s.label} value={s.label}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid>
            <Typography variant="subtitle2" gutterBottom>
                Amount
            </Typography>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={amount}
            sx={{ width: "300px" }}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Grid>

        <Grid>
          <Button
            variant="contained"
            onClick={handleAddItem}
            fullWidth
            startIcon={<AddIcon />}
            sx={{ marginTop: "25px" }}
          >
            Add
          </Button>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="subtitle2" gutterBottom>
          Summary
        </Typography>

        <AmountInput>
          <Typography>Amount</Typography>
          <Typography>${subtotal.toFixed(2)}</Typography>
        </AmountInput>

        <AmountInput>
          <Typography>Tax (0%)</Typography>
          <Typography>${tax.toFixed(2)}</Typography>
        </AmountInput>

        <AmountInput>
          <Typography>Discount (0%)</Typography>
          <Typography>${discount.toFixed(2)}</Typography>
        </AmountInput>

        <TotalAmontWrapper>
          <Typography variant="h6">Total :</Typography>
          <Typography variant="h6" fontWeight={600}>
            ${total.toFixed(2)}
          </Typography>
        </TotalAmontWrapper>
      </Box>

      <Box mt={4}>
        <FormControl fullWidth size="small" sx={{ width: "300px" }}>
          <InputLabel>Payment Mode</InputLabel>
          <Select
            value={paymentMode}
            label="Payment Mode"
            onChange={(e) => setPaymentMode(e.target.value)}
          >
            <MenuItem value="">
            </MenuItem>
            {paymentModes.map((mode) => (
              <MenuItem key={mode} value={mode}>
                {mode}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};