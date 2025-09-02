import { WorkflowRule, WorkflowEvent, WorkflowCondition, WorkflowAction, WorkflowExecution } from './types';

export class WorkflowEngine {
  private rules: WorkflowRule[] = [];
  private executions: WorkflowExecution[] = [];
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.loadRulesFromStorage();
    this.loadExecutionsFromStorage();
  }

  addRule(rule: WorkflowRule): void {
    this.rules.push(rule);
    this.sortRulesByPriority();
    this.saveRulesToStorage();
  }

  updateRule(id: string, updates: Partial<WorkflowRule>): void {
    const index = this.rules.findIndex(rule => rule.id === id);
    if (index !== -1) {
      this.rules[index] = { ...this.rules[index], ...updates };
      this.saveRulesToStorage();
    }
  }

  deleteRule(id: string): void {
    this.rules = this.rules.filter(rule => rule.id !== id);
    this.saveRulesToStorage();
  }

  toggleRule(id: string): void {
    const rule = this.rules.find(rule => rule.id === id);
    if (rule) {
      rule.enabled = !rule.enabled;
      this.saveRulesToStorage();
    }
  }

  getRules(): WorkflowRule[] {
    return [...this.rules];
  }

  async processEvent(event: WorkflowEvent): Promise<void> {
    console.log('🔄 Processing workflow event:', event.type, event.data);
    
    const matchingRules = this.findMatchingRules(event);
    
    for (const rule of matchingRules) {
      if (rule.enabled && this.evaluateConditions(rule.conditions, event.data)) {
        const execution = this.createExecution(rule, event);
        this.executions.push(execution);
        
        try {
          await this.executeActions(rule.actions, event.data, execution);
          this.completeExecution(execution, 'completed');
          this.incrementRuleSuccess(rule.id);
        } catch (error) {
          console.error('Error executing workflow rule:', error);
          this.completeExecution(execution, 'failed', String(error));
          this.incrementRuleError(rule.id);
        }
      }
    }
  }

  private evaluateConditions(conditions: WorkflowCondition[], data: any): boolean {
    if (conditions.length === 0) return true;

    let result = this.evaluateCondition(conditions[0], data);
    
    for (let i = 1; i < conditions.length; i++) {
      const condition = conditions[i];
      const conditionResult = this.evaluateCondition(condition, data);
      
      if (condition.logicalOperator === 'OR') {
        result = result || conditionResult;
      } else { 
        result = result && conditionResult;
      }
    }
    
    return result;
  }

  private evaluateCondition(condition: WorkflowCondition, data: any): boolean {
    const fieldValue = this.getNestedValue(data, condition.field);
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'not_equals':
        return fieldValue !== condition.value;
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());
      case 'not_contains':
        return !String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());
      case 'greater_than':
        return Number(fieldValue) > Number(condition.value);
      case 'less_than':
        return Number(fieldValue) < Number(condition.value);
      case 'between':
        if (Array.isArray(condition.value) && condition.value.length === 2) {
          const num = Number(fieldValue);
          return num >= Number(condition.value[0]) && num <= Number(condition.value[1]);
        }
        return false;
      case 'in_list':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue);
      case 'is_empty':
        return !fieldValue || fieldValue === '' || fieldValue === null || fieldValue === undefined;
      case 'is_not_empty':
        return fieldValue && fieldValue !== '' && fieldValue !== null && fieldValue !== undefined;
      default:
        return false;
    }
  }

  private async executeActions(actions: WorkflowAction[], data: any, execution: WorkflowExecution): Promise<void> {
    for (const action of actions) {
      if (action.delay && action.delay > 0) {
        setTimeout(() => this.executeAction(action, data, execution), action.delay * 60000);
      } else {
        await this.executeAction(action, data, execution);
      }
    }
  }

  private async executeAction(action: WorkflowAction, data: any, execution: WorkflowExecution): Promise<void> {
    console.log('🎯 Executing action:', action.type, action.parameters);
    
    try {
      switch (action.type) {
        case 'send_notification':
          await this.executeNotificationAction(action, data);
          break;
        case 'create_task':
          await this.executeTaskAction(action, data);
          break;
        case 'auto_assign_room':
          await this.executeRoomAssignmentAction(action, data);
          break;
        case 'flag_record':
          await this.executeFlagRecordAction(action, data);
          break;
        case 'auto_categorize_file':
          await this.executeCategorizeFileAction(action, data);
          break;
        case 'create_reminder':
          await this.executeReminderAction(action, data);
          break;
        case 'send_email':
          await this.executeEmailAction(action, data);
          break;
        case 'create_alert':
          await this.executeAlertAction(action, data);
          break;
        default:
          console.warn('Unknown action type:', action.type);
      }
      
      execution.actionsExecuted.push(action.id);
    } catch (error) {
      console.error('Error executing action:', action.type, error);
      throw error;
    }
  }

  private async executeNotificationAction(action: WorkflowAction, data: any): Promise<void> {
    const params = action.parameters;
    const message = this.replaceTemplateVariables(params.message, data);
    
    const notification = {
      id: crypto.randomUUID(),
      type: 'workflow_notification',
      title: params.subject || 'Workflow Notification',
      message,
      recipient: params.recipient,
      priority: params.priority || 'medium',
      timestamp: new Date(),
      read: false
    };
    
    this.storeNotification(notification);
  }

  private async executeTaskAction(action: WorkflowAction, data: any): Promise<void> {
    const params = action.parameters;
    const task = {
      id: crypto.randomUUID(),
      title: this.replaceTemplateVariables(params.title, data),
      description: this.replaceTemplateVariables(params.description, data),
      assignee: params.assignee,
      dueDate: this.calculateDueDate(params.dueDate),
      priority: params.priority || 'medium',
      category: params.category || 'workflow',
      status: 'pending',
      createdAt: new Date(),
      createdBy: 'workflow_automation'
    };
    
    this.storeTask(task);
  }

  private async executeRoomAssignmentAction(action: WorkflowAction, data: any): Promise<void> {
    const params = action.parameters;
    
    const availableRoom = this.findAvailableRoom(params.criteria, params.roomType, params.equipment);
    
    if (availableRoom) {
      this.assignRoom(data.appointment?.id || data.patient?.id, availableRoom.id);
      
      if (params.notification) {
        await this.executeNotificationAction({
          id: crypto.randomUUID(),
          type: 'send_notification',
          parameters: {
            message: this.replaceTemplateVariables(params.notification, { ...data, room: availableRoom })
          }
        }, data);
      }
    }
  }

  private async executeFlagRecordAction(action: WorkflowAction, data: any): Promise<void> {
    const params = action.parameters;
    const flag = {
      id: crypto.randomUUID(),
      recordId: data.patient?.id || data.appointment?.id,
      recordType: data.patient ? 'patient' : 'appointment',
      flag: params.flag,
      color: params.color || 'orange',
      message: this.replaceTemplateVariables(params.message, data),
      createdAt: new Date(),
      createdBy: 'workflow_automation'
    };
    
    this.storeFlag(flag);
  }

  private async executeCategorizeFileAction(action: WorkflowAction, data: any): Promise<void> {
    const params = action.parameters;
    if (data.file) {
      this.categorizeFile(data.file.id, params.category, params.move_to_folder);
    }
  }

  private async executeReminderAction(action: WorkflowAction, data: any): Promise<void> {
    const params = action.parameters;
    const reminder = {
      id: crypto.randomUUID(),
      type: params.type,
      title: this.replaceTemplateVariables(params.title || params.message, data),
      message: this.replaceTemplateVariables(params.message, data),
      dueDate: this.calculateDueDate(params.due_date),
      assignee: params.assignee,
      relatedRecordId: data.patient?.id || data.appointment?.id,
      status: 'pending',
      createdAt: new Date()
    };
    
    this.storeReminder(reminder);
  }

  private async executeEmailAction(action: WorkflowAction, data: any): Promise<void> {
    const params = action.parameters;
    const email = {
      to: this.replaceTemplateVariables(params.to, data),
      subject: this.replaceTemplateVariables(params.subject, data),
      body: this.replaceTemplateVariables(params.body, data),
      template: params.template,
      scheduledFor: params.delay ? new Date(Date.now() + params.delay * 60000) : new Date()
    };
    
    this.storeEmailForSending(email);
  }

  private async executeAlertAction(action: WorkflowAction, data: any): Promise<void> {
    const params = action.parameters;
    
    if (typeof window !== 'undefined' && (window as any).workflowEventBus) {
      (window as any).workflowEventBus.emit('create_medical_alert', {
        type: params.alertType || 'workflow_alert',
        severity: params.severity || 'medium',
        message: this.replaceTemplateVariables(params.message, data),
        patientId: data.patient?.id,
        recommendedAction: params.recommendedAction,
        relatedData: data
      });
    }
  }

  private findMatchingRules(event: WorkflowEvent): WorkflowRule[] {
    return this.rules.filter(rule => 
      rule.enabled && rule.trigger.event === event.type
    ).sort((a, b) => b.priority - a.priority);
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private replaceTemplateVariables(template: string, data: any): string {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const value = this.getNestedValue(data, path.trim());
      return value !== undefined ? String(value) : match;
    });
  }

  private calculateDueDate(dueDateStr?: string): Date | undefined {
    if (!dueDateStr) return undefined;
    
    if (dueDateStr.startsWith('+')) {
      const amount = parseInt(dueDateStr.slice(1));
      const unit = dueDateStr.slice(-1);
      const now = new Date();
      
      switch (unit.toLowerCase()) {
        case 'h':
          return new Date(now.getTime() + amount * 60 * 60 * 1000);
        case 'd':
          return new Date(now.getTime() + amount * 24 * 60 * 60 * 1000);
        case 'w':
          return new Date(now.getTime() + amount * 7 * 24 * 60 * 60 * 1000);
        default:
          return new Date(now.getTime() + amount * 60 * 1000); 
      }
    }
    
    return new Date(dueDateStr);
  }

  private createExecution(rule: WorkflowRule, event: WorkflowEvent): WorkflowExecution {
    return {
      id: crypto.randomUUID(),
      ruleId: rule.id,
      eventId: event.id,
      status: 'running',
      startTime: new Date(),
      actionsExecuted: []
    };
  }

  private completeExecution(execution: WorkflowExecution, status: 'completed' | 'failed', error?: string): void {
    execution.status = status;
    execution.endTime = new Date();
    if (error) execution.error = error;
    
    this.saveExecutionsToStorage();
  }

  private incrementRuleSuccess(ruleId: string): void {
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      rule.triggerCount++;
      rule.successCount++;
      rule.lastTriggered = new Date();
      this.saveRulesToStorage();
    }
  }

  private incrementRuleError(ruleId: string): void {
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      rule.triggerCount++;
      rule.errorCount++;
      this.saveRulesToStorage();
    }
  }

  private sortRulesByPriority(): void {
    this.rules.sort((a, b) => b.priority - a.priority);
  }

  private saveRulesToStorage(): void {
    localStorage.setItem('workflow_rules', JSON.stringify(this.rules));
  }

  private loadRulesFromStorage(): void {
    const stored = localStorage.getItem('workflow_rules');
    if (stored) {
      try {
        this.rules = JSON.parse(stored);
      } catch (error) {
        console.error('Error loading workflow rules:', error);
        this.rules = [];
      }
    }
  }

  private saveExecutionsToStorage(): void {
    const recentExecutions = this.executions.slice(-1000);
    localStorage.setItem('workflow_executions', JSON.stringify(recentExecutions));
  }

  private loadExecutionsFromStorage(): void {
    const stored = localStorage.getItem('workflow_executions');
    if (stored) {
      try {
        this.executions = JSON.parse(stored);
      } catch (error) {
        console.error('Error loading workflow executions:', error);
        this.executions = [];
      }
    }
  }

  private storeNotification(notification: any): void {
    const stored = JSON.parse(localStorage.getItem('workflow_notifications') || '[]');
    stored.push(notification);
    localStorage.setItem('workflow_notifications', JSON.stringify(stored));
  }

  private storeTask(task: any): void {
    const stored = JSON.parse(localStorage.getItem('workflow_tasks') || '[]');
    stored.push(task);
    localStorage.setItem('workflow_tasks', JSON.stringify(stored));
  }

  private storeFlag(flag: any): void {
    const stored = JSON.parse(localStorage.getItem('workflow_flags') || '[]');
    stored.push(flag);
    localStorage.setItem('workflow_flags', JSON.stringify(stored));
  }

  private storeReminder(reminder: any): void {
    const stored = JSON.parse(localStorage.getItem('workflow_reminders') || '[]');
    stored.push(reminder);
    localStorage.setItem('workflow_reminders', JSON.stringify(stored));
  }

  private storeEmailForSending(email: any): void {
    const stored = JSON.parse(localStorage.getItem('workflow_emails') || '[]');
    stored.push(email);
    localStorage.setItem('workflow_emails', JSON.stringify(stored));
  }

  private findAvailableRoom(criteria: string, roomType?: string, equipment?: string[]): any {
    return {
      id: 'room_' + Math.floor(Math.random() * 10),
      name: 'Room ' + Math.floor(Math.random() * 10),
      type: roomType || 'general',
      equipment: equipment || []
    };
  }

  private assignRoom(recordId: string, roomId: string): void {
    const assignments = JSON.parse(localStorage.getItem('room_assignments') || '{}');
    assignments[recordId] = roomId;
    localStorage.setItem('room_assignments', JSON.stringify(assignments));
  }

  private categorizeFile(fileId: string, category: string, folder?: string): void {
    console.log('Categorizing file:', fileId, 'as', category, 'in folder', folder);
  }

  public getStats(): any {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const executionsToday = this.executions.filter(e => e.startTime >= today).length;
    const executionsThisWeek = this.executions.filter(e => e.startTime >= thisWeek).length;
    const successfulExecutions = this.executions.filter(e => e.status === 'completed').length;
    const totalExecutions = this.executions.length;

    return {
      totalRules: this.rules.length,
      activeRules: this.rules.filter(r => r.enabled).length,
      executionsToday,
      executionsThisWeek,
      successRate: totalExecutions > 0 ? Math.round((successfulExecutions / totalExecutions) * 100) : 100,
      timeSavedHours: Math.floor(totalExecutions * 0.25),
      topTriggeredRules: this.rules
        .sort((a, b) => (b.triggerCount || 0) - (a.triggerCount || 0))
        .slice(0, 5)
        .map(rule => ({
          ruleId: rule.id,
          ruleName: rule.name,
          triggerCount: rule.triggerCount || 0
        }))
    };
  }

  public simulateRule(rule: WorkflowRule, testData: any) {
    const wouldTrigger = this.evaluateConditions(rule.conditions, testData);
    const matchedConditions = rule.conditions.map(condition => 
      this.evaluateCondition(condition, testData)
    );
    
    return {
      wouldTrigger,
      matchedConditions,
      actionsToExecute: wouldTrigger ? rule.actions : []
    };
  }

  public getExecutions(): WorkflowExecution[] {
    return [...this.executions];
  }
}