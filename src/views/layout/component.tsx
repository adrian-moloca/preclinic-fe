import { Box, useTheme } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SideDrawer from "../../components/side-menu";
import Header from "../../components/header";
import { useAuthContext } from "../../providers/auth/context";

export const Layout = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { getMe, logout } = useAuthContext();

  // Call getMe on every route change and handle authentication
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getMe();
      // If getMe returns null, user is not authenticated
      if (!user) {
        logout(); // Clear any remaining auth state
        navigate('/sign-in', { replace: true });
      }
    };
    
    checkAuth();
  }, [location.pathname, getMe, logout, navigate]);

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