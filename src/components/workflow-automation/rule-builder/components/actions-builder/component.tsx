import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import { 
  Delete, 
  ExpandMore, 
  Notifications, 
  Task, 
  Flag, 
  Email,
} from '@mui/icons-material';
import { WorkflowAction, WorkflowActionType } from '../../../../../providers/workflow-automation/types';

interface ActionsBuilderProps {
  actions: WorkflowAction[];
  onChange: (actions: WorkflowAction[]) => void;
}

export const ActionsBuilder: React.FC<ActionsBuilderProps> = ({ actions, onChange }) => {
  const [expandedAction, setExpandedAction] = useState<string | false>(false);

  const actionTypes = [
    { 
      value: 'send_notification', 
      label: 'Send Notification', 
      icon: <Notifications />,
      description: 'Send a notification to users or patients'
    },
    { 
      value: 'create_task', 
      label: 'Create Task', 
      icon: <Task />,
      description: 'Create a task for staff members'
    },
    { 
      value: 'flag_record', 
      label: 'Flag Record', 
      icon: <Flag />,
      description: 'Add a flag or label to a patient or appointment record'
    },
    { 
      value: 'send_email', 
      label: 'Send Email', 
      icon: <Email />,
      description: 'Send an email to specified recipients'
    }
  ];

  const addAction = (type: WorkflowActionType) => {
    const newAction: WorkflowAction = {
      id: crypto.randomUUID(),
      type,
      parameters: getDefaultParameters(type)
    };
    onChange([...actions, newAction]);
    setExpandedAction(newAction.id);
  };

  const updateAction = (index: number, updates: Partial<WorkflowAction>) => {
    const newActions = [...actions];
    newActions[index] = { ...newActions[index], ...updates };
    onChange(newActions);
  };

  const removeAction = (index: number) => {
    const newActions = actions.filter((_, i) => i !== index);
    onChange(newActions);
  };

  const getDefaultParameters = (type: WorkflowActionType): Record<string, any> => {
    switch (type) {
      case 'send_notification':
        return {
          recipient: 'doctor',
          method: 'app_notification',
          message: 'Notification message here',
          priority: 'medium'
        };
      case 'create_task':
        return {
          title: 'Task title',
          description: 'Task description',
          assignee: 'nurse',
          priority: 'medium',
          category: 'general'
        };
      case 'flag_record':
        return {
          flag: 'IMPORTANT',
          color: 'orange',
          message: 'Record flagged by automation'
        };
      case 'send_email':
        return {
          to: 'doctor@clinic.com',
          subject: 'Email subject',
          body: 'Email body content'
        };
      default:
        return {};
    }
  };

  const renderActionParameters = (action: WorkflowAction, index: number) => {
    const updateParameters = (updates: Record<string, any>) => {
      updateAction(index, {
        parameters: { ...action.parameters, ...updates }
      });
    };

    switch (action.type) {
      case 'send_notification':
        return (
          <Box>
            <FormControl fullWidth margin="normal">
              <InputLabel>Recipient</InputLabel>
              <Select
                value={action.parameters.recipient || 'doctor'}
                onChange={(e) => updateParameters({ recipient: e.target.value })}
                label="Recipient"
              >
                <MenuItem value="doctor">Doctor</MenuItem>
                <MenuItem value="nurse">Nurse</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
                <MenuItem value="patient">Patient</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Method</InputLabel>
              <Select
                value={action.parameters.method || 'app_notification'}
                onChange={(e) => updateParameters({ method: e.target.value })}
                label="Method"
              >
                <MenuItem value="app_notification">App Notification</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="sms">SMS</MenuItem>
                <MenuItem value="system_alert">System Alert</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Message"
              multiline
              rows={3}
              value={action.parameters.message || ''}
              onChange={(e) => updateParameters({ message: e.target.value })}
              helperText="Use {{patient.name}}, {{appointment.time}} for dynamic content"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                value={action.parameters.priority || 'medium'}
                onChange={(e) => updateParameters({ priority: e.target.value })}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      case 'create_task':
        return (
          <Box>
            <TextField
              fullWidth
              margin="normal"
              label="Task Title"
              value={action.parameters.title || ''}
              onChange={(e) => updateParameters({ title: e.target.value })}
              placeholder="e.g., Review patient lab results"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              multiline
              rows={2}
              value={action.parameters.description || ''}
              onChange={(e) => updateParameters({ description: e.target.value })}
              placeholder="Detailed description of the task"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Assignee"
              value={action.parameters.assignee || ''}
              onChange={(e) => updateParameters({ assignee: e.target.value })}
              placeholder="e.g., Dr. Smith, nurse, admin"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Due Date"
              value={action.parameters.dueDate || ''}
              onChange={(e) => updateParameters({ dueDate: e.target.value })}
              helperText="e.g., +24h, +3d, +1w for relative dates"
              placeholder="e.g., +24h"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                value={action.parameters.priority || 'medium'}
                onChange={(e) => updateParameters({ priority: e.target.value })}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      case 'flag_record':
        return (
          <Box>
            <TextField
              fullWidth
              margin="normal"
              label="Flag Label"
              value={action.parameters.flag || ''}
              onChange={(e) => updateParameters({ flag: e.target.value })}
              placeholder="e.g., URGENT, HIGH_RISK, PRIORITY"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Flag Color</InputLabel>
              <Select
                value={action.parameters.color || 'orange'}
                onChange={(e) => updateParameters({ color: e.target.value })}
                label="Flag Color"
              >
                <MenuItem value="red">Red (Urgent)</MenuItem>
                <MenuItem value="orange">Orange (Important)</MenuItem>
                <MenuItem value="yellow">Yellow (Caution)</MenuItem>
                <MenuItem value="blue">Blue (Info)</MenuItem>
                <MenuItem value="green">Green (Normal)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Flag Message"
              multiline
              rows={2}
              value={action.parameters.message || ''}
              onChange={(e) => updateParameters({ message: e.target.value })}
              placeholder="Why is this record flagged?"
            />
          </Box>
        );

      case 'send_email':
        return (
          <Box>
            <TextField
              fullWidth
              margin="normal"
              label="To (Email Address)"
              value={action.parameters.to || ''}
              onChange={(e) => updateParameters({ to: e.target.value })}
              placeholder="doctor@clinic.com or {{patient.email}}"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Subject"
              value={action.parameters.subject || ''}
              onChange={(e) => updateParameters({ subject: e.target.value })}
              placeholder="Email subject line"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email Body"
              multiline
              rows={4}
              value={action.parameters.body || ''}
              onChange={(e) => updateParameters({ body: e.target.value })}
              placeholder="Email content here..."
            />
          </Box>
        );

      default:
        return (
          <Alert severity="info">
            Configuration for this action type is not yet implemented.
          </Alert>
        );
    }
  };

  const getActionIcon = (type: WorkflowActionType) => {
    const actionType = actionTypes.find(at => at.value === type);
    return actionType?.icon || <Task />;
  };

  const getActionLabel = (type: WorkflowActionType) => {
    const actionType = actionTypes.find(at => at.value === type);
    return actionType?.label || type;
  };

  const getActionSummary = (action: WorkflowAction) => {
    switch (action.type) {
      case 'send_notification':
        return `Send "${action.parameters.message || 'notification'}" to ${action.parameters.recipient || 'recipient'}`;
      case 'create_task':
        return `Create task: "${action.parameters.title || 'Untitled'}" for ${action.parameters.assignee || 'someone'}`;
      case 'flag_record':
        return `Flag record as "${action.parameters.flag || 'FLAGGED'}" (${action.parameters.color || 'orange'})`;
      case 'send_email':
        return `Send email to ${action.parameters.to || 'recipient'}: "${action.parameters.subject || 'No subject'}"`;
      default:
        return 'Action configured';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Actions
        </Typography>
        
        <Alert severity="warning" sx={{ mb: 2 }}>
          At least one action is required. These actions will be executed when the rule triggers and conditions are met.
        </Alert>

        {actions.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary" mb={3}>
              No actions configured. Add at least one action.
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Quick Start Actions:
            </Typography>
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
              {actionTypes.slice(0, 2).map((actionType) => (
                <Button
                  key={actionType.value}
                  variant="contained"
                  startIcon={actionType.icon}
                  onClick={() => addAction(actionType.value as WorkflowActionType)}
                >
                  {actionType.label}
                </Button>
              ))}
            </Box>
          </Box>
        ) : (
          <Box mb={2}>
            {actions.map((action, index) => (
              <Accordion
                key={action.id}
                expanded={expandedAction === action.id}
                onChange={(_, expanded) => setExpandedAction(expanded ? action.id : false)}
                sx={{ mb: 1, border: '1px solid', borderColor: 'grey.300' }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMore />}
                  sx={{ bgcolor: 'grey.50' }}
                >
                  <Box display="flex" alignItems="center" gap={2} width="100%">
                    {getActionIcon(action.type)}
                    <Box flexGrow={1}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {getActionLabel(action.type)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {getActionSummary(action)}
                      </Typography>
                    </Box>
                    {action.delay && (
                      <Chip label={`Delay: ${action.delay}m`} size="small" />
                    )}
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAction(index);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {renderActionParameters(action, index)}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Execution Delay (Optional)
                    </Typography>
                    <TextField
                      type="number"
                      label="Delay (minutes)"
                      value={action.delay || ''}
                      onChange={(e) => updateAction(index, { 
                        delay: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      inputProps={{ min: 0 }}
                      helperText="Wait this many minutes before executing this action"
                      sx={{ width: 200 }}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Add Action
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {actionTypes.map((actionType) => (
              <Button
                key={actionType.value}
                variant="outlined"
                size="small"
                startIcon={actionType.icon}
                onClick={() => addAction(actionType.value as WorkflowActionType)}
                sx={{ mb: 1 }}
              >
                {actionType.label}
              </Button>
            ))}
          </Box>
          
          {/* Action Examples */}
          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              💡 Example Actions:
            </Typography>
            <Typography variant="body2" component="div">
              • Send notification: "High-risk patient {'{{patient.name}}'} needs attention"<br/>
              • Create task: "Review lab results for {'{{patient.name}}'}" assigned to doctor<br/>
              • Flag record: Mark patient as "URGENT" with red flag<br/>
              • Send email: Appointment reminder to {'{{patient.email}}'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};