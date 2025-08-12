import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import SideDrawer from "../../components/side-menu";
import Header from "../../components/header";

export const Layout = () => {
  return (
    <Box display="flex">
      <SideDrawer />
      <Box flexGrow={1}>
        <Header /> 
        <Box p={2}>
          <Outlet /> 
        </Box>
      </Box>
    </Box>
  );
};