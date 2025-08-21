import { Box, BoxProps, styled, Card } from "@mui/material";

export const ComparisonChartWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  boxShadow: theme.palette.mode === 'dark' 
    ? "0px 2px 8px rgba(0, 0, 0, 0.5)" 
    : "0px 2px 8px rgba(0, 0, 0, 0.1)",
  width: "100%",
  maxWidth: "100%",
  height: "auto",
  minHeight: "600px",
  margin: "0 auto",
  
  [theme.breakpoints.up('xs')]: {
    minHeight: "500px",
    padding: theme.spacing(2),
  },
  [theme.breakpoints.up('sm')]: {
    minHeight: "550px",
    padding: theme.spacing(2.5),
  },
  [theme.breakpoints.up('md')]: {
    minHeight: "600px",
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up('lg')]: {
    minHeight: "650px",
    padding: theme.spacing(3),
  },
}));

export const ChartHeader = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  width: "100%",
  
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

export const MetricCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100px',
  width: '100%',
  textAlign: 'center',
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  
  [theme.breakpoints.up('sm')]: {
    height: '110px',
    padding: theme.spacing(2.5),
  },
  [theme.breakpoints.up('md')]: {
    height: '120px',
    padding: theme.spacing(3),
  },
}));