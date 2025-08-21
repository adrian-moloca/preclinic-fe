import { ChartDataPoint } from "../components/interactive-chart/components/analistic-types";

export const appointmentsData: ChartDataPoint[] = [
  { name: "Jan", value: 340, date: "2024-01-01" },
  { name: "Feb", value: 270, date: "2024-02-01" },
  { name: "Mar", value: 280, date: "2024-03-01" },
  { name: "Apr", value: 260, date: "2024-04-01" },
  { name: "May", value: 330, date: "2024-05-01" },
  { name: "Jun", value: 210, date: "2024-06-01" },
  { name: "Jul", value: 240, date: "2024-07-01" },
  { name: "Aug", value: 180, date: "2024-08-01" },
  { name: "Sep", value: 250, date: "2024-09-01" },
  { name: "Oct", value: 200, date: "2024-10-01" },
  { name: "Nov", value: 310, date: "2024-11-01" },
  { name: "Dec", value: 390, date: "2024-12-01" },
];

export const revenueData: ChartDataPoint[] = [
  { name: "Jan", value: 45000, date: "2024-01-01" },
  { name: "Feb", value: 38000, date: "2024-02-01" },
  { name: "Mar", value: 42000, date: "2024-03-01" },
  { name: "Apr", value: 39000, date: "2024-04-01" },
  { name: "May", value: 48000, date: "2024-05-01" },
  { name: "Jun", value: 35000, date: "2024-06-01" },
  { name: "Jul", value: 41000, date: "2024-07-01" },
  { name: "Aug", value: 33000, date: "2024-08-01" },
  { name: "Sep", value: 44000, date: "2024-09-01" },
  { name: "Oct", value: 37000, date: "2024-10-01" },
  { name: "Nov", value: 52000, date: "2024-11-01" },
  { name: "Dec", value: 58000, date: "2024-12-01" },
];

export const patientsData: ChartDataPoint[] = [
  { name: "Jan", value: 120, date: "2024-01-01" },
  { name: "Feb", value: 98, date: "2024-02-01" },
  { name: "Mar", value: 115, date: "2024-03-01" },
  { name: "Apr", value: 87, date: "2024-04-01" },
  { name: "May", value: 134, date: "2024-05-01" },
  { name: "Jun", value: 92, date: "2024-06-01" },
  { name: "Jul", value: 108, date: "2024-07-01" },
  { name: "Aug", value: 76, date: "2024-08-01" },
  { name: "Sep", value: 125, date: "2024-09-01" },
  { name: "Oct", value: 89, date: "2024-10-01" },
  { name: "Nov", value: 142, date: "2024-11-01" },
  { name: "Dec", value: 156, date: "2024-12-01" },
];

export const departmentData: ChartDataPoint[] = [
  { name: "Cardiology", value: 245, date: "2024-12-01" },
  { name: "Neurology", value: 198, date: "2024-12-01" },
  { name: "Orthopedics", value: 156, date: "2024-12-01" },
  { name: "General", value: 648, date: "2024-12-01" },
  { name: "Pediatrics", value: 134, date: "2024-12-01" },
  { name: "Dermatology", value: 89, date: "2024-12-01" },
];

export const generateComparisonData = (currentData: ChartDataPoint[]): ChartDataPoint[] => {
  return currentData.map(item => ({
    ...item,
    value: Math.round(item.value * (0.8 + Math.random() * 0.4)), // 80% to 120% of current
  }));
};

export const weeklyData: ChartDataPoint[] = [
  { name: "Mon", value: 45, date: "2024-12-16" },
  { name: "Tue", value: 52, date: "2024-12-17" },
  { name: "Wed", value: 38, date: "2024-12-18" },
  { name: "Thu", value: 61, date: "2024-12-19" },
  { name: "Fri", value: 48, date: "2024-12-20" },
  { name: "Sat", value: 23, date: "2024-12-21" },
  { name: "Sun", value: 12, date: "2024-12-22" },
];

export const hourlyData: ChartDataPoint[] = [
  { name: "8 AM", value: 8, date: "2024-12-22T08:00:00" },
  { name: "9 AM", value: 15, date: "2024-12-22T09:00:00" },
  { name: "10 AM", value: 23, date: "2024-12-22T10:00:00" },
  { name: "11 AM", value: 19, date: "2024-12-22T11:00:00" },
  { name: "12 PM", value: 12, date: "2024-12-22T12:00:00" },
  { name: "1 PM", value: 18, date: "2024-12-22T13:00:00" },
  { name: "2 PM", value: 25, date: "2024-12-22T14:00:00" },
  { name: "3 PM", value: 21, date: "2024-12-22T15:00:00" },
  { name: "4 PM", value: 16, date: "2024-12-22T16:00:00" },
  { name: "5 PM", value: 9, date: "2024-12-22T17:00:00" },
];