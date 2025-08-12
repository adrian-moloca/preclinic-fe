import { Box, BoxProps, styled } from "@mui/material";

export const CreatePatientFormWrapper = styled(Box)<BoxProps>({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: "16px",
    padding: "8px",
    maxWidth: "1200px",
    margin: "auto",
    marginTop: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f5f5f5",
});

export const FormFieldWrapper = styled(Box)<BoxProps>({
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    width: "90%",
    marginTop: "12px",
    justifyContent: "space-between"
});