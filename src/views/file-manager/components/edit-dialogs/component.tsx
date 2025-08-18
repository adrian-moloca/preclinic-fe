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
  Switch 
} from "@mui/material";
import { FileCategory } from "../types";

interface EditFileDialogProps {
  fileManager: any;
}

export function EditFileDialog({ fileManager }: EditFileDialogProps) {
  return (
    <Dialog open={fileManager.editDialogOpen} onClose={() => fileManager.setEditDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>Edit File Details</DialogTitle>
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => fileManager.setEditDialogOpen(false)}>Cancel</Button>
        <Button onClick={fileManager.saveFileEdit} variant="contained">Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
}