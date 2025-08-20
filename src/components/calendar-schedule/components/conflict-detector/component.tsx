import React, { useMemo } from 'react';
import {
    Paper, Typography, Box, Alert, Chip, Button,
    Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText
} from '@mui/material';
import {
    Warning as WarningIcon,
    ExpandMore as ExpandMoreIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { CalendarEvent, ConflictGroup } from '../types/types';

interface ConflictDetectorProps {
    events: CalendarEvent[];
    onConflictSelect: (eventId: string) => void;
}

export const ConflictDetector: React.FC<ConflictDetectorProps> = ({
    events,
    onConflictSelect
}) => {
    const conflicts = useMemo((): ConflictGroup[] => {
        const appointmentEvents = events.filter(e => e.extendedProps?.type === 'appointment');
        const conflictGroups: ConflictGroup[] = [];

        appointmentEvents.forEach((event1, index) => {
            const conflictingEvents = [event1];
            const start1 = parseISO(event1.start);
            const end1 = event1.end ? parseISO(event1.end) : new Date(start1.getTime() + 30 * 60000);

            appointmentEvents.slice(index + 1).forEach(event2 => {
                const start2 = parseISO(event2.start);
                const end2 = event2.end ? parseISO(event2.end) : new Date(start2.getTime() + 30 * 60000);

                const hasTimeOverlap = isWithinInterval(start1, { start: start2, end: end2 }) ||
                    isWithinInterval(start2, { start: start1, end: end1 }) ||
                    (start1 <= start2 && end1 >= end2) ||
                    (start2 <= start1 && end2 >= end1);

                const hasSameDoctor = event1.resourceId && event1.resourceId === event2.resourceId;

                if (hasTimeOverlap && (hasSameDoctor || event1.resourceId === 'unassigned' || event2.resourceId === 'unassigned')) {
                    conflictingEvents.push(event2);
                }
            });

            if (conflictingEvents.length > 1) {
                const timeSlot = `${format(start1, 'MMM d, HH:mm')} - ${format(end1, 'HH:mm')}`;

                let severity: 'high' | 'medium' | 'low' = 'low';
                if (conflictingEvents.length >= 3) severity = 'high';
                else if (conflictingEvents.length === 2) severity = 'medium';

                const existingGroup = conflictGroups.find(group =>
                    group.conflictingEvents.some(e => conflictingEvents.includes(e))
                );

                if (!existingGroup) {
                    conflictGroups.push({
                        timeSlot,
                        conflictingEvents,
                        severity
                    });
                }
            }
        });

        return conflictGroups;
    }, [events]);

    const getSeverityColor = (severity: string): 'error' | 'warning' | 'info' | 'default' => {
        switch (severity) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'default';
        }
    };

    const getSeverityIcon = (severity: string): string => {
        switch (severity) {
            case 'high': return '🚨';
            case 'medium': return '⚠️';
            case 'low': return 'ℹ️';
            default: return '📅';
        }
    };

    if (conflicts.length === 0) {
        return (
            <Paper sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <ScheduleIcon color="success" />
                    <Typography variant="h6" color="success.main">
                        No Conflicts
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    All appointments are properly scheduled without conflicts.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
                <WarningIcon color="error" />
                <Typography variant="h6" color="error.main">
                    Scheduling Conflicts
                </Typography>
                <Chip label={conflicts.length} color="error" size="small" />
            </Box>

            <Alert severity="warning" sx={{ mb: 2 }}>
                {conflicts.length} scheduling conflict{conflicts.length > 1 ? 's' : ''} detected.
            </Alert>

            <Box>
                {conflicts.map((conflict, index) => (
                    <Accordion key={index} sx={{ mb: 1 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box display="flex" alignItems="center" gap={1} width="100%">
                                <Typography variant="body2">
                                    {getSeverityIcon(conflict.severity)}
                                </Typography>
                                <Box flex={1}>
                                    <Typography variant="subtitle2">
                                        {conflict.timeSlot}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {conflict.conflictingEvents.length} appointments overlap
                                    </Typography>
                                </Box>
                                <Chip
                                    label={conflict.severity.toUpperCase()}
                                    color={getSeverityColor(conflict.severity)}
                                    size="small"
                                    variant="outlined"
                                />
                            </Box>
                        </AccordionSummary>

                        <AccordionDetails>
                            <List dense>
                                {conflict.conflictingEvents.map((event, eventIndex) => (
                                    <ListItem
                                        key={eventIndex}
                                        sx={{
                                            px: 0,
                                            bgcolor: 'error.light',
                                            borderRadius: 1,
                                            mb: 0.5,
                                            border: 1,
                                            borderColor: 'error.main',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => onConflictSelect(event.id)}
                                    >
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
                                            secondary={
                                                <Box>
                                                    <Typography variant="caption" display="block">
                                                        {format(parseISO(event.start), 'HH:mm')} - {' '}
                                                        {event.end ? format(parseISO(event.end), 'HH:mm') : 'End time not set'}
                                                    </Typography>
                                                    {event.extendedProps?.consultationType && (
                                                        <Chip
                                                            label={event.extendedProps.consultationType}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ mt: 0.5, height: 16, fontSize: '0.6rem' }}
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                                        />
                                    </ListItem>
                                ))}
                            </List>

                            <Box mt={2}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    fullWidth
                                    onClick={() => onConflictSelect(conflict.conflictingEvents[0].id)}
                                >
                                    View in Calendar
                                </Button>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Paper>
    );
};