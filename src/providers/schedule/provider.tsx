import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { ScheduleContext } from './context';
import { ScheduleEntry } from './types';

const LOCAL_STORAGE_KEY = 'roleBasedSchedules';

export const ScheduleProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [roleSchedules, setRoleSchedules] = useState<Record<string, Record<string, ScheduleEntry[]>>>({});
  const [currentRole, setCurrentRole] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setRoleSchedules(JSON.parse(stored));
      } catch {
        console.warn('Failed to parse role-based schedules from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(roleSchedules));
  }, [roleSchedules]);

  const weeklySchedules = roleSchedules[currentRole] || {};

  const setRole = useCallback((role: string) => {
    setCurrentRole(role);
    if (!roleSchedules[role]) {
      setRoleSchedules(prev => ({
        ...prev,
        [role]: {}
      }));
    }
  }, [roleSchedules]);

  const addSchedule = useCallback((day: string, entry: ScheduleEntry, role?: string) => {
    const targetRole = role || currentRole;
    if (!targetRole) {
      console.warn('No role specified for adding schedule');
      return;
    }

    setRoleSchedules((prev) => ({
      ...prev,
      [targetRole]: {
        ...prev[targetRole],
        [day]: [...(prev[targetRole]?.[day] || []), entry],
      },
    }));
  }, [currentRole]);

  const updateSchedule = useCallback((day: string, updatedEntry: ScheduleEntry, role?: string) => {
    const targetRole = role || currentRole;
    if (!targetRole) {
      console.warn('No role specified for updating schedule');
      return;
    }


    setRoleSchedules((prev) => {
      const newState = {
        ...prev,
        [targetRole]: {
          ...prev[targetRole],
          [day]: prev[targetRole]?.[day]?.map((entry) =>
            entry.id === updatedEntry.id ? updatedEntry : entry
          ) || [updatedEntry],
        },
      };
      
      return newState;
    });
  }, [currentRole]);

  const deleteSchedule = useCallback((day: string, id: number, role?: string) => {
    const targetRole = role || currentRole;
    if (!targetRole) {
      console.warn('No role specified for deleting schedule');
      return;
    }

    setRoleSchedules((prev) => ({
      ...prev,
      [targetRole]: {
        ...prev[targetRole],
        [day]: prev[targetRole]?.[day]?.filter((entry) => entry.id !== id) || [],
      },
    }));
  }, [currentRole]);

  const resetSchedules = useCallback((role?: string) => {
    if (role) {
      setRoleSchedules((prev) => {
        const updated = { ...prev };
        delete updated[role];
        return updated;
      });
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setRoleSchedules({});
    }
  }, []);

  const getSchedulesForRole = useCallback((role: string) => {
    return roleSchedules[role] || {};
  }, [roleSchedules]);

  const getAllRoles = useCallback(() => {
    return Object.keys(roleSchedules);
  }, [roleSchedules]);

  const hasSchedulesForRole = useCallback((role: string) => {
    const roleData = roleSchedules[role];
    if (!roleData) return false;
    
    return Object.values(roleData).some(daySchedules => 
      Array.isArray(daySchedules) && daySchedules.length > 0
    );
  }, [roleSchedules]);

  const copySchedulesToRole = useCallback((fromRole: string, toRole: string) => {
    const sourceSchedules = roleSchedules[fromRole];
    if (!sourceSchedules) {
      console.warn(`No schedules found for role: ${fromRole}`);
      return;
    }

    setRoleSchedules((prev) => ({
      ...prev,
      [toRole]: { ...sourceSchedules },
    }));
  }, [roleSchedules]);

  return (
    <ScheduleContext.Provider
      value={{
        weeklySchedules,
        setWeeklySchedules: (schedules: Record<string, ScheduleEntry[]>) => {
          if (currentRole) {
            setRoleSchedules(prev => ({
              ...prev,
              [currentRole]: schedules
            }));
          }
        },
        
        currentRole,
        setRole,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        resetSchedules,
        
        getSchedulesForRole,
        getAllRoles,
        hasSchedulesForRole,
        copySchedulesToRole,
        roleSchedules, 
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
