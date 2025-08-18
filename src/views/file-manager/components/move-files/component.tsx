import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box 
} from "@mui/material";
import { Folder } from "@mui/icons-material";

interface MoveFilesDialogProps {
  fileManager: any; // Replace with proper type from your hook
}

export function MoveFilesDialog({ fileManager }: MoveFilesDialogProps) {
  return (
    <Dialog open={fileManager.moveFilesOpen} onClose={() => fileManager.setMoveFilesOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Move {fileManager.selectedFiles.size} Files</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select the destination folder:
        </Typography>
        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          {fileManager.folders.map((folder: any) => (
            <Box
              key={folder.id}
              sx={{
                p: 1,
                cursor: 'pointer',
                borderRadius: 1,
                '&:hover': { bgcolor: 'grey.100' }
              }}
              onClick={() => fileManager.moveSelectedFiles(folder.id)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Folder sx={{ mr: 1, color: folder.color }} />
                <Typography>{folder.name}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => fileManager.setMoveFilesOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}