import { Box, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import SideDrawer from "../../components/side-menu";
import Header from "../../components/header";

export const Layout = () => {
  const theme = useTheme();

  return (
    <Box 
      display="flex" 
      sx={{
        backgroundColor: theme.palette.background.default, 
        color: theme.palette.text.primary, 
        minHeight: '100vh',
        transition: 'background-color 0.3s ease, color 0.3s ease', 
      }}
    >
      <SideDrawer />
      <Box 
        flexGrow={1}
        sx={{
          backgroundColor: theme.palette.background.default, 
          color: theme.palette.text.primary, 
          transition: 'background-color 0.3s ease, color 0.3s ease',
        }}
      >
        <Header /> 
        <Box 
          p={2}
          sx={{
            backgroundColor: theme.palette.background.default, 
            color: theme.palette.text.primary, 
            minHeight: 'calc(100vh - 80px)', 
          }}
        >
          <Outlet /> 
        </Box>
      </Box>
    </Box>
  );
};