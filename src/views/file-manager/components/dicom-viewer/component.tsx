import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  Slider,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  FormControlLabel,
  Switch
} from "@mui/material";
import {
  ZoomIn,
  RotateLeft,
  RotateRight,
  Straighten,
  Save,
  CameraAlt,
  RadioButtonUnchecked,
  Close,
  Settings,
  RuleRounded,
  InvertColors,
} from "@mui/icons-material";
import { FileItem } from "../types";

interface DICOMViewerProps {
  fileManager: any;
}

interface DICOMMetadata {
  patientName?: string;
  studyDate?: string;
  modality?: string;
  bodyPart?: string;
  studyDescription?: string;
  seriesDescription?: string;
  instanceNumber?: number;
  sliceThickness?: string;
  pixelSpacing?: string;
}

interface Measurement {
  id: string;
  type: 'line' | 'angle' | 'area' | 'circle';
  points: { x: number; y: number }[];
  value: number;
  unit: string;
}

export function DICOMViewer({ fileManager }: DICOMViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [metadata, setMetadata] = useState<DICOMMetadata>({});
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [activeTool, setActiveTool] = useState<string>('pan');
  
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [inverted, setInverted] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  
  const [windowWidth, setWindowWidth] = useState(400);
  const [windowCenter, setWindowCenter] = useState(40);
  
  useEffect(() => {
    if (fileManager.dicomViewerOpen && fileManager.currentPreviewFile) {
      setCurrentFile(fileManager.currentPreviewFile);
      loadDICOMFile(fileManager.currentPreviewFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileManager.dicomViewerOpen, fileManager.currentPreviewFile]);

  const loadDICOMFile = async (file: FileItem) => {
    try {
      const mockMetadata: DICOMMetadata = {
        patientName: "DOE, JOHN",
        studyDate: "2024-01-15",
        modality: "CT",
        bodyPart: "CHEST",
        studyDescription: "CT Chest W/O Contrast",
        seriesDescription: "Axial CT",
        instanceNumber: 1,
        sliceThickness: "5.0mm",
        pixelSpacing: "0.976562, 0.976562"
      };
      
      setMetadata(mockMetadata);
      renderDICOMImage();
      
    } catch (error) {
      console.error('Failed to load DICOM file:', error);
    }
  };

  const renderDICOMImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) ${inverted ? 'invert(1)' : ''}`;
    
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.5, '#888888');
    gradient.addColorStop(1, '#000000');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(-150, -150, 300, 300);
    
    ctx.fillStyle = '#cccccc';
    ctx.beginPath();
    ctx.ellipse(0, 0, 120, 80, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.restore();
    
    if (showAnnotations) {
      drawMeasurements(ctx);
    }
  };

  const drawMeasurements = (ctx: CanvasRenderingContext2D) => {
    measurements.forEach((measurement) => {
      ctx.strokeStyle = '#ff4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      if (measurement.type === 'line' && measurement.points.length === 2) {
        ctx.beginPath();
        ctx.moveTo(measurement.points[0].x, measurement.points[0].y);
        ctx.lineTo(measurement.points[1].x, measurement.points[1].y);
        ctx.stroke();
        
        const midX = (measurement.points[0].x + measurement.points[1].x) / 2;
        const midY = (measurement.points[0].y + measurement.points[1].y) / 2;
        ctx.fillStyle = '#ff4444';
        ctx.font = '12px Arial';
        ctx.fillText(`${measurement.value.toFixed(1)}${measurement.unit}`, midX, midY);
      }
    });
  };

  const handleToolChange = (event: React.MouseEvent<HTMLElement>, newTool: string) => {
    if (newTool !== null) {
      setActiveTool(newTool);
    }
  };

  const addMeasurement = (type: Measurement['type']) => {
    const newMeasurement: Measurement = {
      id: Date.now().toString(),
      type,
      points: [{ x: 100, y: 100 }, { x: 200, y: 150 }], 
      value: 45.2,
      unit: type === 'angle' ? '°' : 'mm'
    };
    
    setMeasurements(prev => [...prev, newMeasurement]);
  };

  const resetView = () => {
    setZoom(1);
    setRotation(0);
    setBrightness(50);
    setContrast(50);
    setInverted(false);
    setWindowWidth(400);
    setWindowCenter(40);
  };

  const saveAnnotations = () => {
    if (currentFile) {
      const annotationData = {
        measurements,
        viewSettings: { zoom, rotation, brightness, contrast, inverted }
      };
      
      fileManager.updateFileAnnotations(currentFile.id, annotationData);
      
      console.log('Annotations saved successfully');
    }
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `${currentFile?.name || 'dicom-image'}-annotated.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Dialog 
      open={fileManager.dicomViewerOpen} 
      onClose={() => fileManager.setDicomViewerOpen(false)}
      maxWidth="xl"
      fullWidth
      PaperProps={{ sx: { height: '90vh' } }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Settings color="primary" />
            DICOM Viewer
            {currentFile && (
              <Chip label={currentFile.name} size="small" variant="outlined" />
            )}
          </Box>
          <Box>
            <IconButton onClick={resetView} title="Reset View">
              <Settings />
            </IconButton>
            <IconButton onClick={() => fileManager.setDicomViewerOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', gap: 2, p: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
              <ToggleButtonGroup
                value={activeTool}
                exclusive
                onChange={handleToolChange}
                size="small"
              >
                <ToggleButton value="pan">
                  <Tooltip title="Pan">
                    <Box>Pan</Box>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="zoom">
                  <Tooltip title="Zoom">
                    <ZoomIn />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="measure">
                  <Tooltip title="Linear Measurement">
                    <RuleRounded />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="angle">
                  <Tooltip title="Angle Measurement">
                    <Straighten />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="circle">
                  <Tooltip title="Circle/ROI">
                    <RadioButtonUnchecked />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>

              <Box sx={{ display: 'inline-flex', ml: 2, gap: 1 }}>
                <IconButton size="small" onClick={() => setRotation(r => r - 90)}>
                  <RotateLeft />
                </IconButton>
                <IconButton size="small" onClick={() => setRotation(r => r + 90)}>
                  <RotateRight />
                </IconButton>
                <IconButton size="small" onClick={() => setInverted(!inverted)}>
                  <InvertColors />
                </IconButton>
                <IconButton size="small" onClick={exportImage}>
                  <CameraAlt />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'black' }}>
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  cursor: activeTool === 'pan' ? 'grab' : activeTool === 'zoom' ? 'zoom-in' : 'crosshair'
                }}
                onLoad={renderDICOMImage}
              />
            </Box>
          </Card>
        </Box>

        <Box sx={{ width: 300, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Study Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Patient" 
                    secondary={metadata.patientName} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Study Date" 
                    secondary={metadata.studyDate} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Modality" 
                    secondary={metadata.modality} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Body Part" 
                    secondary={metadata.bodyPart} 
                  />
                </ListItem>
              </List>
            </Box>
          </Card>

          <Card>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Image Controls
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Zoom: {zoom.toFixed(1)}x</Typography>
                <Slider
                  value={zoom}
                  onChange={(_, value) => setZoom(value as number)}
                  min={0.1}
                  max={5}
                  step={0.1}
                  size="small"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Brightness: {brightness}%</Typography>
                <Slider
                  value={brightness}
                  onChange={(_, value) => setBrightness(value as number)}
                  min={0}
                  max={200}
                  size="small"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Contrast: {contrast}%</Typography>
                <Slider
                  value={contrast}
                  onChange={(_, value) => setContrast(value as number)}
                  min={0}
                  max={200}
                  size="small"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" gutterBottom>
                Window/Level
              </Typography>
              
              <TextField
                label="Window Width"
                value={windowWidth}
                onChange={(e) => setWindowWidth(Number(e.target.value))}
                size="small"
                type="number"
                fullWidth
                sx={{ mb: 1 }}
              />
              
              <TextField
                label="Window Center"
                value={windowCenter}
                onChange={(e) => setWindowCenter(Number(e.target.value))}
                size="small"
                type="number"
                fullWidth
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={showAnnotations}
                    onChange={(e) => setShowAnnotations(e.target.checked)}
                  />
                }
                label="Show Annotations"
                sx={{ mt: 1 }}
              />
            </Box>
          </Card>

          <Card sx={{ flex: 1 }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Measurements
              </Typography>
              
              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => addMeasurement('line')}
                  startIcon={<RuleRounded />}
                >
                  Line
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => addMeasurement('angle')}
                  startIcon={<Straighten />}
                >
                  Angle
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => addMeasurement('circle')}
                  startIcon={<RadioButtonUnchecked />}
                >
                  Circle
                </Button>
              </Box>

              <List dense>
                {measurements.map((measurement, index) => (
                  <ListItem key={measurement.id}>
                    <ListItemText
                      primary={`${measurement.type.toUpperCase()} ${index + 1}`}
                      secondary={`${measurement.value.toFixed(1)}${measurement.unit}`}
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => setMeasurements(prev => prev.filter(m => m.id !== measurement.id))}
                    >
                      <Close />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={saveAnnotations} startIcon={<Save />}>
          Save Annotations
        </Button>
        <Button onClick={() => fileManager.setDicomViewerOpen(false)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}