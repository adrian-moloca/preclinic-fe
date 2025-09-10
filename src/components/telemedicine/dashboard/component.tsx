import React, { FC, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Tooltip,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  VideoCall,
  Schedule,
  History,
  Person,
} from '@mui/icons-material';
import { useTelemedicineContext } from '../../../providers/telemedicine';
import { useAppointmentsContext } from '../../../providers/appointments';
import { usePatientsContext } from '../../../providers/patients';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { VideoCall as VideoCallComponent } from '../video-call/component';
import WaitingRoom from '../virtual-waiting-room';

export const TelemedicineDashboard: FC = () => {
  const { 
    currentCall, 
    callHistory, 
    isInitializingCall 
  } = useTelemedicineContext();
  const { appointments } = useAppointmentsContext();
  const { patients } = usePatientsContext();

  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [showWaitingRoom, setShowWaitingRoom] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);

  const onlineAppointments = appointments.filter(apt => 
    apt.appointmentType?.toLowerCase() === 'online'
  );

  const todayAppointments = onlineAppointments.filter(apt => 
    isToday(new Date(apt.date))
  );

  const upcomingAppointments = onlineAppointments.filter(apt => 
    !isPast(new Date(apt.date)) && !isToday(new Date(apt.date))
  );

  const recentCalls = callHistory
    .filter(call => call.status === 'ended')
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 5);

  const handleStartCall = async (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
    setShowWaitingRoom(true);
  };

  const handleJoinCall = () => {
    setShowWaitingRoom(false);
    setShowVideoCall(true);
  };

  const handleEndCall = () => {
    setShowVideoCall(false);
    setSelectedAppointment(null);
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };

  const getAppointmentStatus = (appointment: any) => {
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const now = new Date();
    const diffMinutes = Math.floor((appointmentDateTime.getTime() - now.getTime()) / (1000 * 60));

    if (diffMinutes <= -15) return { label: 'Missed', color: 'error' as const };
    if (diffMinutes <= 5 && diffMinutes >= -5) return { label: 'Ready', color: 'success' as const };
    if (diffMinutes > 5) return { label: 'Scheduled', color: 'info' as const };
    return { label: 'In Progress', color: 'warning' as const };
  };

  if (showVideoCall && selectedAppointment) {
    return (
      <VideoCallComponent 
        appointmentId={selectedAppointment}
        onEndCall={handleEndCall}
      />
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Telemedicine Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your virtual consultations and video calls
          </Typography>
        </Box>
        
        {currentCall && (
          <Chip
            icon={<VideoCall />}
            label="Call in Progress"
            color="success"
            variant="outlined"
          />
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Schedule sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Today's Video Calls</Typography>
              </Box>
              
              {todayAppointments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No video calls scheduled for today
                </Typography>
              ) : (
                <List>
                  {todayAppointments.map((appointment) => {
                    const patient = patients.find(p => p.id === appointment.patientId);
                    const status = getAppointmentStatus(appointment);
                    
                    return (
                      <ListItem
                        key={appointment.id}
                        sx={{
                          border: '1px solid #eee',
                          borderRadius: 2,
                          mb: 1,
                          backgroundColor: status.color === 'success' ? '#e8f5e8' : 'inherit',
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar src={patient?.profileImg}>
                            <Person />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={getPatientName(appointment.patientId)}
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block">
                                {format(new Date(`${appointment.date}T${appointment.time}`), 'HH:mm')} • {appointment.reason}
                              </Typography>
                              <Chip
                                label={status.label}
                                size="small"
                                color={status.color}
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          }
                        />
                        <Box>
                          {status.label === 'Ready' && (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleStartCall(appointment.id)}
                              disabled={isInitializingCall}
                              startIcon={<VideoCall />}
                            >
                              Start Call
                            </Button>
                          )}
                          {status.label === 'Scheduled' && (
                            <Tooltip title="Not ready yet">
                              <Button
                                variant="outlined"
                                size="small"
                                disabled
                                startIcon={<Schedule />}
                              >
                                Waiting
                              </Button>
                            </Tooltip>
                          )}
                        </Box>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <History sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Recent Calls</Typography>
              </Box>
              
              {recentCalls.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No recent calls
                </Typography>
              ) : (
                <List>
                  {recentCalls.map((call) => {
                    const duration = call.endTime 
                      ? Math.floor((new Date(call.endTime).getTime() - new Date(call.startTime).getTime()) / (1000 * 60))
                      : 0;
                    
                    return (
                      <ListItem
                        key={call.id}
                        sx={{
                          border: '1px solid #eee',
                          borderRadius: 2,
                          mb: 1,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <Person />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={getPatientName(call.patientId)}
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block">
                                {format(new Date(call.startTime), 'MMM dd, HH:mm')}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Duration: {duration} minutes
                              </Typography>
                              {call.recordingUrl && (
                                <Chip
                                  label="Recorded"
                                  size="small"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Video Consultations
              </Typography>
              
              {upcomingAppointments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No upcoming video consultations
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {upcomingAppointments.slice(0, 6).map((appointment) => {
                    const patient = patients.find(p => p.id === appointment.patientId);
                    const appointmentDate = new Date(appointment.date);
                    
                    return (
                      <Grid key={appointment.id}>
                        <Paper
                          sx={{
                            p: 2,
                            border: '1px solid #eee',
                            '&:hover': {
                              boxShadow: 3,
                            },
                          }}
                        >
                          <Box display="flex" alignItems="center" mb={1}>
                            <Avatar
                              src={patient?.profileImg}
                              sx={{ width: 32, height: 32, mr: 1 }}
                            >
                              <Person />
                            </Avatar>
                            <Typography variant="subtitle2">
                              {getPatientName(appointment.patientId)}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" gutterBottom>
                            {appointment.reason}
                          </Typography>
                          
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" color="text.secondary">
                              {isTomorrow(appointmentDate) 
                                ? 'Tomorrow' 
                                : format(appointmentDate, 'MMM dd')} 
                              • {appointment.time}
                            </Typography>
                            <Chip
                              label="Video"
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={showWaitingRoom}
        onClose={() => setShowWaitingRoom(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedAppointment && (
            <WaitingRoom
              appointmentId={selectedAppointment}
              onJoinCall={handleJoinCall}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};