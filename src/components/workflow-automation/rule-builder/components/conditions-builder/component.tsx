import React from 'react';
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
  Chip,
  Divider,
  Alert
} from '@mui/material';
import { Add, Delete, Help } from '@mui/icons-material';
import { ConditionOperator, WorkflowCondition } from '../../../../../providers/workflow-automation/types';

interface ConditionsBuilderProps {
  conditions: WorkflowCondition[];
  onChange: (conditions: WorkflowCondition[]) => void;
}

export const ConditionsBuilder: React.FC<ConditionsBuilderProps> = ({ conditions, onChange }) => {
  const availableFields = [
    { field: 'patient.age', label: 'Patient Age', type: 'number' },
    { field: 'patient.gender', label: 'Patient Gender', type: 'text' },
    { field: 'patient.bloodGroup', label: 'Patient Blood Group', type: 'text' },
    { field: 'appointment.type', label: 'Appointment Type', type: 'text' },
    { field: 'appointment.department', label: 'Department', type: 'text' },
    { field: 'appointment.duration', label: 'Appointment Duration (minutes)', type: 'number' },
    { field: 'prescription.medication', label: 'Medication Name', type: 'text' },
    { field: 'prescription.dosage', label: 'Medication Dosage', type: 'text' },
    { field: 'vitals.blood_pressure_systolic', label: 'Systolic Blood Pressure', type: 'number' },
    { field: 'vitals.blood_pressure_diastolic', label: 'Diastolic Blood Pressure', type: 'number' },
    { field: 'vitals.heart_rate', label: 'Heart Rate', type: 'number' },
    { field: 'vitals.temperature', label: 'Temperature', type: 'number' },
    { field: 'file.name', label: 'File Name', type: 'text' },
    { field: 'file.type', label: 'File Type', type: 'text' },
    { field: 'file.size', label: 'File Size (MB)', type: 'number' }
  ];

  const operatorOptions: { value: ConditionOperator; label: string; types: string[] }[] = [
    { value: 'equals', label: 'equals', types: ['text', 'number'] },
    { value: 'not_equals', label: 'does not equal', types: ['text', 'number'] },
    { value: 'contains', label: 'contains', types: ['text'] },
    { value: 'not_contains', label: 'does not contain', types: ['text'] },
    { value: 'greater_than', label: 'is greater than', types: ['number'] },
    { value: 'less_than', label: 'is less than', types: ['number'] },
    { value: 'between', label: 'is between', types: ['number'] },
    { value: 'in_list', label: 'is one of', types: ['text'] },
    { value: 'is_empty', label: 'is empty', types: ['text'] },
    { value: 'is_not_empty', label: 'is not empty', types: ['text'] }
  ];

  const addCondition = () => {
    const newCondition: WorkflowCondition = {
      id: crypto.randomUUID(),
      field: 'patient.age',
      operator: 'greater_than',
      value: '',
      logicalOperator: conditions.length > 0 ? 'AND' : undefined
    };
    onChange([...conditions, newCondition]);
  };

  const updateCondition = (index: number, updates: Partial<WorkflowCondition>) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    onChange(newConditions);
  };

  const removeCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    onChange(newConditions);
  };

  const getFieldType = (fieldPath: string): string => {
    const field = availableFields.find(f => f.field === fieldPath);
    return field?.type || 'text';
  };

  const getAvailableOperators = (fieldType: string) => {
    return operatorOptions.filter(op => op.types.includes(fieldType));
  };

  const renderValueInput = (condition: WorkflowCondition, index: number) => {
    const fieldType = getFieldType(condition.field);
    
    if (condition.operator === 'is_empty' || condition.operator === 'is_not_empty') {
      return (
        <Box sx={{ minWidth: 200, display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            No value needed
          </Typography>
        </Box>
      );
    }

    if (condition.operator === 'between') {
      const values = Array.isArray(condition.value) ? condition.value : ['', ''];
      return (
        <Box display="flex" gap={1} alignItems="center" sx={{ minWidth: 200 }}>
          <TextField
            size="small"
            type="number"
            placeholder="Min"
            value={values[0] || ''}
            onChange={(e) => updateCondition(index, { 
              value: [e.target.value, values[1] || ''] 
            })}
            sx={{ width: 80 }}
          />
          <Typography variant="body2">and</Typography>
          <TextField
            size="small"
            type="number"
            placeholder="Max"
            value={values[1] || ''}
            onChange={(e) => updateCondition(index, { 
              value: [values[0] || '', e.target.value] 
            })}
            sx={{ width: 80 }}
          />
        </Box>
      );
    }

    if (condition.operator === 'in_list') {
      const values = Array.isArray(condition.value) ? condition.value : [];
      return (
        <Box sx={{ minWidth: 200 }}>
          <TextField
            size="small"
            placeholder="Enter values separated by commas"
            value={values.join(', ')}
            onChange={(e) => updateCondition(index, { 
              value: e.target.value.split(',').map(v => v.trim()).filter(v => v)
            })}
            helperText="e.g., Cardiology, Neurology, Orthopedics"
            sx={{ width: '100%' }}
          />
          <Box sx={{ mt: 1 }}>
            {values.map((val, valIndex) => (
              <Chip
                key={valIndex}
                label={val}
                size="small"
                onDelete={() => {
                  const newValues = values.filter((_, i) => i !== valIndex);
                  updateCondition(index, { value: newValues });
                }}
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
        </Box>
      );
    }

    return (
      <TextField
        size="small"
        type={fieldType === 'number' ? 'number' : 'text'}
        value={condition.value}
        onChange={(e) => updateCondition(index, { value: e.target.value })}
        placeholder={`Enter ${fieldType} value`}
        sx={{ minWidth: 200 }}
      />
    );
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Typography variant="h6">
            Conditions
          </Typography>
          <IconButton size="small" color="info">
            <Help fontSize="small" />
          </IconButton>
        </Box>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          Add conditions to specify when this rule should execute. Leave empty to execute for all events.
        </Alert>

        {conditions.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary" mb={2}>
              No conditions set. This rule will execute for all trigger events.
            </Typography>
            <Button
              variant="outlined"
              onClick={addCondition}
              startIcon={<Add />}
            >
              Add First Condition
            </Button>
          </Box>
        ) : (
          <Box>
            {conditions.map((condition, index) => (
              <Box key={condition.id}>
                {index > 0 && (
                  <Box display="flex" alignItems="center" my={2}>
                    <Divider sx={{ flexGrow: 1 }} />
                    <FormControl size="small" sx={{ mx: 2, minWidth: 80 }}>
                      <Select
                        value={condition.logicalOperator || 'AND'}
                        onChange={(e) => updateCondition(index, { 
                          logicalOperator: e.target.value as 'AND' | 'OR' 
                        })}
                        variant="outlined"
                      >
                        <MenuItem value="AND">AND</MenuItem>
                        <MenuItem value="OR">OR</MenuItem>
                      </Select>
                    </FormControl>
                    <Divider sx={{ flexGrow: 1 }} />
                  </Box>
                )}

                <Box 
                  display="flex" 
                  alignItems="flex-start" 
                  gap={2} 
                  p={3} 
                  bgcolor="grey.50" 
                  borderRadius={1}
                  mb={2}
                  border="1px solid"
                  borderColor="grey.300"
                >
                  {/* Field Selection */}
                  <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel>Field</InputLabel>
                    <Select
                      value={condition.field}
                      onChange={(e) => updateCondition(index, { 
                        field: e.target.value,
                        operator: 'equals', // Reset operator when field changes
                        value: '' // Reset value when field changes
                      })}
                      label="Field"
                    >
                      {availableFields.map((field) => (
                        <MenuItem key={field.field} value={field.field}>
                          {field.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Operator Selection */}
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Operator</InputLabel>
                    <Select
                      value={condition.operator}
                      onChange={(e) => updateCondition(index, { 
                        operator: e.target.value as ConditionOperator,
                        value: '' // Reset value when operator changes
                      })}
                      label="Operator"
                    >
                      {getAvailableOperators(getFieldType(condition.field)).map((op) => (
                        <MenuItem key={op.value} value={op.value}>
                          {op.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Value Input */}
                  <Box sx={{ flex: 1 }}>
                    {renderValueInput(condition, index)}
                  </Box>

                  {/* Delete Button */}
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeCondition(index)}
                  >
                    <Delete />
                  </IconButton>
                </Box>

                {/* Show condition preview */}
                <Box sx={{ mb: 2, ml: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Preview: <strong>{availableFields.find(f => f.field === condition.field)?.label}</strong> {' '}
                    {operatorOptions.find(op => op.value === condition.operator)?.label} {' '}
                    {condition.operator !== 'is_empty' && condition.operator !== 'is_not_empty' && (
                      <strong>
                        {Array.isArray(condition.value) 
                          ? condition.value.join(', ') 
                          : condition.value || '(enter value)'}
                      </strong>
                    )}
                  </Typography>
                </Box>
              </Box>
            ))}

            <Button
              variant="outlined"
              onClick={addCondition}
              startIcon={<Add />}
              sx={{ mt: 2 }}
            >
              Add Another Condition
            </Button>
          </Box>
        )}

        {/* Example Conditions */}
        {conditions.length === 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              💡 Example Conditions:
            </Typography>
            <Typography variant="body2" component="div">
              • Patient Age greater than 65<br/>
              • Appointment Department equals "Cardiology"<br/>
              • Blood Pressure Systolic greater than 140<br/>
              • File Name contains "lab"
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};