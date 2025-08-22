import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs,
  Badge
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  MedicalServices,
  TrendingUp,
  People,
  LocalPharmacy
} from '@mui/icons-material';
import { useMedicalDecisionSupport } from '../../providers/medical-decision-support/context';
import AlertPanel from '../medical-alert-system/alert-panel';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`alerts-tabpanel-${index}`}
      aria-labelledby={`alerts-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const MedicalAlertsDashboard: React.FC = () => {
  const { alerts, getCriticalAlerts } = useMedicalDecisionSupport();
  const [tabValue, setTabValue] = useState(0);

  const activeAlerts = alerts.filter(alert => !alert.dismissed);
  const criticalAlerts = getCriticalAlerts();
  const drugInteractionAlerts = activeAlerts.filter(alert => alert.type === 'drug_interaction');
  const allergyAlerts = activeAlerts.filter(alert => alert.type === 'allergy_warning');
  const vitalSignsAlerts = activeAlerts.filter(alert => alert.type === 'vital_signs_alert');
  const followUpAlerts = activeAlerts.filter(alert => alert.type === 'follow_up_due');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const alertsByType = {
    'Drug Interactions': drugInteractionAlerts,
    'Allergy Warnings': allergyAlerts,
    'Vital Signs': vitalSignsAlerts,
    'Follow-up Due': followUpAlerts
  };

  // Icon mapping for different alert types
  const getAlertTypeIcon = (alertType: string) => {
    switch (alertType) {
      case 'Drug Interactions':
        return <LocalPharmacy color="warning" />;
      case 'Allergy Warnings':
        return <Error color="error" />;
      case 'Vital Signs':
        return <TrendingUp color="info" />;
      case 'Follow-up Due':
        return <Info color="info" />;
      default:
        return <Warning color="warning" />;
    }
  };

  // Color mapping for different alert types
  const getAlertTypeColor = (alertType: string): 'error' | 'warning' | 'info' => {
    switch (alertType) {
      case 'Drug Interactions':
        return 'warning';
      case 'Allergy Warnings':
        return 'error';
      case 'Vital Signs':
        return 'info';
      case 'Follow-up Due':
        return 'info';
      default:
        return 'warning';
    }
  };

  // Generate tab labels with badges
  const getTabLabels = () => {
    const baseTabs = [
      {
        label: 'All Alerts',
        count: activeAlerts.length,
        color: 'error' as const
      },
      {
        label: 'Critical',
        count: criticalAlerts.length,
        color: 'error' as const
      }
    ];

    const typeTabs = Object.entries(alertsByType).map(([type, alerts]) => ({
      label: type,
      count: alerts.length,
      color: getAlertTypeColor(type)
    }));

    return [...baseTabs, ...typeTabs];
  };

  const tabLabels = getTabLabels();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Medical Decision Support Dashboard
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                    {criticalAlerts.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Critical Alerts
                  </Typography>
                </Box>
                <Error color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="primary.main" fontWeight="bold">
                    {activeAlerts.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Active Alerts
                  </Typography>
                </Box>
                <MedicalServices color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {drugInteractionAlerts.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Drug Interactions
                  </Typography>
                </Box>
                <LocalPharmacy color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="info.main" fontWeight="bold">
                    {new Set(activeAlerts.map(a => a.patientId)).size}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Patients with Alerts
                  </Typography>
                </Box>
                <People color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different alert types */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          {tabLabels.map((tab, index) => (
            <Tab 
              key={index}
              label={
                <Badge badgeContent={tab.count} color={tab.color} max={99}>
                  {tab.label}
                </Badge>
              } 
            />
          ))}
        </Tabs>

        {/* All Alerts Tab */}
        <TabPanel value={tabValue} index={0}>
          <AlertPanel maxHeight={600} />
        </TabPanel>

        {/* Critical Alerts Tab */}
        <TabPanel value={tabValue} index={1}>
          <AlertPanel maxHeight={600} />
          {criticalAlerts.length === 0 && (
            <Typography variant="body1" color="text.secondary" textAlign="center">
              No critical alerts at this time
            </Typography>
          )}
        </TabPanel>

        {/* Dynamic Alert Type Tabs using alertsByType */}
        {Object.entries(alertsByType).map(([alertType, alerts], index) => {
          const tabIndex = index + 2; // +2 because we have "All Alerts" and "Critical" tabs first
          
          return (
            <TabPanel key={alertType} value={tabValue} index={tabIndex}>
              {alerts.length > 0 ? (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getAlertTypeIcon(alertType)}
                    {alertType} ({alerts.length})
                  </Typography>
                  
                  <List>
                    {alerts.map(alert => (
                      <ListItem key={alert.id} divider>
                        <ListItemIcon>
                          {getAlertTypeIcon(alertType)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                              <Typography variant="subtitle1">
                                {alert.message}
                              </Typography>
                              <Chip 
                                label={alert.severity.toUpperCase()} 
                                color={getAlertTypeColor(alertType)} 
                                size="small" 
                              />
                              <Chip 
                                label={new Date(alert.timestamp).toLocaleDateString()} 
                                variant="outlined" 
                                size="small" 
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              {alert.recommendedAction && (
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Recommendation:</strong> {alert.recommendedAction}
                                </Typography>
                              )}
                              {alert.relatedData?.medications && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Medications: 
                                  </Typography>
                                  {alert.relatedData.medications.map((med, idx) => (
                                    <Chip 
                                      key={idx} 
                                      label={med} 
                                      size="small" 
                                      variant="outlined" 
                                      sx={{ mr: 0.5, mt: 0.5 }} 
                                    />
                                  ))}
                                </Box>
                              )}
                              {alert.relatedData?.allergies && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Allergies: 
                                  </Typography>
                                  {alert.relatedData.allergies.map((allergy, idx) => (
                                    <Chip 
                                      key={idx} 
                                      label={allergy} 
                                      size="small" 
                                      color="error" 
                                      variant="outlined" 
                                      sx={{ mr: 0.5, mt: 0.5 }} 
                                    />
                                  ))}
                                </Box>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{ mb: 2, opacity: 0.5 }}>
                    {getAlertTypeIcon(alertType)}
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    No {alertType.toLowerCase()} alerts
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    All {alertType.toLowerCase()} are currently clear
                  </Typography>
                </Box>
              )}
            </TabPanel>
          );
        })}
      </Paper>

      {/* Alert Summary by Type */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Alert Summary by Type
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(alertsByType).map(([type, alerts]) => {
            const severityCounts = alerts.reduce((acc, alert) => {
              acc[alert.severity] = (acc[alert.severity] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);

            return (
              <Grid key={type}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      {getAlertTypeIcon(type)}
                      <Typography variant="subtitle1" fontWeight={600}>
                        {type}
                      </Typography>
                    </Box>
                    
                    <Typography variant="h5" color="primary.main" fontWeight="bold">
                      {alerts.length}
                    </Typography>
                    
                    {alerts.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        {Object.entries(severityCounts).map(([severity, count]) => (
                          <Chip 
                            key={severity}
                            label={`${severity}: ${count}`}
                            size="small"
                            color={severity === 'critical' ? 'error' : severity === 'high' ? 'warning' : 'info'}
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  );
};