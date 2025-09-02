import { WorkflowRule } from './types';

export const sampleWorkflowRules: WorkflowRule[] = [
  {
    id: 'rule-001',
    name: 'High-Risk Patient Alert',
    description: 'Automatically flag patients over 65 with high blood pressure',
    enabled: true,
    priority: 8,
    trigger: {
      event: 'vital_signs_entered',
      timing: 'immediate'
    },
    conditions: [
      {
        id: 'cond-001',
        field: 'patient.age',
        operator: 'greater_than',
        value: 65
      },
      {
        id: 'cond-002',
        field: 'vitals.blood_pressure_systolic',
        operator: 'greater_than',
        value: 140,
        logicalOperator: 'AND'
      }
    ],
    actions: [
      {
        id: 'action-001',
        type: 'flag_record',
        parameters: {
          flag: 'HIGH_RISK',
          color: 'red',
          message: 'High-risk patient: Age {{patient.age}}, BP {{vitals.blood_pressure_systolic}}/{{vitals.blood_pressure_diastolic}}'
        }
      },
      {
        id: 'action-002',
        type: 'send_notification',
        parameters: {
          recipient: 'doctor',
          method: 'app_notification',
          message: 'High-risk patient {{patient.name}} requires immediate attention',
          priority: 'high'
        }
      }
    ],
    createdBy: 'admin',
    createdAt: new Date('2024-01-15'),
    triggerCount: 12,
    successCount: 12,
    errorCount: 0,
    lastTriggered: new Date('2024-01-20')
  },
  {
    id: 'rule-002',
    name: 'Cardiology Room Assignment',
    description: 'Auto-assign cardiology room for heart-related appointments',
    enabled: true,
    priority: 6,
    trigger: {
      event: 'patient_checked_in',
      timing: 'immediate'
    },
    conditions: [
      {
        id: 'cond-003',
        field: 'appointment.department',
        operator: 'equals',
        value: 'Cardiology'
      }
    ],
    actions: [
      {
        id: 'action-003',
        type: 'auto_assign_room',
        parameters: {
          criteria: 'has_ecg_equipment',
          roomType: 'cardiology',
          notification: 'Cardiology room {{room.name}} assigned with ECG equipment'
        }
      }
    ],
    createdBy: 'admin',
    createdAt: new Date('2024-01-10'),
    triggerCount: 8,
    successCount: 7,
    errorCount: 1,
    lastTriggered: new Date('2024-01-19')
  },
  {
    id: 'rule-003',
    name: 'Lab Results Follow-up',
    description: 'Create follow-up task when lab results are uploaded',
    enabled: true,
    priority: 5,
    trigger: {
      event: 'file_uploaded',
      timing: 'immediate'
    },
    conditions: [
      {
        id: 'cond-004',
        field: 'file.name',
        operator: 'contains',
        value: 'lab'
      }
    ],
    actions: [
      {
        id: 'action-004',
        type: 'auto_categorize_file',
        parameters: {
          category: 'lab_results',
          move_to_folder: 'Lab Reports/{{patient.name}}/{{current_year}}'
        }
      },
      {
        id: 'action-005',
        type: 'create_task',
        parameters: {
          title: 'Review lab results for {{patient.name}}',
          description: 'Lab results uploaded: {{file.name}}',
          assignee: '{{patient.primary_doctor}}',
          dueDate: '+24h',
          priority: 'medium'
        }
      }
    ],
    createdBy: 'admin',
    createdAt: new Date('2024-01-08'),
    triggerCount: 15,
    successCount: 14,
    errorCount: 1,
    lastTriggered: new Date('2024-01-21')
  }
];