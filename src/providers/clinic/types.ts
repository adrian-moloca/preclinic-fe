export interface Clinic {
  id: string;
  name: string;
  description: string;
  logo: string;
  country: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  ownerId: string;
  businessHours: {
    [day: string]: { open: string; close: string; isClosed: boolean };
  };
  departments: string[];
  // settings: ClinicSettings;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'pending';
}

// export interface ClinicSettings {
//   timeZone: string;
//   dateFormat: string;
//   timeFormat: string;
//   currency: string;
//   language: string;
//   theme: string;
//   emailNotifications: boolean;
//   smsNotifications: boolean;
//   appointmentReminders: boolean;
//   marketingEmails: boolean;
//   systemAlerts: boolean;
// }

export interface CreateClinicData {
  name: string;
  description: string;
  logo: string;
  address: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  businessHours: {
    [day: string]: { open: string; close: string; isClosed: boolean };
  };
  // settings: ClinicSettings;
}

export interface ClinicContextType {
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  loading: boolean;
  error: string | null;
  
  createClinic: (clinicData: CreateClinicData) => Promise<Clinic>;
  updateClinic: (id: string, clinicData: Partial<Clinic>) => Promise<Clinic>;
  deleteClinic: (id: string) => Promise<void>;
  selectClinic: (clinicId: string) => void;
  getUserClinics: (userId: string) => Clinic[];
  resetClinics: () => void;
}