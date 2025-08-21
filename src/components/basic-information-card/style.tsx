import { Box, BoxProps, styled } from "@mui/material";

export const BesicInformationCardWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
    padding: "16px",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "8px",
    backgroundColor: theme.palette.background.paper, 
    color: theme.palette.text.primary, 
    boxShadow: theme.palette.mode === 'dark' 
        ? "0 2px 4px rgba(0, 0, 0, 0.5)" 
        : "0 2px 4px rgba(0, 0, 0, 0.1)", 
    flexWrap: "wrap",
    gap: "16px",
}));

export const FirstSectionWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    minWidth: "200px",
    color: theme.palette.text.primary, 
}));

export const SecondSectionWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    minWidth: "120px",
    color: theme.palette.text.primary, 
}));

export const ThirdSectionWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    minWidth: "150px",
    color: theme.palette.text.primary, 
}));

export const FourthSectionWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    minWidth: "130px",
    color: theme.palette.text.primary, 
}));