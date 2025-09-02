import { createContext, useContext } from 'react';
import { WorkflowAutomationContextType } from './types';

export const WorkflowAutomationContext = createContext<WorkflowAutomationContextType | undefined>(undefined);

export const useWorkflowAutomation = (): WorkflowAutomationContextType => {
  const context = useContext(WorkflowAutomationContext);
  if (!context) {
    throw new Error('useWorkflowAutomation must be used within a WorkflowAutomationProvider');
  }
  return context;
};