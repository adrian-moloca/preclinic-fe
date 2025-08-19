import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  Typography, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid,
  Autocomplete,
  FormControlLabel,
  Switch,
  Chip,
  Card,
  Slider,
  Alert,
} from "@mui/material";
import { 
  Search, 
  FilterList, 
  Clear, 
  History, 
  TextFields,
  Person,
  Security,
  Schedule
} from "@mui/icons-material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface AdvancedSearchDialogProps {
  fileManager: any;
}

export function AdvancedSearchDialog({ fileManager }: AdvancedSearchDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedPatient, setSelectedPatient] = React.useState<any>(null);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [dateRange, setDateRange] = React.useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [sizeRange, setSizeRange] = React.useState<number[]>([0, 100]);
  const [includeOCR, setIncludeOCR] = React.useState(true);
  const [onlyConfidential, setOnlyConfidential] = React.useState(false);
  const [onlyShared, setOnlyShared] = React.useState(false);
  const [recentlyAccessed, setRecentlyAccessed] = React.useState(false);
  const [hasExtractedData, setHasExtractedData] = React.useState(false);

  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    fileManager.files.forEach((file: any) => {
      file.tags?.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags);
  }, [fileManager.files]);

  const sizeInBytes = React.useMemo(() => {
    const maxFileSize = Math.max(...fileManager.files.map((f: any) => f.size));
    return [
      (sizeRange[0] / 100) * maxFileSize,
      (sizeRange[1] / 100) * maxFileSize
    ];
  }, [sizeRange, fileManager.files]);

  const handleSearch = () => {
    const filters: any = {};
    
    if (searchQuery.trim()) {
      filters.textSearch = searchQuery.trim();
    }
    
    if (selectedCategory !== 'all') {
      filters.categoryFilter = selectedCategory;
    }
    
    if (selectedPatient) {
      filters.patientFilter = selectedPatient.id;
    }
    
    if (selectedTags.length > 0) {
      filters.tagFilter = selectedTags.join(',');
    }
    
    if (dateRange.start && dateRange.end) {
      filters.dateRange = dateRange;
    }
    
    if (sizeRange[0] > 0 || sizeRange[1] < 100) {
      filters.sizeRange = { min: sizeInBytes[0], max: sizeInBytes[1] };
    }
    
    if (!includeOCR) {
      filters.hasOCR = false;
    }
    
    if (onlyConfidential) {
      filters.isConfidential = true;
    }
    
    if (onlyShared) {
      filters.isShared = true;
    }
    
    if (recentlyAccessed) {
      filters.accessedRecently = true;
    }
    
    if (hasExtractedData) {
      filters.hasExtractedData = true;
    }

    fileManager.performAdvancedSearch(filters);
    fileManager.setAdvancedSearchOpen(false);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPatient(null);
    setSelectedTags([]);
    setDateRange({ start: null, end: null });
    setSizeRange([0, 100]);
    setIncludeOCR(true);
    setOnlyConfidential(false);
    setOnlyShared(false);
    setRecentlyAccessed(false);
    setHasExtractedData(false);
  };

  const handleUseSearchHistory = (searchTerm: string) => {
    setSearchQuery(searchTerm);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog 
        open={fileManager.advancedSearchOpen} 
        onClose={() => fileManager.setAdvancedSearchOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList />
          Advanced Search
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid>
              <TextField
                fullWidth
                label="Search Query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in file names, descriptions, OCR text..."
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
                }}
                helperText="Search across file names, descriptions, patient names, and extracted OCR text"
              />
            </Grid>

            <Grid>
              <Typography variant="h6" sx={{ mb: 2 }}>Content Filters</Typography>
              <Grid container spacing={2}>
                <Grid>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Category"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      {fileManager.FILE_CATEGORIES.map((cat: any) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: cat.color, mr: 1 }} />
                            {cat.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid>
                  <Autocomplete
                    value={selectedPatient}
                    onChange={(_, newValue) => setSelectedPatient(newValue)}
                    options={fileManager.patients}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Patient"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid>
                  <Autocomplete
                    multiple
                    value={selectedTags}
                    onChange={(_, newValue) => setSelectedTags(newValue)}
                    options={allTags}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        placeholder="Select tags to filter by..."
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule />
                Date & Size Filters
              </Typography>
              <Grid container spacing={2}>
                <Grid>
                  <DatePicker
                    label="Start Date"
                    value={dateRange.start}
                    onChange={(newValue) => setDateRange(prev => ({ ...prev, start: newValue }))}
                    slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                  />
                </Grid>
                
                <Grid>
                  <DatePicker
                    label="End Date"
                    value={dateRange.end}
                    onChange={(newValue) => setDateRange(prev => ({ ...prev, end: newValue }))}
                    slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                  />
                </Grid>
                
                <Grid>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    File Size Range: {sizeRange[0]}% - {sizeRange[1]}%
                  </Typography>
                  <Slider
                    value={sizeRange}
                    onChange={(_, newValue) => setSizeRange(newValue as number[])}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security />
                Advanced Options
              </Typography>
              <Grid container spacing={2}>
                <Grid>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={includeOCR}
                          onChange={(e) => setIncludeOCR(e.target.checked)}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextFields fontSize="small" />
                          Include OCR Text in Search
                        </Box>
                      }
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={onlyConfidential}
                          onChange={(e) => setOnlyConfidential(e.target.checked)}
                        />
                      }
                      label="Only Confidential Files"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={onlyShared}
                          onChange={(e) => setOnlyShared(e.target.checked)}
                        />
                      }
                      label="Only Shared Files"
                    />
                  </Box>
                </Grid>
                
                <Grid>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={recentlyAccessed}
                          onChange={(e) => setRecentlyAccessed(e.target.checked)}
                        />
                      }
                      label="Recently Accessed (7 days)"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={hasExtractedData}
                          onChange={(e) => setHasExtractedData(e.target.checked)}
                        />
                      }
                      label="Has Extracted Medical Data"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {fileManager.searchHistory.length > 0 && (
              <Grid>
                <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <History />
                    Recent Searches
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {fileManager.searchHistory.slice(0, 5).map((search: string, index: number) => (
                      <Chip
                        key={index}
                        label={search}
                        size="small"
                        variant="outlined"
                        onClick={() => handleUseSearchHistory(search)}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Card>
              </Grid>
            )}

            <Grid>
              <Alert severity="info">
                <Typography variant="body2">
                  This search will look through {fileManager.files.length} files
                  {includeOCR && ` including OCR-processed text`}
                  {selectedCategory !== 'all' && ` in the ${fileManager.getCategoryInfo(selectedCategory).label} category`}
                  {selectedPatient && ` linked to ${selectedPatient.firstName} ${selectedPatient.lastName}`}
                  {selectedTags.length > 0 && ` with tags: ${selectedTags.join(', ')}`}
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => fileManager.setAdvancedSearchOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleClearFilters} startIcon={<Clear />}>
            Clear All
          </Button>
          <Button onClick={handleSearch} variant="contained" startIcon={<Search />}>
            Search Files
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}