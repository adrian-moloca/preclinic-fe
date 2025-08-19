import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Chip,
  TextField,
  InputAdornment
} from "@mui/material";
import { Folder, Search, DriveFileMove } from "@mui/icons-material";

interface MoveFilesDialogProps {
  fileManager: any;
}

export function MoveFilesDialog({ fileManager }: MoveFilesDialogProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedTargetFolder, setSelectedTargetFolder] = React.useState('');

  const filteredFolders = fileManager.folders.filter((folder: any) => 
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedFileNames = Array.from(fileManager.selectedFiles)
    .map(id => fileManager.files.find((f: any) => f.id === id)?.name)
    .filter(Boolean);

  return (
    <Dialog open={fileManager.moveFilesOpen} onClose={() => fileManager.setMoveFilesOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DriveFileMove />
        Move {fileManager.selectedFiles.size} Files
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Moving files:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {selectedFileNames.slice(0, 3).map((name: string, index: number) => (
              <Chip key={index} label={name} size="small" />
            ))}
            {selectedFileNames.length > 3 && (
              <Chip label={`+${selectedFileNames.length - 3} more`} size="small" variant="outlined" />
            )}
          </Box>
        </Box>
        
        <TextField
          fullWidth
          size="small"
          placeholder="Search folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Select destination folder:
        </Typography>
        <Box sx={{ maxHeight: 300, overflow: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <List dense>
            {filteredFolders.map((folder: any) => (
              <ListItem key={folder.id} disablePadding>
                <ListItemButton
                  selected={selectedTargetFolder === folder.id}
                  onClick={() => setSelectedTargetFolder(folder.id)}
                  disabled={folder.id === fileManager.currentFolderId}
                >
                  <ListItemIcon>
                    <Folder sx={{ color: folder.color }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={folder.name}
                    secondary={folder.id === fileManager.currentFolderId ? 'Current folder' : `${folder.fileCount || 0} files`}
                  />
                  {folder.isPatientFolder && (
                    <Chip label="Patient" size="small" color="primary" variant="outlined" />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
            {filteredFolders.length === 0 && (
              <ListItem>
                <ListItemText 
                  primary="No folders found" 
                  secondary="Try adjusting your search"
                />
              </ListItem>
            )}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => fileManager.setMoveFilesOpen(false)}>Cancel</Button>
        <Button 
          onClick={() => {
            if (selectedTargetFolder) {
              fileManager.moveSelectedFiles(selectedTargetFolder);
              setSelectedTargetFolder('');
            }
          }}
          variant="contained"
          disabled={!selectedTargetFolder}
        >
          Move Files
        </Button>
      </DialogActions>
    </Dialog>
  );
}