import { Box, BoxProps, Grid, GridProps, styled } from "@mui/material";

export const InputsWrapper = styled(Box)<BoxProps>({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
});

export const StyledGrid = styled(Grid)<GridProps>({
    display: "flex",
    justifyContent: "space-between"
});