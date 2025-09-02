import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  PlayArrow,
  Pause,
  AutoMode,
  CheckCircle,
  Error,
  Schedule,
  TrendingUp
} from '@mui/icons-material';
import { useWorkflowAutomation } from '../../../providers/workflow-automation/context';
import { WorkflowRule } from '../../../providers/workflow-automation/types';
import { formatDistanceToNow } from 'date-fns';
import { RuleBuilder } from '../rule-builder/component';

export const WorkflowDashboard: React.FC = () => {
  const { 
    rules, 
    stats, 
    executions, 
    toggleRule, 
    deleteRule, 
    getRulePerformance 
  } = useWorkflowAutomation();

  const [isRuleBuilderOpen, setIsRuleBuilderOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<WorkflowRule | undefined>();
  const [deleteConfirmRule, setDeleteConfirmRule] = useState<WorkflowRule | undefined>();
  const [loading,] = useState(false);

  const handleCreateRule = () => {
    setEditingRule(undefined);
    setIsRuleBuilderOpen(true);
  };

  const handleEditRule = (rule: WorkflowRule) => {
    setEditingRule(rule);
    setIsRuleBuilderOpen(true);
  };

  const handleRuleBuilderClose = () => {
    setIsRuleBuilderOpen(false);
    setEditingRule(undefined);
  };

  const handleDeleteRule = (rule: WorkflowRule) => {
    setDeleteConfirmRule(rule);
  };

  const confirmDeleteRule = () => {
    if (deleteConfirmRule) {
      deleteRule(deleteConfirmRule.id);
      setDeleteConfirmRule(undefined);
    }
  };

  const getStatusIcon = (enabled: boolean) => {
    return enabled ? (
      <CheckCircle sx={{ color: 'success.main' }} />
    ) : (
      <Pause sx={{ color: 'text.disabled' }} />
    );
  };

  const getLastTriggeredText = (lastTriggered?: Date) => {
    if (!lastTriggered) return 'Never';
    try {
      return formatDistanceToNow(new Date(lastTriggered), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const recentExecutions = executions
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 10);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Workflow Automation
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Automate clinic operations with intelligent rules and actions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateRule}
          size="large"
        >
          Create Rule
        </Button>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid sx={{ width: "278px" }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="primary.main" fontWeight="bold">
                    {stats.activeRules}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Rules
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    of {stats.totalRules} total
                  </Typography>
                </Box>
                <AutoMode sx={{ color: 'primary.main', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ width: "278px" }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {stats.executionsToday}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Executions Today
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stats.executionsThisWeek} this week
                  </Typography>
                </Box>
                <PlayArrow sx={{ color: 'success.main', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ width: "277px" }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="info.main" fontWeight="bold">
                    {stats.successRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Success Rate
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last 30 days
                  </Typography>
                </Box>
                <CheckCircle sx={{ color: 'info.main', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ width: "277px" }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {stats.timeSavedHours}h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Time Saved
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Estimated
                  </Typography>
                </Box>
                <TrendingUp sx={{ color: 'warning.main', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Workflow Rules
          </Typography>
          
          {rules.length === 0 ? (
            <Box textAlign="center" py={4}>
              <AutoMode sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No workflow rules created yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Create your first automation rule to streamline clinic operations
              </Typography>
              <Button variant="contained" onClick={handleCreateRule} size="large">
                Create First Rule
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Rule Name</TableCell>
                    <TableCell>Trigger</TableCell>
                    <TableCell>Conditions</TableCell>
                    <TableCell>Actions</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Triggered</TableCell>
                    <TableCell>Last Run</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rules.map((rule) => {
                    const performance = getRulePerformance(rule.id);
                    return (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            {getStatusIcon(rule.enabled)}
                            <Switch
                              size="small"
                              checked={rule.enabled}
                              onChange={() => toggleRule(rule.id)}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {rule.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {rule.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={rule.trigger.event.replace(/_/g, ' ')}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {rule.conditions.length} condition{rule.conditions.length !== 1 ? 's' : ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {rule.actions.length} action{rule.actions.length !== 1 ? 's' : ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={rule.priority}
                            size="small"
                            color={rule.priority >= 7 ? 'error' : rule.priority >= 4 ? 'warning' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {rule.triggerCount}x
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {performance.successRate.toFixed(0)}% success
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {getLastTriggeredText(rule.lastTriggered)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Tooltip title="Edit Rule">
                              <IconButton
                                size="small"
                                onClick={() => handleEditRule(rule)}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Rule">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteRule(rule)}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Executions
          </Typography>
          
          {recentExecutions.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Schedule sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography color="text.secondary">
                No executions yet. Rules will appear here when they run.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Rule</TableCell>
                    <TableCell>Started</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentExecutions.map((execution) => {
                    const rule = rules.find(r => r.id === execution.ruleId);
                    const duration = execution.endTime 
                      ? execution.endTime.getTime() - execution.startTime.getTime()
                      : null;
                    
                    return (
                      <TableRow key={execution.id}>
                        <TableCell>
                          <Chip
                            size="small"
                            label={execution.status}
                            color={
                              execution.status === 'completed' ? 'success' :
                              execution.status === 'failed' ? 'error' : 'warning'
                            }
                            icon={
                              execution.status === 'completed' ? <CheckCircle /> :
                              execution.status === 'failed' ? <Error /> : <Schedule />
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {rule?.name || 'Unknown Rule'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {getLastTriggeredText(execution.startTime)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {duration ? `${duration}ms` : '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {execution.actionsExecuted.length} executed
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isRuleBuilderOpen}
        onClose={handleRuleBuilderClose}
        maxWidth="lg"
        fullWidth
        scroll="body"
      >
        <DialogContent sx={{ p: 0 }}>
          <RuleBuilder
            rule={editingRule}
            onSave={handleRuleBuilderClose}
            onCancel={handleRuleBuilderClose}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteConfirmRule}
        onClose={() => setDeleteConfirmRule(undefined)}
      >
        <DialogTitle>Delete Workflow Rule</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the rule "{deleteConfirmRule?.name}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmRule(undefined)}>
            Cancel
          </Button>
          <Button onClick={confirmDeleteRule} color="error" variant="contained">
            Delete Rule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};