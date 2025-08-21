export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  sortable?: boolean;
  editable?: boolean;
  visible?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  editRender?: (value: any, row: any, onSave: (newValue: any) => void, onCancel: () => void) => React.ReactNode;
}

export interface TablePreset {
  id: string;
  name: string;
  columns: Column[];
  sortOrder?: 'asc' | 'desc';
  sortBy?: string;
  filters?: Record<string, any>;
}

export interface BulkAction {
  label: string;
  value: string;
  icon?: React.ReactNode;
  color?: string;
}