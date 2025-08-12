import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { FC, JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../../providers/auth/context";

interface SubItem {
  label: string;
  icon: JSX.Element;
  route: string;
  permission: string;
}

interface MenuItemProps {
  label: string;
  icon: JSX.Element;
  route?: string;
  permission?: string;
  subItems?: SubItem[];
  open: boolean;
}

export const MenuItem: FC<MenuItemProps> = ({
  label,
  icon,
  route,
  permission,
  subItems,
  open,
}) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { hasPermission } = useAuthContext();

  const handleClick = () => {
    if (subItems) {
      setExpanded(!expanded);
    } else if (route) {
      navigate(route);
    }
  };

  const hasAccess = permission ? hasPermission(permission) : true;
  if (!hasAccess) return null;

  return (
    <Box>
      <Tooltip title={!open ? label : ""} placement="right">
        <ListItemButton
          onClick={handleClick}
          sx={{
            px: 2.5,
            py: 1.5,
            borderRadius: 2,
            mx: 1,
            mb: 0.5,
            color: "#333",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              backgroundColor: "#e3f2fd",
              transform: "translateX(4px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            },
            "&:before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: "3px",
              backgroundColor: "primary.main",
              transform: "scaleY(0)",
              transition: "transform 0.2s ease",
            },
            "&:hover:before": {
              transform: "scaleY(1)",
            },
            transition: "all 0.2s ease",
          }}
        >
          <ListItemIcon 
            sx={{ 
              minWidth: 0, 
              mr: open ? 2 : "auto", 
              justifyContent: "center",
              color: "inherit",
            }}
          >
            {icon}
          </ListItemIcon>
          {open && <ListItemText primary={label} />}
          {open && subItems && (expanded ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </Tooltip>

      {subItems && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subItems.map((subItem) => {
              if (!hasPermission(subItem.permission)) return null;
              
              return (
                <ListItemButton
                  key={subItem.label}
                  onClick={() => navigate(subItem.route)}
                  sx={{
                    pl: open ? 8 : 2,
                    py: 1,
                    mx: 1,
                    borderRadius: 2,
                    color: "#555",
                    position: "relative",
                    "&:hover": {
                      backgroundColor: "#f1f1f1",
                      color: "primary.main",
                      transform: "translateX(2px)",
                    },
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      left: open ? 6 : 1,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      opacity: 0,
                      transition: "opacity 0.2s ease",
                    },
                    "&:hover:before": {
                      opacity: 1,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {open && <ListItemText primary={subItem.label} />}
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      )}
    </Box>
  );
};