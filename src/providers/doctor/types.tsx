export type IDoctor = {
  id?: string;
  userId?: string;
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

  yearsOfExperience: string;
  department: string;
  designation: string;
  medLicenseNumber: string;
  languages: string[];
  about: string;

  appointmentType?: string;
  appointmentDuration?: number;
  consultationCharge: number;
  workingSchedule: { day: string; schedule: { from: string; to: string; session: string; } }[];

educationalInformation: {
  educationalDegree: string;
  from: string;
  to: string;
  university: string;
}[];
};


export interface IDoctorsContext {
  doctors: IDoctor[];
  setDoctors: React.Dispatch<React.SetStateAction<IDoctor[]>>;
  addDoctor: (entry: IDoctor) => void;
  updateDoctor: (entry: IDoctor) => void;
  deleteDoctor: (id: string) => void;
  resetDoctors: () => void;
  fetchDoctors: () => void;
  loading: boolean;
  hasLoaded: boolean;
}


