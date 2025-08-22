import { createContext, useContext } from 'react';
import { MedicalDecisionSupportContextType } from './types';

export const MedicalDecisionSupportContext = createContext<MedicalDecisionSupportContextType | undefined>(undefined);

export const useMedicalDecisionSupport = (): MedicalDecisionSupportContextType => {
  const context = useContext(MedicalDecisionSupportContext);
  if (!context) {
    throw new Error('useMedicalDecisionSupport must be used within a MedicalDecisionSupportProvider');
  }
  return context;
};