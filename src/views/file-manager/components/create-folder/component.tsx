import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField 
} from "@mui/material";

interface CreateFolderDialogProps {
  fileManager: any; // Replace with proper type from your hook
}

export function CreateFolderDialog({ fileManager }: CreateFolderDialogProps) {
  return (
    <Dialog open={fileManager.createFolderOpen} onClose={() => fileManager.setCreateFolderOpen(false)}>
      <DialogTitle>Create New Folder</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Folder Name"
          value={fileManager.newFolderName}
          onChange={(e) => fileManager.setNewFolderName(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => fileManager.setCreateFolderOpen(false)}>Cancel</Button>
        <Button onClick={fileManager.createFolder} variant="contained">Create</Button>
      </DialogActions>
    </Dialog>
  );
}