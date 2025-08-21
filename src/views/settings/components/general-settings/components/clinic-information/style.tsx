import { Box, BoxProps, Paper, PaperProps, styled } from "@mui/material";

export const CustomPaper = styled(Paper)<PaperProps>(({ theme }) => ({
    padding: "24px",
    border: "1px solid",
    borderColor: theme.palette.divider,
    borderRadius: 12,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary, 
}));

export const TitleWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    color: theme.palette.text.primary, 
}));

export const IconWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    padding: "8px",
    borderRadius: "8px",
    backgroundColor: theme.palette.primary.main, 
    color: theme.palette.primary.contrastText, 
}));