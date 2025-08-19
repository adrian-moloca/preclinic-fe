import React from "react";
import { 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Grid,
  Autocomplete,
  FormControlLabel,
  Switch,
  IconButton,
  LinearProgress,
  Chip,
  Divider
} from "@mui/material";
import { 
  CloudUpload,
  Delete,
  Download,
  FolderOpen,
  Edit,
  Share,
  Undo,
  CreateNewFolder,
  NoteAdd,
  Search,
  Sort,
  CameraAlt,
  TextFields,
  PictureAsPdf,
  Security,
  SearchOff,
  FilterList
} from "@mui/icons-material";

interface FileManagerControlsProps {
  fileManager: any;
}

export function FileManagerControls({ fileManager }: FileManagerControlsProps) {
  return (
    <>
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => fileManager.fileInputRef.current?.click()}
                size="large"
                sx={{ 
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                }}
              >
                Upload Files
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<CreateNewFolder />}
                onClick={() => fileManager.setCreateFolderOpen(true)}
                size="large"
              >
                New Folder
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<NoteAdd />}
                onClick={() => fileManager.setTemplateDialogOpen(true)}
                size="large"
              >
                From Template
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<CameraAlt />}
                onClick={() => fileManager.setMobileIntegrationsOpen(true)}
                color="success"
              >
                Camera Capture
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<TextFields />}
                onClick={() => fileManager.setOcrDialogOpen(true)}
                color="info"
              >
                OCR Processing
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<PictureAsPdf />}
                onClick={() => fileManager.setFileProcessingOpen(true)}
                color="warning"
              >
                File Tools
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Security />}
                onClick={() => fileManager.setSecurityDashboardOpen(true)}
                color="error"
              >
                Security
              </Button>
            </Box>

            {fileManager.selectedFiles.size > 0 && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', p: 2, bgcolor: 'action.selected', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ alignSelf: 'center', mr: 2 }}>
                  {fileManager.selectedFiles.size} files selected:
                </Typography>
                
                <Button
                  variant="outlined"
                  startIcon={<Delete />}
                  onClick={fileManager.deleteSelected}
                  color="error"
                  size="small"
                >
                  Delete
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={fileManager.downloadSelected}
                  color="success"
                  size="small"
                >
                  Download
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<FolderOpen />}
                  onClick={() => fileManager.setMoveFilesOpen(true)}
                  size="small"
                >
                  Move
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => fileManager.setBulkEditOpen(true)}
                  size="small"
                >
                  Bulk Edit
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={() => fileManager.setShareDialogOpen(true)}
                  size="small"
                >
                  Share
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<TextFields />}
                  onClick={() => {
                    fileManager.setSelectedFilesForProcessing(Array.from(fileManager.selectedFiles));
                    fileManager.setOcrDialogOpen(true);
                  }}
                  color="info"
                  size="small"
                >
                  OCR Selected
                </Button>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Undo />}
                onClick={fileManager.undo}
                disabled={fileManager.undoStack.length === 0}
              >
                Undo
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<SearchOff />}
                onClick={fileManager.clearSearch}
                disabled={!fileManager.searchTerm && Object.keys(fileManager.searchFilters).length === 0}
              >
                Clear Filters
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Upload Configuration
            </Typography>
            <Grid container spacing={2}>
              <Grid>
                <Autocomplete
                  value={fileManager.selectedPatientForUpload}
                  onChange={(_, newValue) => fileManager.setSelectedPatientForUpload(newValue)}
                  options={fileManager.patients}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Link to Patient"
                      size="small"
                      placeholder="Select patient..."
                    />
                  )}
                />
              </Grid>
              <Grid>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={fileManager.selectedCategory}
                    label="Category"
                    onChange={(e) => fileManager.setSelectedCategory(e.target.value)}
                  >
                    {fileManager.FILE_CATEGORIES.map((cat: any) => (
                      <MenuItem key={cat.value} value={cat.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: cat.color,
                              mr: 1
                            }}
                          />
                          {cat.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  size="small"
                  label="Tags"
                  value={fileManager.fileTags}
                  onChange={(e) => fileManager.setFileTags(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                />
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  size="small"
                  label="Description"
                  value={fileManager.fileDescription}
                  onChange={(e) => fileManager.setFileDescription(e.target.value)}
                  placeholder="File description..."
                />
              </Grid>
              <Grid>
                <FormControlLabel
                  control={
                    <Switch
                      checked={fileManager.isConfidential}
                      onChange={(e) => fileManager.setIsConfidential(e.target.checked)}
                    />
                  }
                  label="Confidential"
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Search & Filters
              </Typography>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => fileManager.setAdvancedSearchOpen(true)}
                size="small"
              >
                Advanced Search
              </Button>
            </Box>
            
            <Grid container spacing={2} alignItems="center">
              <Grid>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search files, OCR text, patients..."
                  value={fileManager.searchTerm}
                  onChange={(e) => {
                    fileManager.setSearchTerm(e.target.value);
                    fileManager.setCurrentPage(1);
                  }}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>
              
              <Grid>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={fileManager.categoryFilter}
                    label="Category"
                    onChange={(e) => {
                      fileManager.setCategoryFilter(e.target.value);
                      fileManager.setCurrentPage(1);
                    }}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {fileManager.FILE_CATEGORIES.map((cat: any) => (
                      <MenuItem key={cat.value} value={cat.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: cat.color,
                              mr: 1
                            }}
                          />
                          {cat.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid>
                <Autocomplete
                  value={fileManager.patients.find((p: any) => p.id === fileManager.patientFilter) || null}
                  onChange={(_, newValue) => {
                    fileManager.setPatientFilter(newValue?.id || null);
                    fileManager.setCurrentPage(1);
                  }}
                  options={fileManager.patients}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Filter by Patient"
                      size="small"
                    />
                  )}
                />
              </Grid>
              
              <Grid>
                <TextField
                  fullWidth
                  size="small"
                  label="Filter by Tags"
                  value={fileManager.tagFilter}
                  onChange={(e) => {
                    fileManager.setTagFilter(e.target.value);
                    fileManager.setCurrentPage(1);
                  }}
                  placeholder="Enter tag..."
                />
              </Grid>
              
              <Grid>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={fileManager.sortBy}
                    label="Sort by"
                    onChange={(e) => fileManager.setSortBy(e.target.value)}
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="size">Size</MenuItem>
                    <MenuItem value="category">Category</MenuItem>
                    <MenuItem value="patient">Patient</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid>
                <IconButton
                  onClick={() => fileManager.setSortDir(fileManager.sortDir === "asc" ? "desc" : "asc")}
                  color="primary"
                  sx={{ 
                    bgcolor: 'primary.50', 
                    '&:hover': { bgcolor: 'primary.100' }
                  }}
                >
                  <Sort sx={{ transform: fileManager.sortDir === 'desc' ? 'rotate(180deg)' : 'none' }} />
                </IconButton>
              </Grid>
              
              <Grid>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={fileManager.showOnlyShared}
                        onChange={(e) => {
                          fileManager.setShowOnlyShared(e.target.checked);
                          fileManager.setCurrentPage(1);
                        }}
                      />
                    }
                    label="Shared"
                    sx={{ m: 0 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={fileManager.showOnlyConfidential}
                        onChange={(e) => {
                          fileManager.setShowOnlyConfidential(e.target.checked);
                          fileManager.setCurrentPage(1);
                        }}
                      />
                    }
                    label="Confidential"
                    sx={{ m: 0 }}
                  />
                </Box>
              </Grid>
            </Grid>

            {(Object.keys(fileManager.searchFilters).length > 0 || fileManager.searchTerm || 
              fileManager.categoryFilter !== 'all' || fileManager.patientFilter || fileManager.tagFilter) && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">Active filters:</Typography>
                {fileManager.searchTerm && (
                  <Chip label={`Search: "${fileManager.searchTerm}"`} size="small" onDelete={() => fileManager.setSearchTerm('')} />
                )}
                {fileManager.categoryFilter !== 'all' && (
                  <Chip label={`Category: ${fileManager.getCategoryInfo(fileManager.categoryFilter).label}`} size="small" onDelete={() => fileManager.setCategoryFilter('all')} />
                )}
                {fileManager.patientFilter && (
                  <Chip label={`Patient: ${fileManager.patients.find((p: any) => p.id === fileManager.patientFilter)?.firstName} ${fileManager.patients.find((p: any) => p.id === fileManager.patientFilter)?.lastName}`} size="small" onDelete={() => fileManager.setPatientFilter(null)} />
                )}
                {fileManager.tagFilter && (
                  <Chip label={`Tag: ${fileManager.tagFilter}`} size="small" onDelete={() => fileManager.setTagFilter('')} />
                )}
              </Box>
            )}

            {fileManager.searchHistory.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Recent searches:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {fileManager.searchHistory.slice(0, 5).map((search: string, index: number) => (
                    <Chip
                      key={index}
                      label={search}
                      size="small"
                      variant="outlined"
                      onClick={() => fileManager.setSearchTerm(search)}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {fileManager.loading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Processing files...
          </Typography>
        </Box>
      )}

      {Object.keys(fileManager.ocrProgress).length > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>OCR Processing Progress:</Typography>
            {Object.entries(fileManager.ocrProgress).map(([fileId, progress]) => {
              const file = fileManager.files.find((f: any) => f.id === fileId);
              return (
                <Box key={fileId} sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {file?.name || 'Unknown file'}
                  </Typography>
                  <LinearProgress variant="determinate" value={(progress as number) * 100} sx={{ mt: 0.5 }} />
                </Box>
              );
            })}
          </CardContent>
        </Card>
      )}
    </>
  );
}