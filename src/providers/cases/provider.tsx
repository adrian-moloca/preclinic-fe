import React, { useState, useEffect, ReactNode } from "react";
import { Case, CreateCaseData, UpdateCaseData, CasesContextType, Service } from "./types";
import { CasesContext } from "./context";

interface CasesProviderProps {
  children: ReactNode;
}

const LOCAL_STORAGE_KEY = "cases";

export const CasesProvider: React.FC<CasesProviderProps> = ({ children }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data - used only if localStorage is empty


  // Load cases from localStorage on mount
  useEffect(() => {
    setLoading(true);
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setCases(JSON.parse(stored));
      } else {
        setCases(mockCases);
      }
    } catch (err) {
      setError("Failed to load cases from localStorage");
    } finally {
      setLoading(false);
    }
  }, []);

  // Save cases to localStorage whenever cases change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cases));
  }, [cases]);

  const getCases = React.useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setCases(JSON.parse(stored));
      } else {
        setCases(mockCases);
      }
    } catch (err) {
      setError('Failed to fetch cases');
    } finally {
      setLoading(false);
    }
  }, []);

  const getCaseById = (id: string): Case | undefined => {
    return cases.find(case_ => case_.id === id);
  };

  const getCasesByPatientId = (patientId: string): Case[] => {
    return cases.filter(case_ => case_.patientId === patientId);
  };

  const getCasesByAppointmentId = (appointmentId: string): Case | undefined => {
    return cases.find(case_ => case_.appointmentId === appointmentId);
  };

  const createCase = async (caseData: CreateCaseData): Promise<Case> => {
    try {
      setLoading(true);
      setError(null);

      const newCase: Case = {
        id: `case-${Date.now()}`,
        ...caseData,
        patientId: caseData.patientId || "", // Make sure patientId is passed in caseData
        doctorId: "", // This should come from the current user context
        status: "completed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalAmount: calculateCaseTotal(caseData.services)
      };

      setCases(prev => [...prev, newCase]);
      return newCase;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create case';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateCase = async (id: string, caseData: UpdateCaseData): Promise<Case> => {
    try {
      setLoading(true);
      setError(null);

      const existingCase = cases.find(case_ => case_.id === id);
      if (!existingCase) {
        throw new Error('Case not found');
      }

      const updatedCase: Case = {
        ...existingCase,
        ...caseData,
        updatedAt: new Date().toISOString(),
        totalAmount: caseData.services ? calculateCaseTotal(caseData.services) : existingCase.totalAmount
      };

      setCases(prev => prev.map(case_ => case_.id === id ? updatedCase : case_));
      return updatedCase;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update case';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteCase = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setCases(prev => prev.filter(case_ => case_.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete case';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculateCaseTotal = (services: Service[]): number => {
    return services.reduce((total, service) => total + service.price, 0);
  };

  const getDraftCases = (): Case[] => {
    return cases.filter(case_ => case_.status === 'draft');
  };

  const getCompletedCases = (): Case[] => {
    return cases.filter(case_ => case_.status === 'completed');
  };

  const getCasesRequiringFollowUp = (): Case[] => {
    return cases.filter(case_ => case_.status === 'follow_up_required' || case_.followUpRequired);
  };

  const contextValue: CasesContextType = {
    cases,
    loading,
    error,
    getCases,
    getCaseById,
    getCasesByPatientId,
    getCasesByAppointmentId,
    createCase,
    updateCase,
    deleteCase,
    calculateCaseTotal,
    getDraftCases,
    getCompletedCases,
    getCasesRequiringFollowUp
  };

  return (
    <CasesContext.Provider value={contextValue}>
      {children}
    </CasesContext.Provider>
  );
};

export default CasesProvider;