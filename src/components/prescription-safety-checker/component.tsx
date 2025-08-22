import React, { useEffect, useState } from 'react';
import { Box, Alert, Typography, Collapse, IconButton } from '@mui/material';
import { ExpandMore, ExpandLess, Warning, Error } from '@mui/icons-material';
import { MedicalAlert } from '../../providers/medical-decision-support/types';
import { useMedicalAlerts } from '../../hooks/medical-alerts';

interface PrescriptionSafetyCheckerProps {
  patientId: string;
  medications: string[];
  onAlertsChange?: (alerts: MedicalAlert[]) => void;
}

export const PrescriptionSafetyChecker: React.FC<PrescriptionSafetyCheckerProps> = ({
  patientId,
  medications,
  onAlertsChange
}) => {
  const { checkPrescriptionSafety } = useMedicalAlerts();
  const [alerts, setAlerts] = useState<MedicalAlert[]>([]);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (patientId && medications.length > 0) {
      const safetyAlerts = checkPrescriptionSafety(patientId, medications);
      setAlerts(safetyAlerts);
      onAlertsChange?.(safetyAlerts);
    } else {
      setAlerts([]);
      onAlertsChange?.([]);
    }
  }, [patientId, medications, checkPrescriptionSafety, onAlertsChange]);

  if (alerts.length === 0) {
    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        <Typography variant="body2">
          ✓ No safety concerns detected with current medications
        </Typography>
      </Alert>
    );
  }

  const criticalAlerts = alerts.filter(a => a.severity === 'critical');

  return (
    <Box sx={{ mb: 2 }}>
      <Alert 
        severity={criticalAlerts.length > 0 ? 'error' : 'warning'}
        action={
          <IconButton
            color="inherit"
            size="small"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        }
      >
        <Box display="flex" alignItems="center" gap={1}>
          {criticalAlerts.length > 0 ? <Error /> : <Warning />}
          <Typography variant="body1" fontWeight={600}>
            {criticalAlerts.length > 0 ? 'Critical Safety Alert' : 'Safety Warning'}
          </Typography>
        </Box>
        <Typography variant="body2">
          {alerts.length} safety concern{alerts.length > 1 ? 's' : ''} detected
          {criticalAlerts.length > 0 && ` (${criticalAlerts.length} critical)`}
        </Typography>
      </Alert>

      <Collapse in={expanded}>
        <Box sx={{ mt: 1 }}>
          {alerts.map((alert, index) => (
            <Alert 
              key={alert.id}
              severity={alert.severity === 'critical' ? 'error' : 'warning'}
              sx={{ mb: 1 }}
            >
              <Typography variant="subtitle2" gutterBottom>
                {alert.message}
              </Typography>
              {alert.recommendedAction && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Recommendation:</strong> {alert.recommendedAction}
                </Typography>
              )}
            </Alert>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};