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
  CardContent,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge
} from "@mui/material";
import {
  LocalHospital,
  Info,
  Medication,
  Science,
  ExpandMore,
  Person,
  Schedule,
  TrendingUp,
} from "@mui/icons-material";
import { FileItem, ClinicalRecommendation, PatientSummary } from "../types";

interface ClinicalDecisionSupportProps {
  fileManager: any;
}

export function ClinicalDecisionSupport({ fileManager }: ClinicalDecisionSupportProps) {
  const [recommendations, setRecommendations] = useState<ClinicalRecommendation[]>([]);
  const [patientSummary, setPatientSummary] = useState<PatientSummary | null>(null);
  const [selectedPatient] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (fileManager.clinicalDecisionOpen) {
      loadClinicalData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileManager.clinicalDecisionOpen]);

  const loadClinicalData = async () => {
    setIsLoading(true);

    const mockRecommendations: ClinicalRecommendation[] = [
      {
        id: '1',
        type: 'medication_interaction',
        priority: 'high',
        title: 'Potential Drug Interaction Detected',
        description: 'Patient is taking both Lisinopril and Potassium supplements. Monitor serum potassium levels.',
        evidence: 'Based on recent prescription analysis',
        actionRequired: true,
        relatedFiles: ['file-123', 'file-456']
      },
      {
        id: '2',
        type: 'screening',
        priority: 'medium',
        title: 'Annual Screening Due',
        description: 'Patient is due for annual mammography screening based on age and risk factors.',
        evidence: 'Guidelines recommend annual screening for women over 40',
        actionRequired: true,
        relatedFiles: ['file-789']
      },
      {
        id: '3',
        type: 'follow_up',
        priority: 'low',
        title: 'Lab Result Follow-up',
        description: 'Cholesterol levels have improved. Continue current statin therapy.',
        evidence: 'Latest lab results show 15% improvement',
        actionRequired: false,
        relatedFiles: ['file-101']
      }
    ];

    const mockPatientSummary: PatientSummary = {
      patientId: selectedPatient || 'patient-123',
      patientName: 'John Doe',
      totalDocuments: 24,
      recentVisits: 3,
      activeConditions: ['Type 2 Diabetes', 'Hypertension', 'Hyperlipidemia'],
      currentMedications: ['Lisinopril 10mg', 'Metformin 500mg', 'Atorvastatin 20mg'],
      riskFactors: ['Family history of CAD', 'Former smoker', 'Sedentary lifestyle']
    };

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setRecommendations(mockRecommendations);
    setPatientSummary(mockPatientSummary);
    setIsLoading(false);
  };

  const getPriorityColor = (priority: ClinicalRecommendation['priority']) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: ClinicalRecommendation['type']) => {
    switch (type) {
      case 'medication_interaction': return <Medication color="error" />;
      case 'follow_up': return <Schedule color="primary" />;
      case 'screening': return <Science color="info" />;
      case 'lifestyle': return <TrendingUp color="success" />;
      case 'referral': return <Person color="warning" />;
      default: return <Info />;
    }
  };

  const handleRecommendationAction = (recommendationId: string) => {
    console.log('Acting on recommendation:', recommendationId);
  };

  return (
    <Dialog 
      open={fileManager.clinicalDecisionOpen} 
      onClose={() => fileManager.setClinicalDecisionOpen(false)}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalHospital color="primary" />
          Clinical Decision Support
          {patientSummary && (
            <Chip 
              label={patientSummary.patientName} 
              color="primary" 
              variant="outlined" 
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Analyzing patient data...
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {patientSummary && (
              <Grid>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Patient Overview
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Documents
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {patientSummary.totalDocuments}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="subtitle2" color="text.secondary">
                          Recent Visits
                        </Typography>
                        <Typography variant="h4" color="success.main">
                          {patientSummary.recentVisits}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="subtitle2" color="text.secondary">
                          Active Conditions
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {patientSummary.activeConditions.map((condition, index) => (
                            <Chip 
                              key={index}
                              label={condition} 
                              size="small" 
                              sx={{ mr: 0.5, mb: 0.5 }}
                              color="warning"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Grid>
                      <Grid>
                        <Typography variant="subtitle2" color="text.secondary">
                          Current Medications
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {patientSummary.currentMedications.slice(0, 2).map((med, index) => (
                            <Chip 
                              key={index}
                              label={med} 
                              size="small" 
                              sx={{ mr: 0.5, mb: 0.5 }}
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                          {patientSummary.currentMedications.length > 2 && (
                            <Chip 
                              label={`+${patientSummary.currentMedications.length - 2} more`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Badge 
                      badgeContent={recommendations.filter(r => r.actionRequired).length} 
                      color="error"
                    >
                      <Info color="primary" />
                    </Badge>
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      Clinical Recommendations
                    </Typography>
                  </Box>

                  {recommendations.map((recommendation) => (
                    <Accordion key={recommendation.id} sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          {getTypeIcon(recommendation.type)}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1">
                              {recommendation.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                              <Chip 
                                size="small" 
                                label={recommendation.priority.toUpperCase()}
                                color={getPriorityColor(recommendation.priority) as any}
                              />
                              {recommendation.actionRequired && (
                                <Chip 
                                  size="small" 
                                  label="Action Required" 
                                  color="error" 
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body1" gutterBottom>
                          {recommendation.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Evidence:</strong> {recommendation.evidence}
                        </Typography>
                        
                        {recommendation.relatedFiles.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" gutterBottom>
                              <strong>Related Files:</strong>
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {recommendation.relatedFiles.map((fileId) => (
                                <Chip 
                                  key={fileId}
                                  label={`File ${fileId.slice(-3)}`}
                                  size="small"
                                  clickable
                                  onClick={() => {
                                    const file = fileManager.files.find((f: FileItem) => f.id === fileId);
                                    if (file) {
                                      fileManager.setCurrentPreviewFile(file);
                                      fileManager.setPreviewDialogOpen(true);
                                    }
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}

                        {recommendation.actionRequired && (
                          <Box sx={{ mt: 2 }}>
                            <Button 
                              variant="contained"
                              size="small"
                              onClick={() => handleRecommendationAction(recommendation.id)}
                            >
                              Take Action
                            </Button>
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => fileManager.setClinicalDecisionOpen(false)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}