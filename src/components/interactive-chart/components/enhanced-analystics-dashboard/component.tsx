import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Stack,
  Tab,
  Tabs,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  People,
  EventNote,
  AttachMoney,
  Refresh,
} from '@mui/icons-material';
import { AnalyticsMetrics, ChartDataPoint, ChartFilter, ComparisonPeriod, DateRange } from '../analistic-types';
import { AnalyticsDashboardWrapper, MetricCard, TabPanel } from './style';
import DateRangePicker from '../../../date-range-picker';
import { InteractiveChart } from '../../component';
import ComparisonChart from '../comparison-chart';

interface EnhancedAnalyticsDashboardProps {
  onDataPointClick?: (data: any, chartType: string) => void;
  onExportData?: (data: any, format: string) => void;
}

export const EnhancedAnalyticsDashboard: React.FC<EnhancedAnalyticsDashboardProps> = ({
  onDataPointClick,
  onExportData,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
  });
  const [comparisonPeriod, setComparisonPeriod] = useState<ComparisonPeriod>('month');
  const [, setFilters] = useState<ChartFilter>({});
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [realTimeEnabled] = useState(false);

  const loadAnalyticsData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMetrics: AnalyticsMetrics = {
        appointments: {
          total: 1247,
          completed: 1134,
          cancelled: 67,
          pending: 46,
          growth: 12.5,
        },
        revenue: {
          total: 125400,
          growth: 8.3,
          byDepartment: {
            'Cardiology': 45000,
            'Neurology': 32000,
            'Orthopedics': 28000,
            'General': 20400,
          },
        },
        patients: {
          total: 892,
          new: 156,
          returning: 736,
          growth: 15.2,
        },
        departments: {
          'Cardiology': { appointments: 245, revenue: 45000, patients: 189 },
          'Neurology': { appointments: 198, revenue: 32000, patients: 145 },
          'Orthopedics': { appointments: 156, revenue: 28000, patients: 123 },
          'General': { appointments: 648, revenue: 20400, patients: 435 },
        },
      };

      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleDataPointClick = (data: ChartDataPoint, chartType: string) => {
    console.log('Data point clicked:', data, chartType);
    onDataPointClick?.(data, chartType);
  };

  const handleFilterChange = (newFilters: ChartFilter) => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    loadAnalyticsData();
  };

  if (loading && !metrics) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
    );
  }

  // Prepare chart data from metrics with consistent structure
  const appointmentsData: ChartDataPoint[] = metrics
    ? [
        { 
          name: 'Completed', 
          value: metrics.appointments.completed, 
          date: dateRange.endDate.toISOString() 
        },
        { 
          name: 'Cancelled', 
          value: metrics.appointments.cancelled, 
          date: dateRange.endDate.toISOString() 
        },
        { 
          name: 'Pending', 
          value: metrics.appointments.pending, 
          date: dateRange.endDate.toISOString() 
        },
      ]
    : [];

  const revenueData: ChartDataPoint[] = metrics
    ? Object.entries(metrics.revenue.byDepartment).map(([dept, value]) => ({
        name: dept,
        value,
        date: dateRange.endDate.toISOString(),
      }))
    : [];

  const patientsData: ChartDataPoint[] = metrics
    ? [
        { 
          name: 'New', 
          value: metrics.patients.new, 
          date: dateRange.endDate.toISOString() 
        },
        { 
          name: 'Returning', 
          value: metrics.patients.returning, 
          date: dateRange.endDate.toISOString() 
        },
      ]
    : [];

  const departmentData: ChartDataPoint[] = metrics
    ? Object.entries(metrics.departments).map(([dept, data]) => ({
        name: dept,
        value: data.appointments,
        date: dateRange.endDate.toISOString(),
      }))
    : [];

  function generateComparisonData(data: ChartDataPoint[]): ChartDataPoint[] {
    return data.map(item => ({
      ...item,
      value: Math.round(item.value * 0.9),
    }));
  }

  return (
    <AnalyticsDashboardWrapper>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Enhanced Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Interactive charts and comprehensive analytics for your clinic
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            label="Date Range"
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {realTimeEnabled && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Real-time updates are enabled. Data refreshes every 30 seconds.
        </Alert>
      )}

      {metrics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid>
            <MetricCard>
              <Box display="flex" alignItems="center" gap={2}>
                <EventNote color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {metrics.appointments.total.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Appointments
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color={metrics.appointments.growth >= 0 ? 'success.main' : 'error.main'}
                  >
                    {metrics.appointments.growth >= 0 ? '+' : ''}{metrics.appointments.growth}%
                  </Typography>
                </Box>
              </Box>
            </MetricCard>
          </Grid>

          <Grid>
            <MetricCard>
              <Box display="flex" alignItems="center" gap={2}>
                <AttachMoney color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    ${metrics.revenue.total.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color={metrics.revenue.growth >= 0 ? 'success.main' : 'error.main'}
                  >
                    {metrics.revenue.growth >= 0 ? '+' : ''}{metrics.revenue.growth}%
                  </Typography>
                </Box>
              </Box>
            </MetricCard>
          </Grid>

          <Grid>
            <MetricCard>
              <Box display="flex" alignItems="center" gap={2}>
                <People color="info" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {metrics.patients.total.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Patients
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color={metrics.patients.growth >= 0 ? 'success.main' : 'error.main'}
                  >
                    {metrics.patients.growth >= 0 ? '+' : ''}{metrics.patients.growth}%
                  </Typography>
                </Box>
              </Box>
            </MetricCard>
          </Grid>

          <Grid>
            <MetricCard>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUp color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {metrics.appointments.completed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {((metrics.appointments.completed / metrics.appointments.total) * 100).toFixed(1)}% completion rate
                  </Typography>
                </Box>
              </Box>
            </MetricCard>
          </Grid>
        </Grid>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" />
          <Tab label="Appointments" />
          <Tab label="Revenue" />
          <Tab label="Patients" />
          <Tab label="Departments" />
          <Tab label="Comparisons" />
        </Tabs>
      </Paper>

      <TabPanel value={selectedTab} index={0}>
        <Grid container spacing={3}>
          <Grid>
            <InteractiveChart
              title="Appointments Overview"
              data={appointmentsData}
              type="bar"
              onDataPointClick={(data, index) => handleDataPointClick(data, 'appointments')}
              onFilterChange={handleFilterChange}
              enableExport
              enableFilters
              realTimeUpdate={realTimeEnabled}
              height={400}
            />
          </Grid>
          <Grid>
            <InteractiveChart
              title="Revenue by Department"
              data={departmentData}
              type="pie"
              onDataPointClick={(data, index) => handleDataPointClick(data, 'department')}
              enableExport
              height={400}
            />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <Grid container spacing={3}>
          <Grid>
            <InteractiveChart
              title="Appointment Trends"
              data={appointmentsData}
              type="line"
              onDataPointClick={(data, index) => handleDataPointClick(data, 'appointments')}
              onFilterChange={handleFilterChange}
              enableExport
              enableFilters
              realTimeUpdate={realTimeEnabled}
              height={500}
            />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <Grid container spacing={3}>
          <Grid>
            <InteractiveChart
              title="Revenue Analysis"
              data={revenueData}
              type="area"
              onDataPointClick={(data, index) => handleDataPointClick(data, 'revenue')}
              onFilterChange={handleFilterChange}
              enableExport
              enableFilters
              realTimeUpdate={realTimeEnabled}
              height={500}
            />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={3}>
        <Grid container spacing={3}>
          <Grid>
            <InteractiveChart
              title="Patient Growth"
              data={patientsData}
              type="line"
              onDataPointClick={(data, index) => handleDataPointClick(data, 'patients')}
              onFilterChange={handleFilterChange}
              enableExport
              enableFilters
              realTimeUpdate={realTimeEnabled}
              height={500}
            />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={4}>
        <Grid container spacing={3}>
          <Grid>
            <InteractiveChart
              title="Department Performance"
              data={departmentData}
              type="bar"
              onDataPointClick={(data, index) => handleDataPointClick(data, 'department')}
              enableExport
              height={400}
            />
          </Grid>
          <Grid>
            <InteractiveChart
              title="Department Distribution"
              data={departmentData}
              type="pie"
              onDataPointClick={(data, index) => handleDataPointClick(data, 'department')}
              enableExport
              height={400}
            />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={5}>
        <Grid container spacing={3}>
          <Grid>
            <ComparisonChart
              title="Month-over-Month Comparison"
              currentData={appointmentsData}
              previousData={generateComparisonData(appointmentsData)}
              currentLabel="This Month"
              previousLabel="Last Month"
              comparisonPeriod={comparisonPeriod}
              onPeriodChange={setComparisonPeriod}
              metrics={{
                growth: 12.5,
                trend: 'up',
                total: 1247,
                previousTotal: 1108,
              }}
            />
          </Grid>
        </Grid>
      </TabPanel>
    </AnalyticsDashboardWrapper>
  );
};