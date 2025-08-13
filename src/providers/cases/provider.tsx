import { Case, CreateCaseData, UpdateCaseData, CasesContextType, Service } from "./types";
import { CasesContext } from "./context";
import React, { ReactNode, useEffect, useState } from "react";

interface CasesProviderProps {
  children: ReactNode;
}

const LOCAL_STORAGE_KEY = "cases";

export const MOCK_CASES: Case[] = [
  {
    id: 'case1',
    appointmentId: 'a1',
    patientId: '1',
    doctorId: 'd1',
    services: [
      {
        id: 's1',
        name: 'Cardiology Consultation',
        description: 'Specialist consultation for heart and vascular conditions.',
        price: 200,
        category: 'Cardiology'
      }
    ],
    prescriptions: [
      {
        id: 'pr1',
        medication: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '30 days',
        instructions: 'Take after meals'
      }
    ],
    diagnosis: 'Type 2 Diabetes',
    treatmentPlan: 'Continue Metformin, monitor blood sugar, regular exercise.',
    notes: 'Patient is responding well to medication.',
    vitalSigns: {
      bloodPressure: '130/85',
      heartRate: '78',
      temperature: '36.7',
      weight: '82',
      height: '175'
    },
    symptoms: ['Fatigue', 'Increased thirst'],
    followUpRequired: true,
    followUpDate: '2025-09-15',
    status: 'completed',
    createdAt: '2025-08-13T09:00:00.000Z',
    updatedAt: '2025-08-13T09:00:00.000Z',
    totalAmount: 200
  },
  {
    id: 'case2',
    appointmentId: 'a2',
    patientId: '2',
    doctorId: 'd2',
    services: [
      {
        id: 's2',
        name: 'Pediatric Checkup',
        description: 'Routine health check for children.',
        price: 150,
        category: 'Pediatrics'
      }
    ],
    prescriptions: [
      {
        id: 'pr2',
        medication: 'Albuterol',
        dosage: '2 puffs',
        frequency: 'As needed',
        duration: '30 days',
        instructions: 'Use inhaler during asthma attacks'
      }
    ],
    diagnosis: 'Asthma',
    treatmentPlan: 'Continue Albuterol, avoid triggers, regular follow-up.',
    notes: 'No recent asthma attacks reported.',
    vitalSigns: {
      bloodPressure: '110/70',
      heartRate: '90',
      temperature: '36.5',
      weight: '40',
      height: '145'
    },
    symptoms: ['Cough', 'Shortness of breath'],
    followUpRequired: false,
    followUpDate: '',
    status: 'completed',
    createdAt: '2025-08-13T10:00:00.000Z',
    updatedAt: '2025-08-13T10:00:00.000Z',
    totalAmount: 150
  },
  {
    id: 'case3',
    appointmentId: 'a3',
    patientId: '3',
    doctorId: 'd3',
    services: [
      {
        id: 's3',
        name: 'Dermatology Skin Exam',
        description: 'Comprehensive skin examination and advice.',
        price: 180,
        category: 'Dermatology'
      }
    ],
    prescriptions: [
      {
        id: 'pr3',
        medication: 'Hydrocortisone Cream',
        dosage: 'Apply thin layer',
        frequency: 'Twice daily',
        duration: '14 days',
        instructions: 'Apply to affected area'
      }
    ],
    diagnosis: 'Contact Dermatitis',
    treatmentPlan: 'Use Hydrocortisone Cream, avoid irritants.',
    notes: 'Skin condition improving.',
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: '75',
      temperature: '36.6',
      weight: '76',
      height: '180'
    },
    symptoms: ['Itching', 'Redness'],
    followUpRequired: false,
    followUpDate: '',
    status: 'completed',
    createdAt: '2025-08-13T11:00:00.000Z',
    updatedAt: '2025-08-13T11:00:00.000Z',
    totalAmount: 180
  }
];

export const CasesProvider: React.FC<CasesProviderProps> = ({ children }) => {
  const [cases, setCases] = useState<Case[]>(MOCK_CASES);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load cases from localStorage on mount
  useEffect(() => {
    setLoading(true);
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Always include mock cases
        const merged = [
          ...MOCK_CASES,
          ...parsed.filter((c: Case) => !MOCK_CASES.some(mc => mc.id === c.id))
        ];
        setCases(merged);
      } else {
        setCases(MOCK_CASES);
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
        const parsed = JSON.parse(stored);
        // Always include mock cases
        const merged = [
          ...MOCK_CASES,
          ...parsed.filter((c: Case) => !MOCK_CASES.some(mc => mc.id === c.id))
        ];
        setCases(merged);
      } else {
        setCases(MOCK_CASES);
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
        patientId: caseData.patientId || "",
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
      // Prevent deleting mock cases
      if (MOCK_CASES.some(mc => mc.id === id)) {
        console.warn("❌ Cannot delete mock case:", id);
        return;
      }
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