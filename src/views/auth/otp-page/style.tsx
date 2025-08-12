import { Box, BoxProps, styled } from "@mui/material";

export const OtpPageWrapper = styled(Box)<BoxProps>({
    display: "flex",
    height: "100vh"
});

export const ImageSectionWrapper = styled(Box)<BoxProps>({
    width: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
});

export const InputsSectionWrapper = styled(Box)<BoxProps>({
    width: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
});

export const CardTitleWrapper = styled(Box)<BoxProps>({
    padding: "16px",
    textAlign: "center"
});

export const ResendOtpWrapper = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "center",
    marginTop: "16px"
});