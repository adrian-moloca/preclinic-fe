export type IAssistent = {
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
  medLicenteNumber: string;
  languages: string[];
  about: string;

  educationalDegrees: string;
  university: string;
  from: string; 
  to: string;   
  workingSchedule?: Record<string, any[]>;
};


export interface IAssistentsContext {
  assistents: IAssistent[];
  setAssistents: React.Dispatch<React.SetStateAction<IAssistent[]>>;
  addAssistent: (entry: IAssistent) => void;
  updateAssistent: (entry: IAssistent) => void;
  deleteAssistent: (id: string) => void;
  resetAssistents: () => void;
}


