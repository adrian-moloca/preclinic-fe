export interface ChartDataPoint {
  name: string;
  value: number;
  date: string;
  [key: string]: any;
}

export interface ComparisonData {
  current: ChartDataPoint[];
  previous: ChartDataPoint[];
  label: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface ChartFilter {
  department?: string;
  doctor?: string;
  status?: string;
  dateRange?: DateRange;
}

export interface AnalyticsMetrics {
  appointments: {
    total: number;
    completed: number;
    cancelled: number;
    pending: number;
    growth: number;
  };
  revenue: {
    total: number;
    growth: number;
    byDepartment: { [key: string]: number };
  };
  patients: {
    total: number;
    new: number;
    returning: number;
    growth: number;
  };
  departments: {
    [key: string]: {
      appointments: number;
      revenue: number;
      patients: number;
    };
  };
}

export type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'composed';
export type ComparisonPeriod = 'month' | 'year' | 'quarter' | 'week';
export type ExportFormat = 'png' | 'pdf' | 'excel';