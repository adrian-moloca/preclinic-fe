import { IDepartments } from "../departments";

export type AppointmentsEntry = {
  id: string;
  patients: string[];
  patientId: string; 
  appointmentType: string;
  date: string;
  time: string;
  reason: string;
  type: string;
  status: string;
  department: IDepartments;
};

export interface IAppointmentsContext {
  appointments: AppointmentsEntry[];
  setAppointments: React.Dispatch<React.SetStateAction<AppointmentsEntry[]>>;
  addAppointment: (entry: AppointmentsEntry) => void;
  updateAppointment: (entry: AppointmentsEntry) => void;
  deleteAppointment: (id: string) => void;
  resetAppointments: () => void;
}