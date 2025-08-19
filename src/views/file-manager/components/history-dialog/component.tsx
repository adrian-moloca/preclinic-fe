import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Chip,
  Box,
  Typography,
  IconButton,
  Tooltip
} from "@mui/material";
import { CloudUpload, Download, Restore, Visibility } from "@mui/icons-material";

interface VersionHistoryDialogProps {
  fileManager: any;
}

export function VersionHistoryDialog({ fileManager }: VersionHistoryDialogProps) {
  return (
    <Dialog open={fileManager.versionHistoryOpen} onClose={() => fileManager.setVersionHistoryOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Version History
          {fileManager.selectedFileForHistory && (
            <Typography variant="body2" color="text.secondary">
              {fileManager.selectedFileForHistory.name}
            </Typography>
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        {fileManager.selectedFileForHistory && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Version</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Uploaded By</TableCell>
                  <TableCell>Changes</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fileManager.selectedFileForHistory.versions.map((version: any) => (
                  <TableRow key={version.id} sx={{ 
                    bgcolor: version.version === fileManager.selectedFileForHistory.version ? 'action.selected' : 'inherit'
                  }}>
                    <TableCell>
                      <Chip 
                        label={`v${version.version}`}
                        color={version.version === fileManager.selectedFileForHistory.version ? "primary" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(version.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(version.date).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell>{version.uploadedBy}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {version.changes}
                      </Typography>
                    </TableCell>
                    <TableCell>{fileManager.formatFileSize(version.fileSize)}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {version.version === fileManager.selectedFileForHistory.version ? (
                          <Chip label="Current" color="success" size="small" />
                        ) : (
                          <>
                            <Tooltip title="Preview this version">
                              <IconButton size="small">
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download this version">
                              <IconButton size="small">
                                <Download fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Restore this version">
                              <IconButton size="small" color="warning">
                                <Restore fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => fileManager.selectedFileForHistory && fileManager.uploadNewVersion(fileManager.selectedFileForHistory.id)} 
          startIcon={<CloudUpload />}
          variant="outlined"
        >
          Upload New Version
        </Button>
        <Button onClick={() => fileManager.setVersionHistoryOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}