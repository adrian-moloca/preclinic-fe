import { Box, BoxProps, styled } from "@mui/material";

export const SchedduleWrapper = styled(Box)<BoxProps>({
    dsiplay: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
});

export const TitleWrapper = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "center",
    marginTop: 24
});