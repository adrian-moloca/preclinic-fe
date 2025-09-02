import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Slider,
  Alert,
  Divider
} from '@mui/material';
import { Save, PlayArrow, Close } from '@mui/icons-material';
import { WorkflowRule, WorkflowTriggerEvent } from '../../../providers/workflow-automation/types';
import { useWorkflowAutomation } from '../../../providers/workflow-automation/context';
import TriggerSelector from './components/trigger-selector';
import ConditionsBuilder from './components/conditions-builder';
import ActionsBuilder from './components/actions-builder';
import RulePreview from './components/rule-preview';

interface RuleBuilderProps {
  rule?: WorkflowRule;
  onSave: (rule: WorkflowRule) => void;
  onCancel: () => void;
}

export const RuleBuilder: React.FC<RuleBuilderProps> = ({ rule, onSave, onCancel }) => {
  const { createRule, updateRule, simulateRule } = useWorkflowAutomation();
  const [activeStep, setActiveStep] = useState(0);
  const [ruleData, setRuleData] = useState<Partial<WorkflowRule>>(rule || {
    name: '',
    description: '',
    enabled: true,
    priority: 5,
    trigger: {
      event: 'appointment_created' as WorkflowTriggerEvent,
      timing: 'immediate'
    },
    conditions: [],
    actions: []
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const handleNext = () => {
    const errors = validateCurrentStep();
    if (errors.length === 0) {
      setActiveStep((prev) => prev + 1);
      setValidationErrors([]);
    } else {
      setValidationErrors(errors);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setValidationErrors([]);
  };

  const validateCurrentStep = (): string[] => {
    const errors: string[] = [];

    switch (activeStep) {
      case 0: 
        if (!ruleData.name?.trim()) errors.push('Rule name is required');
        if (!ruleData.description?.trim()) errors.push('Rule description is required');
        break;
      case 1: 
        if (!ruleData.trigger?.event) errors.push('Trigger event is required');
        break;
      case 2: 
        break;
      case 3: 
        if (!ruleData.actions?.length) errors.push('At least one action is required');
        break;
    }

    return errors;
  };

  const handleSave = () => {
    const errors = validateCurrentStep();
    if (errors.length === 0) {
      if (rule?.id) {
        updateRule(rule.id, ruleData);
      } else {
        createRule(ruleData as any);
      }
      onSave(ruleData as WorkflowRule);
    } else {
      setValidationErrors(errors);
    }
  };

  const handleTest = () => {
    const testData = {
      appointment: {
        id: 'test-appointment',
        type: 'consultation',
        department: 'Cardiology'
      },
      patient: {
        id: 'test-patient',
        name: 'John Doe',
        age: 65
      },
      vitals: {
        blood_pressure_systolic: 150,
        blood_pressure_diastolic: 90,
        heart_rate: 75
      }
    };

    const result = simulateRule(ruleData as WorkflowRule, testData);
    setSimulationResult(result);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          {rule ? 'Edit Workflow Rule' : 'Create Workflow Rule'}
        </Typography>
        <Button onClick={onCancel} startIcon={<Close />}>
          Cancel
        </Button>
      </Box>

      {validationErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationErrors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Alert>
      )}

      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>Basic Information</StepLabel>
          <StepContent>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Rule Name"
                value={ruleData.name || ''}
                onChange={(e) => setRuleData({ ...ruleData, name: e.target.value })}
                margin="normal"
                required
                placeholder="e.g., High-Risk Patient Alert"
              />
              <TextField
                fullWidth
                label="Description"
                value={ruleData.description || ''}
                onChange={(e) => setRuleData({ ...ruleData, description: e.target.value })}
                margin="normal"
                multiline
                rows={2}
                required
                placeholder="Describe what this rule does..."
              />
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography gutterBottom>Priority (1-10)</Typography>
                <Slider
                  value={ruleData.priority || 5}
                  onChange={(_, value) => setRuleData({ ...ruleData, priority: value as number })}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={10}
                />
                <Typography variant="caption" color="text.secondary">
                  Higher priority rules execute first
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={ruleData.enabled || false}
                    onChange={(e) => setRuleData({ ...ruleData, enabled: e.target.checked })}
                  />
                }
                label="Enable this rule immediately"
              />
            </Box>
            <Box sx={{ mb: 1 }}>
              <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                Continue
              </Button>
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Trigger Configuration</StepLabel>
          <StepContent>
            <TriggerSelector
              trigger={ruleData.trigger!}
              onChange={(trigger) => setRuleData({ ...ruleData, trigger })}
            />
            <Box sx={{ mb: 1 }}>
              <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                Continue
              </Button>
              <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                Back
              </Button>
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Conditions (Optional)</StepLabel>
          <StepContent>
            <ConditionsBuilder
              conditions={ruleData.conditions || []}
              onChange={(conditions) => setRuleData({ ...ruleData, conditions })}
            />
            <Box sx={{ mb: 1 }}>
              <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                Continue
              </Button>
              <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                Back
              </Button>
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Actions</StepLabel>
          <StepContent>
            <ActionsBuilder
              actions={ruleData.actions || []}
              onChange={(actions) => setRuleData({ ...ruleData, actions })}
            />
            <Box sx={{ mb: 1 }}>
              <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                Continue
              </Button>
              <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                Back
              </Button>
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Review & Test</StepLabel>
          <StepContent>
            <RulePreview rule={ruleData as WorkflowRule} />
            
            {simulationResult && (
              <Alert 
                severity={simulationResult.wouldTrigger ? "success" : "info"} 
                sx={{ mt: 2 }}
              >
                <Typography variant="subtitle2">
                  Test Result: {simulationResult.wouldTrigger ? 'Rule would trigger' : 'Rule would not trigger'}
                </Typography>
                {simulationResult.wouldTrigger && (
                  <Typography variant="body2">
                    Actions to execute: {simulationResult.actionsToExecute.length}
                  </Typography>
                )}
              </Alert>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 1, mt: 2 }}>
              <Button 
                variant="contained" 
                onClick={handleSave} 
                startIcon={<Save />}
                sx={{ mt: 1, mr: 1 }}
                size="large"
              >
                {rule ? 'Update Rule' : 'Create Rule'}
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleTest} 
                startIcon={<PlayArrow />}
                sx={{ mt: 1, mr: 1 }}
              >
                Test Rule
              </Button>
              <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                Back
              </Button>
            </Box>
          </StepContent>
        </Step>
      </Stepper>
    </Paper>
  );
};