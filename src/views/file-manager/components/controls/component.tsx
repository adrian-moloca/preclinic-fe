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
  CameraAlt,
  TextFields,
  Security,
  SearchOff,
  FilterList,
  Psychology,
  Settings,
  LocalHospital
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
                size="large"
              >
                Camera Capture
              </Button>

              <Button
                variant="outlined"
                startIcon={<Psychology />}
                onClick={() => fileManager.setMedicalClassificationOpen(true)}
                color="secondary"
                size="large"
              >
                AI Classification
              </Button>

              <Button
                variant="outlined"
                startIcon={<Security />}
                onClick={() => fileManager.setSecurityDashboardOpen(true)}
                color="error"
                size="large"
              >
                HIPAA Dashboard
              </Button>

              <Button
                variant="outlined"
                startIcon={<Settings />}
                onClick={() => fileManager.setDicomViewerOpen(true)}
                color="info"
                size="large"
              >
                DICOM Viewer
              </Button>

              <Button
                variant="outlined"
                startIcon={<LocalHospital />}
                onClick={() => fileManager.setClinicalDecisionOpen(true)}
                color="warning"
                size="large"
              >
                Clinical Support
              </Button>

              <Button
                variant="outlined"
                startIcon={<TextFields />}
                onClick={() => fileManager.setOcrDialogOpen(true)}
                disabled={fileManager.selectedFiles.size === 0}
              >
                OCR Process
              </Button>
            </Box>
          </Box>

          {fileManager.selectedFiles.size > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Bulk Actions ({fileManager.selectedFiles.size} selected)
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  color="primary"
                  onClick={fileManager.downloadSelectedFiles}
                >
                  Download
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={() => fileManager.setShareDialogOpen(true)}
                  color="info"
                >
                  Share
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FolderOpen />}
                  onClick={() => fileManager.setMoveFilesOpen(true)}
                  color="warning"
                >
                  Move
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => fileManager.setBulkEditOpen(true)}
                  color="secondary"
                >
                  Edit Details
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Delete />}
                  onClick={fileManager.deleteSelectedFiles}
                  color="error"
                >
                  Delete
                </Button>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Search & Filter
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search files..."
                  value={fileManager.searchTerm}
                  onChange={(e) => {
                    fileManager.setSearchTerm(e.target.value);
                    if (e.target.value) {
                      fileManager.addToSearchHistory(e.target.value);
                    }
                  }}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                    endAdornment: fileManager.searchTerm && (
                      <IconButton size="small" onClick={() => fileManager.setSearchTerm('')}>
                        <SearchOff />
                      </IconButton>
                    )
                  }}
                />
              </Grid>

              <Grid>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={fileManager.categoryFilter}
                    label="Category"
                    onChange={(e) => fileManager.setCategoryFilter(e.target.value)}
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
                  size="small"
                  options={fileManager.patients}
                  getOptionLabel={(option: any) => `${option.firstName} ${option.lastName}`}
                  value={fileManager.patients.find((p: any) => p.id === fileManager.patientFilter) || null}
                  onChange={(_, newValue) => fileManager.setPatientFilter(newValue?.id || null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Patient"
                      placeholder="Select patient..."
                    />
                  )}
                />
              </Grid>

              <Grid>
                <TextField
                  fullWidth
                  size="small"
                  label="Tags"
                  value={fileManager.tagFilter}
                  onChange={(e) => fileManager.setTagFilter(e.target.value)}
                  placeholder="Filter by tags..."
                />
              </Grid>

              <Grid>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={fileManager.showOnlyShared}
                        onChange={(e) => fileManager.setShowOnlyShared(e.target.checked)}
                      />
                    }
                    label="Shared"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={fileManager.showOnlyConfidential}
                        onChange={(e) => fileManager.setShowOnlyConfidential(e.target.checked)}
                      />
                    }
                    label="Confidential"
                  />
                  <Button
                    size="small"
                    startIcon={<FilterList />}
                    onClick={() => fileManager.setAdvancedSearchOpen(true)}
                  >
                    Advanced
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Upload Configuration
            </Typography>
            <Grid container spacing={2}>
              <Grid>
                <Autocomplete
                  size="small"
                  options={fileManager.patients}
                  getOptionLabel={(option: any) => `${option.firstName} ${option.lastName}`}
                  value={fileManager.selectedPatientForUpload}
                  onChange={(_, newValue) => fileManager.setSelectedPatientForUpload(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Default Patient"
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

          {(fileManager.searchTerm || fileManager.categoryFilter !== 'all' || fileManager.patientFilter || fileManager.tagFilter) && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
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
              {fileManager.searchHistory.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Recent searches:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {fileManager.searchHistory.slice(0, 5).map((term: string, index: number) => (
                      <Chip
                        key={index}
                        label={term}
                        size="small"
                        variant="outlined"
                        clickable
                        onClick={() => fileManager.setSearchTerm(term)}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* Undo Stack */}
          {fileManager.undoStack.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Button
                startIcon={<Undo />}
                size="small"
                onClick={() => {
                  const lastAction = fileManager.undoStack[fileManager.undoStack.length - 1];
                  if (lastAction.type === 'delete') {
                    fileManager.setFiles((prev: any) => [...prev, ...lastAction.files]);
                  }
                  fileManager.setUndoStack((prev: any) => prev.slice(0, -1));
                }}
              >
                Undo Last Action
              </Button>
            </Box>
          )}

          {fileManager.loading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Processing files...
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
      </>
  );
};