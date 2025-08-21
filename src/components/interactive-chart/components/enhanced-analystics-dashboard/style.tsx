import { Box, BoxProps, styled, Card } from "@mui/material";

export const AnalyticsDashboardWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  width: '100%',
  maxWidth: '1400px',
  margin: '0 auto',
  
  // Responsive padding
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(4, 3),
  },
}));

export const MetricCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '120px',
  width: '278px',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.palette.mode === 'dark' 
    ? "0px 2px 8px rgba(0, 0, 0, 0.5)" 
    : "0px 2px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? "0px 4px 16px rgba(0, 0, 0, 0.6)" 
      : "0px 4px 16px rgba(0, 0, 0, 0.15)",
  },
  
  [theme.breakpoints.up('sm')]: {
    height: '140px',
    padding: theme.spacing(2.5),
  },
  [theme.breakpoints.up('md')]: {
    height: '160px',
    padding: theme.spacing(3),
  },
}));

interface TabPanelProps extends BoxProps {
  value: number;
  index: number;
}

export const TabPanel = styled(Box)<TabPanelProps>(({ theme, value, index }) => ({
  display: value !== index ? 'none' : 'block',
  paddingTop: theme.spacing(3),
  width: '100%',
  
  '& > *': {
    width: '100%',
    maxWidth: '100%',
  },
  
  '& .MuiGrid-container': {
    width: '100%',
    margin: 0,
    justifyContent: 'center',
    
    '& .MuiGrid-item': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'stretch',
    },
  },
}));