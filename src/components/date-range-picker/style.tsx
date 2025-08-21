import { Box, BoxProps, styled } from "@mui/material";

export const DateRangePickerWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  maxWidth: '280px',
  margin: '0 auto',
  
  '& .MuiButton-root': {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1, 2),
    width: '100%',
    minHeight: '56px',
    justifyContent: 'flex-start',
    textAlign: 'left',
    
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      borderColor: theme.palette.primary.main,
    },
  },
  
  [theme.breakpoints.up('xs')]: {
    maxWidth: '200px',
  },
  [theme.breakpoints.up('sm')]: {
    maxWidth: '240px',
  },
  [theme.breakpoints.up('md')]: {
    maxWidth: '280px',
  },
  
  '& .MuiPopover-paper': {
    maxWidth: '90vw',
    margin: theme.spacing(1),
  },
}));