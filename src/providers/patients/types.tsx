export type PatientsEntry = {
  _id: string;
  profileImg: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  birthDate: string;
  gender: string;
  bloodGroup: string;
  country: string;
  state: string;
  city: string;
  address: string;
  zipCode: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
};

export interface IPatientsContext {
  patients: PatientsEntry[];
  setPatients: React.Dispatch<React.SetStateAction<PatientsEntry[]>>;
  addPatient: (entry: PatientsEntry) => void;
  updatePatient: (entry: PatientsEntry) => void;
  deletePatient: (id: string) => void;
  resetPatients: () => void;
}


