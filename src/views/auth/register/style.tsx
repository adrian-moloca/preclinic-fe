import { Box, BoxProps, styled } from "@mui/material";

export const RegisterWrapper = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    flexDirection: "column"
});

export const TitleWrapper = styled(Box)<BoxProps>({
    marginBottom: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
});

export const SignInSectionWrapper = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "center",
    marginTop: "16px"
});