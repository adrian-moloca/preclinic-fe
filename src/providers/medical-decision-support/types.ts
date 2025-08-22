export interface MedicalAlert {
  id: string;
  type: 'drug_interaction' | 'allergy_warning' | 'vital_signs_alert' | 'follow_up_due' | 'dosage_warning' | 'contraindication';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  patientId: string;
  recommendedAction?: string;
  relatedData?: {
    medications?: string[];
    allergies?: string[];
    vitalSigns?: VitalSignsReading;
    age?: number;
  };
  timestamp: Date;
  dismissed?: boolean;
  acknowledgedBy?: string;
}

export interface DrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  description: string;
  clinicalEffect: string;
  recommendation: string;
}

export interface DrugInfo {
  id: string;
  name: string;
  genericName?: string;
  category: string;
  commonAllergies: string[];
  contraindications: string[];
  ageRestrictions?: {
    minAge?: number;
    maxAge?: number;
    pediatricDosing?: string;
    geriatricConsiderations?: string;
  };
  normalDosage: {
    adult: string;
    pediatric?: string;
    elderly?: string;
  };
  interactions: string[];
}

export interface VitalSignsReading {
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
}

export interface VitalSignsRange {
  parameter: string;
  ageGroup: 'infant' | 'child' | 'adult' | 'elderly';
  normal: {
    min: number;
    max: number;
  };
  warning: {
    min: number;
    max: number;
  };
  critical: {
    min: number;
    max: number;
  };
  unit: string;
}

export interface MedicalDecisionSupportContextType {
  alerts: MedicalAlert[];
  checkDrugInteractions: (medications: string[], patientId: string) => MedicalAlert[];
  checkAllergies: (medications: string[], allergies: string[], patientId: string) => MedicalAlert[];
  validateVitalSigns: (vitalSigns: VitalSignsReading, age: number, patientId: string) => MedicalAlert[];
  checkDosageAppropriate: (medication: string, dosage: string, age: number, weight?: number, patientId?: string) => MedicalAlert[];
  checkFollowUpDue: (patientId: string, lastVisit: Date, diagnosis?: string) => MedicalAlert[];
  dismissAlert: (alertId: string) => void;
  acknowledgeAlert: (alertId: string, userId: string) => void;
  clearAlertsForPatient: (patientId: string) => void;
  getAlertsForPatient: (patientId: string) => MedicalAlert[];
  getCriticalAlerts: () => MedicalAlert[];
}