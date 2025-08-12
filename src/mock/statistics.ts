interface CardData {
  title: string;
  value: string | number;
  iconColor: string;
  iconBg: string;
  percent: string;
  percentColor: "success" | "error";
  chartType: "bar" | "line";
}

export const StatisticData: CardData[] = [
    {
    title: "Doctors",
    value: 247,
    iconColor: "#3f51b5",
    iconBg: "rgba(63,81,181,0.1)",
    percent: "+95%",
    percentColor: "success",
    chartType: "bar",
  },
  {
    title: "Patients",
    value: 4178,
    iconColor: "#f44336",
    iconBg: "rgba(244,67,54,0.1)",
    percent: "+25%",
    percentColor: "success",
    chartType: "line",
  },
  {
    title: "Appointment",
    value: 12178,
    iconColor: "#2196f3",
    iconBg: "rgba(33,150,243,0.1)",
    percent: "-15%",
    percentColor: "error",
    chartType: "bar",
  },
  {
    title: "Revenue",
    value: "$55,1240",
    iconColor: "#4caf50",
    iconBg: "rgba(76,175,80,0.1)",
    percent: "+25%",
    percentColor: "success",
    chartType: "line",
  },
]