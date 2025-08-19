import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { Folder, Person } from "@mui/icons-material";

interface CreateFolderDialogProps {
  fileManager: any;
}

export function CreateFolderDialog({ fileManager }: CreateFolderDialogProps) {
  const [isPatientFolder, setIsPatientFolder] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState<{ id: string; firstName: string; lastName: string } | null>(null);
  const [folderColor, setFolderColor] = React.useState('#2196F3');

  const folderColors = [
    { name: 'Blue', value: '#2196F3' },
    { name: 'Green', value: '#4CAF50' },
    { name: 'Orange', value: '#FF9800' },
    { name: 'Purple', value: '#9C27B0' },
    { name: 'Red', value: '#F44336' },
    { name: 'Teal', value: '#009688' }
  ];

  const handleCreate = () => {
    fileManager.createFolder();
    setIsPatientFolder(false);
    setSelectedPatient(null);
    setFolderColor('#2196F3');
  };

  return (
    <Dialog open={fileManager.createFolderOpen} onClose={() => fileManager.setCreateFolderOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Folder />
        Create New Folder
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid>
            <TextField
              autoFocus
              fullWidth
              label="Folder Name"
              value={fileManager.newFolderName}
              onChange={(e) => fileManager.setNewFolderName(e.target.value)}
              placeholder="Enter folder name..."
            />
          </Grid>
          
          <Grid>
            <FormControl fullWidth>
              <InputLabel>Folder Color</InputLabel>
              <Select
                value={folderColor}
                label="Folder Color"
                onChange={(e) => setFolderColor(e.target.value)}
                renderValue={(value) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 16, 
                      height: 16, 
                      borderRadius: '50%', 
                      bgcolor: value 
                    }} />
                    {folderColors.find(c => c.value === value)?.name}
                  </Box>
                )}
              >
                {folderColors.map((color) => (
                  <MenuItem key={color.value} value={color.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 16, 
                        height: 16, 
                        borderRadius: '50%', 
                        bgcolor: color.value 
                      }} />
                      {color.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid>
            <FormControlLabel
              control={
                <Switch
                  checked={isPatientFolder}
                  onChange={(e) => setIsPatientFolder(e.target.checked)}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person fontSize="small" />
                  Patient Folder
                </Box>
              }
            />
          </Grid>
          
          {isPatientFolder && (
            <Grid>
              <FormControl fullWidth>
                <InputLabel>Select Patient</InputLabel>
                <Select
                  value={selectedPatient?.id || ''}
                  label="Select Patient"
                  onChange={(e) => {
                    const patient = fileManager.patients.find((p: any) => p.id === e.target.value);
                    setSelectedPatient(patient);
                    if (patient) {
                      fileManager.setNewFolderName(`${patient.firstName} ${patient.lastName}`);
                    }
                  }}
                >
                  {fileManager.patients.map((patient: any) => (
                    <MenuItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          
          <Grid>
            <Typography variant="body2" color="text.secondary">
              This folder will be created in: <strong>{fileManager.currentFolder?.name}</strong>
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => fileManager.setCreateFolderOpen(false)}>Cancel</Button>
        <Button 
          onClick={handleCreate} 
          variant="contained"
          disabled={!fileManager.newFolderName.trim()}
        >
          Create Folder
        </Button>
      </DialogActions>
    </Dialog>
  );
}