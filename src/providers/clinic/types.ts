export interface Clinic {
  _id: string;
  name: string;
  description: string;
  logo: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  ownerId: string;
  businessHours: {
    [day: string]: { open: string; close: string; isClosed: boolean };
  };
  departments: string[];
  settings: ClinicSettings;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface ClinicSettings {
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  language: string;
  theme: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  marketingEmails: boolean;
  systemAlerts: boolean;
}

export interface CreateClinicData {
  name: string;
  description?: string;
  logo?: string;
  address: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  businessHours?: {
    [day: string]: { open: string; close: string; isClosed: boolean };
  };
  settings?: ClinicSettings;
}

export const defaultClinicSettings: ClinicSettings = {
  timeZone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  currency: 'USD',
  language: 'en',
  theme: 'light',
  emailNotifications: true,
  smsNotifications: false,
  appointmentReminders: true,
  marketingEmails: false,
  systemAlerts: true,
};

export const defaultBusinessHours = {
  monday: { open: '09:00', close: '17:00', isClosed: false },
  tuesday: { open: '09:00', close: '17:00', isClosed: false },
  wednesday: { open: '09:00', close: '17:00', isClosed: false },
  thursday: { open: '09:00', close: '17:00', isClosed: false },
  friday: { open: '09:00', close: '17:00', isClosed: false },
  saturday: { open: '09:00', close: '13:00', isClosed: false },
  sunday: { open: '09:00', close: '13:00', isClosed: true },
};

export interface ClinicContextType {
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  loading: boolean;
  error: string | null;
  
  createClinic: (clinicData: CreateClinicData) => Promise<Clinic>;
  updateClinic: (id: string, clinicData: Partial<Clinic>) => Promise<Clinic>;
  getClinicByOwnerId: (ownerId: string) => Clinic | null;
  deleteClinic: (id: string) => Promise<void>;
  getMyClinic: () => Promise<Clinic | null>;
  selectClinic: (clinicId: string) => void;
  setSelectedClinic?: (clinic: any) => void;
  getUserClinics: (userId: string) => Clinic[];
  resetClinics: () => void;
}