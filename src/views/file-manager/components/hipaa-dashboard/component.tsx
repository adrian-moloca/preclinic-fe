import React, { useState } from "react";
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  IconButton,
  Tooltip,
  Badge
} from "@mui/material";
import {
  Security,
  Warning,
  CheckCircle,
  History,
  Person,
  Lock,
  Visibility,
  Download,
  Share,
  Delete,
  Edit,
  Assessment,
  Schedule,
  ReportProblem
} from "@mui/icons-material";
import { AccessLogEntry } from "../types";

interface HIPAADashboardProps {
  fileManager: any;
}

interface ComplianceMetrics {
  encryptionStatus: number;
  accessControlCompliance: number;
  auditTrailCoverage: number;
  retentionPolicyCompliance: number;
  overallScore: number;
}

interface SecurityAlert {
  id: string;
  type: 'unauthorized_access' | 'retention_violation' | 'encryption_issue' | 'access_pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  fileId?: string;
  userId?: string;
  resolved: boolean;
}

export function HIPAADashboard({ fileManager }: HIPAADashboardProps) {
  const [complianceMetrics, ] = useState<ComplianceMetrics>({
    encryptionStatus: 95,
    accessControlCompliance: 88,
    auditTrailCoverage: 92,
    retentionPolicyCompliance: 85,
    overallScore: 90
  });

  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      type: 'unauthorized_access',
      severity: 'high',
      message: 'Multiple failed access attempts to patient file',
      timestamp: '2024-01-15T10:30:00Z',
      fileId: 'file-123',
      resolved: false
    },
    {
      id: '2',
      type: 'retention_violation',
      severity: 'medium',
      message: 'Document exceeds retention policy (7 years)',
      timestamp: '2024-01-14T15:45:00Z',
      fileId: 'file-456',
      resolved: false
    }
  ]);

  const [recentAccess, ] = useState<AccessLogEntry[]>([
    {
      timestamp: '2024-01-15T14:30:00Z',
      action: 'view',
      userId: 'user-123',
      userAgent: 'Mozilla/5.0...',
      location: 'Cluj-Napoca, RO'
    },
    {
      timestamp: '2024-01-15T14:25:00Z',
      action: 'download',
      userId: 'user-456',
      userAgent: 'Mozilla/5.0...',
      location: 'Cluj-Napoca, RO'
    }
  ]);


  const getAlertIcon = (type: SecurityAlert['type']) => {
    switch (type) {
      case 'unauthorized_access': return <Security color="error" />;
      case 'retention_violation': return <Schedule color="warning" />;
      case 'encryption_issue': return <Lock color="error" />;
      case 'access_pattern': return <Visibility color="info" />;
      default: return <ReportProblem color="warning" />;
    }
  };

  const getAlertColor = (severity: SecurityAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getActionIcon = (action: AccessLogEntry['action']) => {
    switch (action) {
      case 'view': return <Visibility />;
      case 'download': return <Download />;
      case 'edit': return <Edit />;
      case 'share': return <Share />;
      case 'delete': return <Delete />;
      default: return <History />;
    }
  };

  const resolveAlert = (alertId: string) => {
    setSecurityAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  };

  const generateComplianceReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      metrics: complianceMetrics,
      alerts: securityAlerts,
      accessLog: recentAccess
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hipaa-compliance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog 
      open={fileManager.securityDashboardOpen} 
      onClose={() => fileManager.setSecurityDashboardOpen(false)}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security color="primary" />
            HIPAA Compliance Dashboard
          </Box>
          <Chip 
            label={`Overall Score: ${complianceMetrics.overallScore}%`}
            color={complianceMetrics.overallScore >= 90 ? 'success' : 
                   complianceMetrics.overallScore >= 70 ? 'warning' : 'error'}
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          <Grid>
            <Typography variant="h6" gutterBottom>
              Compliance Metrics
            </Typography>
            <Grid container spacing={2}>
              <Grid>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Lock color="primary" />
                      <Typography variant="subtitle1" sx={{ ml: 1 }}>
                        Encryption
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="primary">
                      {complianceMetrics.encryptionStatus}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={complianceMetrics.encryptionStatus} 
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Person color="primary" />
                      <Typography variant="subtitle1" sx={{ ml: 1 }}>
                        Access Control
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="primary">
                      {complianceMetrics.accessControlCompliance}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={complianceMetrics.accessControlCompliance} 
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <History color="primary" />
                      <Typography variant="subtitle1" sx={{ ml: 1 }}>
                        Audit Trail
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="primary">
                      {complianceMetrics.auditTrailCoverage}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={complianceMetrics.auditTrailCoverage} 
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Schedule color="primary" />
                      <Typography variant="subtitle1" sx={{ ml: 1 }}>
                        Retention
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="primary">
                      {complianceMetrics.retentionPolicyCompliance}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={complianceMetrics.retentionPolicyCompliance} 
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Badge badgeContent={securityAlerts.filter(a => !a.resolved).length} color="error">
                    <Warning color="warning" />
                  </Badge>
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Security Alerts
                  </Typography>
                </Box>
                <List>
                  {securityAlerts.slice(0, 5).map((alert) => (
                    <ListItem 
                      key={alert.id}
                      sx={{ 
                        border: 1, 
                        borderColor: 'grey.300', 
                        borderRadius: 1, 
                        mb: 1,
                        opacity: alert.resolved ? 0.6 : 1
                      }}
                    >
                      <ListItemIcon>
                        {getAlertIcon(alert.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={alert.message}
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              {new Date(alert.timestamp).toLocaleString()}
                            </Typography>
                            <Chip 
                              size="small" 
                              label={alert.severity.toUpperCase()} 
                              color={getAlertColor(alert.severity) as any}
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        }
                      />
                      {!alert.resolved && (
                        <Tooltip title="Mark as resolved">
                          <IconButton 
                            size="small" 
                            onClick={() => resolveAlert(alert.id)}
                          >
                            <CheckCircle color="success" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <History sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Recent Access Activity
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Action</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Location</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentAccess.slice(0, 8).map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getActionIcon(entry.action)}
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {entry.action}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{entry.userId}</TableCell>
                          <TableCell>
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>{entry.location}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={generateComplianceReport}
          variant="outlined"
          startIcon={<Assessment />}
        >
          Generate Report
        </Button>
        <Button onClick={() => fileManager.setSecurityDashboardOpen(false)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}