import { Box, BoxProps, styled, Chip } from "@mui/material";

export const InteractiveChartWrapper = styled(Box)<BoxProps>(({ theme }) => ({
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
  minHeight: "400px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  
  [theme.breakpoints.up('xs')]: {
    minHeight: "350px",
    padding: theme.spacing(2),
  },
  [theme.breakpoints.up('sm')]: {
    minHeight: "400px",
    padding: theme.spacing(2.5),
  },
  [theme.breakpoints.up('md')]: {
    minHeight: "450px",
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up('lg')]: {
    minHeight: "500px",
    padding: theme.spacing(3),
  },
}));

export const ChartHeader = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  width: "100%",
  
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

export const FilterChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  '& .MuiChip-deleteIcon': {
    color: theme.palette.primary.contrastText,
  },
}));