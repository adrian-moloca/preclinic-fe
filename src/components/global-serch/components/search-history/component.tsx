import React, { FC } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  History as HistoryIcon,
  Close as CloseIcon,
  DeleteSweep as ClearAllIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { SearchHistory } from '../types';

interface SearchHistoryProps {
  history: SearchHistory[];
  onHistoryClick: (query: string) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export const SearchHistoryComponent: FC<SearchHistoryProps> = ({
  history,
  onHistoryClick,
  onRemoveItem,
  onClearAll,
}) => {
  if (history.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <HistoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
        <Typography color="text.secondary">
          No search history yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        pb={1}
      >
        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
          Recent Searches
        </Typography>
        <IconButton size="small" onClick={onClearAll} title="Clear all history">
          <ClearAllIcon />
        </IconButton>
      </Box>
      <List dense>
        {history.map((item) => (
          <ListItem
            key={item.id}
            component="button"
            onClick={() => onHistoryClick(item.query)}
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            disableGutters
          >
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2">{item.query}</Typography>
                  <Chip
                    label={`${item.resultsCount} results`}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </Box>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveItem(item.id);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};