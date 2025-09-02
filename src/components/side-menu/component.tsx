import {
  Box,
  Drawer,
  IconButton,
  List,
  Typography,
  Fade,
  useTheme,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarMonthIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
  Settings as SettingsIcon,
  Medication as MedicationIcon,
  ExitToApp as ExitToAppIcon,
  VideoCall as VideoCallIcon,
  Inventory as InventoryIcon,
  Reviews as ReviewsIcon,
  Chat as ChatIcon,
  MedicalServices,
  AutoMode,
} from "@mui/icons-material";
import { FC, useState } from "react";
import { useAuthContext } from "../../providers/auth/context";
import UserInfo from "./components/user-info";
import MenuSection from "./components/menu-section";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import BusinessIcon from "@mui/icons-material/Business";
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import GavelIcon from '@mui/icons-material/Gavel';
import PaymentsIcon from '@mui/icons-material/Payments';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FolderIcon from '@mui/icons-material/Folder';
import { useMedicalDecisionSupport } from "../../providers/medical-decision-support/context";
import { useWorkflowAutomation } from "../../providers/workflow-automation/context";

const drawerWidthOpen = 260;
const drawerWidthClosed = 70;

export const SideDrawer: FC = () => {
  const [open, setOpen] = useState(true);
  const { user } = useAuthContext();
  const { stats } = useWorkflowAutomation();
  const theme = useTheme();
  const { getCriticalAlerts } = useMedicalDecisionSupport();
  const criticalAlerts = getCriticalAlerts();

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
      icon: <AccessTimeIcon />,
      route: "/schedule",
      resource: "schedule"
    },
  ];

  const clinicOperationsItems = [
    {
      label: "Patients",
      icon: <PersonIcon />,
      resource: "patients",
      subItems: [
        { label: "All Patients", icon: <PersonIcon />, route: "/patients/all-patients", permission: "view_patients" },
        { label: "Add Patient", icon: <PersonAddIcon />, route: "/patients/create", permission: "manage_patients" },
      ]
    },
    {
      label: "Appointments",
      icon: <CalendarMonthIcon />,
      resource: "appointments",
      subItems: [
        { label: "All Appointments", icon: <CalendarMonthIcon />, route: "/appointments/all", permission: "view_appointments" },
        { label: "Online Appointments", icon: <VideoCallIcon />, route: "/appointments/online", permission: "view_appointments" },
      ]
    },
    {
      label: "Prescriptions",
      icon: <MedicationIcon />,
      resource: "prescriptions",
      subItems: [
        { label: "All Prescriptions", icon: <MedicationIcon />, route: "/prescriptions/all", permission: "view_prescriptions" },
        { label: "Add Prescription", icon: <PersonAddIcon />, route: "/prescriptions/create", permission: "manage_prescriptions" },
      ]
    },
    {
      label: "Medical Alerts",
      icon: (
        <Badge badgeContent={criticalAlerts.length} color="error" max={99}>
          <MedicalServices />
        </Badge>
      ),
      resource: "medical-alerts",
      subItems: [
        { label: "Alert Dashboard", icon: <MedicalServices />, route: "/medical-alerts", permission: "view_dashboard" },
      ]
    },
    {
      label: "Products",
      icon: <InventoryIcon />,
      resource: "products",
      subItems: [
        { label: "All Products", icon: <InventoryIcon />, route: "/products/all", permission: "view_products" },
        { label: "Add Product", icon: <PersonAddIcon />, route: "/products/create", permission: "manage_products" },
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
    {
      label: "Doctors",
      icon: <MedicalServicesIcon />,
      subItems: [
        { label: "All Doctors", icon: <MedicalServicesIcon />, route: "/doctors/all", permission: "view_doctors" },
        { label: "Add Doctor", icon: <PersonAddIcon />, route: "/doctors/create", permission: "manage_doctors" },
      ]
    },
    {
      label: "Assistants",
      icon: <PersonIcon />,
      subItems: [
        { label: "All Assistants", icon: <PersonIcon />, route: "/assistents/all", permission: "view_assistents" },
        { label: "Add Assistant", icon: <PersonAddIcon />, route: "/assistents/create", permission: "manage_assistents" },
      ]
    },
    {
      label: "Services",
      icon: <MedicalServicesIcon />,
      subItems: [
        { label: "All Services", icon: <MedicalServicesIcon />, route: "/services/all", permission: "view_services" },
        { label: "Add Service", icon: <PersonAddIcon />, route: "/services/create", permission: "manage_services" },
      ]
    },
    {
      label: "Departments",
      icon: <BusinessIcon />,
      subItems: [
        { label: "All Departments", icon: <BusinessIcon />, route: "/departments/all", permission: "view_departments" },
        { label: "Add Department", icon: <PersonAddIcon />, route: "/departments/create", permission: "manage_departments" },
      ]
    },
    {
      label: "Chat",
      icon: <ChatIcon />,
      route: "/chat",
      resource: "chat"
    },
  ];

  const staffManagementItems = [
    {
      label: "Leaves",
      icon: <ExitToAppIcon />,
      resource: "leaves",
      subItems: [
        { label: "All Leaves", icon: <ExitToAppIcon />, route: "/leaves/all-leaves", permission: "view_leaves" },
        { label: "Add Leave", icon: <PersonAddIcon />, route: "/leaves/create", permission: "request_leaves" },
      ]
    },
    {
      label: "Payroll",
      icon: <PaymentsIcon />,
      subItems: [
        { label: "Add Payroll", icon: <PaymentsIcon />, route: "/payroll/add", permission: "manage_payroll" },
        { label: "All Payrolls", icon: <PaymentsIcon />, route: "/payroll/all", permission: "view_payrolls" },
      ]
    },
    {
      label: "Invoices",
      icon: <ReceiptIcon />,
      resources: "invoices",
      subItems: [
        { label: "Add Invoice", icon: <ReceiptIcon />, route: "/invoices/create", permission: "manage_invoices" },
        { label: "All Invoices", icon: <ReceiptIcon />, route: "/invoices/all", permission: "view_invoices" },
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

  // Show automationItems as a section, but it's just a page, not a menu
  const automationItems = [
    {
      label: "Workflow Automation",
      icon: (
        <Badge badgeContent={stats.activeRules} color="primary" max={99}>
          <AutoMode />
        </Badge>
      ),
      route: "/workflow-automation",
      permission: "manage_settings"
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

      <Box sx={{
        position: "sticky",
        top: "73px",
        zIndex: 9,
        flexShrink: 0,
        background: "inherit"
      }}>
        <UserInfo user={user} open={open} />
      </Box>

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
          />

          <MenuSection
            title="Clinic Operations"
            items={clinicOperationsItems}
            open={open}
            requiredResources={["patients", "appointments", "prescriptions", "products", "reviews"]}
          />

          <MenuSection
            title="Staff Management"
            items={staffManagementItems}
            open={open}
            requiredResources={["leaves"]}
          />

          <MenuSection
            title="Policy"
            items={commonPagesItems}
            open={open}
          />
          <MenuSection
            title="Administration"
            items={administrationItems}
            open={open}
            requiredPermission="manage_settings"
          />

          {/* Automation section as a single page */}
          <MenuSection
            title="Automation"
            items={automationItems}
            open={open}
            requiredPermission="manage_settings"
          />
        </List>
      </Box>

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
                  Your Clinic Dashboard
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