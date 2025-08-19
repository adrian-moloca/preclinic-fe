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
  Alert,
  IconButton,
  Chip,
  Divider,
  LinearProgress
} from "@mui/material";
import { 
  CameraAlt, 
  Mic, 
  Stop, 
  PhotoCamera,
  Close,
} from "@mui/icons-material";

interface MobileIntegrationsDialogProps {
  fileManager: any;
}

export function MobileIntegrationsDialog({ fileManager }: MobileIntegrationsDialogProps) {
  const [activeFeature, setActiveFeature] = React.useState<'camera' | 'voice' | null>(null);
  const [recordingTime, setRecordingTime] = React.useState(0);
  const [recordingInterval, setRecordingInterval] = React.useState<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (fileManager.isRecording && !recordingInterval) {
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
    } else if (!fileManager.isRecording && recordingInterval) {
      clearInterval(recordingInterval);
      setRecordingInterval(null);
      setRecordingTime(0);
    }

    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, [fileManager.isRecording, recordingInterval]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCamera = async () => {
    setActiveFeature('camera');
    await fileManager.startCamera();
  };

  const handleStopCamera = () => {
    fileManager.stopCamera();
    setActiveFeature(null);
  };

  const handleCapturePhoto = () => {
    fileManager.capturePhoto();
    handleStopCamera();
  };

  const handleStartRecording = async () => {
    setActiveFeature('voice');
    await fileManager.startVoiceRecording();
  };

  const handleStopRecording = () => {
    fileManager.stopVoiceRecording();
    setActiveFeature(null);
  };

  const mobileFeatures = [
    {
      id: 'camera',
      title: 'Document Camera',
      description: 'Capture documents, prescriptions, and medical images',
      icon: <CameraAlt />,
      color: 'primary',
      available: navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    },
    {
      id: 'voice',
      title: 'Voice Notes',
      description: 'Record voice memos and patient notes',
      icon: <Mic />,
      color: 'secondary',
      available: navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    },
    {
      id: 'barcode',
      title: 'Barcode Scanner',
      description: 'Scan medication barcodes and patient IDs',
      icon: <PhotoCamera />,
      color: 'warning',
      available: false
    }
  ];

  return (
    <Dialog 
      open={fileManager.mobileIntegrationsOpen} 
      onClose={() => fileManager.setMobileIntegrationsOpen(false)} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CameraAlt />
        Mobile Integration Tools
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Mobile Features
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {mobileFeatures.map((feature) => (
                <Card
                  key={feature.id}
                  sx={{
                    p: 2,
                    cursor: feature.available ? 'pointer' : 'not-allowed',
                    opacity: feature.available ? 1 : 0.5,
                    border: activeFeature === feature.id ? 2 : 1,
                    borderColor: activeFeature === feature.id ? `${feature.color}.main` : 'divider',
                    '&:hover': feature.available ? {
                      borderColor: `${feature.color}.main`,
                      bgcolor: `${feature.color}.50`
                    } : {}
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ color: `${feature.color}.main` }}>
                      {feature.icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                      {!feature.available && (
                        <Chip label="Not Available" size="small" color="error" sx={{ mt: 1 }} />
                      )}
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>

            <Alert severity="info" sx={{ mt: 2 }}>
              Mobile features work best on modern browsers with camera and microphone permissions enabled.
            </Alert>
          </Grid>

          <Grid>
            {activeFeature === null && (
              <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                <CameraAlt sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Select a mobile feature to get started
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use your device's camera or microphone to capture medical documents and notes
                </Typography>
              </Card>
            )}

            {activeFeature === 'camera' && (
              <Card sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Document Camera</Typography>
                  <IconButton onClick={handleStopCamera} color="error">
                    <Close />
                  </IconButton>
                </Box>
                
                {fileManager.cameraStream ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <video
                      ref={fileManager.videoRef}
                      autoPlay
                      playsInline
                      style={{
                        width: '100%',
                        maxHeight: 300,
                        borderRadius: 8,
                        marginBottom: 16
                      }}
                    />
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleCapturePhoto}
                        startIcon={<PhotoCamera />}
                        sx={{ 
                          borderRadius: '50px',
                          px: 3
                        }}
                      >
                        Capture Photo
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleStopCamera}
                        startIcon={<Close />}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Starting camera...
                    </Typography>
                    <LinearProgress />
                  </Box>
                )}
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  Position the document clearly in frame. The captured image will be automatically saved to your current folder.
                </Alert>
              </Card>
            )}

            {activeFeature === 'voice' && (
              <Card sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Voice Recording</Typography>
                  <IconButton onClick={handleStopRecording} color="error">
                    <Close />
                  </IconButton>
                </Box>
                
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  {fileManager.isRecording ? (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <Box sx={{ 
                          width: 120, 
                          height: 120, 
                          borderRadius: '50%', 
                          bgcolor: 'error.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          animation: 'pulse 2s infinite'
                        }}>
                          <Mic sx={{ fontSize: 48, color: 'white' }} />
                        </Box>
                      </Box>
                      
                      <Typography variant="h4" sx={{ mb: 2, fontFamily: 'monospace' }}>
                        {formatTime(recordingTime)}
                      </Typography>
                      
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Recording in progress...
                      </Typography>
                      
                      <Button
                        variant="contained"
                        color="error"
                        size="large"
                        onClick={handleStopRecording}
                        startIcon={<Stop />}
                        sx={{ borderRadius: '50px', px: 4 }}
                      >
                        Stop Recording
                      </Button>
                    </>
                  ) : (
                    <>
                      <Mic sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Ready to Record
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Click the button below to start recording your voice note
                      </Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={handleStartRecording}
                        startIcon={<Mic />}
                        sx={{ borderRadius: '50px', px: 4 }}
                      >
                        Start Recording
                      </Button>
                    </>
                  )}
                </Box>
                
                <Alert severity="info">
                  Voice recordings will be saved as audio files in your current folder. Speak clearly for best quality.
                </Alert>
              </Card>
            )}
          </Grid>

          <Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<CameraAlt />}
                onClick={handleStartCamera}
                disabled={activeFeature !== null || !mobileFeatures[0].available}
              >
                Quick Photo
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Mic />}
                onClick={handleStartRecording}
                disabled={activeFeature !== null || !mobileFeatures[1].available}
              >
                Quick Voice Note
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<PhotoCamera />}
                disabled
              >
                Scan Barcode
              </Button>
            </Box>
          </Grid>

          <Grid>
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Mobile Captures</Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {fileManager.files
                .filter((f: any) => f.processedFrom === 'camera_capture' || f.processedFrom === 'voice_recording')
                .slice(0, 5)
                .map((file: any) => (
                  <Card key={file.id} sx={{ p: 1, minWidth: 120 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      {file.type.startsWith('image/') ? <CameraAlt /> : <Mic />}
                      <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                        {file.name.substring(0, 15)}...
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(file.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Card>
                ))}
              
              {fileManager.files.filter((f: any) => 
                f.processedFrom === 'camera_capture' || f.processedFrom === 'voice_recording'
              ).length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No mobile captures yet. Use the camera or microphone to get started.
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => fileManager.setMobileIntegrationsOpen(false)}>
          Close
        </Button>
        {activeFeature && (
          <Button 
            onClick={() => {
              if (activeFeature === 'camera') handleStopCamera();
              if (activeFeature === 'voice') handleStopRecording();
            }}
            color="error"
            startIcon={<Stop />}
          >
            Stop {activeFeature === 'camera' ? 'Camera' : 'Recording'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}