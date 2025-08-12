import { Box, BoxProps, styled } from "@mui/material";

export const UpcomingAppointmentsWrapper = styled(Box)<BoxProps>({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 3,
    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
    padding: 24,
    gap: 16,
});

export const HeaderWrapper = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
});

export const UserWrapper = styled(Box)<BoxProps>({
    display: "flex",
    alignItems: "center",
    gap: 16,
});

export const InfonWrapper = styled(Box)<BoxProps>({
    display: "flex",
    gap: 12,
});

export const DepartmentWrapper = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "space-between",
    marginTop: 8,
});

export const ButtonsWrapper = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
});

export const ButtonContentWrapper = styled(Box)<BoxProps>({
    display: "flex",
    alignItems: "center",
    gap: 8,
});