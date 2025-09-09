import React, { FC, useState, MouseEvent } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
} from "@mui/material";
import {
  Person,
  Settings,
  Logout,
  VpnKey,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useProfileContext } from "../../providers/profile";
import { useAuthContext } from "../../providers/auth";

export const AvatarMenu: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  
  const { profiles } = useProfileContext();
  const { user, logout } = useAuthContext();
  
  const currentProfile = user || Object.values(profiles)[0];

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileSettings = () => {
    navigate("/profile/settings");
    handleClose();
  };

  const handleChangePassword = () => {
    navigate("/profile/change-password");
    handleClose();
  };

  const handleLogout = async () => {
    try {
       logout();
      navigate("/sign-in");
    } catch (error) {
      console.error("❌ Logout error:", error);
      navigate("/sign-in");
    }
    handleClose();
  };

  const displayName = currentProfile 
    ? `${currentProfile.firstName || ''} ${currentProfile.lastName || ''}`.trim() || 'User'
    : 'User';
  const displayEmail = currentProfile?.email || '';

  const getProfileImage = () => {
    if (!currentProfile) return undefined;
    
    const imageFields = ['profileImg', 'profileImage', 'image', 'avatar'];
    for (const field of imageFields) {
      if (field in currentProfile && typeof (currentProfile as any)[field] === 'string') {
        return (currentProfile as any)[field];
      }
    }
    return undefined;
  };

  const profileImage = getProfileImage();

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar
          src={profileImage}
          alt={displayName}
          sx={{ width: 36, height: 36 }}
        >
          {!profileImage && displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {currentProfile && (
          <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {displayEmail}
            </Typography>
          </Box>
        )}
        
        <Divider />

        <MenuItem onClick={handleProfileSettings}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile Settings
        </MenuItem>

        <MenuItem onClick={handleChangePassword}>
          <ListItemIcon>
            <VpnKey fontSize="small" />
          </ListItemIcon>
          Change Password
        </MenuItem>

        <MenuItem onClick={() => navigate("/settings")}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};