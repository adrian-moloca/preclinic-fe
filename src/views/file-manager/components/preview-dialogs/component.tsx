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
  Alert,
  Tabs,
  Tab,
  Divider
} from "@mui/material";
import { 
  Close, 
  Download, 
  TextFields, 
  Security, 
  Person, 
  Schedule,
  Visibility
} from "@mui/icons-material";

interface PreviewDialogProps {
  fileManager: any;
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`preview-tabpanel-${index}`}
      aria-labelledby={`preview-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export function PreviewDialog({ fileManager }: PreviewDialogProps) {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Dialog 
      open={fileManager.previewDialogOpen} 
      onClose={() => fileManager.setPreviewDialogOpen(false)} 
      maxWidth="lg" 
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span>File Preview</span>
          {fileManager.currentPreviewFile?.isOcrProcessed && (
            <Chip
              icon={<TextFields />}
              label="OCR Processed"
              size="small"
              color="success"
              variant="outlined"
            />
          )}
          {fileManager.currentPreviewFile?.isConfidential && (
            <Chip
              icon={<Security />}
              label="Confidential"
              size="small"
              color="error"
              variant="outlined"
            />
          )}
        </Box>
        <IconButton onClick={() => fileManager.setPreviewDialogOpen(false)}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      {fileManager.currentPreviewFile && (
        <>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="File Details" />
            <Tab label="Content Preview" />
            {fileManager.currentPreviewFile.isOcrProcessed && <Tab label="OCR Data" />}
            {fileManager.currentPreviewFile.accessLog && <Tab label="Access History" />}
          </Tabs>

          <DialogContent sx={{ p: 0 }}>
            <TabPanel value={tabValue} index={0}>
              <Card sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid>
                    <Typography variant="subtitle2" color="text.secondary">File Name</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{fileManager.currentPreviewFile.name}</Typography>
                    
                    <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                    <Chip 
                      label={fileManager.getCategoryInfo(fileManager.currentPreviewFile.category).label}
                      size="small"
                      sx={{ bgcolor: fileManager.getCategoryInfo(fileManager.currentPreviewFile.category).color, color: 'white', mb: 2 }}
                    />
                    
                    {fileManager.currentPreviewFile.patientName && (
                      <>
                        <Typography variant="subtitle2" color="text.secondary">Patient</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Person sx={{ fontSize: 16, mr: 0.5, color: 'primary.main' }} />
                          <Typography variant="body1">{fileManager.currentPreviewFile.patientName}</Typography>
                        </Box>
                      </>
                    )}
                  </Grid>
                  
                  <Grid>
                    <Typography variant="subtitle2" color="text.secondary">Size</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{fileManager.formatFileSize(fileManager.currentPreviewFile.size)}</Typography>
                    
                    <Typography variant="subtitle2" color="text.secondary">Upload Date</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Schedule sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body1">{new Date(fileManager.currentPreviewFile.date).toLocaleString()}</Typography>
                    </Box>
                    
                    <Typography variant="subtitle2" color="text.secondary">Version</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>v{fileManager.currentPreviewFile.version}</Typography>
                    
                    {fileManager.currentPreviewFile.lastAccessed && (
                      <>
                        <Typography variant="subtitle2" color="text.secondary">Last Accessed</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {new Date(fileManager.currentPreviewFile.lastAccessed).toLocaleString()}
                        </Typography>
                      </>
                    )}
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

                {fileManager.currentPreviewFile.sharedWith.length > 0 && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Shared With</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {fileManager.currentPreviewFile.sharedWith.length} people
                    </Typography>
                  </>
                )}
              </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {fileManager.currentPreviewFile.type.startsWith('image/') && fileManager.currentPreviewFile.content && (
                <Box sx={{ textAlign: 'center' }}>
                  <img 
                    src={fileManager.currentPreviewFile.content} 
                    alt={fileManager.currentPreviewFile.name}
                    style={{ maxWidth: '100%', maxHeight: '600px', borderRadius: 8 }}
                  />
                </Box>
              )}
              
              {fileManager.currentPreviewFile.type === 'application/pdf' && fileManager.currentPreviewFile.content && (
                <Box sx={{ textAlign: 'center' }}>
                  <iframe 
                    src={fileManager.currentPreviewFile.content}
                    width="100%"
                    height="600px"
                    style={{ border: 'none', borderRadius: 8 }}
                    title={`Preview of ${fileManager.currentPreviewFile.name}`}
                  />
                </Box>
              )}
              
              {!fileManager.currentPreviewFile.content && (
                <Alert severity="info">
                  Preview not available for this file type. Use the download button to view the file.
                </Alert>
              )}
            </TabPanel>

            {fileManager.currentPreviewFile.isOcrProcessed && (
              <TabPanel value={tabValue} index={2}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextFields />
                    Extracted Text & Medical Data
                  </Typography>
                  
                  {fileManager.currentPreviewFile.extractedData && (
                    <Card sx={{ p: 2, mb: 2, bgcolor: 'success.50' }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Extracted Medical Information:
                      </Typography>
                      <Grid container spacing={2}>
                        {fileManager.currentPreviewFile.extractedData.patientName && (
                          <Grid>
                            <Typography variant="subtitle2" color="text.secondary">Patient Name</Typography>
                            <Typography variant="body1">{fileManager.currentPreviewFile.extractedData.patientName}</Typography>
                          </Grid>
                        )}
                        {fileManager.currentPreviewFile.extractedData.doctorName && (
                          <Grid>
                            <Typography variant="subtitle2" color="text.secondary">Doctor</Typography>
                            <Typography variant="body1">{fileManager.currentPreviewFile.extractedData.doctorName}</Typography>
                          </Grid>
                        )}
                        {fileManager.currentPreviewFile.extractedData.dateOfBirth && (
                          <Grid>
                            <Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>
                            <Typography variant="body1">{fileManager.currentPreviewFile.extractedData.dateOfBirth}</Typography>
                          </Grid>
                        )}
                        {fileManager.currentPreviewFile.extractedData.medicalRecordNumber && (
                          <Grid>
                            <Typography variant="subtitle2" color="text.secondary">Medical Record Number</Typography>
                            <Typography variant="body1">{fileManager.currentPreviewFile.extractedData.medicalRecordNumber}</Typography>
                          </Grid>
                        )}
                        {fileManager.currentPreviewFile.extractedData.medications && (
                          <Grid>
                            <Typography variant="subtitle2" color="text.secondary">Medications</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                              {fileManager.currentPreviewFile.extractedData.medications.map((med: string, index: number) => (
                                <Chip key={index} label={med} size="small" color="info" />
                              ))}
                            </Box>
                          </Grid>
                        )}
                        {fileManager.currentPreviewFile.extractedData.testResults && (
                          <Grid>
                            <Typography variant="subtitle2" color="text.secondary">Test Results</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                              {fileManager.currentPreviewFile.extractedData.testResults.map((result: string, index: number) => (
                                <Chip key={index} label={result} size="small" color="warning" />
                              ))}
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Card>
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Full Extracted Text:
                  </Typography>
                  <Card sx={{ p: 2, bgcolor: 'grey.50', maxHeight: 400, overflow: 'auto' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                      {fileManager.currentPreviewFile.ocrText || 'No text extracted'}
                    </Typography>
                  </Card>
                </Box>
              </TabPanel>
            )}

            {fileManager.currentPreviewFile.accessLog && (
              <TabPanel value={tabValue} index={fileManager.currentPreviewFile.isOcrProcessed ? 3 : 2}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Visibility />
                    Access History ({fileManager.currentPreviewFile.accessCount || 0} total accesses)
                  </Typography>
                  
                  <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {fileManager.currentPreviewFile.accessLog.map((log: any, index: number) => (
                      <Card key={index} sx={{ p: 2, mb: 1, bgcolor: 'action.hover' }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {log.action.toUpperCase()}
                            </Typography>
                          </Grid>
                          <Grid>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(log.timestamp).toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid>
                            <Typography variant="body2" color="text.secondary">
                              User: {log.userId}
                            </Typography>
                          </Grid>
                          <Grid>
                            <Typography variant="caption" color="text.secondary">
                              {log.userAgent?.split(' ')[0] || 'Unknown Browser'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Card>
                    ))}
                    
                    {(!fileManager.currentPreviewFile.accessLog || fileManager.currentPreviewFile.accessLog.length === 0) && (
                      <Alert severity="info">No access history recorded</Alert>
                    )}
                  </Box>
                </Box>
              </TabPanel>
            )}
          </DialogContent>
        </>
      )}
      
      <DialogActions>
        <Button 
          onClick={() => fileManager.currentPreviewFile && fileManager.downloadSingleFile(fileManager.currentPreviewFile.id)} 
          startIcon={<Download />}
        >
          Download
        </Button>
        <Button onClick={() => fileManager.setPreviewDialogOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}