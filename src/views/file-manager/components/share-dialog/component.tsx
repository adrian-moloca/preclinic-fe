import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  TextField, 
  Alert, 
  FormControlLabel, 
  Switch 
} from "@mui/material";

interface ShareDialogProps {
  fileManager: any; // Replace with proper type from your hook
}

export function ShareDialog({ fileManager }: ShareDialogProps) {
  return (
    <Dialog open={fileManager.shareDialogOpen} onClose={() => fileManager.setShareDialogOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Share Files</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Share {fileManager.selectedFiles.size || 1} file(s) with team members or patients.
        </Typography>
        
        <TextField
          fullWidth
          label="Email Addresses"
          value={fileManager.shareUsers.join(', ')}
          onChange={(e) => fileManager.setShareUsers(e.target.value.split(',').map((email: string) => email.trim()))}
          placeholder="user1@email.com, user2@email.com"
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="Share Note (Optional)"
          value={fileManager.shareNote}
          onChange={(e) => fileManager.setShareNote(e.target.value)}
          multiline
          rows={3}
          placeholder="Add a note for the recipients..."
          sx={{ mb: 2 }}
        />
        
        <Alert severity="info" sx={{ mb: 2 }}>
          Recipients will receive an email notification with access to the shared files.
        </Alert>
        
        <FormControlLabel
          control={<Switch />}
          label="Allow recipients to download files"
        />
        <FormControlLabel
          control={<Switch />}
          label="Send notification email"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => fileManager.setShareDialogOpen(false)}>Cancel</Button>
        <Button onClick={fileManager.shareFile} variant="contained" disabled={fileManager.shareUsers.length === 0}>
          Share Files
        </Button>
      </DialogActions>
    </Dialog>
  );
}