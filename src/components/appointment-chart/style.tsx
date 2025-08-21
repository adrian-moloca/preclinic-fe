import { Box, BoxProps, styled } from "@mui/material";

export const AppointmentChartWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderRadius: 4,
    padding: 3,
    boxShadow: theme.palette.mode === 'dark' 
        ? "0px 1px 3px rgba(0, 0, 0, 0.5)" 
        : "0px 1px 3px rgba(0, 0, 0, 0.2)",
    width: "100%",
}));

export const ChartHeader = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 16,
    color: theme.palette.text.primary, 
}));