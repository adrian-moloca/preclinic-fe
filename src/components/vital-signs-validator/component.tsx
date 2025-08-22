import React, { useEffect, useState } from 'react';
import { Box, Alert, Typography, Grid, Chip } from '@mui/material';
import { MedicalAlert } from '../../providers/medical-decision-support/types';
import { useMedicalAlerts } from '../../hooks/medical-alerts';

interface VitalSignsValidatorProps {
  patientId: string;
  vitalSigns: {
    bloodPressure?: { systolic: number; diastolic: number };
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
  };
  onAlertsChange?: (alerts: MedicalAlert[]) => void;
}

export const VitalSignsValidator: React.FC<VitalSignsValidatorProps> = ({
  patientId,
  vitalSigns,
  onAlertsChange
}) => {
  const { checkVitalSignsSafety } = useMedicalAlerts();
  const [alerts, setAlerts] = useState<MedicalAlert[]>([]);

  useEffect(() => {
    if (patientId && Object.keys(vitalSigns).length > 0) {
      const vitalSignsAlerts = checkVitalSignsSafety(patientId, vitalSigns);
      setAlerts(vitalSignsAlerts);
      onAlertsChange?.(vitalSignsAlerts);
    } else {
      setAlerts([]);
      onAlertsChange?.([]);
    }
  }, [patientId, vitalSigns, checkVitalSignsSafety, onAlertsChange]);

  if (alerts.length === 0) {
    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        <Typography variant="body2">
          ✓ All vital signs within normal ranges
        </Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      {alerts.map((alert, index) => (
        <Alert 
          key={alert.id}
          severity={alert.severity === 'critical' ? 'error' : 'warning'}
          sx={{ mb: 1 }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid>
              <Typography variant="subtitle2">
                {alert.message}
              </Typography>
              {alert.recommendedAction && (
                <Typography variant="body2" color="text.secondary">
                  {alert.recommendedAction}
                </Typography>
              )}
            </Grid>
            <Grid>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip 
                  label={alert.severity.toUpperCase()} 
                  color={alert.severity === 'critical' ? 'error' : 'warning'}
                  size="small"
                />
                <Chip 
                  label="VITAL SIGNS" 
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>
        </Alert>
      ))}
    </Box>
  );
};