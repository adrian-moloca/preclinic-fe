import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  Button,
  Box,
  Typography,
  IconButton,
  Toolbar,
  Divider,
  Paper,
  Slider,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ButtonGroup,
  Alert,
  Tab,
  Tabs,
  FormControl,
  Select,
  MenuItem,
  Menu,
} from '@mui/material';
import {
  Close,
  ZoomIn,
  ZoomOut,
  RotateLeft,
  RotateRight,
  Fullscreen,
  FullscreenExit,
  RestartAlt,
  Save,
  Print,
  Share,
  Visibility,
  VisibilityOff,
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  Tune,
  Timeline,
  Psychology,
  Straighten,
  Edit,
  GetApp,
  FileDownload
} from '@mui/icons-material';

interface DICOMViewerProps {
  fileManager: {
    dicomViewerOpen: boolean;
    setDicomViewerOpen: (open: boolean) => void;
    currentPreviewFile: any;
    updateFileAnnotations: (fileId: string, annotations: any) => void;
  };
}

interface ViewportSettings {
  windowWidth: number;
  windowCenter: number;
  zoom: number;
  pan: { x: number; y: number };
  rotation: number;
  brightness: number;
  contrast: number;
}

interface Measurement {
  id: string;
  type: 'length' | 'angle' | 'area' | 'ellipse';
  points: { x: number; y: number }[];
  value: number;
  unit: string;
  label: string;
}

interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  type: 'arrow' | 'text' | 'rectangle' | 'circle';
  color: string;
}

const mockDicomMetadata = {
  patientName: "DOE^JOHN",
  patientID: "12345",
  studyDate: "20241201",
  modality: "CT",
  bodyPartExamined: "CHEST",
  studyDescription: "CT CHEST W/O CONTRAST",
  seriesDescription: "AXIAL 5MM",
  sliceThickness: "5.0mm",
  pixelSpacing: "0.7031\\0.7031",
  imagePosition: "-250.0\\-250.0\\120.0",
  imageOrientation: "1\\0\\0\\0\\1\\0",
  rows: 512,
  columns: 512,
  bitsAllocated: 16,
  windowCenter: 40,
  windowWidth: 400,
  rescaleIntercept: -1024,
  rescaleSlope: 1
};

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export function DICOMViewer({ fileManager }: DICOMViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const printCanvasRef = useRef<HTMLCanvasElement>(null);
  const [tabValue, setTabValue] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlice, setCurrentSlice] = useState(1);
  const [totalSlices] = useState(120);
  
  const [saveMenuAnchor, setSaveMenuAnchor] = useState<null | HTMLElement>(null);
  
  const [viewportSettings, setViewportSettings] = useState<ViewportSettings>({
    windowWidth: 400,
    windowCenter: 40,
    zoom: 1.0,
    pan: { x: 0, y: 0 },
    rotation: 0,
    brightness: 50,
    contrast: 50
  });

  const [activeTool, setActiveTool] = useState<string>('windowing');
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [showAnnotations, setShowAnnotations] = useState(true);

  const windowingPresets = [
    { name: 'Soft Tissue', center: 40, width: 400 },
    { name: 'Lung', center: -600, width: 1600 },
    { name: 'Bone', center: 300, width: 1500 },
    { name: 'Brain', center: 40, width: 80 },
    { name: 'Liver', center: 60, width: 160 },
    { name: 'Abdomen', center: 60, width: 400 }
  ];

  useEffect(() => {
    if (fileManager.dicomViewerOpen && canvasRef.current) {
      renderMockDicomImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileManager.dicomViewerOpen, viewportSettings, currentSlice]);

  const renderMockDicomImage = (targetCanvas?: HTMLCanvasElement) => {
    const canvas = targetCanvas || canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(viewportSettings.zoom, viewportSettings.zoom);
    ctx.rotate((viewportSettings.rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2 + viewportSettings.pan.x, -canvas.height / 2 + viewportSettings.pan.y);

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % canvas.width;
      const y = Math.floor(i / 4 / canvas.width);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      
      let intensity = 0;
      
      if (distFromCenter < 80) {
        intensity = 50 + Math.sin(currentSlice * 0.1) * 20;
      } else if (distFromCenter < 150) {
        intensity = 20 + Math.random() * 15;
      } else if (distFromCenter < 200) {
        intensity = 40 + Math.sin(x * 0.05) * 10;
      } else {
        intensity = 5;
      }

      const windowedValue = Math.max(0, Math.min(255,
        ((intensity - viewportSettings.windowCenter + viewportSettings.windowWidth / 2) / viewportSettings.windowWidth) * 255
      ));

      const finalValue = Math.max(0, Math.min(255,
        (windowedValue * (viewportSettings.contrast / 50)) + (viewportSettings.brightness - 50) * 2
      ));

      data[i] = finalValue;     
      data[i + 1] = finalValue; 
      data[i + 2] = finalValue; 
      data[i + 3] = 255;        
    }

    ctx.putImageData(imageData, 0, 0);

    if (showMeasurements) {
      drawMeasurements(ctx);
    }
    if (showAnnotations) {
      drawAnnotations(ctx);
    }

    drawOverlay(ctx, targetCanvas !== null);

    ctx.restore();
  };

  const drawMeasurements = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#00ff00';
    ctx.fillStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.font = '12px Arial';

    measurements.forEach(measurement => {
      if (measurement.points.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(measurement.points[0].x, measurement.points[0].y);
        
        if (measurement.type === 'length') {
          ctx.lineTo(measurement.points[1].x, measurement.points[1].y);
          
          const midX = (measurement.points[0].x + measurement.points[1].x) / 2;
          const midY = (measurement.points[0].y + measurement.points[1].y) / 2;
          ctx.fillText(`${measurement.value.toFixed(1)}${measurement.unit}`, midX, midY - 10);
        }
        
        ctx.stroke();
      }
    });
  };

  const drawAnnotations = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#ffff00';
    ctx.strokeStyle = '#ffff00';
    ctx.font = '14px Arial';

    annotations.forEach(annotation => {
      if (annotation.type === 'text') {
        ctx.fillText(annotation.text, annotation.x, annotation.y);
      } else if (annotation.type === 'arrow') {
        ctx.beginPath();
        ctx.moveTo(annotation.x, annotation.y);
        ctx.lineTo(annotation.x + 20, annotation.y - 10);
        ctx.moveTo(annotation.x + 20, annotation.y - 10);
        ctx.lineTo(annotation.x + 15, annotation.y - 5);
        ctx.moveTo(annotation.x + 20, annotation.y - 10);
        ctx.lineTo(annotation.x + 15, annotation.y - 15);
        ctx.stroke();
        ctx.fillText(annotation.text, annotation.x + 25, annotation.y - 10);
      }
    });
  };

  const drawOverlay = (ctx: CanvasRenderingContext2D, isPrint = false) => {
    ctx.fillStyle = '#ffffff';
    ctx.font = isPrint ? '14px monospace' : '12px monospace';
    
    ctx.fillText(`Patient: ${mockDicomMetadata.patientName}`, 10, isPrint ? 25 : 20);
    ctx.fillText(`ID: ${mockDicomMetadata.patientID}`, 10, isPrint ? 45 : 35);
    ctx.fillText(`Study: ${mockDicomMetadata.studyDescription}`, 10, isPrint ? 65 : 50);
    
    const canvas = canvasRef.current;
    if (canvas) {
      const rightX = canvas.width - 100;
      ctx.fillText(`${mockDicomMetadata.modality}`, rightX, isPrint ? 25 : 20);
      ctx.fillText(`Slice: ${currentSlice}/${totalSlices}`, rightX, isPrint ? 45 : 35);
      ctx.fillText(`${mockDicomMetadata.sliceThickness}`, rightX, isPrint ? 65 : 50);
    }
    
    if (canvas) {
      const bottomY = canvas.height - (isPrint ? 45 : 35);
      ctx.fillText(`W: ${viewportSettings.windowWidth}`, 10, bottomY);
      ctx.fillText(`C: ${viewportSettings.windowCenter}`, 10, bottomY + (isPrint ? 20 : 15));
      ctx.fillText(`Zoom: ${(viewportSettings.zoom * 100).toFixed(0)}%`, 10, bottomY + (isPrint ? 40 : 30));
    }

    if (isPrint && canvas) {
      ctx.fillText(`Printed: ${new Date().toLocaleDateString()}`, 10, canvas.height - 5);
      ctx.fillText(`PreClinic DICOM Viewer`, canvas.width - 200, canvas.height - 5);
    }
  };

  const handleSaveClick = (event: React.MouseEvent<HTMLElement>) => {
    setSaveMenuAnchor(event.currentTarget);
  };

  const handleSaveClose = () => {
    setSaveMenuAnchor(null);
  };

  const saveAsImage = (format: 'png' | 'jpeg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const saveCanvas = document.createElement('canvas');
    saveCanvas.width = canvas.width;
    saveCanvas.height = canvas.height;
    const saveCtx = saveCanvas.getContext('2d');
    
    if (saveCtx) {
      saveCtx.fillStyle = '#ffffff';
      saveCtx.fillRect(0, 0, saveCanvas.width, saveCanvas.height);
      
      renderMockDicomImage(saveCanvas);
      
      saveCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${fileManager.currentPreviewFile?.name || 'DICOM_Image'}_slice_${currentSlice}.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, `image/${format}`, format === 'jpeg' ? 0.95 : 1.0);
    }
    
    handleSaveClose();
  };

  const saveAsPDF = async () => {
    try {
      const jsPDF = (await import('jspdf')).default;
      const canvas = canvasRef.current;
      
      if (!canvas) return;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfCanvas = document.createElement('canvas');
      pdfCanvas.width = 800;
      pdfCanvas.height = 800;
      renderMockDicomImage(pdfCanvas);

      pdf.setFontSize(16);
      pdf.text('DICOM Medical Image Report', 20, 20);
      
      pdf.setFontSize(12);
      pdf.text(`Patient: ${mockDicomMetadata.patientName}`, 20, 35);
      pdf.text(`Patient ID: ${mockDicomMetadata.patientID}`, 20, 45);
      pdf.text(`Study: ${mockDicomMetadata.studyDescription}`, 20, 55);
      pdf.text(`Modality: ${mockDicomMetadata.modality}`, 20, 65);
      pdf.text(`Body Part: ${mockDicomMetadata.bodyPartExamined}`, 20, 75);
      pdf.text(`Study Date: ${mockDicomMetadata.studyDate}`, 120, 35);
      pdf.text(`Slice: ${currentSlice}/${totalSlices}`, 120, 45);
      pdf.text(`Slice Thickness: ${mockDicomMetadata.sliceThickness}`, 120, 55);
      pdf.text(`Window: ${viewportSettings.windowWidth}`, 120, 65);
      pdf.text(`Level: ${viewportSettings.windowCenter}`, 120, 75);

      const imgData = pdfCanvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 20, 85, 170, 170);

      if (measurements.length > 0) {
        pdf.text('Measurements:', 20, 270);
        measurements.forEach((measurement, index) => {
          pdf.text(`${index + 1}. ${measurement.label}: ${measurement.value.toFixed(1)} ${measurement.unit}`, 25, 280 + (index * 10));
        });
      }

      if (annotations.length > 0) {
        const startY = measurements.length > 0 ? 280 + (measurements.length * 10) + 10 : 270;
        pdf.text('Annotations:', 20, startY);
        annotations.forEach((annotation, index) => {
          pdf.text(`${index + 1}. ${annotation.text}`, 25, startY + 10 + (index * 10));
        });
      }

      pdf.setFontSize(10);
      pdf.text(`Generated by PreClinic DICOM Viewer on ${new Date().toLocaleDateString()}`, 20, 280);

      pdf.save(`${fileManager.currentPreviewFile?.name || 'DICOM_Report'}_slice_${currentSlice}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
    
    handleSaveClose();
  };

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert('Please allow popups to enable printing');
      return;
    }

    const printCanvas = document.createElement('canvas');
    printCanvas.width = 600;
    printCanvas.height = 600;
    renderMockDicomImage(printCanvas);

    const imageDataUrl = printCanvas.toDataURL('image/png');

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>DICOM Medical Image - Print</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px;
            background: white;
          }
          .header { 
            text-align: center; 
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          .patient-info { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 20px;
            background: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
          }
          .image-container { 
            text-align: center; 
            margin: 20px 0;
            page-break-inside: avoid;
          }
          .image-container img { 
            max-width: 100%; 
            border: 1px solid #333;
          }
          .technical-info {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            font-size: 12px;
            background: #f9f9f9;
            padding: 10px;
          }
          .measurements, .annotations {
            margin-top: 15px;
          }
          .measurements h4, .annotations h4 {
            margin-bottom: 5px;
            color: #333;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 10px;
          }
          @media print {
            body { margin: 0; }
            .header { page-break-after: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>DICOM Medical Image Report</h1>
          <h3>PreClinic DICOM Viewer</h3>
        </div>
        
        <div class="patient-info">
          <div>
            <strong>Patient:</strong> ${mockDicomMetadata.patientName}<br>
            <strong>Patient ID:</strong> ${mockDicomMetadata.patientID}<br>
            <strong>Study Date:</strong> ${mockDicomMetadata.studyDate}<br>
            <strong>Study:</strong> ${mockDicomMetadata.studyDescription}
          </div>
          <div>
            <strong>Modality:</strong> ${mockDicomMetadata.modality}<br>
            <strong>Body Part:</strong> ${mockDicomMetadata.bodyPartExamined}<br>
            <strong>Series:</strong> ${mockDicomMetadata.seriesDescription}<br>
            <strong>Slice:</strong> ${currentSlice} of ${totalSlices}
          </div>
        </div>

        <div class="image-container">
          <img src="${imageDataUrl}" alt="DICOM Image" />
        </div>

        <div class="technical-info">
          <div>
            <strong>Viewing Parameters:</strong><br>
            Window Width: ${viewportSettings.windowWidth}<br>
            Window Center: ${viewportSettings.windowCenter}<br>
            Zoom: ${(viewportSettings.zoom * 100).toFixed(0)}%<br>
            Rotation: ${viewportSettings.rotation}°
          </div>
          <div>
            <strong>Image Properties:</strong><br>
            Pixel Spacing: ${mockDicomMetadata.pixelSpacing}<br>
            Slice Thickness: ${mockDicomMetadata.sliceThickness}<br>
            Image Size: ${mockDicomMetadata.rows}×${mockDicomMetadata.columns}<br>
            Bits Allocated: ${mockDicomMetadata.bitsAllocated}
          </div>
        </div>

        ${measurements.length > 0 ? `
          <div class="measurements">
            <h4>Measurements:</h4>
            <ul>
              ${measurements.map((m, i) => `<li>${m.label}: ${m.value.toFixed(1)} ${m.unit}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${annotations.length > 0 ? `
          <div class="annotations">
            <h4>Annotations:</h4>
            <ul>
              ${annotations.map((a, i) => `<li>${a.text} (${a.type})</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="footer">
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>PreClinic Medical File Manager - DICOM Viewer</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  const handleWindowingPreset = (preset: typeof windowingPresets[0]) => {
    setViewportSettings(prev => ({
      ...prev,
      windowCenter: preset.center,
      windowWidth: preset.width
    }));
  };

  const resetViewport = () => {
    setViewportSettings({
      windowWidth: 400,
      windowCenter: 40,
      zoom: 1.0,
      pan: { x: 0, y: 0 },
      rotation: 0,
      brightness: 50,
      contrast: 50
    });
  };

  const addMockMeasurement = () => {
    const newMeasurement: Measurement = {
      id: Date.now().toString(),
      type: 'length',
      points: [
        { x: 200 + Math.random() * 100, y: 200 + Math.random() * 100 },
        { x: 250 + Math.random() * 100, y: 250 + Math.random() * 100 }
      ],
      value: 25.4 + Math.random() * 50,
      unit: 'mm',
      label: 'Distance'
    };
    
    setMeasurements(prev => [...prev, newMeasurement]);
  };

  const addMockAnnotation = () => {
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      x: 300 + Math.random() * 100,
      y: 300 + Math.random() * 100,
      text: 'Annotation',
      type: 'arrow',
      color: '#ffff00'
    };
    
    setAnnotations(prev => [...prev, newAnnotation]);
  };

  const handleSliceChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentSlice < totalSlices) {
      setCurrentSlice(prev => prev + 1);
    } else if (direction === 'prev' && currentSlice > 1) {
      setCurrentSlice(prev => prev - 1);
    }
  };

  const toggleCineMode = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      const interval = setInterval(() => {
        setCurrentSlice(prev => {
          if (prev >= totalSlices) {
            setIsPlaying(false);
            clearInterval(interval);
            return 1;
          }
          return prev + 1;
        });
      }, 200);
    }
  };

  return (
    <Dialog
      open={fileManager.dicomViewerOpen}
      onClose={() => fileManager.setDicomViewerOpen(false)}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: { width: '95vw', height: '90vh', maxWidth: 'none' }
      }}
    >
      <canvas
        ref={printCanvasRef}
        width={600}
        height={600}
        style={{ display: 'none' }}
      />

      <DialogTitle sx={{ p: 1, bgcolor: 'primary.dark', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            DICOM Viewer - {fileManager.currentPreviewFile?.name || 'Mock DICOM File'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => setIsFullscreen(!isFullscreen)}
              sx={{ color: 'white' }}
            >
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
            <IconButton
              size="small"
              onClick={() => fileManager.setDicomViewerOpen(false)}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Paper sx={{ width: 280, display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 48 }}
          >
            <Tab icon={<Tune />} label="Tools" />
            <Tab icon={<Timeline />} label="Info" />
            <Tab icon={<Psychology />} label="Analysis" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="subtitle2" gutterBottom>Window Presets</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {windowingPresets.map((preset) => (
                <Button
                  key={preset.name}
                  size="small"
                  variant="outlined"
                  onClick={() => handleWindowingPreset(preset)}
                  sx={{ fontSize: '0.7rem', minWidth: 0, px: 1 }}
                >
                  {preset.name}
                </Button>
              ))}
            </Box>

            <Typography variant="subtitle2" gutterBottom>Window Width</Typography>
            <Slider
              value={viewportSettings.windowWidth}
              onChange={(_, value) => setViewportSettings(prev => ({ ...prev, windowWidth: value as number }))}
              min={1}
              max={2000}
              step={1}
              size="small"
            />
            <TextField
              size="small"
              value={viewportSettings.windowWidth}
              onChange={(e) => setViewportSettings(prev => ({ ...prev, windowWidth: parseInt(e.target.value) || 0 }))}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" gutterBottom>Window Center</Typography>
            <Slider
              value={viewportSettings.windowCenter}
              onChange={(_, value) => setViewportSettings(prev => ({ ...prev, windowCenter: value as number }))}
              min={-1000}
              max={1000}
              step={1}
              size="small"
            />
            <TextField
              size="small"
              value={viewportSettings.windowCenter}
              onChange={(e) => setViewportSettings(prev => ({ ...prev, windowCenter: parseInt(e.target.value) || 0 }))}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" gutterBottom>Zoom</Typography>
            <Slider
              value={viewportSettings.zoom}
              onChange={(_, value) => setViewportSettings(prev => ({ ...prev, zoom: value as number }))}
              min={0.1}
              max={5}
              step={0.1}
              size="small"
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" gutterBottom>Brightness</Typography>
            <Slider
              value={viewportSettings.brightness}
              onChange={(_, value) => setViewportSettings(prev => ({ ...prev, brightness: value as number }))}
              min={0}
              max={100}
              size="small"
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" gutterBottom>Contrast</Typography>
            <Slider
              value={viewportSettings.contrast}
              onChange={(_, value) => setViewportSettings(prev => ({ ...prev, contrast: value as number }))}
              min={0}
              max={100}
              size="small"
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" gutterBottom>Active Tool</Typography>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <Select
                value={activeTool}
                onChange={(e) => setActiveTool(e.target.value)}
              >
                <MenuItem value="windowing">Windowing</MenuItem>
                <MenuItem value="zoom">Zoom</MenuItem>
                <MenuItem value="pan">Pan</MenuItem>
                <MenuItem value="length">Length Measurement</MenuItem>
                <MenuItem value="angle">Angle Measurement</MenuItem>
                <MenuItem value="annotation">Annotation</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Button size="small" onClick={resetViewport} startIcon={<RestartAlt />}>
                Reset
              </Button>
              <Button size="small" onClick={addMockMeasurement} startIcon={<Straighten />}>
                Measure
              </Button>
              <Button size="small" onClick={addMockAnnotation} startIcon={<Edit />}>
                Annotate
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="subtitle2" gutterBottom>Patient Information</Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Name"
                  secondary={mockDicomMetadata.patientName}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Patient ID"
                  secondary={mockDicomMetadata.patientID}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Study Date"
                  secondary={mockDicomMetadata.studyDate}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Modality"
                  secondary={mockDicomMetadata.modality}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Body Part"
                  secondary={mockDicomMetadata.bodyPartExamined}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Study Description"
                  secondary={mockDicomMetadata.studyDescription}
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>Technical Parameters</Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Image Size"
                  secondary={`${mockDicomMetadata.rows}×${mockDicomMetadata.columns}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Pixel Spacing"
                  secondary={mockDicomMetadata.pixelSpacing}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Slice Thickness"
                  secondary={mockDicomMetadata.sliceThickness}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Bits Allocated"
                  secondary={mockDicomMetadata.bitsAllocated}
                />
              </ListItem>
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Alert severity="info" sx={{ mb: 2 }}>
              AI Analysis features would be implemented here
            </Alert>
            
            <Typography variant="subtitle2" gutterBottom>Measurements</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <IconButton
                size="small"
                onClick={() => setShowMeasurements(!showMeasurements)}
              >
                {showMeasurements ? <Visibility /> : <VisibilityOff />}
              </IconButton>
              <Typography variant="body2">
                Show Measurements ({measurements.length})
              </Typography>
            </Box>

            <List dense>
              {measurements.map((measurement) => (
                <ListItem key={measurement.id}>
                  <ListItemIcon>
                    <Straighten fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${measurement.value.toFixed(1)} ${measurement.unit}`}
                    secondary={measurement.label}
                  />
                </ListItem>
              ))}
            </List>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Annotations</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <IconButton
                size="small"
                onClick={() => setShowAnnotations(!showAnnotations)}
              >
                {showAnnotations ? <Visibility /> : <VisibilityOff />}
              </IconButton>
              <Typography variant="body2">
                Show Annotations ({annotations.length})
              </Typography>
            </Box>

            <List dense>
              {annotations.map((annotation) => (
                <ListItem key={annotation.id}>
                  <ListItemIcon>
                    <Edit fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={annotation.text}
                    secondary={annotation.type}
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>
        </Paper>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#000' }}>
          <Toolbar variant="dense" sx={{ bgcolor: 'grey.100', minHeight: 48 }}>
            <ButtonGroup size="small" sx={{ mr: 2 }}>
              <IconButton onClick={() => setViewportSettings(prev => ({ ...prev, zoom: prev.zoom * 1.2 }))}>
                <ZoomIn />
              </IconButton>
              <IconButton onClick={() => setViewportSettings(prev => ({ ...prev, zoom: prev.zoom * 0.8 }))}>
                <ZoomOut />
              </IconButton>
              <IconButton onClick={() => setViewportSettings(prev => ({ ...prev, rotation: prev.rotation - 90 }))}>
                <RotateLeft />
              </IconButton>
              <IconButton onClick={() => setViewportSettings(prev => ({ ...prev, rotation: prev.rotation + 90 }))}>
                <RotateRight />
              </IconButton>
            </ButtonGroup>

            <Divider orientation="vertical" flexItem sx={{ mr: 2 }} />

            <ButtonGroup size="small" sx={{ mr: 2 }}>
              <IconButton onClick={() => handleSliceChange('prev')} disabled={currentSlice <= 1}>
                <SkipPrevious />
              </IconButton>
              <IconButton onClick={toggleCineMode}>
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
              <IconButton onClick={() => handleSliceChange('next')} disabled={currentSlice >= totalSlices}>
                <SkipNext />
              </IconButton>
            </ButtonGroup>

            <Typography variant="body2" sx={{ mr: 2 }}>
              Slice: {currentSlice} / {totalSlices}
            </Typography>

            <Slider
              value={currentSlice}
              onChange={(_, value) => setCurrentSlice(value as number)}
              min={1}
              max={totalSlices}
              size="small"
              sx={{ width: 200, mr: 2 }}
            />

            <Box sx={{ flexGrow: 1 }} />

            <ButtonGroup size="small">
              <IconButton onClick={handleSaveClick}>
                <Save />
              </IconButton>
              <IconButton onClick={handlePrint}>
                <Print />
              </IconButton>
              <IconButton>
                <Share />
              </IconButton>
            </ButtonGroup>
          </Toolbar>

          <Menu
            anchorEl={saveMenuAnchor}
            open={Boolean(saveMenuAnchor)}
            onClose={handleSaveClose}
          >
            <MenuItem onClick={() => saveAsImage('png')}>
              <ListItemIcon><FileDownload /></ListItemIcon>
              Save as PNG
            </MenuItem>
            <MenuItem onClick={() => saveAsImage('jpeg')}>
              <ListItemIcon><FileDownload /></ListItemIcon>
              Save as JPEG
            </MenuItem>
            <MenuItem onClick={saveAsPDF}>
              <ListItemIcon><GetApp /></ListItemIcon>
              Save as PDF Report
            </MenuItem>
          </Menu>

          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
            <canvas
              ref={canvasRef}
              width={512}
              height={512}
              style={{
                border: '1px solid #333',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>

          <Box sx={{ p: 1, bgcolor: 'grey.900', color: 'white', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <Box>
              W: {viewportSettings.windowWidth} | C: {viewportSettings.windowCenter} | 
              Zoom: {(viewportSettings.zoom * 100).toFixed(0)}%
            </Box>
            <Box>
              {mockDicomMetadata.modality} | {mockDicomMetadata.bodyPartExamined} | 
              {mockDicomMetadata.sliceThickness}
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}