export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number; 
  
  trigger: {
    event: WorkflowTriggerEvent;
    timing: 'immediate' | 'delayed';
    delay?: number; 
  };
  
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  
  createdBy: string;
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
  successCount: number;
  errorCount: number;
}

export type WorkflowTriggerEvent = 
  | 'appointment_created'
  | 'appointment_completed'
  | 'appointment_cancelled'
  | 'patient_registered'
  | 'patient_checked_in'
  | 'prescription_added'
  | 'prescription_completed'
  | 'file_uploaded'
  | 'vital_signs_entered'
  | 'payment_received'
  | 'lab_results_uploaded'
  | 'medical_alert_created';

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: string | number | string[] | boolean;
  logicalOperator?: 'AND' | 'OR';
}

export type ConditionOperator = 
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'greater_than'
  | 'less_than'
  | 'between'
  | 'in_list'
  | 'is_empty'
  | 'is_not_empty';

export interface WorkflowAction {
  id: string;
  type: WorkflowActionType;
  parameters: Record<string, any>;
  delay?: number; 
}

export type WorkflowActionType = 
  | 'send_notification'
  | 'create_task'
  | 'update_field'
  | 'auto_assign_room'
  | 'create_reminder'
  | 'flag_record'
  | 'auto_categorize_file'
  | 'schedule_followup'
  | 'send_email'
  | 'create_alert';

export interface WorkflowEvent {
  id: string;
  type: WorkflowTriggerEvent;
  data: any;
  timestamp: Date;
  source: string; 
}

export interface WorkflowExecution {
  id: string;
  ruleId: string;
  eventId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  error?: string;
  actionsExecuted: string[];
}

export interface WorkflowStats {
  totalRules: number;
  activeRules: number;
  executionsToday: number;
  executionsThisWeek: number;
  successRate: number;
  timeSavedHours: number;
  topTriggeredRules: Array<{
    ruleId: string;
    ruleName: string;
    triggerCount: number;
  }>;
}

export interface NotificationAction {
  recipient: 'patient' | 'doctor' | 'nurse' | 'admin' | string;
  method: 'email' | 'sms' | 'app_notification' | 'system_alert';
  subject?: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface TaskAction {
  title: string;
  description: string;
  assignee: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface RoomAssignmentAction {
  criteria: string;
  roomType?: string;
  equipment?: string[];
  notification?: string;
}

export interface WorkflowAutomationContextType {
  rules: WorkflowRule[];
  executions: WorkflowExecution[];
  stats: WorkflowStats;
  
  createRule: (rule: Omit<WorkflowRule, 'id' | 'createdAt' | 'triggerCount' | 'successCount' | 'errorCount'>) => void;
  updateRule: (id: string, updates: Partial<WorkflowRule>) => void;
  deleteRule: (id: string) => void;
  toggleRule: (id: string) => void;
  
  emitEvent: (event: Omit<WorkflowEvent, 'id' | 'timestamp'>) => void;
  
  getStatsForPeriod: (startDate: Date, endDate: Date) => WorkflowStats;
  getRulePerformance: (ruleId: string) => {
    triggerCount: number;
    successRate: number;
    averageExecutionTime: number;
  };
  
  simulateRule: (rule: WorkflowRule, testData: any) => {
    wouldTrigger: boolean;
    matchedConditions: boolean[];
    actionsToExecute: WorkflowAction[];
  };
}