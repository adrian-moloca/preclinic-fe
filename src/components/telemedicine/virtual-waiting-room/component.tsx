import React, { FC, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Videocam,
  Phone,
  Person,
  Schedule,
  Check,
  Settings,
  Refresh,
} from '@mui/icons-material';
import { useTelemedicineContext } from '../../../providers/telemedicine';
import { useAppointmentsContext } from '../../../providers/appointments';
import { usePatientsContext } from '../../../providers/patients';
import { format, differenceInMinutes } from 'date-fns';

interface WaitingRoomProps {
  appointmentId: string;
  onJoinCall: () => void;
}

export const WaitingRoom: FC<WaitingRoomProps> = ({ appointmentId, onJoinCall }) => {
  const { startCall, isInitializingCall } = useTelemedicineContext();
  const { appointments } = useAppointmentsContext();
  const { patients } = usePatientsContext();
  
  const [connectionTest, setConnectionTest] = useState<'testing' | 'good' | 'poor' | 'failed'>('testing');
  const [deviceAccess, setDeviceAccess] = useState<'checking' | 'granted' | 'denied'>('checking');
  const [currentTime, setCurrentTime] = useState(new Date());

  const appointment = appointments.find(apt => apt.id === appointmentId);
  const patient = appointment ? patients.find(p => p._id === appointment.patientId) : null;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    testDeviceAccess();
    testConnection();
  }, []);

  const testDeviceAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setDeviceAccess('granted');
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      setDeviceAccess('denied');
    }
  };

  const testConnection = async () => {
    try {
      const start = Date.now();
      await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' });
      const duration = Date.now() - start;
      
      if (duration < 100) {
        setConnectionTest('good');
      } else if (duration < 500) {
        setConnectionTest('poor');
      } else {
        setConnectionTest('failed');
      }
    } catch (error) {
      setConnectionTest('failed');
    }
  };

  const handleStartCall = async () => {
    if (deviceAccess === 'granted') {
      await startCall(appointmentId);
      onJoinCall();
    } else {
      alert('Please allow camera and microphone access to start the video call.');
    }
  };

  const getConnectionStatus = () => {
    switch (connectionTest) {
      case 'testing':
        return { label: 'Testing...', color: 'info' as const, progress: true };
      case 'good':
        return { label: 'Excellent', color: 'success' as const, progress: false };
      case 'poor':
        return { label: 'Fair', color: 'warning' as const, progress: false };
      case 'failed':
        return { label: 'Poor', color: 'error' as const, progress: false };
    }
  };

  const getDeviceStatus = () => {
    switch (deviceAccess) {
      case 'checking':
        return { label: 'Checking...', color: 'info' as const, icon: <Settings /> };
      case 'granted':
        return { label: 'Ready', color: 'success' as const, icon: <Check /> };
      case 'denied':
        return { label: 'Access Denied', color: 'error' as const, icon: <Settings /> };
    }
  };

  const connectionStatus = getConnectionStatus();
  const deviceStatus = getDeviceStatus();
  
  const appointmentTime = appointment ? new Date(`${appointment.date}T${appointment.time}`) : new Date();
  const minutesUntilAppointment = differenceInMinutes(appointmentTime, currentTime);
  const isAppointmentTime = minutesUntilAppointment <= 5 && minutesUntilAppointment >= -15;

  if (!appointment || !patient) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Appointment not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        sx={{
          maxWidth: 600,
          width: '100%',
          p: 4,
          borderRadius: 3,
          textAlign: 'center',
        }}
      >
        <Box mb={3}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Virtual Consultation
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Prepare for your telemedicine appointment
          </Typography>
        </Box>

        <Paper
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: '#f8f9fa',
            borderRadius: 2,
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <Avatar
              src={patient.profileImg}
              sx={{ width: 60, height: 60, mr: 2 }}
            >
              <Person />
            </Avatar>
            <Box textAlign="left">
              <Typography variant="h6" fontWeight="bold">
                {patient.firstName} {patient.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {appointment.reason}
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" justifyContent="center" gap={2}>
            <Chip
              icon={<Schedule />}
              label={format(appointmentTime, 'MMM dd, yyyy • HH:mm')}
              variant="outlined"
            />
            {minutesUntilAppointment > 0 && (
              <Chip
                label={`Starts in ${minutesUntilAppointment} minutes`}
                color="info"
              />
            )}
            {isAppointmentTime && (
              <Chip
                label="Ready to start"
                color="success"
              />
            )}
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            System Check
          </Typography>
          
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: connectionStatus.color === 'success' ? '#4caf50' : '#ff9800' }}>
                  {connectionStatus.progress ? <Settings /> : <Check />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Internet Connection"
                secondary={connectionStatus.label}
              />
              {connectionStatus.progress && (
                <Box sx={{ width: 100, ml: 2 }}>
                  <LinearProgress />
                </Box>
              )}
              <Tooltip title="Test again">
                <IconButton onClick={testConnection}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </ListItem>
            
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ 
                  bgcolor: deviceStatus.color === 'success' ? '#4caf50' : 
                           deviceStatus.color === 'error' ? '#f44336' : '#ff9800' 
                }}>
                  {deviceStatus.icon}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Camera & Microphone"
                secondary={deviceStatus.label}
              />
              {deviceAccess === 'denied' && (
                <Button
                  size="small"
                  onClick={testDeviceAccess}
                  variant="outlined"
                >
                  Retry
                </Button>
              )}
            </ListItem>
          </List>
        </Paper>

        <Paper
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: '#e3f2fd',
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Before we start:
          </Typography>
          <Box textAlign="left">
            <Typography variant="body2" gutterBottom>
              • Find a quiet, well-lit space
            </Typography>
            <Typography variant="body2" gutterBottom>
              • Have your ID and insurance card ready
            </Typography>
            <Typography variant="body2" gutterBottom>
              • Prepare any questions you want to discuss
            </Typography>
            <Typography variant="body2" gutterBottom>
              • Test your camera and microphone above
            </Typography>
          </Box>
        </Paper>

        <Box>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartCall}
            disabled={
              !isAppointmentTime || 
              deviceAccess !== 'granted' || 
              isInitializingCall ||
              connectionTest === 'failed'
            }
            startIcon={<Videocam />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 2,
              mb: 2,
            }}
          >
            {isInitializingCall ? 'Starting Call...' : 'Start Video Call'}
          </Button>

          {!isAppointmentTime && minutesUntilAppointment > 0 && (
            <Typography variant="body2" color="text.secondary">
              The call will be available 5 minutes before your appointment time
            </Typography>
          )}

          {deviceAccess === 'denied' && (
            <Typography variant="body2" color="error">
              Please allow camera and microphone access to continue
            </Typography>
          )}

          {connectionTest === 'failed' && (
            <Typography variant="body2" color="error">
              Connection test failed. Please check your internet connection.
            </Typography>
          )}
        </Box>

        <Box mt={3} pt={2} borderTop="1px solid #eee">
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Having technical issues?
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Phone />}
            href={`tel:${patient.phoneNumber}`}
          >
            Call Instead
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};