import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
  ButtonGroup,
  Stack,
  Card,
  Grid,
  Chip,
} from '@mui/material';
import {
  ResponsiveContainer,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
  Legend,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';
import { ChartDataPoint, ComparisonPeriod } from '../analistic-types';
import { ChartHeader, ComparisonChartWrapper, MetricCard } from './style';

interface ComparisonChartProps {
  title: string;
  currentData: ChartDataPoint[];
  previousData: ChartDataPoint[];
  currentLabel: string;
  previousLabel: string;
  comparisonPeriod?: ComparisonPeriod;
  onPeriodChange?: (period: ComparisonPeriod) => void;
  metrics?: {
    growth: number;
    trend: 'up' | 'down' | 'flat';
    total: number;
    previousTotal: number;
  };
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  title,
  currentData,
  previousData,
  currentLabel,
  previousLabel,
  comparisonPeriod = 'month',
  onPeriodChange,
  metrics,
}) => {
  const [viewType, setViewType] = useState<'overlay' | 'side-by-side'>('overlay');

  const combinedData = useMemo(() => {
    const maxLength = Math.max(currentData.length, previousData.length);
    const combined = [];

    for (let i = 0; i < maxLength; i++) {
      const current = currentData[i];
      const previous = previousData[i];
      
      combined.push({
        name: current?.name || previous?.name || `Period ${i + 1}`,
        current: current?.value || 0,
        previous: previous?.value || 0,
        currentLabel: currentLabel,
        previousLabel: previousLabel,
      });
    }

    return combined;
  }, [currentData, previousData, currentLabel, previousLabel]);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const renderTrendIcon = (trend: 'up' | 'down' | 'flat') => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="success" />;
      case 'down':
        return <TrendingDown color="error" />;
      default:
        return <TrendingFlat color="disabled" />;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const current = payload.find((p: any) => p.dataKey === 'current')?.value || 0;
      const previous = payload.find((p: any) => p.dataKey === 'previous')?.value || 0;
      const change = calculateChange(current, previous);

      return (
        <Card sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {label}
          </Typography>
          <Stack spacing={1}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="primary">
                {currentLabel}:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {current.toLocaleString()}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                {previousLabel}:
              </Typography>
              <Typography variant="body2">
                {previous.toLocaleString()}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2">
                Change:
              </Typography>
              <Chip
                label={`${change >= 0 ? '+' : ''}${change.toFixed(1)}%`}
                color={change >= 0 ? 'success' : 'error'}
                size="small"
              />
            </Box>
          </Stack>
        </Card>
      );
    }
    return null;
  };

  return (
    <ComparisonChartWrapper>
      <ChartHeader>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentLabel} vs {previousLabel}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <ButtonGroup size="small">
            <Button
              variant={viewType === 'overlay' ? 'contained' : 'outlined'}
              onClick={() => setViewType('overlay')}
            >
              Overlay
            </Button>
            <Button
              variant={viewType === 'side-by-side' ? 'contained' : 'outlined'}
              onClick={() => setViewType('side-by-side')}
            >
              Side by Side
            </Button>
          </ButtonGroup>

          {onPeriodChange && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={comparisonPeriod}
                onChange={(e) => onPeriodChange(e.target.value as ComparisonPeriod)}
              >
                <MenuItem value="week">Week over Week</MenuItem>
                <MenuItem value="month">Month over Month</MenuItem>
                <MenuItem value="quarter">Quarter over Quarter</MenuItem>
                <MenuItem value="year">Year over Year</MenuItem>
              </Select>
            </FormControl>
          )}
        </Stack>
      </ChartHeader>

      {metrics && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid>
            <MetricCard>
              <Typography variant="caption" color="text.secondary">
                Current Total
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {metrics.total.toLocaleString()}
              </Typography>
            </MetricCard>
          </Grid>
          <Grid>
            <MetricCard>
              <Typography variant="caption" color="text.secondary">
                Previous Total
              </Typography>
              <Typography variant="h6">
                {metrics.previousTotal.toLocaleString()}
              </Typography>
            </MetricCard>
          </Grid>
          <Grid>
            <MetricCard>
              <Typography variant="caption" color="text.secondary">
                Growth
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                {renderTrendIcon(metrics.trend)}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color={
                    metrics.growth > 0 
                      ? 'success.main' 
                      : metrics.growth < 0 
                      ? 'error.main' 
                      : 'text.secondary'
                  }
                >
                  {metrics.growth >= 0 ? '+' : ''}{metrics.growth.toFixed(1)}%
                </Typography>
              </Box>
            </MetricCard>
          </Grid>
          <Grid>
            <MetricCard>
              <Typography variant="caption" color="text.secondary">
                Difference
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {(metrics.total - metrics.previousTotal).toLocaleString()}
              </Typography>
            </MetricCard>
          </Grid>
        </Grid>
      )}

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={combinedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {viewType === 'overlay' ? (
            <>
              <Line
                type="monotone"
                dataKey="current"
                stroke="#4f46e5"
                strokeWidth={3}
                name={currentLabel}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                name={previousLabel}
                dot={{ r: 3 }}
              />
            </>
          ) : (
            <>
              <Bar
                dataKey="current"
                fill="#4f46e5"
                name={currentLabel}
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="previous"
                fill="#94a3b8"
                name={previousLabel}
                radius={[2, 2, 0, 0]}
              />
            </>
          )}
          
          <ReferenceLine y={0} stroke="#000" strokeDasharray="2 2" />
        </ComposedChart>
      </ResponsiveContainer>
    </ComparisonChartWrapper>
  );
};