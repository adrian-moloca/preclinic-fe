import React, { useState } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Collapse,
  Box,
  Button,
  Divider,
  Alert as MuiAlert
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  ExpandMore,
  ExpandLess,
  Close,
  CheckCircle,
  MedicalServices
} from '@mui/icons-material';
import { useMedicalDecisionSupport } from '../../../providers/medical-decision-support/context';
import { useAuthContext } from '../../../providers/auth';

interface AlertPanelProps {
  patientId?: string;
  showOnlyPatient?: boolean;
  maxHeight?: number;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ 
  patientId, 
  showOnlyPatient = false, 
  maxHeight = 400 
}) => {
  const { alerts, dismissAlert, acknowledgeAlert } = useMedicalDecisionSupport();
  const { user } = useAuthContext();
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());

  const filteredAlerts = showOnlyPatient && patientId
    ? alerts.filter(alert => alert.patientId === patientId && !alert.dismissed)
    : alerts.filter(alert => !alert.dismissed);

  const toggleExpanded = (alertId: string) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(alertId)) {
      newExpanded.delete(alertId);
    } else {
      newExpanded.add(alertId);
    }
    setExpandedAlerts(newExpanded);
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <Error color="error" />;
      case 'high': return <Warning color="error" />;
      case 'medium': return <Warning color="warning" />;
      case 'low': return <Info color="info" />;
      default: return <Info color="info" />;
    }
  };

  const getAlertColor = (severity: string): 'error' | 'warning' | 'info' | 'success' => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'info';
    }
  };

  const getSeverityChipColor = (severity: string): 'error' | 'warning' | 'info' | 'default' => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const handleDismiss = (alertId: string) => {
    dismissAlert(alertId);
  };

  const handleAcknowledge = (alertId: string) => {
    if (user?.id) {
      acknowledgeAlert(alertId, user.id);
    }
  };

  if (filteredAlerts.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CheckCircle color="success" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" color="success.main">
          No Active Medical Alerts
        </Typography>
        <Typography variant="body2" color="text.secondary">
          All systems are functioning normally
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ maxHeight, overflow: 'auto' }}>
      <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <MedicalServices />
          <Typography variant="h6">
            Medical Decision Support Alerts ({filteredAlerts.length})
          </Typography>
        </Box>
      </Box>

      <List sx={{ p: 0 }}>
        {filteredAlerts.map((alert, index) => (
          <React.Fragment key={alert.id}>
            <ListItem
              sx={{
                backgroundColor: alert.severity === 'critical' ? 'error.lighter' : 'transparent',
                borderLeft: `4px solid`,
                borderLeftColor: getAlertColor(alert.severity) + '.main'
              }}
            >
              <ListItemIcon>
                {getAlertIcon(alert.severity)}
              </ListItemIcon>
              
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                    <Typography variant="subtitle1" component="span">
                      {alert.message}
                    </Typography>
                    <Chip 
                      label={alert.severity.toUpperCase()} 
                      size="small" 
                      color={getSeverityChipColor(alert.severity)}
                      variant="outlined"
                    />
                    <Chip 
                      label={alert.type.replace('_', ' ').toUpperCase()} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {new Date(alert.timestamp).toLocaleString()}
                    {alert.acknowledgedBy && (
                      <Chip 
                        label={`Acknowledged by ${alert.acknowledgedBy}`} 
                        size="small" 
                        color="success"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Typography>
                }
              />
              
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => toggleExpanded(alert.id)}
                  size="small"
                >
                  {expandedAlerts.has(alert.id) ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDismiss(alert.id)}
                  size="small"
                  color="error"
                >
                  <Close />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>

            <Collapse in={expandedAlerts.has(alert.id)} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2, backgroundColor: 'grey.50' }}>
                {alert.recommendedAction && (
                  <MuiAlert severity={getAlertColor(alert.severity)} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Recommended Action:
                    </Typography>
                    <Typography variant="body2">
                      {alert.recommendedAction}
                    </Typography>
                  </MuiAlert>
                )}

                {alert.relatedData && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Related Information:
                    </Typography>
                    
                    {alert.relatedData.medications && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Medications:
                        </Typography>
                        {alert.relatedData.medications.map((med, idx) => (
                          <Chip key={idx} label={med} size="small" sx={{ mr: 1, mb: 1 }} />
                        ))}
                      </Box>
                    )}

                    {alert.relatedData.allergies && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Allergies:
                        </Typography>
                        {alert.relatedData.allergies.map((allergy, idx) => (
                          <Chip key={idx} label={allergy} size="small" color="error" sx={{ mr: 1, mb: 1 }} />
                        ))}
                      </Box>
                    )}

                    {alert.relatedData.vitalSigns && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Vital Signs:
                        </Typography>
                        <Typography variant="body2">
                          {alert.relatedData.vitalSigns.bloodPressure && 
                            `BP: ${alert.relatedData.vitalSigns.bloodPressure.systolic}/${alert.relatedData.vitalSigns.bloodPressure.diastolic} mmHg `}
                          {alert.relatedData.vitalSigns.heartRate && 
                            `HR: ${alert.relatedData.vitalSigns.heartRate} bpm `}
                          {alert.relatedData.vitalSigns.temperature && 
                            `Temp: ${alert.relatedData.vitalSigns.temperature}°C `}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}

                <Box display="flex" gap={1} justifyContent="flex-end">
                  {!alert.acknowledgedBy && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleAcknowledge(alert.id)}
                    >
                      Acknowledge
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDismiss(alert.id)}
                  >
                    Dismiss
                  </Button>
                </Box>
              </Box>
            </Collapse>

            {index < filteredAlerts.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};