import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  Card,
  Grid,
  Alert,
  Divider
} from "@mui/material";
import {
  TextFields,
  Image,
  PictureAsPdf,
  CheckCircle,
  Error,
  Schedule,
  Language
} from "@mui/icons-material";

interface OCRDialogProps {
  fileManager: any;
}

export function OCRDialog({ fileManager }: OCRDialogProps) {
  const [selectedLanguage, setSelectedLanguage] = React.useState('eng');
  const [processingFiles, setProcessingFiles] = React.useState<string[]>([]);

  const ocrLanguages = [
    { code: 'eng', name: 'English' },
    { code: 'spa', name: 'Spanish' },
    { code: 'fra', name: 'French' },
    { code: 'deu', name: 'German' },
    { code: 'ita', name: 'Italian' },
    { code: 'por', name: 'Portuguese' },
    { code: 'chi_sim', name: 'Chinese (Simplified)' },
    { code: 'jpn', name: 'Japanese' },
    { code: 'kor', name: 'Korean' },
    { code: 'ara', name: 'Arabic' }
  ];

  const eligibleFiles = fileManager.files.filter((file: any) =>
    file.type.startsWith('image/') || file.type === 'application/pdf'
  );

  const selectedEligibleFiles = eligibleFiles.filter((file: any) =>
    fileManager.selectedFilesForProcessing.includes(file.id) ||
    file.id === fileManager.menuFileId
  );

  // FIXED: Use the hook's built-in OCR processing function
  const handleProcessFiles = async () => {
    const filesToProcess = selectedEligibleFiles.length > 0 ? selectedEligibleFiles : eligibleFiles.slice(0, 5);

    setProcessingFiles(filesToProcess.map((f: any) => f.id));

    // Use the hook's processFileWithOCR function for each file
    for (const file of filesToProcess) {
      try {
        await fileManager.processFileWithOCR(file.id, selectedLanguage);
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error);
      }
    }

    setProcessingFiles([]);
  };

  const getFileStatus = (file: any) => {
    if (processingFiles.includes(file.id) || file.processingStatus === 'processing') {
      return { icon: <Schedule color="warning" />, text: 'Processing...', color: 'warning' };
    }
    if (file.processingStatus === 'failed') {
      return { icon: <Error color="error" />, text: 'Failed', color: 'error' };
    }
    if (file.isOcrProcessed) {
      return { icon: <CheckCircle color="success" />, text: 'Completed', color: 'success' };
    }
    return { icon: undefined, text: 'Ready', color: 'default' };
  };

  return (
    <Dialog open={fileManager.ocrDialogOpen} onClose={() => fileManager.setOcrDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextFields />
        OCR Text Extraction
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Language />
                OCR Settings
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={selectedLanguage}
                  label="Language"
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  {ocrLanguages.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Alert severity="info" sx={{ mt: 2 }}>
                OCR will extract text from images and PDF documents, then attempt to identify medical information like patient names, medications, and test results.
              </Alert>
            </Card>
          </Grid>

          <Grid>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Files Ready for OCR Processing ({selectedEligibleFiles.length || eligibleFiles.length})
            </Typography>

            <Box sx={{ maxHeight: 400, overflow: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <List dense>
                {(selectedEligibleFiles.length > 0 ? selectedEligibleFiles : eligibleFiles).map((file: any) => {
                  const status = getFileStatus(file);
                  const progress = fileManager.ocrProgress[file.id];

                  return (
                    <ListItem key={file.id}>
                      <ListItemIcon>
                        {file.type.startsWith('image/') ? <Image /> : <PictureAsPdf />}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">{file.name}</Typography>
                            <Chip
                              label={status.text}
                              size="small"
                              color={status.color as any}
                              icon={status.icon}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {fileManager.formatFileSize(file.size)} • {file.category}
                            </Typography>
                            {progress !== undefined && (
                              <Box sx={{ mt: 1 }}>
                                <LinearProgress variant="determinate" value={progress * 100} />
                                <Typography variant="caption" color="text.secondary">
                                  {Math.round(progress * 100)}% complete
                                </Typography>
                              </Box>
                            )}
                            {file.isOcrProcessed && file.extractedData && (
                              <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {file.extractedData.patientName && (
                                  <Chip label={`Patient: ${file.extractedData.patientName}`} size="small" />
                                )}
                                {file.extractedData.medications && (
                                  <Chip label={`${file.extractedData.medications.length} Medications`} size="small" />
                                )}
                                {file.extractedData.testResults && (
                                  <Chip label={`${file.extractedData.testResults.length} Results`} size="small" />
                                )}
                              </Box>
                            )}
                            {file.processingStatus === 'failed' && (
                              <Alert severity="error" sx={{ mt: 1 }}>
                                OCR processing failed. Please try again or check if the image is clear and readable.
                              </Alert>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}

                {eligibleFiles.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No files available for OCR processing"
                      secondary="OCR can process images (JPG, PNG) and PDF documents"
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          </Grid>

          {Object.keys(fileManager.ocrProgress).length > 0 && (
            <Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>Processing Status</Typography>
              {Object.entries(fileManager.ocrProgress).map(([fileId, progress]) => {
                const file = fileManager.files.find((f: any) => f.id === fileId);
                return (
                  <Box key={fileId} sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {file?.name || 'Unknown file'}
                    </Typography>
                    <LinearProgress variant="determinate" value={(progress as number) * 100} />
                    <Typography variant="caption" color="text.secondary">
                      {Math.round((progress as number) * 100)}% - Extracting text...
                    </Typography>
                  </Box>
                );
              })}
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => fileManager.setOcrDialogOpen(false)}>Close</Button>
        <Button
          onClick={handleProcessFiles}
          variant="contained"
          disabled={eligibleFiles.length === 0 || processingFiles.length > 0}
          startIcon={<TextFields />}
        >
          {processingFiles.length > 0 ? 'Processing...' : 'Start OCR Processing'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}