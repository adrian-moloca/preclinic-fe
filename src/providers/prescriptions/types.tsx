export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id?: string;
  patientId: string;
  dateIssued: string;
  diagnosis: string;
  notes?: string;
  medications: Medication[];
}

export interface PrescriptionsContextType {
  prescription: Record<string, Prescription>;
  addPrescription: (prescription: Prescription) => void;
  updatePrescription: (id: string, updatedData: Partial<Prescription>) => void;
  deletePrescription: (id: string) => void;
  resetPrescription: () => void;
  setPrescription: React.Dispatch<React.SetStateAction<Record<string, Prescription>>>;
  fetchPrescriptions: (force?: boolean) => Promise<void>;
  loading: boolean;
  hasLoaded: boolean;
}