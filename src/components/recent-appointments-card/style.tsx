import { Box, BoxProps, styled } from "@mui/material";

export const RecentAppointmentsWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    borderRadius: 3,
    padding: 3,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary, 
    boxShadow: theme.palette.mode === 'dark' 
        ? "0px 1px 3px rgba(0, 0, 0, 0.5)" 
        : "0px 1px 3px rgba(0, 0, 0, 0.2)", 
    marginBottom: "16px",
    marginTop: "24px",
    height: "100%",
}));

export const CardHeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    color: theme.palette.text.primary,
}));