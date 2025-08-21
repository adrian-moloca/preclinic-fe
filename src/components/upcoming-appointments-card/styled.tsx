import { Box, BoxProps, styled } from "@mui/material";

export const UpcomingAppointmentsWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary, 
    borderRadius: 3,
    boxShadow: theme.palette.mode === 'dark' 
        ? "0px 4px 12px rgba(0,0,0,0.5)" 
        : "0px 4px 12px rgba(0,0,0,0.1)", 
    padding: 24,
    gap: 16,
}));

export const HeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: theme.palette.text.primary, 
}));

export const UserWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: 16,
    color: theme.palette.text.primary, 
}));

export const InfonWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    gap: 12,
    color: theme.palette.text.primary, 
}));

export const DepartmentWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    marginTop: 8,
    color: theme.palette.text.primary, 
}));

export const ButtonsWrapper = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
});

export const ButtonContentWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: theme.palette.text.primary, 
}));