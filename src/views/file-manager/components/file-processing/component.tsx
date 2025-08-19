import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  Typography, 
  Card, 
  Grid, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { 
  PictureAsPdf, 
  MergeType, 
  Transform, 
  Compress, 
  Image,
  InsertDriveFile,
  CloudDone,
  Error,
  Schedule
} from "@mui/icons-material";

interface FileProcessingDialogProps {
  fileManager: any;
}

export function FileProcessingDialog({ fileManager }: FileProcessingDialogProps) {
  const [selectedOperation, setSelectedOperation] = React.useState<'merge_pdf' | 'image_to_pdf' | 'compress' | ''>('');
  const [compressionQuality, setCompressionQuality] = React.useState(80);
  const [processing, setProcessing] = React.useState(false);

  const operations = [
    {
      id: 'merge_pdf',
      title: 'Merge PDFs',
      description: 'Combine multiple PDF files into one document',
      icon: <MergeType />,
      color: 'primary',
      requirements: 'Requires 2+ PDF files'
    },
    {
      id: 'image_to_pdf',
      title: 'Images to PDF',
      description: 'Convert images to a single PDF document',
      icon: <Transform />,
      color: 'success',
      requirements: 'Requires 1+ image files'
    },
    {
      id: 'compress',
      title: 'Compress Files',
      description: 'Reduce file sizes for easier sharing',
      icon: <Compress />,
      color: 'warning',
      requirements: 'Works with images and PDFs'
    }
  ];

  const selectedFiles = Array.from(fileManager.selectedFiles)
    .map(id => fileManager.files.find((f: any) => f.id === id))
    .filter(Boolean);

  const pdfFiles = selectedFiles.filter(f => f.type === 'application/pdf');
  const imageFiles = selectedFiles.filter(f => f.type.startsWith('image/'));
  const compressibleFiles = selectedFiles.filter(f => 
    f.type.startsWith('image/') || f.type === 'application/pdf'
  );

  const canPerformOperation = (operationId: string) => {
    switch (operationId) {
      case 'merge_pdf':
        return pdfFiles.length >= 2;
      case 'image_to_pdf':
        return imageFiles.length >= 1;
      case 'compress':
        return compressibleFiles.length >= 1;
      default:
        return false;
    }
  };

  const handleProcessFiles = async () => {
    if (!selectedOperation) return;
    
    setProcessing(true);
    
    try {
      switch (selectedOperation) {
        case 'merge_pdf':
          await fileManager.mergePDFs(pdfFiles.map((f: any) => f.id));
          break;
        case 'image_to_pdf':
          await fileManager.convertImageToPDF(imageFiles.map((f: any) => f.id));
          break;
        case 'compress':
          console.log('Compressing files with quality:', compressionQuality);
          break;
      }
    } catch (error) {
      console.error('File processing failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  const getFileIcon = (file: any) => {
    if (file.type.startsWith('image/')) return <Image />;
    if (file.type === 'application/pdf') return <PictureAsPdf />;
    return <InsertDriveFile />;
  };

  const getProcessingStatus = (file: any) => {
    if (file.processingStatus === 'processing') {
      return { icon: <Schedule color="warning" />, text: 'Processing', color: 'warning' };
    }
    if (file.processingStatus === 'failed') {
      return { icon: <Error color="error" />, text: 'Failed', color: 'error' };
    }
    if (file.processingStatus === 'completed') {
      return { icon: <CloudDone color="success" />, text: 'Completed', color: 'success' };
    }
    return null;
  };

  return (
    <Dialog open={fileManager.fileProcessingOpen} onClose={() => fileManager.setFileProcessingOpen(false)} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Transform />
        File Processing Tools
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Select Processing Operation
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {operations.map((operation) => {
                const canPerform = canPerformOperation(operation.id);
                return (
                  <Card
                    key={operation.id}
                    sx={{
                      p: 2,
                      cursor: canPerform ? 'pointer' : 'not-allowed',
                      border: selectedOperation === operation.id ? 2 : 1,
                      borderColor: selectedOperation === operation.id ? `${operation.color}.main` : 'divider',
                      opacity: canPerform ? 1 : 0.5,
                      '&:hover': canPerform ? {
                        borderColor: `${operation.color}.main`,
                        bgcolor: `${operation.color}.50`
                      } : {}
                    }}
                    onClick={() => canPerform && setSelectedOperation(operation.id as any)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ color: `${operation.color}.main` }}>
                        {operation.icon}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {operation.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {operation.description}
                        </Typography>
                        <Typography variant="caption" color={canPerform ? 'success.main' : 'error.main'}>
                          {operation.requirements} {canPerform ? '✓' : '✗'}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                );
              })}
            </Box>

            {selectedOperation === 'compress' && (
              <Card sx={{ p: 2, mt: 2, bgcolor: 'warning.50' }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>Compression Settings</Typography>
                <FormControl fullWidth size="small">
                  <InputLabel>Quality</InputLabel>
                  <Select
                    value={compressionQuality}
                    label="Quality"
                    onChange={(e) => setCompressionQuality(Number(e.target.value))}
                  >
                    <MenuItem value={90}>High Quality (90%)</MenuItem>
                    <MenuItem value={80}>Good Quality (80%)</MenuItem>
                    <MenuItem value={70}>Medium Quality (70%)</MenuItem>
                    <MenuItem value={60}>Low Quality (60%)</MenuItem>
                  </Select>
                </FormControl>
              </Card>
            )}
          </Grid>

          <Grid>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Selected Files ({selectedFiles.length})
            </Typography>
            
            {selectedFiles.length === 0 ? (
              <Alert severity="info">
                Please select files from the file manager to process them.
              </Alert>
            ) : (
              <Box sx={{ maxHeight: 400, overflow: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <List dense>
                  {selectedFiles.map((file: any) => {
                    const status = getProcessingStatus(file);
                    return (
                      <ListItem key={file.id}>
                        <ListItemIcon>
                          {getFileIcon(file)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2">{file.name}</Typography>
                              {status && (
                                <Chip 
                                  label={status.text} 
                                  size="small" 
                                  color={status.color as any}
                                  icon={status.icon}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {fileManager.formatFileSize(file.size)} • {file.type}
                              </Typography>
                              {file.processedFrom && (
                                <Box sx={{ mt: 0.5 }}>
                                  <Chip 
                                    label={`Processed from: ${file.processedFrom}`} 
                                    size="small" 
                                    variant="outlined"
                                  />
                                </Box>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            )}

            {selectedFiles.length > 0 && (
              <Card sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>File Summary:</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {pdfFiles.length > 0 && (
                    <Chip 
                      label={`${pdfFiles.length} PDF${pdfFiles.length > 1 ? 's' : ''}`} 
                      size="small" 
                      color="error"
                    />
                  )}
                  {imageFiles.length > 0 && (
                    <Chip 
                      label={`${imageFiles.length} Image${imageFiles.length > 1 ? 's' : ''}`} 
                      size="small" 
                      color="success"
                    />
                  )}
                  <Chip 
                    label={`Total: ${fileManager.formatFileSize(selectedFiles.reduce((acc, f) => acc + f.size, 0))}`} 
                    size="small" 
                    variant="outlined"
                  />
                </Box>
              </Card>
            )}
          </Grid>

          {selectedOperation && (
            <Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>Processing Preview</Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                {selectedOperation === 'merge_pdf' && `This will create a new PDF file containing all ${pdfFiles.length} selected PDF documents in order.`}
                {selectedOperation === 'image_to_pdf' && `This will create a new PDF document with ${imageFiles.length} pages, one for each selected image.`}
                {selectedOperation === 'compress' && `This will create compressed versions of ${compressibleFiles.length} files with ${compressionQuality}% quality.`}
              </Alert>
              
              <Card sx={{ p: 2, bgcolor: 'success.50' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Expected Results:</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {selectedOperation === 'merge_pdf' && (
                    <Typography variant="body2">
                      • 1 new merged PDF file will be created
                      • Original files will remain unchanged
                      • New file will be saved in the current folder
                    </Typography>
                  )}
                  {selectedOperation === 'image_to_pdf' && (
                    <Typography variant="body2">
                      • 1 new PDF file with {imageFiles.length} pages will be created
                      • Each image will become a page in the PDF
                      • Original images will remain unchanged
                    </Typography>
                  )}
                  {selectedOperation === 'compress' && (
                    <Typography variant="body2">
                      • {compressibleFiles.length} compressed files will be created
                      • File sizes will be reduced by approximately 20-60%
                      • Original files will remain unchanged
                    </Typography>
                  )}
                </Box>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => fileManager.setFileProcessingOpen(false)}>Close</Button>
        <Button 
          onClick={handleProcessFiles}
          variant="contained"
          disabled={!selectedOperation || selectedFiles.length === 0 || processing || !canPerformOperation(selectedOperation)}
          startIcon={processing ? <Schedule /> : <Transform />}
        >
          {processing ? 'Processing...' : 'Start Processing'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}