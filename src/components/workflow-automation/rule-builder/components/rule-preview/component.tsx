import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Alert
} from '@mui/material';
import { WorkflowRule } from '../../../../../providers/workflow-automation/types';

interface RulePreviewProps {
  rule: WorkflowRule;
}

export const RulePreview: React.FC<RulePreviewProps> = ({ rule }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Rule Preview
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h6">{rule.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {rule.description}
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Chip 
                label={rule.enabled ? 'Enabled' : 'Disabled'} 
                color={rule.enabled ? 'success' : 'default'}
                size="small"
              />
              <Chip 
                label={`Priority: ${rule.priority}`} 
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            Trigger: {rule.trigger?.event?.replace(/_/g, ' ')}
          </Typography>
          
          <Typography variant="subtitle2" gutterBottom>
            Conditions: {rule.conditions?.length || 0}
          </Typography>
          
          <Typography variant="subtitle2" gutterBottom>
            Actions: {rule.actions?.length || 0}
          </Typography>
        </CardContent>
      </Card>

      <Alert severity="info">
        <Typography variant="subtitle2">Summary</Typography>
        <Typography variant="body2">
          This rule will {rule.enabled ? 'automatically' : 'NOT'} execute {rule.actions?.length || 0} action(s) 
          when "{rule.trigger?.event?.replace(/_/g, ' ')}" occurs.
        </Typography>
      </Alert>
    </Box>
  );
};