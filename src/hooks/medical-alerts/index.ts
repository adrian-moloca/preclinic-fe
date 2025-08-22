import { useCallback } from 'react';
import { useMedicalDecisionSupport } from '../../providers/medical-decision-support/context';
import { usePatientsContext } from '../../providers/patients';

interface PatientMedicalData {
  patientId: string;
  medications?: string[];
  allergies?: string[];
  vitalSigns?: {
    bloodPressure?: { systolic: number; diastolic: number };
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
  };
  age?: number;
  weight?: number;
  lastVisit?: Date;
  diagnosis?: string;
}

export const useMedicalAlerts = () => {
  const {
    checkDrugInteractions,
    checkAllergies,
    validateVitalSigns,
    checkDosageAppropriate,
    checkFollowUpDue,
    getAlertsForPatient,
    getCriticalAlerts,
    clearAlertsForPatient
  } = useMedicalDecisionSupport();
  
  const { patients } = usePatientsContext();

  const performMedicalCheck = useCallback((data: PatientMedicalData) => {
    const { patientId, medications = [], allergies = [], vitalSigns, age, weight, lastVisit, diagnosis } = data;

    clearAlertsForPatient(patientId);

    const newAlerts = [];

    if (medications.length > 1) {
      const drugInteractionAlerts = checkDrugInteractions(medications, patientId);
      newAlerts.push(...drugInteractionAlerts);
    }

    if (medications.length > 0 && allergies.length > 0) {
      const allergyAlerts = checkAllergies(medications, allergies, patientId);
      newAlerts.push(...allergyAlerts);
    }

    if (vitalSigns && age !== undefined) {
      const vitalSignsAlerts = validateVitalSigns(vitalSigns, age, patientId);
      newAlerts.push(...vitalSignsAlerts);
    }

    if (medications.length > 0 && age !== undefined) {
      medications.forEach(medication => {
        const dosage = "standard"; 
        const dosageAlerts = checkDosageAppropriate(medication, dosage, age, weight, patientId);
        newAlerts.push(...dosageAlerts);
      });
    }

    if (lastVisit) {
      const followUpAlerts = checkFollowUpDue(patientId, lastVisit, diagnosis);
      newAlerts.push(...followUpAlerts);
    }

    return newAlerts;
  }, [checkDrugInteractions, checkAllergies, validateVitalSigns, checkDosageAppropriate, checkFollowUpDue, clearAlertsForPatient]);

  const checkPrescriptionSafety = useCallback((patientId: string, medications: string[]) => {
    const patient = Array.isArray(patients) 
      ? patients.find((p: any) => p.id === patientId)
      : patients && typeof patients === 'object' && patients[patientId];

    if (!patient) return [];

    const allergies = patient.allergies ? patient.allergies.split(',').map((a: string) => a.trim()) : [];
    
    const alerts = [];

    if (medications.length > 1) {
      alerts.push(...checkDrugInteractions(medications, patientId));
    }

    if (allergies.length > 0) {
      alerts.push(...checkAllergies(medications, allergies, patientId));
    }

    return alerts;
  }, [patients, checkDrugInteractions, checkAllergies]);

  const checkVitalSignsSafety = useCallback((patientId: string, vitalSigns: any) => {
    const patient = Array.isArray(patients) 
      ? patients.find((p: any) => p.id === patientId)
      : patients && typeof patients === 'object' && patients[patientId];

    if (!patient) return [];

    const age = patient.birthDate 
      ? new Date().getFullYear() - new Date(patient.birthDate).getFullYear()
      : 30;

    return validateVitalSigns(vitalSigns, age, patientId);
  }, [patients, validateVitalSigns]);

  return {
    performMedicalCheck,
    checkPrescriptionSafety,
    checkVitalSignsSafety,
    getAlertsForPatient,
    getCriticalAlerts
  };
};