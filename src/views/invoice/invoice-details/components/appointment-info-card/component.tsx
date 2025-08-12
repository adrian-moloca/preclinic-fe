import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';

interface AppointmentInfoCardProps {
    appointmentInfo: any;
    formatDate: (date: string) => string;
}

export const AppointmentInfoCard: React.FC<AppointmentInfoCardProps> = ({
    appointmentInfo,
    formatDate
}) => {
    return (
        <Card sx={{ boxShadow: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarToday color="primary" />
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        Related Appointment
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid>
                        <Typography variant="caption" color="text.secondary">
                            Appointment Type
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
                            {appointmentInfo.appointmentType}
                        </Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="caption" color="text.secondary">
                            Date
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
                            {formatDate(appointmentInfo.date)}
                        </Typography>
                    </Grid>
                    {appointmentInfo.reason && (
                        <Grid>
                            <Typography variant="caption" color="text.secondary">
                                Reason
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
                                {appointmentInfo.reason}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );
};