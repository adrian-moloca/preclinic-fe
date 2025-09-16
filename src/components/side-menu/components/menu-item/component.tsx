import { 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Collapse, 
  List, 
  Tooltip,
  Box,
  Popover,
  Paper
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState, FC, useRef, JSX } from "react";
import { useNavigate } from "react-router-dom";

interface MenuItemProps {
  label: string;
  icon: JSX.Element;
  route?: string;
  open: boolean;
  permission?: string;
  subItems?: Array<{
    label: string;
    icon: JSX.Element;
    route: string;
    permission?: string;
  }>;
}

export const MenuItem: FC<MenuItemProps> = ({ 
  label, 
  icon, 
  route, 
  subItems, 
  open,
  permission 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!open && subItems) {
      // When closed with subitems, show popover
      setAnchorEl(event.currentTarget);
    } else if (subItems && open) {
      // When open with subitems, expand/collapse
      setExpanded(!expanded);
    } else if (route) {
      // Navigate for items without subitems
      navigate(route);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleSubItemClick = (subRoute: string) => {
    navigate(subRoute);
    handlePopoverClose();
  };

  // When drawer is closed
  if (!open) {
    const tooltipText = subItems ? `${label}` : label;
    const popoverOpen = Boolean(anchorEl);
    
    return (
      <>
        <Tooltip title={tooltipText} placement="right">
          <ListItemButton
            ref={buttonRef}
            onClick={handleClick}
            sx={{
              minHeight: 48,
              width: '100%',
              justifyContent: 'center',
              px: 0,
              py: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.primary',
                '& svg': {
                  fontSize: '1.5rem',
                }
              }}
            >
              {icon}
            </Box>
          </ListItemButton>
        </Tooltip>

        {/* Popover for subitems when drawer is closed */}
        {subItems && (
          <Popover
            open={popoverOpen}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            sx={{ ml: 1 }}
          >
            <Paper sx={{ p: 1, minWidth: 200 }}>
              <Box sx={{ fontWeight: 600, px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
                {label}
              </Box>
              <List dense>
                {subItems.map((subItem) => (
                  <ListItemButton
                    key={subItem.route}
                    onClick={() => handleSubItemClick(subItem.route)}
                    sx={{ py: 1 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {subItem.icon}
                    </ListItemIcon>
                    <ListItemText primary={subItem.label} />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Popover>
        )}
      </>
    );
  }

  // When drawer is open with subitems
  if (subItems && subItems.length > 0) {
    return (
      <>
        <ListItemButton onClick={handleClick} sx={{ minHeight: 48, px: 2 }}>
          <ListItemIcon 
            sx={{ 
              minWidth: 40,
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText primary={label} />
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subItems.map((subItem) => (
              <ListItemButton
                key={subItem.route}
                sx={{ pl: 3, minHeight: 44 }}
                onClick={() => navigate(subItem.route)}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40,
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {subItem.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText 
                  primary={subItem.label} 
                  primaryTypographyProps={{ fontSize: '0.9rem' }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </>
    );
  }

  // When drawer is open without subitems
  return (
    <ListItemButton 
      onClick={() => { if (route) navigate(route); }} 
      sx={{ minHeight: 48, px: 2 }}
    >
      <ListItemIcon 
        sx={{ 
          minWidth: 40,
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};