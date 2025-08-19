import React, { FC } from 'react';
import {
  Box,
  Chip,
  Typography,
} from '@mui/material';
import {
  Today as TodayIcon,
  EventAvailable as UpcomingIcon,
  Warning as UrgentIcon,
  Person as NewPatientsIcon,
  Medication as PrescriptionsIcon,
} from '@mui/icons-material';
import { QuickFilter } from '../types';
import { isToday, isThisWeek, parseISO, isYesterday } from 'date-fns';

interface QuickFiltersProps {
  onFilterClick: (filter: QuickFilter) => void;
  appointmentsCount?: number;
  patientsCount?: number;
  prescriptionsCount?: number;
}

export const QuickFilters: FC<QuickFiltersProps> = ({
  onFilterClick,
  appointmentsCount = 0,
  patientsCount = 0,
  prescriptionsCount = 0,
}) => {
  const quickFilters: QuickFilter[] = [
    {
      id: 'today-appointments',
      label: "Today's Appointments",
      type: 'appointment',
      icon: <TodayIcon />,
      filter: (appointments) =>
        appointments.filter((apt: any) => isToday(parseISO(apt.date))),
      count: appointmentsCount,
    },
    {
      id: 'upcoming-appointments',
      label: 'This Week',
      type: 'appointment',
      icon: <UpcomingIcon />,
      filter: (appointments) =>
        appointments.filter((apt: any) => isThisWeek(parseISO(apt.date))),
    },
    {
      id: 'urgent-appointments',
      label: 'Urgent Cases',
      type: 'appointment',
      icon: <UrgentIcon />,
      filter: (appointments) =>
        appointments.filter((apt: any) =>
          apt.type?.toLowerCase() === 'emergency' ||
          apt.reason?.toLowerCase().includes('urgent')
        ),
    },
    {
      id: 'recent-patients',
      label: 'Recent Patients',
      type: 'patient',
      icon: <NewPatientsIcon />,
      filter: (patients) =>
        patients.filter((patient: any) => {
          return true;
        }).slice(0, 10),
      count: patientsCount,
    },
    {
      id: 'recent-prescriptions',
      label: 'Recent Prescriptions',
      type: 'prescription',
      icon: <PrescriptionsIcon />,
      filter: (prescriptions) =>
        prescriptions.filter((prescription: any) =>
          isToday(parseISO(prescription.dateIssued)) ||
          isYesterday(parseISO(prescription.dateIssued))
        ),
      count: prescriptionsCount,
    },
  ];

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1}>
        Quick Filters
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {quickFilters.map((filter) => (
          <Chip
            key={filter.id}
            icon={React.isValidElement(filter.icon) ? filter.icon : undefined}
            label={
              <Box display="flex" alignItems="center" gap={0.5}>
                {filter.label}
                {typeof filter.count === 'number' && (
                  <Typography variant="caption" fontWeight={600}>
                    ({filter.count})
                  </Typography>
                )}
              </Box>
            }
            onClick={() => onFilterClick(filter)}
            variant="outlined"
            sx={{
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};