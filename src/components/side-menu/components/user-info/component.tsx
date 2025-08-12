import { Box, Typography, Avatar, Chip } from "@mui/material";
import { FC } from "react";
import { IUsers } from "../../../../providers/users";
import { User } from "../../../../providers/auth/types";

interface UserInfoProps {
  user: User | IUsers | null;
  open: boolean;
}

export const UserInfo: FC<UserInfoProps> = ({ user, open }) => {
  if (!user) return null;

  return (
    <Box
      sx={{
        p: 2,
        color: "white",
        position: "relative",
        overflow: "hidden",
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.3,
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {open ? (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={user.profileImg}
              sx={{
                width: 40,
                height: 40,
                border: "2px solid rgba(255,255,255,0.3)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              {user.firstName?.[0]}{user.lastName?.[0]}
            </Avatar>
            <Box flex={1}>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ color: "#000" }}
              >
                {user.firstName} {user.lastName}
              </Typography>
              <Chip
                label={user.role?.replace('-', ' ').toUpperCase() || 'USER'}
                size="small"
                sx={{
                  fontSize: '0.6rem',
                  height: 20,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: '#000',
                  '& .MuiChip-label': {
                    fontWeight: 600,
                  },
                }}
              />
            </Box>
          </Box>
        ) : (
          <Box display="flex" justifyContent="center">
            <Avatar
              src={user.profileImg}
              sx={{
                width: 36,
                height: 36,
                border: "2px solid rgba(255,255,255,0.3)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              {user.firstName?.[0]}{user.lastName?.[0]}
            </Avatar>
          </Box>
        )}
      </Box>
    </Box>
  );
};
