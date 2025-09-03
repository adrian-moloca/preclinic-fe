import React, { useState, useEffect } from "react";
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
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Psychology,
  Science,
  Medication,
  Description,
  Person,
  LocalHospital,
  ExpandMore,
  Warning,
  Info,
  Save,
} from "@mui/icons-material";
import { ExtractedMedicalData, FileItem, MedicalInsight } from "../types";

interface MedicalClassificationDialogProps {
  fileManager: any;
}

export function MedicalClassificationDialog({ fileManager }: MedicalClassificationDialogProps) {
  const [classificationResults, setClassificationResults] = useState<ExtractedMedicalData | null>(null);
  const [medicalInsights, setMedicalInsights] = useState<MedicalInsight[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  useEffect(() => {
    if (fileManager.medicalClassificationOpen && fileManager.currentOCRFile) {
      setSelectedFile(fileManager.currentOCRFile);
      processFile(fileManager.currentOCRFile);
    }
  }, [fileManager.medicalClassificationOpen, fileManager.currentOCRFile]);

  const processFile = async (file: FileItem) => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setProgress(100);

      const mockResults: ExtractedMedicalData = {
        patientName: "John Doe",
        dateOfBirth: "1985-03-15",
        medicalRecordNumber: "MRN-12345",
        doctorName: "Dr. Sarah Johnson",
        facilityName: "Central Medical Center",
        documentType: "Lab Results",
        dateOfService: "2024-01-15",
        medications: ["Lisinopril 10mg", "Metformin 500mg"],
        testResults: [
          "Glucose: 95 mg/dL (Normal)",
          "Cholesterol: 180 mg/dL (Normal)",
          "Blood Pressure: 120/80 mmHg (Normal)"
        ],
        diagnoses: ["Type 2 Diabetes", "Hypertension"],
        vitalSigns: {
          temperature: "98.6°F",
          heartRate: "72 bpm",
          bloodPressure: "120/80"
        }
      };

      const mockInsights: MedicalInsight[] = [
        {
          type: 'medication',
          text: 'Patient is taking Lisinopril for hypertension management',
          confidence: 0.95,
          source: 'medication_list'
        },
        {
          type: 'vital',
          text: 'Blood glucose levels are within normal range',
          confidence: 0.92,
          source: 'lab_results'
        },
        {
          type: 'warning',
          text: 'Patient has diabetes - monitor glucose levels regularly',
          confidence: 0.88,
          source: 'diagnosis_analysis'
        }
      ];

      setClassificationResults(mockResults);
      setMedicalInsights(mockInsights);
    } catch (error) {
      console.error('Medical classification failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveClassification = () => {
    if (selectedFile && classificationResults) {
      fileManager.updateFileWithMedicalData(selectedFile.id, classificationResults, medicalInsights);
      fileManager.setMedicalClassificationOpen(false);
    }
  };

  const getInsightIcon = (type: MedicalInsight['type']) => {
    switch (type) {
      case 'medication': return <Medication color="primary" />;
      case 'vital': return <Science color="success" />;
      case 'diagnosis': return <LocalHospital color="warning" />;
      case 'warning': return <Warning color="error" />;
      default: return <Info color="info" />;
    }
  };

  return (
    <Dialog 
      open={fileManager.medicalClassificationOpen} 
      onClose={() => fileManager.setMedicalClassificationOpen(false)}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Psychology color="primary" />
          Medical Document Classification
          {selectedFile && (
            <Chip 
              label={selectedFile.name} 
              size="small" 
              variant="outlined" 
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        {isProcessing ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Analyzing Medical Document...
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ mt: 2, mb: 2 }} 
            />
            <Typography variant="body2" color="text.secondary">
              {progress < 30 ? 'Reading document content...' :
               progress < 60 ? 'Extracting medical information...' :
               progress < 90 ? 'Analyzing clinical data...' :
               'Finalizing results...'}
            </Typography>
          </Box>
        ) : classificationResults ? (
          <Grid container spacing={3}>
            <Grid>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Patient Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Name" secondary={classificationResults.patientName} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Date of Birth" secondary={classificationResults.dateOfBirth} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="MRN" secondary={classificationResults.medicalRecordNumber} />
                  </ListItem>
                </List>
              </Card>
            </Grid>

            <Grid>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Document Details
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Document Type" secondary={classificationResults.documentType} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Doctor" secondary={classificationResults.doctorName} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Facility" secondary={classificationResults.facilityName} />
                  </ListItem>
                </List>
              </Card>
            </Grid>

            <Grid>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Clinical Insights
                </Typography>
                {medicalInsights.map((insight, index) => (
                  <Alert 
                    key={index}
                    severity={insight.type === 'warning' ? 'warning' : 'info'}
                    icon={getInsightIcon(insight.type)}
                    sx={{ mb: 1 }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">{insight.text}</Typography>
                      <Chip 
                        label={`${Math.round(insight.confidence * 100)}% confidence`}
                        size="small"
                        color={insight.confidence > 0.9 ? 'success' : 'default'}
                      />
                    </Box>
                  </Alert>
                ))}
              </Card>
            </Grid>

            <Grid>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1">Medications</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={1}>
                    {classificationResults.medications?.map((med, index) => (
                      <Grid key={index}>
                        <Chip label={med} color="primary" variant="outlined" />
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1">Test Results</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {classificationResults.testResults?.map((result, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Science color="success" />
                        </ListItemIcon>
                        <ListItemText primary={result} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        ) : (
          <Alert severity="info">
            No medical data to display. Select a file to analyze.
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => fileManager.setMedicalClassificationOpen(false)}>
          Cancel
        </Button>
        {classificationResults && (
          <Button 
            onClick={saveClassification}
            variant="contained"
            startIcon={<Save />}
          >
            Save Classification
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}