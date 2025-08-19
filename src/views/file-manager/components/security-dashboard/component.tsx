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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Divider,
  LinearProgress
} from "@mui/material";
import { 
  Security, 
  Visibility, 
  Download, 
  Edit, 
  Share, 
  Delete,
  Warning,
  CheckCircle,
  Timeline,
  Assessment
} from "@mui/icons-material";

interface SecurityDashboardDialogProps {
  fileManager: any;
}

export function SecurityDashboardDialog({ fileManager }: SecurityDashboardDialogProps) {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState('7d');

  const securityMetrics = React.useMemo(() => {
    const now = new Date();
    const timeRanges = {
      '1d': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    
    const cutoffTime = new Date(now.getTime() - timeRanges[selectedTimeRange as keyof typeof timeRanges]);
    
    const recentAccessLogs = fileManager.files
      .filter((f: any) => f.accessLog && f.accessLog.length > 0)
      .flatMap((f: any) => 
        f.accessLog
          .filter((log: any) => new Date(log.timestamp) > cutoffTime)
          .map((log: any) => ({ ...log, fileName: f.name, fileId: f.id }))
      )
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const confidentialFiles = fileManager.files.filter((f: any) => f.isConfidential);
    const sharedFiles = fileManager.files.filter((f: any) => f.sharedWith.length > 0);
    const recentlyAccessed = fileManager.files.filter((f: any) => {
      if (!f.lastAccessed) return false;
      return new Date(f.lastAccessed) > cutoffTime;
    });

    const actionCounts = recentAccessLogs.reduce((acc: any, log: any) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {});

    return {
      totalFiles: fileManager.files.length,
      confidentialFiles: confidentialFiles.length,
      sharedFiles: sharedFiles.length,
      recentlyAccessed: recentlyAccessed.length,
      recentAccessLogs,
      actionCounts,
      riskScore: calculateRiskScore(fileManager.files, recentAccessLogs)
    };
  }, [fileManager.files, selectedTimeRange]);

  function calculateRiskScore(files: any[], accessLogs: any[]) {
    let score = 0;
    const factors = {
      confidentialShared: files.filter(f => f.isConfidential && f.sharedWith.length > 0).length * 10,
      highAccessFrequency: files.filter(f => (f.accessCount || 0) > 50).length * 5,
      recentDeletes: accessLogs.filter(log => log.action === 'delete').length * 15,
      unprotectedShares: files.filter(f => f.sharedWith.length > 0 && !f.isConfidential).length * 2
    };
    
    score = Object.values(factors).reduce((sum, val) => sum + val, 0);
    return Math.min(score, 100);
  }

  const getRiskLevel = (score: number) => {
    if (score < 20) return { level: 'Low', color: 'success', icon: <CheckCircle /> };
    if (score < 50) return { level: 'Medium', color: 'warning', icon: <Warning /> };
    return { level: 'High', color: 'error', icon: <Warning /> };
  };

  const risk = getRiskLevel(securityMetrics.riskScore);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'view': return <Visibility />;
      case 'download': return <Download />;
      case 'edit': return <Edit />;
      case 'share': return <Share />;
      case 'delete': return <Delete />;
      default: return <Visibility />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'view': return 'info';
      case 'download': return 'success';
      case 'edit': return 'warning';
      case 'share': return 'primary';
      case 'delete': return 'error';
      default: return 'default';
    }
  };

  return (
    <Dialog 
      open={fileManager.securityDashboardOpen} 
      onClose={() => fileManager.setSecurityDashboardOpen(false)} 
      maxWidth="lg" 
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Security />
        Security Dashboard
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid>
            <Card sx={{ p: 2, mb: 2, bgcolor: `${risk.color}.50` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: `${risk.color}.main` }}>
                    {risk.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6">
                      Security Risk: {risk.level}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Risk Score: {securityMetrics.riskScore}/100
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ width: 200 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={securityMetrics.riskScore} 
                    color={risk.color as any}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment />
              Security Metrics
            </Typography>
            
            <Grid container spacing={2}>
              <Grid>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main">
                    {securityMetrics.totalFiles}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Files
                  </Typography>
                </Card>
              </Grid>
              <Grid>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {securityMetrics.confidentialFiles}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confidential
                  </Typography>
                </Card>
              </Grid>
              <Grid>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {securityMetrics.sharedFiles}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Shared Files
                  </Typography>
                </Card>
              </Grid>
              <Grid>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {securityMetrics.recentlyAccessed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recently Accessed
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            <Card sx={{ p: 2, mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Recent Activity Summary
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {Object.entries(securityMetrics.actionCounts).map(([action, count]) => (
                  <Chip
                    key={action}
                    label={`${action.toUpperCase()}: ${count}`}
                    color={getActionColor(action) as any}
                    size="small"
                    icon={getActionIcon(action)}
                  />
                ))}
                {Object.keys(securityMetrics.actionCounts).length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No recent activity
                  </Typography>
                )}
              </Box>
            </Card>
          </Grid>

          <Grid>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Timeline />
              Recent Access Logs
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {['1d', '7d', '30d'].map((range) => (
                <Button
                  key={range}
                  variant={selectedTimeRange === range ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setSelectedTimeRange(range)}
                >
                  {range === '1d' ? 'Today' : range === '7d' ? '7 Days' : '30 Days'}
                </Button>
              ))}
            </Box>

            <Card sx={{ maxHeight: 400, overflow: 'auto' }}>
              <List dense>
                {securityMetrics.recentAccessLogs.slice(0, 20).map((log: any, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {getActionIcon(log.action)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">
                            {log.fileName.length > 20 ? `${log.fileName.substring(0, 20)}...` : log.fileName}
                          </Typography>
                          <Chip 
                            label={log.action.toUpperCase()} 
                            size="small" 
                            color={getActionColor(log.action) as any}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(log.timestamp).toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            User: {log.userId} • {log.userAgent?.split(' ')[0]}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
                
                {securityMetrics.recentAccessLogs.length === 0 && (
                  <ListItem>
                    <ListItemText 
                      primary="No recent access logs"
                      secondary="Activity will appear here when files are accessed"
                    />
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>

          <Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>Security Recommendations</Typography>
            
            <Grid container spacing={2}>
              {securityMetrics.riskScore > 50 && (
                <Grid>
                  <Alert severity="error">
                    <Typography variant="subtitle2">High Risk Detected</Typography>
                    <Typography variant="body2">
                      Consider reviewing file sharing permissions and implementing additional security measures.
                    </Typography>
                  </Alert>
                </Grid>
              )}
              
              {fileManager.files.filter((f: any) => f.isConfidential && f.sharedWith.length > 0).length > 0 && (
                <Grid>
                  <Alert severity="warning">
                    <Typography variant="subtitle2">Confidential Files Shared</Typography>
                    <Typography variant="body2">
                      {fileManager.files.filter((f: any) => f.isConfidential && f.sharedWith.length > 0).length} confidential files are currently shared.
                    </Typography>
                  </Alert>
                </Grid>
              )}
              
              {securityMetrics.recentAccessLogs.filter((log: any) => log.action === 'delete').length > 5 && (
                <Grid>
                  <Alert severity="info">
                    <Typography variant="subtitle2">High Deletion Activity</Typography>
                    <Typography variant="body2">
                      Unusual number of file deletions detected. Consider implementing additional deletion controls.
                    </Typography>
                  </Alert>
                </Grid>
              )}
              
              {securityMetrics.riskScore < 20 && (
                <Grid>
                  <Alert severity="success">
                    <Typography variant="subtitle2">Good Security Posture</Typography>
                    <Typography variant="body2">
                      Your file security practices are following best practices. Continue monitoring for any changes.
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => fileManager.setSecurityDashboardOpen(false)}>
          Close
        </Button>
        <Button variant="outlined" startIcon={<Download />}>
          Export Security Report
        </Button>
      </DialogActions>
    </Dialog>
  );
}