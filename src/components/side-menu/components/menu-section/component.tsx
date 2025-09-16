import { Box } from "@mui/material";
import { FC, JSX } from "react";
import { useAuthContext } from "../../../../providers/auth/context";
import MenuItem from "../menu-item";
import SectionHeader from "../header-section";

interface MenuSectionProps {
  title: string;
  items: Array<{
    label: string;
    icon: JSX.Element;
    route?: string;
    permission?: string;
    resource?: string;
    subItems?: Array<{
      label: string;
      icon: JSX.Element;
      route: string;
      permission: string;
    }>;
  }>;
  open: boolean;
  requiredPermission?: string;
  requiredResources?: string[];
}

export const MenuSection: FC<MenuSectionProps> = ({
  title,
  items,
  open,
  requiredPermission,
  requiredResources,
}) => {
  const { hasPermission, canAccess, user } = useAuthContext();

   const filteredItems = items.filter(item => {
    // ADD THIS CHECK FOR DOCTOR_OWNER
    if (user?.role === 'doctor_owner') {
      return true; // Doctor owner sees everything
    }
    
    // Existing permission check
    if (item.permission) {
      return user?.permissions?.includes(item.permission);
    }
    
    // If item has subitems, check those too
    if (item.subItems) {
      item.subItems = item.subItems.filter(subItem => {
        // ADD THIS CHECK FOR DOCTOR_OWNER
        if (user?.role === 'doctor_owner') {
          return true;
        }
        
        if (subItem.permission) {
          return user?.permissions?.includes(subItem.permission);
        }
        return true;
      });
    }
    
    return true; // No permission required
  });

  const shouldShowSection = () => {
    if (requiredPermission && !hasPermission(requiredPermission)) return false;

    if (requiredResources) {
      const hasResourceAccess = requiredResources.some(resource => canAccess(resource));
      if (!hasResourceAccess) return false;
    }

    return filteredItems.some(item => {
      if (item.permission && !hasPermission(item.permission)) return false;
      if (item.resource && !canAccess(item.resource)) return false;
      return true;
    });
  };

  if (!shouldShowSection()) return null;

  return (
    <Box>
      <SectionHeader title={title} open={open} />
      {filteredItems.map((item) => {
        const hasAccess = item.permission ? hasPermission(item.permission) :
          item.resource ? canAccess(item.resource) : true;

        if (!hasAccess) return null;

        return (
          <MenuItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            route={item.route}
            permission={item.permission}
            subItems={item.subItems}
            open={open}
          />
        );
      })}
    </Box>
  );
};