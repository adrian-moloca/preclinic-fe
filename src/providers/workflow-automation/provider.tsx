import React, { useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { WorkflowAutomationContext } from './context';
import { WorkflowRule, WorkflowEvent, WorkflowExecution, WorkflowStats } from './types';
import { WorkflowEngine } from './engine';
import { useAuthContext } from '../auth/context';

interface WorkflowAutomationProviderProps {
  children: ReactNode;
}

let workflowEngineInstance: WorkflowEngine | null = null;

export const WorkflowAutomationProvider: React.FC<WorkflowAutomationProviderProps> = ({ children }) => {
  const { user } = useAuthContext();
  const [rules, setRules] = useState<WorkflowRule[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [stats, setStats] = useState<WorkflowStats>({
    totalRules: 0,
    activeRules: 0,
    executionsToday: 0,
    executionsThisWeek: 0,
    successRate: 100,
    timeSavedHours: 0,
    topTriggeredRules: []
  });

  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      if (!workflowEngineInstance) {
        workflowEngineInstance = new WorkflowEngine();
        
        if (typeof window !== 'undefined') {
          (window as any).workflowEventBus = {
            emit: (eventType: string, data: any) => {
              emitEvent({ type: eventType as any, data, source: 'global' });
            }
          };
        }
      }
      
      updateLocalState();
      isInitialized.current = true;
    }

// eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateLocalState = useCallback(() => {
    if (workflowEngineInstance && isInitialized.current) {
      const currentRules = workflowEngineInstance.getRules();
      const currentExecutions = workflowEngineInstance.getExecutions();
      const currentStats = workflowEngineInstance.getStats();
      
      setRules(currentRules);
      setExecutions(currentExecutions);
      setStats(currentStats);
    }
  }, []);

  const createRule = useCallback((ruleData: Omit<WorkflowRule, 'id' | 'createdAt' | 'triggerCount' | 'successCount' | 'errorCount'>) => {
    if (!workflowEngineInstance || !user) return;

    const newRule: WorkflowRule = {
      ...ruleData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      triggerCount: 0,
      successCount: 0,
      errorCount: 0,
      createdBy: user.id
    };

    workflowEngineInstance.addRule(newRule);
    
    setRules(workflowEngineInstance.getRules());
    setStats(workflowEngineInstance.getStats());
  }, [user]);

  const updateRule = useCallback((id: string, updates: Partial<WorkflowRule>) => {
    if (!workflowEngineInstance) return;

    workflowEngineInstance.updateRule(id, updates);
    
    setRules(workflowEngineInstance.getRules());
    setStats(workflowEngineInstance.getStats());
  }, []);

  const deleteRule = useCallback((id: string) => {
    if (!workflowEngineInstance) return;

    workflowEngineInstance.deleteRule(id);
    
    setRules(workflowEngineInstance.getRules());
    setStats(workflowEngineInstance.getStats());
  }, []);

  const toggleRule = useCallback((id: string) => {
    if (!workflowEngineInstance) return;

    workflowEngineInstance.toggleRule(id);
    
    setRules(workflowEngineInstance.getRules());
    setStats(workflowEngineInstance.getStats());
  }, []);

  const emitEvent = useCallback(async (eventData: Omit<WorkflowEvent, 'id' | 'timestamp'>) => {
    if (!workflowEngineInstance) return;

    const event: WorkflowEvent = {
      ...eventData,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };

    console.log('🚀 Emitting workflow event:', event.type, event.data);

    try {
      await workflowEngineInstance.processEvent(event);
      
      setExecutions(workflowEngineInstance.getExecutions());
      setStats(workflowEngineInstance.getStats());
    } catch (error) {
      console.error('Error processing workflow event:', error);
    }
  }, []);

  const getStatsForPeriod = useCallback((startDate: Date, endDate: Date): WorkflowStats => {
    const filteredExecutions = executions.filter(e => 
      e.startTime >= startDate && e.startTime <= endDate
    );

    const successful = filteredExecutions.filter(e => e.status === 'completed').length;
    const total = filteredExecutions.length;

    return {
      ...stats,
      executionsToday: filteredExecutions.filter(e => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return e.startTime >= today;
      }).length,
      successRate: total > 0 ? (successful / total) * 100 : 100,
      timeSavedHours: Math.floor(total * 0.25)
    };
  }, [executions, stats]);

  const getRulePerformance = useCallback((ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    const ruleExecutions = executions.filter(e => e.ruleId === ruleId);
    
    const successful = ruleExecutions.filter(e => e.status === 'completed').length;
    const totalTime = ruleExecutions
      .filter(e => e.endTime)
      .reduce((total, e) => total + (e.endTime!.getTime() - e.startTime.getTime()), 0);

    return {
      triggerCount: rule?.triggerCount || 0,
      successRate: ruleExecutions.length > 0 ? (successful / ruleExecutions.length) * 100 : 100,
      averageExecutionTime: ruleExecutions.length > 0 ? totalTime / ruleExecutions.length : 0
    };
  }, [rules, executions]);

  const simulateRule = useCallback((rule: WorkflowRule, testData: any) => {
    if (!workflowEngineInstance) {
      return {
        wouldTrigger: false,
        matchedConditions: [],
        actionsToExecute: []
      };
    }

    return workflowEngineInstance.simulateRule(rule, testData);
  }, []);

  const value = React.useMemo(() => ({
    rules,
    executions,
    stats,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
    emitEvent,
    getStatsForPeriod,
    getRulePerformance,
    simulateRule
  }), [
    rules,
    executions,
    stats,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
    emitEvent,
    getStatsForPeriod,
    getRulePerformance,
    simulateRule
  ]);

  return (
    <WorkflowAutomationContext.Provider value={value}>
      {children}
    </WorkflowAutomationContext.Provider>
  );
};

export default WorkflowAutomationProvider;