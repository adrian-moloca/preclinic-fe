import { Box, BoxProps, styled, Typography, TypographyProps } from "@mui/material";

export const HeaderTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
    padding: "0 20px 8px",
    color: theme.palette.text.secondary, 
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    display: "block",
    fontSize: "0.65rem",
    position: "relative",
    "&:after": {
        content: '""',
        position: "absolute",
        bottom: -4,
        left: 20,
        right: 20,
        height: "2px",
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, transparent 100%)`, 
    }
}));

export const SectionHeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    position: "relative",
    margin: "16px 0",
    color: theme.palette.text.primary, 
}));