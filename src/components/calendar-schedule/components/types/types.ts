import React from 'react';

export type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek' | 'resourceTimelineWeek';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  color?: string;
  resourceId?: string;
  backgroundColor?: string;
  extendedProps?: {
    appointmentId?: string;
    patientId?: string;
    doctorId?: string;
    department?: string;
    appointmentType?: string;
    consultationType?: string;
    type?: 'appointment' | 'custom';
    reason?: string;
    conflictsWith?: string[];
  };
}

export interface ConflictGroup {
  timeSlot: string;
  conflictingEvents: CalendarEvent[];
  severity: 'high' | 'medium' | 'low';
}

export interface ViewConfig {
  icon: React.ReactNode;
  label: string;
}

export const APPOINTMENT_TYPE_COLORS = {
  consultation: '#2196F3',
  'follow-up': '#4CAF50',
  emergency: '#F44336',
  routine: '#FF9800',
  procedure: '#9C27B0',
  checkup: '#00BCD4',
  vaccination: '#795548',
  'pre-operative': '#E91E63',
  'post-operative': '#607D8B',
} as const;

export const DOCTOR_COLORS = [
  '#1976D2', '#388E3C', '#F57C00', '#7B1FA2', 
  '#C2185B', '#00796B', '#5D4037', '#455A64'
] as const;

export const DEPARTMENT_COLORS = {
  cardiology: '#E53935',
  neurology: '#8E24AA',
  orthopedics: '#FB8C00',
  pediatrics: '#43A047',
  dermatology: '#00ACC1',
  general: '#3949AB',
  emergency: '#D32F2F',
  surgery: '#6A1B9A',
} as const;