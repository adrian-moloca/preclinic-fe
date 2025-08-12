import { Typography, Select, MenuItem, FormControl } from "@mui/material";
import {
  ResponsiveContainer,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
  Area,
  Legend,
} from "recharts";
import { useState } from "react";
import { data } from "../../mock/appointmentChartData";
import { AppointmentChartWrapper, ChartHeader } from "./style";

export const AppointmentsChart = () => {
  const [period, setPeriod] = useState("Monthly");

  return (
    <AppointmentChartWrapper>
      <ChartHeader>
        <Typography variant="h6" fontWeight={600}>
          Appointments
        </Typography>
        <FormControl size="small">
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="Weekly">Weekly</MenuItem>
            <MenuItem value="Daily">Daily</MenuItem>
          </Select>
        </FormControl>
      </ChartHeader>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 400]} />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="completed"
            stroke="#22c55e"
            fill="rgba(34,197,94,0.15)"
            name="Completed Appointments"
          />
          <Bar
            dataKey="total"
            barSize={20}
            fill="#4f46e5"
            name="Total Appointments"
            radius={[10, 10, 0, 0]}
          />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Completed Appointments"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </AppointmentChartWrapper>
  );
};