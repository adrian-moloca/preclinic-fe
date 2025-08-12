import styled from "@emotion/styled";
import { Box, BoxProps, Paper, PaperProps } from "@mui/material";

export const StyledPaper = styled(Paper)<PaperProps>({
    padding: "16px",
    marginTop: "16px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    width: "90%"
});

export const SectionsWrapper = styled(Box)<BoxProps>({
    display: "flex",
    gap: "16px",
    width: "100%",
    maxWidth: "1150px"
});