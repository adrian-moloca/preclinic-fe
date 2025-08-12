import { Box, Button, ButtonProps, BoxProps, styled } from "@mui/material";

export const HeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "12px 24px",
    backgroundColor: "#fff",
    boxShadow: theme.shadows[1],
    position: "sticky",
    top: 0,
    zIndex: 1100,
    boxSizing: "border-box",
    overflow: "hidden",
    maxWidth: "100vw",
}));

export const FirstSectionWrapper = styled(Box)({
    display: "flex",
    alignItems: "center",
    flex: 1,
    minWidth: 240,
});

export const SecondSectionWrapper = styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 16,
    flex: 2,
    flexWrap: "wrap",
});

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
    borderColor: theme.palette.grey[300],
    backgroundColor: "#f9f9f9",
    "&:hover": {
        backgroundColor: theme.palette.grey[200],
    },
}));
