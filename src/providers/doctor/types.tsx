export type IDoctor = {
  id: string;
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

  yearsOfExperience: number;
  department: string;
  designation: string;
  medLicenteNumber: string;
  languages: string[];
  about: string;

  appointmentType?: string; 
  appointmentDuration?: number; 
  consultationCharge: number;

  educationalDegrees: string;
  university: string;
  from: string; 
  to: string;   
  workingSchedule?: Record<string, any[]>;
};


export interface IDoctorsContext {
  doctors: IDoctor[];
  setDoctors: React.Dispatch<React.SetStateAction<IDoctor[]>>;
  addDoctor: (entry: IDoctor) => void;
  updateDoctor: (entry: IDoctor) => void;
  deleteDoctor: (id: string) => void;
  resetDoctors: () => void;
}


