import { Box, BoxProps, styled } from "@mui/material";

export const SettingsWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    padding: "24px",
    alignItems: "flex-start",
    minHeight: "300px",
    backgroundColor: theme.palette.background.default, 
    color: theme.palette.text.primary, 
}));

export const LeftSideButtonsWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    minWidth: "180px",
    marginTop: "40px",
    backgroundColor: theme.palette.background.paper, 
    color: theme.palette.text.primary, 
    borderRadius: "8px",
    boxShadow: theme.palette.mode === 'dark' 
        ? "inset 0 0 8px rgba(255,255,255,0.05)" 
        : "inset 0 0 8px rgba(0,0,0,0.05)", 
    padding: "16px",
}));