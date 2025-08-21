import { Box, BoxProps, styled } from "@mui/material";

export const ScheduleFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    maxWidth: 1050,
    width: "100%",
    margin: "0 auto",
    marginTop: "40px",
    backgroundColor: theme.palette.background.paper, 
    color: theme.palette.text.primary, 
    padding: "32px",
    borderRadius: "24px",
    boxShadow: theme.palette.mode === 'dark' 
        ? "0px 4px 20px rgba(0,0,0,0.5)" 
        : "0px 4px 20px rgba(0,0,0,0.08)", 
}));

export const DayButtonsWrapper = styled(Box)<BoxProps>({
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 32,
    justifyContent: 'center',
});

export const AddScheduleWrapper = styled(Box)<BoxProps>({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
});

export const SubmitButtonWrapper = styled(Box)<BoxProps>({
    textAlign: 'center',
    marginTop: 24,
});