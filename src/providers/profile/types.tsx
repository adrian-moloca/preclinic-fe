export interface Profile {
  id: string;
  image: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  country: string;
  state: string;
  city: string;
}

export interface ProfileContextType {
  profiles: Record<string, Profile>;
  addProfile: (patient: Profile) => void;
  updateProfile: (id: string, updatedData: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  resetProfiles: () => void;
  setProfiles: React.Dispatch<React.SetStateAction<Record<string, Profile>>>;
}