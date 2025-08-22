import React, { FC } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { 
  Favorite as FavoriteIcon, 
  FavoriteBorder as FavoriteBorderIcon 
} from '@mui/icons-material';
import { useFavorites, FavoriteItem } from '../../hooks/favorites';

interface FavoriteButtonProps {
  item: Omit<FavoriteItem, 'addedAt'>;
  size?: 'small' | 'medium' | 'large';
  color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export const FavoriteButton: FC<FavoriteButtonProps> = ({ 
  item, 
  size = 'medium',
  color = 'error'
}) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const isItemFavorite = isFavorite(item.id, item.type);

  const handleToggleFavorite = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (isItemFavorite) {
      removeFromFavorites(item.id, item.type);
    } else {
      addToFavorites(item);
    }
  };

  return (
    <Tooltip title={isItemFavorite ? 'Remove from favorites' : 'Add to favorites'}>
      <IconButton 
        onClick={handleToggleFavorite}
        size={size}
        color={isItemFavorite ? color : 'inherit'}
      >
        {isItemFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Tooltip>
  );
};