import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Button,
  Stack,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
} from '@mui/material';
import {
  ResponsiveContainer,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ComposedChart,
  Area,
  Legend,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  GetApp,
  FilterList,
  Fullscreen,
  Refresh,
  ImageOutlined,
  PictureAsPdf,
  TableChart,
} from '@mui/icons-material';
import { ChartDataPoint, ChartFilter, ChartType, ExportFormat } from './components/analistic-types';
import { ChartHeader, FilterChip, InteractiveChartWrapper } from './style';

interface InteractiveChartProps {
  title: string;
  data: ChartDataPoint[];
  type?: ChartType;
  onDataPointClick?: (data: ChartDataPoint, index: number) => void;
  onFilterChange?: (filter: ChartFilter) => void;
  exportData?: any[];
  height?: number;
  enableExport?: boolean;
  enableFilters?: boolean;
  realTimeUpdate?: boolean;
  updateInterval?: number;
}

const COLORS = ['#4f46e5', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  title,
  data,
  type = 'bar',
  onDataPointClick,
  onFilterChange,
  exportData,
  height = 400,
  enableExport = true,
  enableFilters = true,
  realTimeUpdate = false,
  updateInterval = 30000,
}) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState<ChartType>(type);
  const [activeFilters, setActiveFilters] = useState<ChartFilter>({});
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedDataPoints, setSelectedDataPoints] = useState<number[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!realTimeUpdate) return;

    const interval = setInterval(() => {
      console.log('Refreshing chart data...');
    }, updateInterval);

    return () => clearInterval(interval);
  }, [realTimeUpdate, updateInterval]);

  const handleDataPointClick = useCallback((data: any, index: number) => {
    if (onDataPointClick) {
      onDataPointClick(data, index);
    }

    setSelectedDataPoints(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  }, [onDataPointClick]);

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportMenuAnchor(null);
  };

  const exportChart = async (format: ExportFormat) => {
    if (!chartRef.current) return;

    try {
      if (format === 'png') {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(chartRef.current);
        const link = document.createElement('a');
        link.download = `${title.replace(/\s+/g, '_')}_chart.png`;
        link.href = canvas.toDataURL();
        link.click();
      } else if (format === 'pdf') {
        const jsPDF = (await import('jspdf')).default;
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(chartRef.current);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${title.replace(/\s+/g, '_')}_chart.pdf`);
      } else if (format === 'excel') {
        const XLSX = (await import('xlsx'));
        const ws = XLSX.utils.json_to_sheet(exportData || data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Chart Data');
        XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}_data.xlsx`);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }

    handleExportClose();
  };

  const handleChartElementClick = (event: any) => {
    if (event && event.activePayload && event.activePayload.length > 0) {
      const payload = event.activePayload[0].payload;
      const index = data.findIndex(item => item.name === payload.name);
      if (index !== -1) {
        handleDataPointClick(payload, index);
      }
    }
  };

  const handlePieClick = (entry: any, index: number) => {
    handleDataPointClick(entry, index);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            padding: 2,
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="subtitle2">{label}</Typography>
          {payload.map((entry: any, index: number) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {entry.name}: {entry.value.toLocaleString()}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
    };

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart 
              {...commonProps}
              onClick={handleChartElementClick}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 5, cursor: 'pointer' }}
                activeDot={{ r: 8, cursor: 'pointer' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart 
              {...commonProps}
              onClick={handleChartElementClick}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4f46e5"
                fill="rgba(79,70,229,0.2)"
                strokeWidth={2}
                cursor="pointer"
              />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                onClick={handlePieClick}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      selectedDataPoints.includes(index)
                        ? '#22c55e'
                        : COLORS[index % COLORS.length]
                    }
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default: // bar
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart
              {...commonProps}
              onClick={handleChartElementClick}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                cursor="pointer"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      selectedDataPoints.includes(index)
                        ? '#22c55e'
                        : '#4f46e5'
                    }
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <InteractiveChartWrapper
      sx={{
        bgcolor: theme.palette.mode === 'dark'
          ? theme.palette.background.paper
          : 'background.paper',
        color: theme.palette.text.primary,
        transition: 'background 0.3s, color 0.3s',
        borderRadius: 3,
        p: { xs: 2, md: 3 },
        boxShadow: theme.palette.mode === 'dark'
          ? '0 4px 24px rgba(30,32,36,0.25)'
          : '0 4px 24px rgba(102,126,234,0.08)',
      }}
    >
      <ChartHeader>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          {realTimeUpdate && (
            <Chip
              label="Live"
              color="success"
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          {enableFilters && (
            <Tooltip title="Filters">
              <IconButton size="small">
                <FilterList />
              </IconButton>
            </Tooltip>
          )}

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ChartType)}
              variant="outlined"
            >
              <MenuItem value="bar">Bar</MenuItem>
              <MenuItem value="line">Line</MenuItem>
              <MenuItem value="area">Area</MenuItem>
              <MenuItem value="pie">Pie</MenuItem>
            </Select>
          </FormControl>

          {realTimeUpdate && (
            <Tooltip title="Refresh">
              <IconButton size="small">
                <Refresh />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Fullscreen">
            <IconButton size="small">
              <Fullscreen />
            </IconButton>
          </Tooltip>

          {enableExport && (
            <>
              <Tooltip title="Export">
                <IconButton size="small" onClick={handleExportClick}>
                  <GetApp />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={exportMenuAnchor}
                open={Boolean(exportMenuAnchor)}
                onClose={handleExportClose}
              >
                <MenuItem onClick={() => exportChart('png')}>
                  <ListItemIcon>
                    <ImageOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Export as PNG</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => exportChart('pdf')}>
                  <ListItemIcon>
                    <PictureAsPdf fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Export as PDF</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => exportChart('excel')}>
                  <ListItemIcon>
                    <TableChart fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Export Data</ListItemText>
                </MenuItem>
              </Menu>
            </>
          )}
        </Stack>
      </ChartHeader>

      {Object.keys(activeFilters).length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {Object.entries(activeFilters).map(([key, value]) => (
              <FilterChip
                key={key}
                label={`${key}: ${value}`}
                onDelete={() => {
                  const newFilters = { ...activeFilters };
                  delete newFilters[key as keyof ChartFilter];
                  setActiveFilters(newFilters);
                  onFilterChange?.(newFilters);
                }}
                size="small"
              />
            ))}
          </Stack>
        </Box>
      )}

      <Box ref={chartRef}>
        {renderChart()}
      </Box>

      {selectedDataPoints.length > 0 && (
        <Box sx={{ mt: 2, p: 2, bgcolor: theme.palette.action.hover, borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Selected {selectedDataPoints.length} data point(s)
          </Typography>
          <Button
            size="small"
            onClick={() => setSelectedDataPoints([])}
            sx={{ mt: 1 }}
          >
            Clear Selection
          </Button>
        </Box>
      )}
    </InteractiveChartWrapper>
  );
};