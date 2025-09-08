import { Box, BoxProps, styled } from "@mui/material";

export const SignInWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: theme.palette.background.default, 
}));

export const LogoWrapper = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "center",
    marginBottom: "24px",
});

export const CardWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    width: "100%",
    backgroundColor: theme.palette.background.paper, 
    color: theme.palette.text.primary, 
    borderRadius: 3,
    boxShadow: theme.palette.mode === 'dark' 
        ? "0px 4px 20px rgba(0, 0, 0, 0.5)" 
        : "0px 4px 20px rgba(0, 0, 0, 0.05)", 
    padding: "32px",
}));

export const SectionWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    color: theme.palette.text.primary, 
}));

export const RemindMeWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    color: theme.palette.text.primary, 
}));