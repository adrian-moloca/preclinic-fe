export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
}

export interface PrescriptionItem {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface VitalSigns {
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  height: string;
}

export interface Case {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  services: Service[];
  prescriptions: PrescriptionItem[];
  diagnosis: string;
  treatmentPlan: string;
  notes: string;
  vitalSigns: VitalSigns;
  symptoms: string[];
  followUpRequired: boolean;
  followUpDate: string;
  status: 'draft' | 'completed' | 'follow_up_required';
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
}

export interface CreateCaseData {
  appointmentId: string;
  patientId: string;
  services: Service[];
  prescriptions: PrescriptionItem[];
  diagnosis: string;
  treatmentPlan: string;
  notes: string;
  vitalSigns: VitalSigns;
  symptoms: string[];
  followUpRequired: boolean;
  followUpDate: string;
}

export interface UpdateCaseData extends Partial<CreateCaseData> {
  id: string;
}

export interface CasesContextType {
  cases: Case[];
  loading: boolean;
  error: string | null;
  
  getCases: () => Promise<void>;
  getCaseById: (id: string) => Case | undefined;
  getCasesByPatientId: (patientId: string) => Case[];
  getCasesByAppointmentId: (appointmentId: string) => Case | undefined;
  createCase: (caseData: CreateCaseData) => Promise<Case>;
  updateCase: (id: string, caseData: UpdateCaseData) => Promise<Case>;
  deleteCase: (id: string) => Promise<void>;
  
  calculateCaseTotal: (services: Service[]) => number;
  getDraftCases: () => Case[];
  getCompletedCases: () => Case[];
  getCasesRequiringFollowUp: () => Case[];
}