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
  Switch,
  Box,
  Typography,
  Chip,
  Autocomplete
} from "@mui/material";
import { Edit } from "@mui/icons-material";

interface BulkEditDialogProps {
  fileManager: any;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
}

export function BulkEditDialog({ fileManager }: BulkEditDialogProps) {
  const [updateCategory, setUpdateCategory] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState('');
  const [updatePatient, setUpdatePatient] = React.useState(false);
  const [newPatient, setNewPatient] = React.useState<Patient | null>(null);
  const [addTags, setAddTags] = React.useState('');
  const [removeTags, setRemoveTags] = React.useState('');
  const [updateDescription, setUpdateDescription] = React.useState(false);
  const [newDescription, setNewDescription] = React.useState('');
  const [updateConfidentiality, setUpdateConfidentiality] = React.useState(false);
  const [newConfidentiality, setNewConfidentiality] = React.useState(false);
  const [updatePriority, setUpdatePriority] = React.useState(false);
  const [newPriority, setNewPriority] = React.useState('medium');

  const selectedFileNames = Array.from<string>(fileManager.selectedFiles)
    .map((id: string) => fileManager.files.find((f: any) => f.id === id)?.name)
    .filter(Boolean);

  const handleApplyChanges = () => {
    const updates: any = {};

    if (updateCategory && newCategory) {
      updates.category = newCategory;
    }

    if (updatePatient && newPatient) {
      updates.patientId = newPatient.id;
      updates.patientName = `${newPatient.firstName} ${newPatient.lastName}`;
    }

    if (addTags) {
      updates.addTags = addTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    if (removeTags) {
      updates.removeTags = removeTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    if (updateDescription && newDescription) {
      updates.description = newDescription;
    }

    if (updateConfidentiality) {
      updates.isConfidential = newConfidentiality;
    }

    if (updatePriority && newPriority) {
      updates.priority = newPriority;
    }

    fileManager.bulkEditFiles(updates);

    setUpdateCategory(false);
    setNewCategory('');
    setUpdatePatient(false);
    setNewPatient(null);
    setAddTags('');
    setRemoveTags('');
    setUpdateDescription(false);
    setNewDescription('');
    setUpdateConfidentiality(false);
    setNewConfidentiality(false);
    setUpdatePriority(false);
    setNewPriority('medium');
  };

  return (
    <Dialog open={fileManager.bulkEditOpen} onClose={() => fileManager.setBulkEditOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Edit />
        Bulk Edit {fileManager.selectedFiles.size} Files
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Editing files:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {selectedFileNames.slice(0, 5).map((name: string, index: number) => (
              <Chip key={index} label={name} size="small" />
            ))}
            {selectedFileNames.length > 5 && (
              <Chip label={`+${selectedFileNames.length - 5} more`} size="small" variant="outlined" />
            )}
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid>
            <FormControlLabel
              control={
                <Switch
                  checked={updateCategory}
                  onChange={(e) => setUpdateCategory(e.target.checked)}
                />
              }
              label="Update Category"
            />
            {updateCategory && (
              <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                <InputLabel>New Category</InputLabel>
                <Select
                  value={newCategory}
                  label="New Category"
                  onChange={(e) => setNewCategory(e.target.value)}
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
            )}
          </Grid>

          <Grid>
            <FormControlLabel
              control={
                <Switch
                  checked={updatePatient}
                  onChange={(e) => setUpdatePatient(e.target.checked)}
                />
              }
              label="Update Patient"
            />
            {updatePatient && (
              <Autocomplete
                value={newPatient}
                onChange={(_, value) => setNewPatient(value as Patient)}
                options={fileManager.patients as Patient[]}
                getOptionLabel={(option: Patient) => option ? `${option.firstName} ${option.lastName}` : ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Link to Patient"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              />
            )}
          </Grid>

          <Grid>
            <TextField
              fullWidth
              size="small"
              label="Add Tags"
              value={addTags}
              onChange={(e) => setAddTags(e.target.value)}
              placeholder="tag1, tag2, tag3"
              helperText="Comma-separated tags to add"
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              size="small"
              label="Remove Tags"
              value={removeTags}
              onChange={(e) => setRemoveTags(e.target.value)}
              placeholder="tag1, tag2, tag3"
              helperText="Comma-separated tags to remove"
            />
          </Grid>

          <Grid>
            <FormControlLabel
              control={
                <Switch
                  checked={updateDescription}
                  onChange={(e) => setUpdateDescription(e.target.checked)}
                />
              }
              label="Update Description"
            />
            {updateDescription && (
              <TextField
                fullWidth
                label="New Description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                multiline
                rows={3}
                size="small"
                sx={{ mt: 1 }}
                placeholder="Add description to selected files..."
              />
            )}
          </Grid>

          <Grid>
            <FormControlLabel
              control={
                <Switch
                  checked={updatePriority}
                  onChange={(e) => setUpdatePriority(e.target.checked)}
                />
              }
              label="Update Priority"
            />
            {updatePriority && (
              <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newPriority}
                  label="Priority"
                  onChange={(e) => setNewPriority(e.target.value)}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            )}
          </Grid>

          <Grid>
            <FormControlLabel
              control={
                <Switch
                  checked={updateConfidentiality}
                  onChange={(e) => setUpdateConfidentiality(e.target.checked)}
                />
              }
              label="Update Confidentiality"
            />
            {updateConfidentiality && (
              <FormControlLabel
                control={
                  <Switch
                    checked={newConfidentiality}
                    onChange={(e) => setNewConfidentiality(e.target.checked)}
                  />
                }
                label="Mark as Confidential"
                sx={{ mt: 1, ml: 2 }}
              />
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => fileManager.setBulkEditOpen(false)}>Cancel</Button>
        <Button
          onClick={handleApplyChanges}
          variant="contained"
          disabled={
            !updateCategory &&
            !updatePatient &&
            !addTags &&
            !removeTags &&
            !updateDescription &&
            !updateConfidentiality &&
            !updatePriority
          }
        >
          Apply Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}