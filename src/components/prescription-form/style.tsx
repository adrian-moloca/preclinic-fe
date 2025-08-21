import { Box, BoxProps, Paper, PaperProps, styled } from "@mui/material";

export const PaperWrapper = styled(Paper)<PaperProps>(({ theme }) => ({
    padding: "16px",
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: theme.palette.background.paper, 
    color: theme.palette.text.primary, 
}));

export const PatentDetailsWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "center",
    color: theme.palette.text.primary, 
}));

export const PrescriptionFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    color: theme.palette.text.primary, 
}));