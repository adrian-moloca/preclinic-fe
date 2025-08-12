import { Box, BoxProps, styled } from "@mui/material";

export const SignInWrapper = styled(Box)<BoxProps>({
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    background: "linear-gradient(#f7f9fc, #eef1f8)",
});

export const LogoWrapper = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "center",
    marginBottom: "24px",
});

export const CardWrapper = styled(Box)<BoxProps>({
    width: "400px",
    backgroundColor: "#fff",
    borderRadius: 3,
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
    padding: "32px",
});

export const SectionWrapper = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
});

export const RemindMeWrapper = styled(Box)<BoxProps>({
    display: "flex",
    alignItems: "center",
});