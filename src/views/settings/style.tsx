import { Box, BoxProps, styled } from "@mui/material";

export const SettingsWrapper = styled(Box)<BoxProps>({
    display: "flex",
    padding: "24px",
    alignItems: "flex-start",
    minHeight: "300px",
});

export const LeftSideButtonsWrapper = styled(Box)<BoxProps>({
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    minWidth: "180px",
    marginTop: "40px",
    bgColor: "#fff",
    borderRadius: "8px",
    boxShadow: "inset 0 0 8px rgba(0,0,0,0.05)",
    padding: "16px",
});