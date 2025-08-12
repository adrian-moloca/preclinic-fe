import { Box, BoxProps, styled } from "@mui/material";

export const ChangePasswordWrapper = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "center",
    width: "100%"
});

export const InputsWrapper = styled(Box)<BoxProps>({
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
    maxWidth: "1000px"
});