import { Box, BoxProps, Paper, PaperProps, styled } from "@mui/material";

export const PaperWrapper = styled(Paper)<PaperProps>({
    padding: "16px",
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", 
    alignItems: "center",
});

export const PatentDetailsWrapper = styled(Box)<BoxProps>({
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "center",
});

export const PrescriptionFormWrapper = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "center"
});