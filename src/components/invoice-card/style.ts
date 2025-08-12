import { Box, BoxProps, styled } from "@mui/material";

export const AmountInput = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px"
});

export const TotalAmontWrapper = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "space-between",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #ddd"
});