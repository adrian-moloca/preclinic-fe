import { Box, BoxProps, Divider, DividerProps, Paper, PaperProps, styled } from "@mui/material";

export const FieldsWrapper = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    alignItems: "center",
});

export const DividerFormWrapper = styled(Divider)<DividerProps>({
    marginTop: "12px",
    marginBottom: "12px",
    width: "100%",
});

export const PaperFormWrapper = styled(Paper)<PaperProps>(({ theme }) => ({
    padding: "16px",
    marginTop: "32px",
    width: "100%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "wrap",
    backgroundColor: theme.palette.background.paper, 
    color: theme.palette.text.primary, 
    boxShadow: theme.palette.mode === 'dark' 
        ? "0px 4px 12px rgba(0, 0, 0, 0.5)" 
        : "0px 4px 12px rgba(0, 0, 0, 0.1)", 
    elevation: 3
}));

export const LeaveFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    color: theme.palette.text.primary, 
}));