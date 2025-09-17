import { createContext, useContext } from 'react';
import { ScheduleEntry } from './types';

export interface ScheduleContextType {
  weeklySchedules: Record<string, ScheduleEntry[]>;
  setWeeklySchedules: (schedules: Record<string, ScheduleEntry[]>) => void;
  
  currentRole: string;
  setRole: (role: string) => void;
  addSchedule: (day: string, entry: ScheduleEntry, role?: string) => void;
  updateSchedule: (day: string, updatedEntry: ScheduleEntry, role?: string) => void;
  deleteSchedule: (day: string, id: number, role?: string) => void;
  resetSchedules: (role?: string) => void;
  
  getSchedulesForRole: (role: string) => Record<string, ScheduleEntry[]>;
  getAllRoles: () => string[];
  hasSchedulesForRole: (role: string) => boolean;
  copySchedulesToRole: (fromRole: string, toRole: string) => void;
  roleSchedules: Record<string, Record<string, ScheduleEntry[]>>;
  setSchedulesForRole?: (role: string, schedules: Record<string, ScheduleEntry[]>) => void;
}

export const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useScheduleContext must be used within a ScheduleProvider');
  }
  return context;
};
