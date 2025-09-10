import React, { FC, useState, useCallback, useRef, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  Popover,
  Paper,
  Box,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { QuickFilter, SearchResult } from './components/types';
import { useDebounce } from '../../hooks/debounce';
import { useGlobalSearch } from '../../hooks/global-search';
import SearchResults from './components/serach-results';
import SearchHistoryComponent from './components/search-history';
import QuickFilters from './components/quick-filter';

interface GlobalSearchProps {
  placeholder?: string;
  width?: number;
  showQuickFilters?: boolean;
}

export const GlobalSearch: FC<GlobalSearchProps> = ({
  placeholder = 'Search patients, appointments, prescriptions...',
  width = 400,
  showQuickFilters = true,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState<'results' | 'history' | 'filters'>('results');

  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  const {
    searchGlobally,
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
    removeFromSearchHistory,
    allData,
  } = useGlobalSearch();

  useEffect(() => {
    if (debouncedQuery.trim()) {
      setIsLoading(true);
      setActiveTab('results');
      
      try {
        const searchResults = searchGlobally(debouncedQuery);
        setResults(searchResults);
        
        if (searchResults.length > 0) {
          addToSearchHistory(debouncedQuery, searchResults.length);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setResults([]);
      setActiveTab('history');
      setIsLoading(false);
    }
  }, [debouncedQuery, searchGlobally, addToSearchHistory]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    
    if (!value.trim()) {
      setActiveTab('history');
    }
  }, []);

  const handleFocus = useCallback(() => {
    setIsOpen(true);
    if (!query.trim()) {
      setActiveTab('history');
    }
  }, [query]);

  const handleResultClick = useCallback((result: SearchResult) => {
    navigate(result.route);
    setIsOpen(false);
    setQuery('');
  }, [navigate]);

  const handleHistoryClick = useCallback((historyQuery: string) => {
    setQuery(historyQuery);
    setActiveTab('results');
  }, []);

  const handleQuickFilterClick = useCallback((filter: QuickFilter) => {
    let filteredData: any[] = [];
    
    try {
      switch (filter.type) {
        case 'appointment':
          filteredData = filter.filter(allData.appointments);
          break;
        case 'patient':
          filteredData = filter.filter(allData.patients);
          break;
        case 'prescription':
          filteredData = filter.filter(allData.prescriptions);
          break;
        default:
          filteredData = [];
      }

      const quickResults: SearchResult[] = [];
      
      filteredData.forEach((item) => {
        if (filter.type === 'appointment') {
          const patient = allData.patients.find((p: any) => p.id === item.patientId);
          quickResults.push({
            id: item.id,
            type: 'appointment',
            title: `Appointment - ${patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'}`,
            subtitle: `${item.date} at ${item.time}`,
            description: item.reason,
            route: `/appointments/${item.id}`,
            status: item.status,
            date: item.date,
          });
        } else if (filter.type === 'patient') {
          quickResults.push({
            id: item.id,
            type: 'patient',
            title: `${item.firstName} ${item.lastName}`,
            subtitle: item.email || item.phoneNumber,
            description: item.address,
            route: `/patients/${item.id}`,
            avatar: item.profileImg,
          });
        } else if (filter.type === 'prescription') {
          const patient = allData.patients.find(p => p.id === item.patientId);
          quickResults.push({
            id: item.id,
            type: 'prescription',
            title: `Prescription - ${patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'}`,
            subtitle: item.diagnosis || 'No diagnosis',
            description: item.medications?.map((m: any) => m.name).join(', '),
            route: `/prescriptions/${item.id}`,
            date: item.dateIssued,
          });
        }
      });

      setResults(quickResults);
      setActiveTab('results');
      setQuery(filter.label);
    } catch (error) {
      console.error('Filter error:', error);
    }
  }, [allData]);

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setActiveTab('history');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handlePopoverClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const todayAppointments = allData.appointments.filter((apt: { date: string }) => {
    try {
      return apt.date === new Date().toISOString().split('T')[0];
    } catch {
      return false;
    }
  }).length;

  return (
    <Box position="relative">
      <TextField
        inputRef={inputRef}
        fullWidth
        value={query}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        variant="outlined"
        size="small"
        sx={{
          width: width,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'white',
            },
            '&.Mui-focused': {
              backgroundColor: 'white',
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {isLoading ? (
                <CircularProgress size={20} />
              ) : (
                <SearchIcon color="action" />
              )}
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton 
                size="small" 
                onClick={handleClear}
                onMouseDown={(e) => e.preventDefault()} 
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Popover
        open={isOpen}
        anchorEl={inputRef.current}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        disableAutoFocus
        disableEnforceFocus
        PaperProps={{
          ref: popoverRef,
          sx: {
            width: width,
            maxHeight: 500,
            mt: 1,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <Paper>
          <Box display="flex" borderBottom="1px solid" borderColor="divider">
            <Box
              flex={1}
              textAlign="center"
              py={1}
              sx={{
                cursor: 'pointer',
                backgroundColor: activeTab === 'results' ? 'action.selected' : 'transparent',
                borderBottom: activeTab === 'results' ? 2 : 0,
                borderColor: 'primary.main',
              }}
              onClick={() => setActiveTab('results')}
            >
              <Typography variant="caption" fontWeight={600}>
                Results ({results.length})
              </Typography>
            </Box>
            <Box
              flex={1}
              textAlign="center"
              py={1}
              sx={{
                cursor: 'pointer',
                backgroundColor: activeTab === 'history' ? 'action.selected' : 'transparent',
                borderBottom: activeTab === 'history' ? 2 : 0,
                borderColor: 'primary.main',
              }}
              onClick={() => setActiveTab('history')}
            >
              <Typography variant="caption" fontWeight={600}>
                History ({searchHistory.length})
              </Typography>
            </Box>
            {showQuickFilters && (
              <Box
                flex={1}
                textAlign="center"
                py={1}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'filters' ? 'action.selected' : 'transparent',
                  borderBottom: activeTab === 'filters' ? 2 : 0,
                  borderColor: 'primary.main',
                }}
                onClick={() => setActiveTab('filters')}
              >
                <Typography variant="caption" fontWeight={600}>
                  Quick Filters
                </Typography>
              </Box>
            )}
          </Box>

          {activeTab === 'results' && (
            <SearchResults
              results={results}
              onResultClick={handleResultClick}
            />
          )}

          {activeTab === 'history' && (
            <SearchHistoryComponent
              history={searchHistory}
              onHistoryClick={handleHistoryClick}
              onRemoveItem={removeFromSearchHistory}
              onClearAll={clearSearchHistory}
            />
          )}

          {activeTab === 'filters' && showQuickFilters && (
            <Box p={2}>
              <QuickFilters
                onFilterClick={handleQuickFilterClick}
                appointmentsCount={todayAppointments}
                patientsCount={allData.patients.length}
                prescriptionsCount={allData.prescriptions.length}
              />
            </Box>
          )}
        </Paper>
      </Popover>
    </Box>
  );
};