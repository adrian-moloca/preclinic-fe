import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  FormControlLabel, 
  Switch 
} from "@mui/material";

interface BulkEditDialogProps {
  fileManager: any; // Replace with proper type from your hook
}

export function BulkEditDialog({ fileManager }: BulkEditDialogProps) {
  return (
    <Dialog open={fileManager.bulkEditOpen} onClose={() => fileManager.setBulkEditOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>Bulk Edit {fileManager.selectedFiles.size} Files</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                defaultValue=""
              >
                <MenuItem value="">Keep current</MenuItem>
                {fileManager.FILE_CATEGORIES.map((cat: any) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Add Tags"
              placeholder="tag1, tag2, tag3"
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              placeholder="Add description to selected files..."
            />
          </Grid>
          <Grid>
            <FormControlLabel
              control={<Switch />}
              label="Mark as Confidential"
            />
          </Grid>
          <Grid>
            <FormControlLabel
              control={<Switch />}
              label="Remove from Sharing"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => fileManager.setBulkEditOpen(false)}>Cancel</Button>
        <Button onClick={() => fileManager.bulkEditFiles({})} variant="contained">Apply Changes</Button>
      </DialogActions>
    </Dialog>
  );
}