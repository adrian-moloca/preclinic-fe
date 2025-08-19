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
  Chip,
  Divider,
  IconButton,
  Paper
} from "@mui/material";
import { 
  Close, 
  TextFields, 
  ContentCopy, 
  Download,
  Person,
  LocalHospital,
  Medication,
  Assessment
} from "@mui/icons-material";

interface OCRDataViewerDialogProps {
  fileManager: any;
}

export function OCRDataViewerDialog({ fileManager }: OCRDataViewerDialogProps) {
  const file = fileManager.currentOCRFile;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const downloadOCRData = () => {
    if (!file?.ocrText) return;
    
    const dataStr = `OCR Data for: ${file.name}\n\nExtracted Text:\n${file.ocrText}\n\nExtracted Medical Data:\n${JSON.stringify(file.extractedData, null, 2)}`;
    const dataBlob = new Blob([dataStr], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name}-ocr-data.txt`;
    a.click();
    
    URL.revokeObjectURL(url);
  };

  if (!file) return null;

  return (
    <Dialog 
      open={fileManager.ocrDataViewerOpen} 
      onClose={() => fileManager.setOcrDataViewerOpen(false)} 
      maxWidth="lg" 
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextFields />
          <span>OCR Data - {file.name}</span>
          <Chip 
            label={file.ocrLanguage || 'eng'} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        </Box>
        <IconButton onClick={() => fileManager.setOcrDataViewerOpen(false)}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {file.extractedData && Object.keys(file.extractedData).length > 0 && (
            <Grid>
              <Card sx={{ p: 2, mb: 2, bgcolor: 'success.50' }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalHospital />
                  Extracted Medical Information
                </Typography>
                <Grid container spacing={2}>
                  {file.extractedData.patientName && (
                    <Grid>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Person fontSize="small" />
                        <Typography variant="subtitle2" color="text.secondary">Patient Name:</Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {file.extractedData.patientName}
                      </Typography>
                    </Grid>
                  )}
                  
                  {file.extractedData.doctorName && (
                    <Grid>
                      <Typography variant="subtitle2" color="text.secondary">Doctor:</Typography>
                      <Typography variant="body1">{file.extractedData.doctorName}</Typography>
                    </Grid>
                  )}
                  
                  {file.extractedData.dateOfBirth && (
                    <Grid>
                      <Typography variant="subtitle2" color="text.secondary">Date of Birth:</Typography>
                      <Typography variant="body1">{file.extractedData.dateOfBirth}</Typography>
                    </Grid>
                  )}
                  
                  {file.extractedData.medicalRecordNumber && (
                    <Grid>
                      <Typography variant="subtitle2" color="text.secondary">Medical Record Number:</Typography>
                      <Typography variant="body1">{file.extractedData.medicalRecordNumber}</Typography>
                    </Grid>
                  )}
                  
                  {file.extractedData.facilityName && (
                    <Grid>
                      <Typography variant="subtitle2" color="text.secondary">Facility:</Typography>
                      <Typography variant="body1">{file.extractedData.facilityName}</Typography>
                    </Grid>
                  )}
                  
                  {file.extractedData.medications && file.extractedData.medications.length > 0 && (
                    <Grid>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Medication fontSize="small" />
                        <Typography variant="subtitle2" color="text.secondary">Medications:</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {file.extractedData.medications.map((med: string, index: number) => (
                          <Chip key={index} label={med} size="small" color="info" />
                        ))}
                      </Box>
                    </Grid>
                  )}
                  
                  {file.extractedData.testResults && file.extractedData.testResults.length > 0 && (
                    <Grid>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Assessment fontSize="small" />
                        <Typography variant="subtitle2" color="text.secondary">Test Results:</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {file.extractedData.testResults.map((result: string, index: number) => (
                          <Chip key={index} label={result} size="small" color="warning" />
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Card>
            </Grid>
          )}
          
          <Grid>
            <Divider sx={{ my: 2 }} />
          </Grid>
          
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Full Extracted Text ({file.ocrText?.length || 0} characters)
              </Typography>
              <Box>
                <Button
                  size="small"
                  startIcon={<ContentCopy />}
                  onClick={() => copyToClipboard(file.ocrText || '')}
                  sx={{ mr: 1 }}
                >
                  Copy
                </Button>
                <Button
                  size="small"
                  startIcon={<Download />}
                  onClick={downloadOCRData}
                >
                  Download
                </Button>
              </Box>
            </Box>
            
            <Paper sx={{ p: 2, bgcolor: 'grey.50', maxHeight: 400, overflow: 'auto' }}>
              {file.ocrText ? (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    whiteSpace: 'pre-wrap', 
                    fontFamily: 'monospace',
                    lineHeight: 1.6
                  }}
                >
                  {file.ocrText}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" style={{ fontStyle: 'italic' }}>
                  No text extracted or OCR processing not completed
                </Typography>
              )}
            </Paper>
          </Grid>
          
          <Grid>
            <Card sx={{ p: 2, bgcolor: 'info.50' }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Processing Information
              </Typography>
              <Grid container spacing={2}>
                <Grid>
                  <Typography variant="caption" color="text.secondary">Language:</Typography>
                  <Typography variant="body2">{file.ocrLanguage || 'English'}</Typography>
                </Grid>
                <Grid>
                  <Typography variant="caption" color="text.secondary">Status:</Typography>
                  <Typography variant="body2">
                    {file.processingStatus === 'completed' ? 'Completed' : 'Processing'}
                  </Typography>
                </Grid>
                <Grid>
                  <Typography variant="caption" color="text.secondary">File Type:</Typography>
                  <Typography variant="body2">{file.type}</Typography>
                </Grid>
                <Grid>
                  <Typography variant="caption" color="text.secondary">File Size:</Typography>
                  <Typography variant="body2">{fileManager.formatFileSize(file.size)}</Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={() => fileManager.setOcrDataViewerOpen(false)}>
          Close
        </Button>
        <Button 
          onClick={downloadOCRData} 
          startIcon={<Download />}
          variant="outlined"
        >
          Download OCR Data
        </Button>
      </DialogActions>
    </Dialog>
  );
}