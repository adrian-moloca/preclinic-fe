import React, { useState } from 'react';
import {
  Paper, Typography, Box, IconButton, Button, List, ListItem, ListItemText, Chip
} from '@mui/material';
import {
  ChevronLeft, ChevronRight, Today as TodayIcon
} from '@mui/icons-material';
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isSameDay, isToday, addMonths, subMonths 
} from 'date-fns';
import { CalendarEvent } from '../types/types';

interface MiniCalendarWidgetProps {
  selectedDate: string;
  onDateSelect: (date: Date) => void;
  events: CalendarEvent[];
  conflicts: boolean;
}

export const MiniCalendarWidget: React.FC<MiniCalendarWidgetProps> = ({
  selectedDate,
  onDateSelect,
  events,
  conflicts
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedInternalDate, setSelectedInternalDate] = useState(new Date(selectedDate));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.start.startsWith(dateStr));
  };

  const getConflictsForDate = (date: Date): CalendarEvent[] => {
    const dayEvents = getEventsForDate(date);
    return dayEvents.filter(event => 
      event.extendedProps?.conflictsWith && 
      event.extendedProps.conflictsWith.length > 0
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedInternalDate(date);
    onDateSelect(date);
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    handleDateClick(today);
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          Quick Navigation
        </Typography>
        <Button size="small" onClick={handleToday} startIcon={<TodayIcon />}>
          Today
        </Button>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <IconButton size="small" onClick={handlePrevMonth}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={600}>
          {format(currentMonth, 'MMMM yyyy')}
        </Typography>
        <IconButton size="small" onClick={handleNextMonth}>
          <ChevronRight />
        </IconButton>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={0.5} mb={1}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <Box key={index} textAlign="center" py={0.5}>
            <Typography variant="caption" fontWeight={600} color="text.secondary">
              {day}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={0.5}>
        {calendarDays.map((date) => {
          const dayEvents = getEventsForDate(date);
          const dayConflicts = getConflictsForDate(date);
          const hasEvents = dayEvents.length > 0;
          const hasConflicts = conflicts && dayConflicts.length > 0;
          const isSelected = isSameDay(date, selectedInternalDate);
          const isCurrentMonth = isSameMonth(date, currentMonth);

          return (
            <Box
              key={format(date, 'yyyy-MM-dd')}
              onClick={() => handleDateClick(date)}
              sx={{
                minHeight: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: 1,
                position: 'relative',
                bgcolor: isSelected ? 'primary.main' : 'transparent',
                color: isSelected ? 'primary.contrastText' : 
                       !isCurrentMonth ? 'text.disabled' :
                       isToday(date) ? 'primary.main' : 'text.primary',
                fontWeight: isToday(date) ? 600 : 400,
                border: isToday(date) && !isSelected ? 1 : 0,
                borderColor: 'primary.main',
                '&:hover': {
                  bgcolor: isSelected ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              <Typography variant="caption">{format(date, 'd')}</Typography>
              {hasEvents && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: hasConflicts ? 'error.main' : 'success.main',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>

      <Box mt={2}>
        <Typography variant="subtitle2" gutterBottom>
          Events for {format(selectedInternalDate, 'MMM d, yyyy')}
        </Typography>
        
        {getEventsForDate(selectedInternalDate).length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            No events scheduled
          </Typography>
        ) : (
          <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
            {getEventsForDate(selectedInternalDate).slice(0, 3).map((event, index) => (
              <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: event.color || 'primary.main',
                    mr: 1,
                    flexShrink: 0,
                  }}
                />
                <ListItemText
                  primary={event.title}
                  secondary={format(new Date(event.start), 'HH:mm')}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
                {event.extendedProps?.conflictsWith && event.extendedProps.conflictsWith.length > 0 && (
                  <Chip 
                    label="Conflict" 
                    size="small" 
                    color="error" 
                    variant="outlined"
                    sx={{ ml: 1, height: 20, fontSize: '0.6rem' }}
                  />
                )}
              </ListItem>
            ))}
            
            {getEventsForDate(selectedInternalDate).length > 3 && (
              <ListItem sx={{ px: 0 }}>
                <Typography variant="caption" color="text.secondary">
                  +{getEventsForDate(selectedInternalDate).length - 3} more events
                </Typography>
              </ListItem>
            )}
          </List>
        )}
      </Box>
    </Paper>
  );
};