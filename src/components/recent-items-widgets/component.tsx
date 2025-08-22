import React, { FC } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Event as EventIcon,
  LocalPharmacy as PrescriptionIcon,
  Close as CloseIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useRecentItems } from '../../hooks/recent-items';
import { formatDistanceToNow } from 'date-fns';

const getIcon = (type: string) => {
  switch (type) {
    case 'patient':
      return <PersonIcon />;
    case 'appointment':
      return <EventIcon />;
    case 'prescription':
      return <PrescriptionIcon />;
    default:
      return <HistoryIcon />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'patient':
      return 'primary';
    case 'appointment':
      return 'secondary';
    case 'prescription':
      return 'success';
    default:
      return 'default';
  }
};

export const RecentItemsWidget: FC = () => {
  const navigate = useNavigate();
  const { recentItems, removeRecentItem, clearRecentItems } = useRecentItems();

  const handleItemClick = (url: string) => {
    navigate(url);
  };

  const handleRemoveItem = (id: string, type: string, event: React.MouseEvent) => {
    event.stopPropagation();
    removeRecentItem(id, type);
  };

  if (recentItems.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
            <HistoryIcon />
            Recently Viewed
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No recent items yet. Items you view will appear here for quick access.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" display="flex" alignItems="center" gap={1}>
            <HistoryIcon />
            Recently Viewed
          </Typography>
          <IconButton size="small" onClick={clearRecentItems} title="Clear all">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <List dense>
          {recentItems.map((item, index) => (
            <React.Fragment key={`${item.type}-${item.id}`}>
              <ListItem
                onClick={() => handleItemClick(item.url)}
                sx={{ px: 0 }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: `${getTypeColor(item.type)}.light` }}>
                    {getIcon(item.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" fontWeight={500}>
                        {item.title}
                      </Typography>
                      <Chip
                        label={item.type}
                        size="small"
                        variant="outlined"
                        color={getTypeColor(item.type) as any}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      {item.subtitle && (
                        <Typography variant="caption" display="block">
                          {item.subtitle}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                      </Typography>
                    </Box>
                  }
                />
                <IconButton
                  size="small"
                  onClick={(e) => handleRemoveItem(item.id, item.type, e)}
                  sx={{ ml: 1 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </ListItem>
              {index < recentItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};