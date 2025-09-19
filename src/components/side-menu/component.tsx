import {
  Box,
  Drawer,
  IconButton,
  List,
  Typography,
  Fade,
  useTheme,
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarMonthIcon,
  Settings as SettingsIcon,
  Medication as MedicationIcon,
  VideoCall as VideoCallIcon,
  Reviews as ReviewsIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { FC, useState } from "react";
import { useAuthContext } from "../../providers/auth/context";
import { useClinicContext } from "../../providers/clinic/context";
import UserInfo from "./components/user-info";
import MenuSection from "./components/menu-section";
// Additional icon imports for better representations
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BadgeIcon from '@mui/icons-material/Badge';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DomainIcon from '@mui/icons-material/Domain';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DescriptionIcon from '@mui/icons-material/Description';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import GavelIcon from '@mui/icons-material/Gavel';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FolderIcon from '@mui/icons-material/Folder';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';

const drawerWidthOpen = 260;
const drawerWidthClosed = 90;

export const SideDrawer: FC = () => {
  const [open, setOpen] = useState(true);
  const { user } = useAuthContext();
  const { selectedClinic } = useClinicContext();
  const theme = useTheme(); 

  const toggleDrawer = () => setOpen(!open);

  
  const mainMenuItems = [
    { 
      label: "Dashboard", 
      icon: <DashboardIcon />, 
      route: "/", 
      permission: "view_dashboard" 
    },
    { 
      label: "Schedule", 
      icon: <CalendarViewMonthIcon />, 
      route: "/schedule", 
      resource: "schedule" 
    },
  ];

  const clinicOperationsItems = [
    {
      label: "Patients",
      icon: <GroupIcon />,
      resource: "patients",
      subItems: [
        { label: "All Patients", icon: <GroupIcon />, route: "/patients/all-patients", permission: "view_patients" },
        { label: "Add Patient", icon: <GroupAddIcon />, route: "/patients/create", permission: "manage_patients" },
      ]
    },
    {
      label: "Services",
      icon: <MedicalServicesIcon />,
      resource: "services",
      subItems: [
        { label: "All Services", icon: <MedicalServicesIcon />, route: "/services/all", permission: "view_services" },
        { label: "Add Service", icon: <AddBoxIcon />, route: "/services/create", permission: "manage_services" },
      ]
    },
    {
      label: "Doctors",
      icon: <LocalHospitalIcon />,
      resource: "doctors",
      subItems: [
        { label: "All Doctors", icon: <LocalHospitalIcon />, route: "/doctors/all", permission: "view_doctors" },
        { label: "Add Doctor", icon: <BadgeIcon />, route: "/doctors/create", permission: "manage_doctors" },
      ]
    },
    {
      label: "Assistants",
      icon: <BadgeIcon />,
      resource: "assistants",
      subItems: [
        { label: "All Assistants", icon: <BadgeIcon />, route: "/assistents/all", permission: "view_assistents" },
        { label: "Add Assistant", icon: <GroupAddIcon />, route: "/assistents/create", permission: "manage_assistents" },
      ]
    },
    {
      label: "Appointments",
      icon: <CalendarMonthIcon />,
      resource: "appointments",
      subItems: [
        { label: "All Appointments", icon: <CalendarMonthIcon />, route: "/appointments/all", permission: "view_appointments" },
        { label: "Online Appointments", icon: <VideoCallIcon />, route: "/appointments/online-appointments", permission: "view_appointments" },
      ]
    },
    {
      label: "Prescriptions",
      icon: <MedicationIcon />,
      resource: "prescriptions",
      subItems: [
        { label: "All Prescriptions", icon: <MedicationIcon />, route: "/prescriptions/all", permission: "view_prescriptions" },
        { label: "Add Prescription", icon: <NoteAddIcon />, route: "/prescriptions/create", permission: "manage_prescriptions" },
      ]
    },
    {
      label: "Products",
      icon: <Inventory2Icon />,
      resource: "products",
      subItems: [
        { label: "All Products", icon: <Inventory2Icon />, route: "/products/all", permission: "view_products" },
        { label: "Add Product", icon: <AddShoppingCartIcon />, route: "/products/create", permission: "manage_products" },
      ]
    },
    {
      label: "Reviews",
      icon: <ReviewsIcon />,
      resource: "reviews",
      subItems: [
        { label: "All Reviews", icon: <ReviewsIcon />, route: "/reviews/all", permission: "view_reviews" },
      ]
    },
  ];

  const staffManagementItems = [
    {
      label: "Departments",
      icon: <DomainIcon />,
      resoruce: "departments",
      subItems: [
        { label: "All Departments", icon: <DomainIcon />, route: "/departments/all", permission: "view_departments" },
        { label: "Add Department", icon: <DomainAddIcon />, route: "/departments/create", permission: "manage_departments" },
      ]
    },
    {
      label: "Leaves",
      icon: <EventBusyIcon />,
      resource: "leaves",
      subItems: [
        { label: "All Leaves", icon: <EventBusyIcon />, route: "/leaves/all-leaves", permission: "view_leaves" },
        { label: "Add Leave", icon: <EventAvailableIcon />, route: "/leaves/create", permission: "request_leaves" },
      ]
    },
    {
      label: "Payroll",
      icon: <AccountBalanceIcon />,
      resource: "payroll",
      subItems: [
        { label: "Add Payroll", icon: <RequestQuoteIcon />, route: "/payroll/add", permission: "manage_payroll" },
        { label: "All Payrolls", icon: <AccountBalanceIcon />, route: "/payroll/all", permission: "view_payroll" },
      ]
    },
    {
      label: "Invoices",
      icon: <ReceiptIcon />,
      resources: "invoices",
      subItems: [
        { label: "Add Invoice", icon: <DescriptionIcon />, route: "/invoices/create", permission: "manage_invoices" },
        { label: "All Invoices", icon: <ReceiptLongIcon />, route: "/invoices/all", permission: "view_invoices" },
      ]
    }
  ];

  const administrationItems = [
    { 
      label: "Settings", 
      icon: <SettingsIcon />, 
      route: "/settings", 
      permission: "manage_settings" 
    },
    {
      label: "File Manager",
      icon: <FolderIcon />,
      route: "/files",
      permission: "view_files"
    }
  ];

  const commonPagesItems = [
    {
      label: "Privacy Policy",
      icon: <PrivacyTipIcon />,
      route: "/privacy-policy",
    },
    {
      label: "Terms & Conditions",
      icon: <GavelIcon />,
      route: "/terms-and-conditions",
    }
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidthOpen : drawerWidthClosed,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        "& .MuiDrawer-paper": {
          width: open ? drawerWidthOpen : drawerWidthClosed,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowX: "hidden",
          overflowY: "hidden", 
          borderRight: "none",
          background: theme.palette.mode === 'dark' 
            ? "linear-gradient(180deg, #1e1e1e 0%, #2a2a2a 100%)" 
            : "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
          boxShadow: theme.palette.mode === 'dark' 
            ? "4px 0 20px rgba(0,0,0,0.5)" 
            : "4px 0 20px rgba(0,0,0,0.08)",
          position: "fixed",
          height: "100vh", 
          top: 0,
          left: 0,
          zIndex: 1200, 
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "1px",
            height: "100%",
            background: theme.palette.mode === 'dark' 
              ? "linear-gradient(180deg, transparent 0%, #555 50%, transparent 100%)" 
              : "linear-gradient(180deg, transparent 0%, #e0e0e0 50%, transparent 100%)",
          },
        },
      }}
    >
      {/* Toggle Button Section */}
      <Box
        display="flex"
        justifyContent={open ? "flex-end" : "center"}
        alignItems="center"
        p={2}
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          position: "sticky", 
          top: 0,
          zIndex: 10,
          flexShrink: 0, 
          overflow: "hidden",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme.palette.mode === 'dark' 
              ? "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)" 
              : "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <IconButton
            onClick={toggleDrawer}
            sx={{
              color: theme.palette.text.primary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Clinic Branding Section */}
      {selectedClinic && (
        <Box
          sx={{
            p: open ? 2 : 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            position: "sticky",
            top: "73px",
            zIndex: 9,
            flexShrink: 0,
          }}
        >
          <Fade in={open} timeout={300}>
            <Box>
              {open ? (
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    src={selectedClinic.logo}
                    sx={{ 
                      width: 32, 
                      height: 32,
                      bgcolor: 'primary.light',
                    }}
                  >
                    {!selectedClinic.logo && <BusinessIcon fontSize="small" />}
                  </Avatar>
                  <Box flex={1} minWidth={0}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="primary.main"
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {selectedClinic.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block'
                      }}
                    >
                      {selectedClinic.city}, {selectedClinic.state}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box display="flex" justifyContent="center">
                  <Avatar
                    src={selectedClinic.logo}
                    sx={{ 
                      width: 32, 
                      height: 32,
                      bgcolor: 'primary.light',
                    }}
                  >
                    {!selectedClinic.logo && <BusinessIcon fontSize="small" />}
                  </Avatar>
                </Box>
              )}
            </Box>
          </Fade>
        </Box>
      )}

      {/* User Info Section */}
      <Box sx={{ 
        position: "sticky", 
        top: selectedClinic ? "146px" : "73px", 
        zIndex: 9,
        flexShrink: 0,
        background: "inherit"
      }}>
        <UserInfo user={user} open={open} />
      </Box>

      {/* Menu Items */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        overflowX: 'hidden',
        py: 1,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
          borderRadius: '3px',
          '&:hover': {
            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
          },
        },
        scrollbarWidth: 'thin',
        scrollbarColor: theme.palette.mode === 'dark' 
          ? 'rgba(255,255,255,0.2) transparent' 
          : 'rgba(0,0,0,0.2) transparent',
      }}>
        <List sx={{ px: 1 }}>
          <MenuSection
            title="Main"
            items={mainMenuItems}
            open={open}
            setOpen={setOpen}
          />

          <MenuSection
            title="Clinic Operations"
            items={clinicOperationsItems}
            open={open}
            setOpen={setOpen}
            requiredResources={["patients", "appointments", "prescriptions", "products", "reviews"]}
          />

          <MenuSection
            title="Staff Management"
            items={staffManagementItems}
            open={open}
            setOpen={setOpen}
            requiredResources={["leaves"]}
          />

          <MenuSection
            title="Policy"
            items={commonPagesItems}
            open={open}
            setOpen={setOpen}
          />
          <MenuSection
            title="Administration"
            items={administrationItems}
            open={open}
            setOpen={setOpen}
            // requiredPermission={"manage_settings"}
          />
        </List>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          background: theme.palette.mode === 'dark' 
            ? "linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)" 
            : "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          p: 2,
          position: "sticky",
          bottom: 0,
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <Fade in={open} timeout={300}>
          <Box>
            {open && (
              <Box textAlign="center">
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary, 
                    display: 'block',
                    fontWeight: 600,
                    mb: 0.5,
                  }}
                >
                  {selectedClinic ? selectedClinic.name : 'Preclinic Dashboard'}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.disabled, 
                    display: 'block',
                    fontSize: '0.7rem',
                  }}
                >
                  v2.1.0 • {new Date().getFullYear()}
                </Typography>
              </Box>
            )}
          </Box>
        </Fade>
      </Box>
    </Drawer>
  );
};