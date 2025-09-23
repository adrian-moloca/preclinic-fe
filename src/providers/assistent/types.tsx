export type IAssistent = {
  id?: string;
  userId?: string
  clinic?: string;
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
  medLicenseNumber: string;
  languages: string[];
  about: string;

  educationalInformation: {
  educationalDegree: string;
  from: string;
  to: string;
  university: string;
  };

  workingSchedule: [
    {
      day: string;
      schedule: {
        from: string;
        to: string;
        session: string;
      }
    }
  ]
};


export interface IAssistentsContext {
  assistents: IAssistent[];
  setAssistents: React.Dispatch<React.SetStateAction<IAssistent[]>>;
  addAssistent: (entry: IAssistent) => void;
  fetchAssistents: () => void;
  updateAssistent: (entry: IAssistent) => void;
  deleteAssistent: (id: string) => void;
  resetAssistents: () => void;
  loading?: boolean;
  hasLoaded: boolean;
}


