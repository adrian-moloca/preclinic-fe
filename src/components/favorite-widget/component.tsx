import React, { FC, useState } from 'react';
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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Person as PersonIcon,
  Event as EventIcon,
  LocalPharmacy as PrescriptionIcon,
  Inventory as ProductIcon,
  LocalHospital as DoctorIcon,
  MedicalServices as ServiceIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useFavorites, FavoriteItem } from '../../hooks/favorites';

const getIcon = (type: string) => {
  switch (type) {
    case 'patient':
      return <PersonIcon />;
    case 'appointment':
      return <EventIcon />;
    case 'prescription':
      return <PrescriptionIcon />;
    case 'product':
      return <ProductIcon />;
    case 'doctor':
      return <DoctorIcon />;
    case 'service':
      return <ServiceIcon />;
    default:
      return <FavoriteIcon />;
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
    case 'product':
      return 'warning';
    case 'doctor':
      return 'info';
    case 'service':
      return 'error';
    default:
      return 'default';
  }
};

interface FavoritesWidgetProps {
  maxItems?: number;
  showTabs?: boolean;
}

export const FavoritesWidget: FC<FavoritesWidgetProps> = ({ 
  maxItems = 10, 
  showTabs = true 
}) => {
  const navigate = useNavigate();
  const { favorites, removeFromFavorites, getFavoritesByType } = useFavorites();
  const [selectedTab, setSelectedTab] = useState(0);

  const types: FavoriteItem['type'][] = ['patient', 'appointment', 'prescription', 'product', 'doctor', 'service'];
  const tabLabels = ['All', 'Patients', 'Appointments', 'Prescriptions', 'Products', 'Doctors', 'Services'];

  const getFilteredFavorites = () => {
    if (selectedTab === 0) {
      return favorites.slice(0, maxItems);
    }
    const type = types[selectedTab - 1];
    return getFavoritesByType(type).slice(0, maxItems);
  };

  const handleItemClick = (url: string) => {
    navigate(url);
  };

  const handleRemoveFromFavorites = (id: string, type: string, event: React.MouseEvent) => {
    event.stopPropagation();
    removeFromFavorites(id, type);
  };

  const filteredFavorites = getFilteredFavorites();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
          <FavoriteIcon />
          Favorites
        </Typography>

        {showTabs && favorites.length > 0 && (
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            {tabLabels.map((label, index) => (
              <Tab
                key={label}
                label={label}
                sx={{ minWidth: 'auto', px: 1 }}
              />
            ))}
          </Tabs>
        )}

        {filteredFavorites.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {selectedTab === 0 
              ? "No favorite items yet. Star items to add them to your favorites."
              : `No favorite ${tabLabels[selectedTab].toLowerCase()} yet.`
            }
          </Typography>
        ) : (
          <List dense>
            {filteredFavorites.map((item, index) => (
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
                        {!showTabs && (
                          <Chip
                            label={item.type}
                            size="small"
                            variant="outlined"
                            color={getTypeColor(item.type) as any}
                          />
                        )}
                      </Box>
                    }
                    secondary={item.subtitle}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => handleRemoveFromFavorites(item.id, item.type, e)}
                    sx={{ ml: 1 }}
                  >
                    <FavoriteIcon fontSize="small" color="error" />
                  </IconButton>
                </ListItem>
                {index < filteredFavorites.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};