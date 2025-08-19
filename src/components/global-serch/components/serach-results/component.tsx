import React, { FC } from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Event as EventIcon,
  Medication as MedicationIcon,
  Inventory as InventoryIcon,
  LocalHospital as DoctorIcon,
  AssignmentInd as AssistantIcon,
} from '@mui/icons-material';
import { SearchResult } from '../types';

interface SearchResultsProps {
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
  maxHeight?: number;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'patient': return <PersonIcon />;
    case 'appointment': return <EventIcon />;
    case 'prescription': return <MedicationIcon />;
    case 'product': return <InventoryIcon />;
    case 'doctor': return <DoctorIcon />;
    case 'assistant': return <AssistantIcon />;
    default: return <PersonIcon />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'patient': return 'primary';
    case 'appointment': return 'secondary';
    case 'prescription': return 'success';
    case 'product': return 'warning';
    case 'doctor': return 'info';
    case 'assistant': return 'error';
    default: return 'default';
  }
};

export const SearchResults: FC<SearchResultsProps> = ({
  results,
  onResultClick,
  maxHeight = 400,
}) => {
  if (results.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="text.secondary">
          No results found. Try adjusting your search terms.
        </Typography>
      </Box>
    );
  }

  const groupedResults = results.reduce((groups, result) => {
    const type = result.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(result);
    return groups;
  }, {} as Record<string, SearchResult[]>);

  return (
    <Box sx={{ maxHeight, overflowY: 'auto' }}>
      {Object.entries(groupedResults).map(([type, typeResults], groupIndex) => (
        <Box key={type}>
          {groupIndex > 0 && <Divider />}
          <Typography
            variant="subtitle2"
            sx={{
              p: 2,
              pb: 1,
              fontWeight: 600,
              textTransform: 'capitalize',
              color: 'text.secondary',
            }}
          >
            {type}s ({typeResults.length})
          </Typography>
          <List dense>
            {typeResults.map((result, index) => (
              <ListItem
                key={result.id}
                component="button"
                onClick={() => onResultClick(result)}
                disableGutters
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  cursor: 'pointer',
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={result.avatar}
                    sx={{
                      bgcolor: `${getTypeColor(result.type)}.main`,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {result.avatar ? undefined : getTypeIcon(result.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" fontWeight={500}>
                        {result.title}
                      </Typography>
                      {result.status && (
                        <Chip
                          label={result.status}
                          size="small"
                          color={getTypeColor(result.type) as any}
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {result.subtitle}
                      </Typography>
                      {result.description && (
                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: 300,
                          }}
                        >
                          {result.description}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
};