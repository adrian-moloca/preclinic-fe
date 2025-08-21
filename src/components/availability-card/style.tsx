import { Box, BoxProps, styled } from "@mui/material";

export const AvailabilityCardWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    width: 400,
    height: "100%",
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper, 
    color: theme.palette.text.primary, 
    borderRadius: 8,
    padding: 16,
    display: "flex",
    flexDirection: "column",
}));

export const HeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginBottom: 16,
    color: theme.palette.text.primary,
}));

export const ScheduleWrapper = styled(Box)<BoxProps>({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 16
});

export const FormWrapper = styled(Box)<BoxProps>({
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 8
});