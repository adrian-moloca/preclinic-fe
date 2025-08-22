import React, { FC } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { DraftManager } from '../../../../components/draft-manager/component';
import RecentItemsWidget from '../../../../components/recent-items-widgets';
import FavoritesWidget from '../../../../components/favorite-widget';

export const QuickAccessPanel: FC = () => {
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Quick Access
      </Typography>
      
      <Grid container spacing={3}>
        <Grid>
          <RecentItemsWidget />
        </Grid>
        
        <Grid>
          <FavoritesWidget maxItems={8} showTabs={false} />
        </Grid>
        
        <Grid>
          <DraftManager />
        </Grid>
      </Grid>
    </Box>
  );
};