import React from 'react';
import { 
  Box, 
  Skeleton, 
  Card, 
  CardContent, 
  Stack,
  Grid,
  Paper
} from '@mui/material';

interface LoadingSkeletonProps {
  variant?: 'table' | 'card' | 'form' | 'dashboard' | 'list' | 'profile';
  rows?: number;
  height?: number | string;
  animation?: 'pulse' | 'wave' | false;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  rows = 5,
  height = 'auto',
  animation = 'wave'
}) => {
  const renderTableSkeleton = () => (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="30%" height={40} animation={animation} />
        <Skeleton variant="rectangular" width="100%" height={50} sx={{ mt: 1 }} animation={animation} />
      </Box>
      {Array.from({ length: rows }).map((_, index) => (
        <Box key={index} sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="circular" width={40} height={40} animation={animation} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" animation={animation} />
              <Skeleton variant="text" width="40%" animation={animation} />
            </Box>
            <Skeleton variant="rectangular" width={80} height={32} animation={animation} />
          </Stack>
        </Box>
      ))}
    </Paper>
  );

  const renderCardSkeleton = () => (
    <Grid container spacing={3}>
      {Array.from({ length: rows }).map((_, index) => (
        <Grid key={index}>
          <Card elevation={1}>
            <CardContent>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Skeleton variant="circular" width={48} height={48} animation={animation} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="80%" animation={animation} />
                    <Skeleton variant="text" width="60%" animation={animation} />
                  </Box>
                </Box>
                <Skeleton variant="rectangular" width="100%" height={120} animation={animation} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Skeleton variant="rectangular" width={80} height={32} animation={animation} />
                  <Skeleton variant="rectangular" width={80} height={32} animation={animation} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderFormSkeleton = () => (
    <Paper sx={{ p: 3 }}>
      <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} animation={animation} />
      <Grid container spacing={3}>
        {Array.from({ length: rows * 2 }).map((_, index) => (
          <Grid key={index}>
            <Box sx={{ mb: 2 }}>
              <Skeleton variant="text" width="30%" height={20} animation={animation} />
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ mt: 1 }} animation={animation} />
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        <Skeleton variant="rectangular" width={100} height={40} animation={animation} />
        <Skeleton variant="rectangular" width={100} height={40} animation={animation} />
      </Box>
    </Paper>
  );

  const renderDashboardSkeleton = () => (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="40%" height={48} animation={animation} />
        <Skeleton variant="text" width="60%" height={24} animation={animation} />
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Skeleton variant="circular" width={56} height={56} animation={animation} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="80%" height={32} animation={animation} />
                    <Skeleton variant="text" width="60%" animation={animation} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} animation={animation} />
              <Skeleton variant="rectangular" width="100%" height={300} animation={animation} />
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} animation={animation} />
              {Array.from({ length: 5 }).map((_, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Skeleton variant="circular" width={32} height={32} animation={animation} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="70%" animation={animation} />
                    <Skeleton variant="text" width="50%" animation={animation} />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderListSkeleton = () => (
    <Paper>
      {Array.from({ length: rows }).map((_, index) => (
        <Box key={index} sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="circular" width={48} height={48} animation={animation} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="70%" animation={animation} />
              <Skeleton variant="text" width="50%" animation={animation} />
            </Box>
            <Skeleton variant="rectangular" width={24} height={24} animation={animation} />
          </Box>
        </Box>
      ))}
    </Paper>
  );

  const renderProfileSkeleton = () => (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Skeleton variant="circular" width={120} height={120} animation={animation} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="50%" height={40} animation={animation} />
              <Skeleton variant="text" width="70%" height={24} animation={animation} />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Skeleton variant="rectangular" width={80} height={24} animation={animation} />
                <Skeleton variant="rectangular" width={80} height={24} animation={animation} />
                <Skeleton variant="rectangular" width={80} height={24} animation={animation} />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} animation={animation} />
              {Array.from({ length: 6 }).map((_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Skeleton variant="text" width="25%" animation={animation} />
                  <Skeleton variant="text" width="60%" animation={animation} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} animation={animation} />
              <Skeleton variant="rectangular" width="100%" height={200} animation={animation} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const skeletons = {
    table: renderTableSkeleton,
    card: renderCardSkeleton,
    form: renderFormSkeleton,
    dashboard: renderDashboardSkeleton,
    list: renderListSkeleton,
    profile: renderProfileSkeleton,
  };

  return (
    <Box sx={{ height }}>
      {skeletons[variant]()}
    </Box>
  );
};