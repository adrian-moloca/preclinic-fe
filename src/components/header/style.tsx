import { Box, Button, ButtonProps, BoxProps, styled } from "@mui/material";

export const HeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "12px 24px",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    position: "sticky",
    top: 0,
    zIndex: 1100,
    boxSizing: "border-box",
    overflow: "hidden",
    maxWidth: "100vw",
}));

export const FirstSectionWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    flex: 1,
    minWidth: 240,
    color: theme.palette.text.primary,
}));

export const SecondSectionWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 16,
    flex: 2,
    flexWrap: "wrap",
    color: theme.palette.text.primary,
}));

export const AiButton = styled(Button)<ButtonProps>(({ theme }) => ({
    height: 40,
    borderRadius: 8,
    textTransform: "none",
    fontWeight: 500,
    paddingLeft: 20,
    paddingRight: 20,
    whiteSpace: "nowrap",
}));

export const HeaderButtonsWrapper = styled(Box)({
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
});

export const IconButtons = styled(Button)<ButtonProps>(({ theme }) => ({
    minWidth: 0,
    width: 36,
    height: 36,
    borderRadius: "50%",
    padding: 0,
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
    "&:hover": {
        backgroundColor: theme.palette.action.selected,
    },
}));