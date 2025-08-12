export type ScheduleEntry = {
  id: number;
  session: string;
  from: string;
  to: string;
};

export interface IScheduleContext {
  weeklySchedules: Record<string, ScheduleEntry[]>;
  setWeeklySchedules: (schedules: Record<string, ScheduleEntry[]>) => void;
  addSchedule: (day: string, entry: ScheduleEntry) => void;
  updateSchedule: (day: string, entry: ScheduleEntry) => void;
  deleteSchedule: (day: string, id: number) => void;
  resetSchedules: () => void;
  currentRole: string;
  setRole: (role: string) => void;
  getSchedulesForRole: (role: string) => Record<string, ScheduleEntry[]>;
  getAllRoles: () => string[];
  hasSchedulesForRole: (role: string) => boolean;
  copySchedulesToRole: (fromRole: string, toRole: string) => void;
  roleSchedules: Record<string, Record<string, ScheduleEntry[]>>;
}
