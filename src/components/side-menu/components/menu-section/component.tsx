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
  setOpen?: (value: boolean) => void;
  requiredPermission?: string;
  requiredResources?: string[];
}

export const MenuSection: FC<MenuSectionProps> = ({
  title,
  items,
  open,
  setOpen,
  requiredPermission,
  requiredResources,
}) => {
  const { hasPermission, canAccess, user } = useAuthContext();

  // Check if user is doctor_owner - they have access to everything
  const isDoctorOwner = user?.role === 'doctor_owner';

  const shouldShowSection = () => {
    // Doctor owner sees all sections
    if (isDoctorOwner) return true;

    if (requiredPermission && !hasPermission(requiredPermission)) return false;

    if (requiredResources) {
      const hasResourceAccess = requiredResources.some(resource => canAccess(resource));
      if (!hasResourceAccess) return false;
    }

    return items.some(item => {
      if (item.permission && !hasPermission(item.permission)) return false;
      if (item.resource && !canAccess(item.resource)) return false;
      return true;
    });
  };

  if (!shouldShowSection()) return null;

  return (
    <Box>
      <SectionHeader title={title} open={open} />
      {items.map((item) => {
        // Doctor owner bypasses all permission checks
        if (isDoctorOwner) {
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
        }

        // For other users, check permissions
        const hasAccess = item.permission ? hasPermission(item.permission) :
          item.resource ? canAccess(item.resource) : true;

        if (!hasAccess) return null;

        // Filter subitems based on permissions for non-doctor_owner users
        const filteredSubItems = item.subItems?.filter(subItem => {
          if (subItem.permission) {
            return hasPermission(subItem.permission);
          }
          return true;
        });

        return (
          <MenuItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            route={item.route}
            permission={item.permission}
            subItems={filteredSubItems}
            open={open}
          />
        );
      })}
    </Box>
  );
};