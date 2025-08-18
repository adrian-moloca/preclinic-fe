import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  IconButton, 
  Box, 
  Card, 
  Grid, 
  Typography, 
  Chip, 
  Alert 
} from "@mui/material";
import { Close, Download } from "@mui/icons-material";

interface PreviewDialogProps {
  fileManager: any; // Replace with proper type from your hook
}

export function PreviewDialog({ fileManager }: PreviewDialogProps) {
  return (
    <Dialog open={fileManager.previewDialogOpen} onClose={() => fileManager.setPreviewDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>File Preview</span>
        <IconButton onClick={() => fileManager.setPreviewDialogOpen(false)}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {fileManager.currentPreviewFile && (
          <Box>
            <Card sx={{ mb: 2, p: 2 }}>
              <Grid container spacing={2}>
                <Grid>
                  <Typography variant="subtitle2" color="text.secondary">File Name</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{fileManager.currentPreviewFile.name}</Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                  <Chip 
                    label={fileManager.getCategoryInfo(fileManager.currentPreviewFile.category).label}
                    size="small"
                    sx={{ bgcolor: fileManager.getCategoryInfo(fileManager.currentPreviewFile.category).color, color: 'white', mb: 1 }}
                  />
                  
                  {fileManager.currentPreviewFile.patientName && (
                    <>
                      <Typography variant="subtitle2" color="text.secondary">Patient</Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>{fileManager.currentPreviewFile.patientName}</Typography>
                    </>
                  )}
                </Grid>
                
                <Grid>
                  <Typography variant="subtitle2" color="text.secondary">Size</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{fileManager.formatFileSize(fileManager.currentPreviewFile.size)}</Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary">Upload Date</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{new Date(fileManager.currentPreviewFile.date).toLocaleDateString()}</Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary">Version</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>v{fileManager.currentPreviewFile.version}</Typography>
                </Grid>
              </Grid>
              
              {fileManager.currentPreviewFile.description && (
                <>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Description</Typography>
                  <Typography variant="body1">{fileManager.currentPreviewFile.description}</Typography>
                </>
              )}
              
              {fileManager.currentPreviewFile.tags.length > 0 && (
                <>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Tags</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {fileManager.currentPreviewFile.tags.map((tag: string, index: number) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                </>
              )}
            </Card>
            
            {/* File Content Preview */}
            {fileManager.currentPreviewFile.type.startsWith('image/') && fileManager.currentPreviewFile.content && (
              <Box sx={{ textAlign: 'center' }}>
                <img 
                  src={fileManager.currentPreviewFile.content} 
                  alt={fileManager.currentPreviewFile.name}
                  style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: 8 }}
                />
              </Box>
            )}
            
            {fileManager.currentPreviewFile.type === 'application/pdf' && fileManager.currentPreviewFile.content && (
              <Box sx={{ textAlign: 'center' }}>
                <iframe 
                  src={fileManager.currentPreviewFile.content}
                  width="100%"
                  height="400px"
                  style={{ border: 'none', borderRadius: 8 }}
                  title={`PDF Preview - ${fileManager.currentPreviewFile.name}`}
                />
              </Box>
            )}
            
            {!fileManager.currentPreviewFile.content && (
              <Alert severity="info">
                Preview not available for this file type. Use the download button to view the file.
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => fileManager.currentPreviewFile && fileManager.downloadSingleFile(fileManager.currentPreviewFile.id)} startIcon={<Download />}>
          Download
        </Button>
        <Button onClick={() => fileManager.setPreviewDialogOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}