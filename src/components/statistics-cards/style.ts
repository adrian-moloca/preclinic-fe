import { Box, BoxProps, Card, CardProps, Grid, GridProps, styled } from "@mui/material";

export const StatisticsCardsWrapper = styled(Grid)<GridProps>({
    spacing: 2,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
});

export const StatisticCard = styled(Card)<CardProps>(({ theme }) => ({
    padding: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    width: 250,
    backgroundColor: theme.palette.background.paper, 
    color: theme.palette.text.primary, 
}));

export const CardContentWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: theme.palette.text.primary, 
}));

export const StatisticIconWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));