import { IDepartments } from "../departments";

export interface AppointmentsEntry {
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
  doctorId?: string;
  duration?: number;
}

export interface IAppointmentsContext {
  appointments: AppointmentsEntry[];
  addAppointment: (appointment: AppointmentsEntry) => void;
  updateAppointment: (appointment: AppointmentsEntry) => void;
  deleteAppointment: (id: string) => void;
  getAppointmentById: (id: string) => AppointmentsEntry | undefined;
}