import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  Autocomplete, 
  FormControlLabel, 
  Switch,
  Chip,
  Typography,
  Divider
} from "@mui/material";
import { TextFields, Visibility } from "@mui/icons-material";
import { FileCategory } from "../types";

interface EditFileDialogProps {
  fileManager: any;
}

export function EditFileDialog({ fileManager }: EditFileDialogProps) {
  return (
    <Dialog open={fileManager.editDialogOpen} onClose={() => fileManager.setEditDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          Edit File Details
          {fileManager.editingFile?.isOcrProcessed && (
            <Chip
              icon={<TextFields />}
              label="OCR Processed"
              size="small"
              color="success"
              variant="outlined"
            />
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid>
            <TextField
              fullWidth
              label="File Name"
              value={fileManager.editFormData.name || ''}
              onChange={(e) => fileManager.setEditFormData((prev: typeof fileManager.editFormData) => ({ ...prev, name: e.target.value }))}
            />
          </Grid>
          
          <Grid>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={fileManager.editFormData.category || 'other'}
                label="Category"
                onChange={(e) => fileManager.setEditFormData((prev: typeof fileManager.editFormData) => ({ ...prev, category: e.target.value as FileCategory }))}
              >
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
              value={fileManager.patients.find((p: any) => p.id === fileManager.editFormData.patientId) || null}
              onChange={(_, newValue) => fileManager.setEditFormData((prev: typeof fileManager.editFormData) => ({ 
                ...prev, 
                patientId: newValue?.id,
                patientName: newValue ? `${newValue.firstName} ${newValue.lastName}` : undefined
              }))}
              options={fileManager.patients}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
              renderInput={(params) => (
                <TextField {...params} label="Linked Patient" />
              )}
            />
          </Grid>
          
          <Grid>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={fileManager.editFormData.priority || 'medium'}
                label="Priority"
                onChange={(e) => fileManager.setEditFormData((prev: typeof fileManager.editFormData) => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid>
            <TextField
              fullWidth
              label="Tags"
              value={fileManager.editFormData.tags?.join(', ') || ''}
              onChange={(e) => fileManager.setEditFormData((prev: typeof fileManager.editFormData) => ({ 
                ...prev, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
              }))}
              placeholder="tag1, tag2, tag3"
              helperText="Separate tags with commas"
            />
          </Grid>
          
          <Grid>
            <TextField
              fullWidth
              label="Description"
              value={fileManager.editFormData.description || ''}
              onChange={(e) => fileManager.setEditFormData((prev: typeof fileManager.editFormData) => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
            />
          </Grid>
          
          <Grid>
            <FormControlLabel
              control={
                <Switch
                  checked={fileManager.editFormData.isConfidential || false}
                  onChange={(e) => fileManager.setEditFormData((prev: typeof fileManager.editFormData) => ({ ...prev, isConfidential: e.target.checked }))}
                />
              }
              label="Mark as Confidential"
            />
          </Grid>

          {fileManager.editingFile?.isOcrProcessed && (
            <>
              <Grid>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextFields />
                  OCR Information
                </Typography>
              </Grid>
              
              <Grid>
                <TextField
                  fullWidth
                  label="OCR Language"
                  value={fileManager.editingFile.ocrLanguage || 'eng'}
                  disabled
                  size="small"
                />
              </Grid>
              
              <Grid>
                <TextField
                  fullWidth
                  label="Processing Status"
                  value={fileManager.editingFile.processingStatus || 'completed'}
                  disabled
                  size="small"
                />
              </Grid>
              
              {fileManager.editingFile.extractedData?.patientName && (
                <Grid>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Extracted Medical Data:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {fileManager.editingFile.extractedData.patientName && (
                      <Chip label={`Patient: ${fileManager.editingFile.extractedData.patientName}`} size="small" />
                    )}
                    {fileManager.editingFile.extractedData.doctorName && (
                      <Chip label={`Doctor: ${fileManager.editingFile.extractedData.doctorName}`} size="small" />
                    )}
                    {fileManager.editingFile.extractedData.testResults && (
                      <Chip label={`${fileManager.editingFile.extractedData.testResults.length} Test Results`} size="small" />
                    )}
                    {fileManager.editingFile.extractedData.medications && (
                      <Chip label={`${fileManager.editingFile.extractedData.medications.length} Medications`} size="small" />
                    )}
                  </Box>
                </Grid>
              )}
              
              {fileManager.editingFile.ocrText && (
                <Grid>
                  <TextField
                    fullWidth
                    label="Extracted Text (Preview)"
                    value={fileManager.editingFile.ocrText.substring(0, 200) + (fileManager.editingFile.ocrText.length > 200 ? '...' : '')}
                    disabled
                    multiline
                    rows={3}
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => {
                          }}
                        >
                          View Full
                        </Button>
                      )
                    }}
                  />
                </Grid>
              )}
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => fileManager.setEditDialogOpen(false)}>Cancel</Button>
        <Button onClick={fileManager.saveFileEdit} variant="contained">Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
}