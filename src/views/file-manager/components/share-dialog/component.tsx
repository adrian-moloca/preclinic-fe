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
  Switch,
  Box,
  Chip,
  Grid,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from "@mui/material";
import { Share, Email, Link, Security, Delete, Person } from "@mui/icons-material";

interface ShareDialogProps {
  fileManager: any;
}

export function ShareDialog({ fileManager }: ShareDialogProps) {
  const [shareMethod, setShareMethod] = React.useState<'email' | 'link'>('email');
  const [linkExpiration, setLinkExpiration] = React.useState('7');
  const [allowDownload, setAllowDownload] = React.useState(true);
  const [requirePassword, setRequirePassword] = React.useState(false);
  const [sharePassword, setSharePassword] = React.useState('');
  const [notifyByEmail, setNotifyByEmail] = React.useState(true);

  const selectedFileNames = Array.from(fileManager.selectedFiles)
    .map(id => fileManager.files.find((f: any) => f.id === id)?.name)
    .filter(Boolean);

  const currentFile = fileManager.files.find((f: any) => f.id === fileManager.menuFileId);

  return (
    <Dialog open={fileManager.shareDialogOpen} onClose={() => fileManager.setShareDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Share />
        Share Files
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Sharing {fileManager.selectedFiles.size || 1} file(s):
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {(selectedFileNames.length > 0 ? selectedFileNames : [currentFile?.name]).slice(0, 3).map((name: string, index: number) => (
              <Chip key={index} label={name} size="small" />
            ))}
            {(selectedFileNames.length > 3) && (
              <Chip label={`+${selectedFileNames.length - 3} more`} size="small" variant="outlined" />
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid>
            <Typography variant="h6" sx={{ mb: 2 }}>Share Method</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Card 
                sx={{ 
                  p: 2, 
                  cursor: 'pointer', 
                  border: shareMethod === 'email' ? 2 : 1,
                  borderColor: shareMethod === 'email' ? 'primary.main' : 'divider'
                }}
                onClick={() => setShareMethod('email')}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Email sx={{ fontSize: 32, mb: 1, color: shareMethod === 'email' ? 'primary.main' : 'text.secondary' }} />
                  <Typography variant="subtitle2">Email Invitation</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Send secure email invitations
                  </Typography>
                </Box>
              </Card>
              
              <Card 
                sx={{ 
                  p: 2, 
                  cursor: 'pointer', 
                  border: shareMethod === 'link' ? 2 : 1,
                  borderColor: shareMethod === 'link' ? 'primary.main' : 'divider'
                }}
                onClick={() => setShareMethod('link')}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Link sx={{ fontSize: 32, mb: 1, color: shareMethod === 'link' ? 'primary.main' : 'text.secondary' }} />
                  <Typography variant="subtitle2">Shareable Link</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Generate a secure link
                  </Typography>
                </Box>
              </Card>
            </Box>
          </Grid>

          {shareMethod === 'email' && (
            <Grid>
              <TextField
                fullWidth
                label="Email Addresses"
                value={fileManager.shareUsers.join(', ')}
                onChange={(e) => fileManager.setShareUsers(e.target.value.split(',').map((email: string) => email.trim()))}
                placeholder="user1@email.com, user2@email.com"
                helperText="Separate multiple email addresses with commas"
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Message (Optional)"
                value={fileManager.shareNote}
                onChange={(e) => fileManager.setShareNote(e.target.value)}
                multiline
                rows={3}
                placeholder="Add a note for the recipients..."
              />
            </Grid>
          )}

          {shareMethod === 'link' && (
            <Grid>
              <TextField
                fullWidth
                label="Link Expiration (days)"
                type="number"
                value={linkExpiration}
                onChange={(e) => setLinkExpiration(e.target.value)}
                inputProps={{ min: 1, max: 30 }}
                helperText="Link will expire after this many days"
              />
            </Grid>
          )}

          <Grid>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Security />
              Security Options
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={allowDownload}
                    onChange={(e) => setAllowDownload(e.target.checked)}
                  />
                }
                label="Allow recipients to download files"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={requirePassword}
                    onChange={(e) => setRequirePassword(e.target.checked)}
                  />
                }
                label="Require password to access"
              />
              
              {requirePassword && (
                <TextField
                  label="Share Password"
                  type="password"
                  value={sharePassword}
                  onChange={(e) => setSharePassword(e.target.value)}
                  size="small"
                  sx={{ ml: 4, maxWidth: 300 }}
                  helperText="Recipients will need this password"
                />
              )}
              
              <FormControlLabel
                control={
                  <Switch
                    checked={notifyByEmail}
                    onChange={(e) => setNotifyByEmail(e.target.checked)}
                  />
                }
                label="Send notification email"
              />
            </Box>
          </Grid>

          {currentFile?.sharedWith && currentFile.sharedWith.length > 0 && (
            <Grid>
              <Typography variant="h6" sx={{ mb: 2 }}>Currently Shared With</Typography>
              <List dense>
                {currentFile.sharedWith.map((email: string, index: number) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => {
                      }}>
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText primary={email} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}
        </Grid>

        <Alert severity="info" sx={{ mt: 3 }}>
          {shareMethod === 'email' 
            ? "Recipients will receive an email notification with secure access to the shared files."
            : "A secure, expiring link will be generated that can be shared with anyone."
          }
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => fileManager.setShareDialogOpen(false)}>Cancel</Button>
        <Button 
          onClick={fileManager.shareFile} 
          variant="contained" 
          disabled={shareMethod === 'email' ? fileManager.shareUsers.length === 0 : false}
        >
          {shareMethod === 'email' ? 'Send Invitations' : 'Generate Link'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}