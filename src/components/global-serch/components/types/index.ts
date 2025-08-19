export interface SearchResult {
  id: string;
  type: 'patient' | 'appointment' | 'prescription' | 'product' | 'doctor' | 'assistant';
  title: string;
  subtitle: string;
  description?: string;
  route: string;
  avatar?: string;
  status?: string;
  date?: string;
}

export interface SearchHistory {
  id: string;
  query: string;
  timestamp: string;
  resultsCount: number;
}

export interface QuickFilter {
  id: string;
  label: string;
  type: 'appointment' | 'patient' | 'prescription' | 'general';
  filter: (data: any[]) => any[];
  icon: React.ReactNode;
  count?: number;
}