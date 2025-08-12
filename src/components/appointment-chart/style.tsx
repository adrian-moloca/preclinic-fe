import { Box, BoxProps, styled } from "@mui/material";

export const AppointmentChartWrapper = styled(Box)<BoxProps>(() => ({
    backgroundColor: "#fff",
    borderRadius: 4,
    padding: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
    width: "100%",
}));

export const ChartHeader = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 16
});