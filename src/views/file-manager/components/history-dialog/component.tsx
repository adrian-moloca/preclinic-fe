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
  Chip 
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

interface VersionHistoryDialogProps {
  fileManager: any; 
}

export function VersionHistoryDialog({ fileManager }: VersionHistoryDialogProps) {
  return (
    <Dialog open={fileManager.versionHistoryOpen} onClose={() => fileManager.setVersionHistoryOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>Version History</DialogTitle>
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
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fileManager.selectedFileForHistory.versions.map((version: any) => (
                  <TableRow key={version.id}>
                    <TableCell>
                      <Chip 
                        label={`v${version.version}`}
                        color={version.version === fileManager.selectedFileForHistory.version ? "primary" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(version.date).toLocaleString()}</TableCell>
                    <TableCell>{version.uploadedBy}</TableCell>
                    <TableCell>{version.changes}</TableCell>
                    <TableCell>{fileManager.formatFileSize(version.fileSize)}</TableCell>
                    <TableCell>
                      {version.version === fileManager.selectedFileForHistory.version && (
                        <Chip label="Current" color="success" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => fileManager.selectedFileForHistory && fileManager.uploadNewVersion(fileManager.selectedFileForHistory.id)} startIcon={<CloudUpload />}>
          Upload New Version
        </Button>
        <Button onClick={() => fileManager.setVersionHistoryOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}