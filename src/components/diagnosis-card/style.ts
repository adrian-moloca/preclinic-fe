import { Box, BoxProps, styled } from "@mui/material";

export const AddDiagnosticWrapper = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px"
});

export const InputsWrapper = styled(Box)<BoxProps>({
    display: "flex",
    gap: "16px",
    flexWrap: "wrap"
});

export const InputWrapper = styled(Box)<BoxProps>({
    flex: "1",
    minWidth: "300px"
});
