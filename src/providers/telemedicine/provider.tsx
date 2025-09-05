import React, { FC, ReactNode, useState, useEffect, useRef, useCallback } from 'react';
import { TelemedicineContext } from './context';
import { CallSession, ChatMessage } from './types';
import { useAuthContext } from '../auth/context';

const STORAGE_KEY = 'telemedicine_sessions';

export const TelemedicineProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();

  const [currentCall, setCurrentCall] = useState<CallSession | null>(null);
  const [callHistory, setCallHistory] = useState<CallSession[]>([]);
  const [isInitializingCall, setIsInitializingCall] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<{ [participantId: string]: MediaStream }>({});

  const peerConnections = useRef<{ [participantId: string]: RTCPeerConnection }>({});
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const isScreenSharing = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedHistory = JSON.parse(stored);
        if (Array.isArray(parsedHistory)) {
          setCallHistory(parsedHistory);
        }
      }
    } catch (error) {
      console.error('Failed to load call history:', error);
      setCallHistory([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(callHistory));
    } catch (error) {
      console.error('Failed to save call history:', error);
    }
  }, [callHistory]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      
      setTimeout(() => {
        if (localStream) {
          localStream.getTracks().forEach(track => track.stop());
        }
        
        Object.values(remoteStreams).forEach(stream => {
          stream.getTracks().forEach(track => track.stop());
        });
        
        Object.values(peerConnections.current).forEach(pc => {
          pc.close();
        });
        
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
          mediaRecorder.current.stop();
        }
      }, 1000);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('🔄 Call state changed:', {
      hasCurrentCall: !!currentCall,
      callId: currentCall?.id,
      callStatus: currentCall?.status,
      hasLocalStream: !!localStream,
      isInitializing: isInitializingCall
    });
  }, [currentCall, localStream, isInitializingCall]);

  const getAppointmentDirectly = useCallback((appointmentId: string) => {
    try {
      const storedAppointments = localStorage.getItem('appointments');
      if (storedAppointments) {
        const parsed = JSON.parse(storedAppointments);
        
        let appointmentsList: any[] = [];
        
        if (Array.isArray(parsed)) {
          appointmentsList = parsed;
        } else if (parsed && typeof parsed === 'object') {
          const values = Object.values(parsed);
          if (values.length > 0 && Array.isArray(values[0])) {
            appointmentsList = values[0] as any[];
          } else {
            appointmentsList = Object.values(parsed).filter(item => 
              item && typeof item === 'object' && 'id' in item
            ) as any[];
          }
        }
        
        const foundAppointment = appointmentsList.find(apt => 
          String(apt.id) === String(appointmentId)
        );
        
        if (foundAppointment) {
          return foundAppointment;
        }
      }
    } catch (error) {
      console.error('Error reading appointments from localStorage:', error);
    }
    
    return {
      id: appointmentId,
      patientId: 'test-patient-1',
      doctorId: user?.id || 'test-doctor-1',
      appointmentType: 'online',
      type: 'consultation',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      reason: 'Online consultation',
      status: 'scheduled',
      department: { id: 'general', name: 'General Medicine' }
    };
  }, [user]);

  const startCall = useCallback(async (appointmentId: string): Promise<void> => {
    if (!user || isInitializingCall) {
      return;
    }

    setIsInitializingCall(true);
    
    try {
      const appointment = getAppointmentDirectly(appointmentId);
      
      if (!appointment) {
        throw new Error(`Appointment with ID ${appointmentId} not found. Please ensure the appointment exists.`);
      }

      if (appointment.appointmentType?.toLowerCase() !== 'online') {
        throw new Error(`This appointment is configured as "${appointment.appointmentType}" type. Only "online" appointments support video calls.`);
      }

      const callSession: CallSession = {
        id: crypto.randomUUID(),
        appointmentId: String(appointment.id),
        patientId: String(appointment.patientId),
        doctorId: String(appointment.doctorId || user.id),
        startTime: new Date().toISOString(),
        status: 'active', 
        participants: [
          {
            id: user.id,
            name: user.role === 'doctor' 
              ? `Dr. ${user.firstName || ''} ${user.lastName || ''}`.trim()
              : `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            role: (user.role as 'doctor' | 'patient' | 'assistant') || 'assistant',
            isVideoEnabled: true,
            isAudioEnabled: true,
          },
        ],
        chatMessages: [],
      };

      setCurrentCall(callSession);

      let stream: MediaStream;
      try {
        
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('getUserMedia is not supported in this browser');
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideo = devices.some(d => d.kind === 'videoinput');
        const hasAudio = devices.some(d => d.kind === 'audioinput');

        console.log('🔍 Device check:', { hasVideo, hasAudio });

        const constraints = {
          video: hasVideo ? { 
            width: { ideal: 1280 }, 
            height: { ideal: 720 },
            facingMode: 'user'
          } : false,
          audio: hasAudio ? {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          } : false,
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);

      } catch (mediaError) {
        console.error('❌ Failed to get user media:', mediaError);
        
        const failedCall = { ...callSession, status: 'failed' as const };
        setCurrentCall(failedCall);
        
        let errorMessage = 'Unable to access camera and microphone.';
        
        if (mediaError instanceof Error) {
          if (mediaError.name === 'NotAllowedError') {
            errorMessage = 'Camera/microphone access denied. Please allow permissions and try again.';
          } else if (mediaError.name === 'NotFoundError') {
            errorMessage = 'No camera or microphone found. Please connect a device and try again.';
          } else if (mediaError.name === 'NotReadableError') {
            errorMessage = 'Camera/microphone is being used by another application. Please close other apps and try again.';
          } else {
            errorMessage = `Media error: ${mediaError.message}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      setLocalStream(stream);

      const systemMessage: ChatMessage = {
        id: crypto.randomUUID(),
        senderId: 'system',
        senderName: 'System',
        message: `Call started by ${callSession.participants[0].name}`,
        timestamp: new Date().toISOString(),
        type: 'system',
      };

      const updatedCall = { 
        ...callSession, 
        chatMessages: [systemMessage] 
      };
      setCurrentCall(updatedCall);


    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (!currentCall || currentCall.status === 'connecting') {
        setCurrentCall(null);
        setLocalStream(null);
      }
      
      alert(`Failed to start video call: ${errorMessage}`);
    } finally {
      setIsInitializingCall(false);
    }
  }, [user, getAppointmentDirectly, isInitializingCall, currentCall]);

  const joinCall = useCallback(async (callId: string): Promise<void> => {
    try {
      const call = callHistory.find(c => c.id === callId);
      if (call && call.status === 'active') {
        setCurrentCall(call);
      }
    } catch (error) {
      console.error('Failed to join call:', error);
    }
  }, [callHistory]);

  const endCall = useCallback(() => {
    try {
      if (currentCall) {
        
        if (localStream) {
          localStream.getTracks().forEach(track => track.stop());
          setLocalStream(null);
        }

        Object.values(remoteStreams).forEach(stream => {
          stream.getTracks().forEach(track => track.stop());
        });
        setRemoteStreams({});

        Object.values(peerConnections.current).forEach(pc => {
          try {
            pc.close();
          } catch (error) {
            console.error('Error closing peer connection:', error);
          }
        });
        peerConnections.current = {};

        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
          try {
            mediaRecorder.current.stop();
          } catch (error) {
            console.error('Error stopping recording:', error);
          }
        }

        const endedCall: CallSession = {
          ...currentCall,
          endTime: new Date().toISOString(),
          status: 'ended',
        };

        setCallHistory(prev => {
          const existing = prev.find(c => c.id === currentCall.id);
          if (existing) {
            return prev.map(c => c.id === currentCall.id ? endedCall : c);
          }
          return [...prev, endedCall];
        });

        setCurrentCall(null);
      }
    } catch (error) {
      console.error('Error ending call:', error);
    }
  }, [currentCall, localStream, remoteStreams]);

  const toggleVideo = useCallback(() => {
    if (!localStream || !currentCall || !user) return;

    try {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length === 0) return;

      const isVideoEnabled = videoTracks[0].enabled;
      
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });

      const updatedCall: CallSession = {
        ...currentCall,
        participants: currentCall.participants.map(p => 
          p.id === user.id ? { ...p, isVideoEnabled: !isVideoEnabled } : p
        ),
      };

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        senderId: 'system',
        senderName: 'System',
        message: `${user.firstName || 'User'} ${!isVideoEnabled ? 'enabled' : 'disabled'} their camera`,
        timestamp: new Date().toISOString(),
        type: 'system',
      };

      updatedCall.chatMessages = [...updatedCall.chatMessages, message];
      setCurrentCall(updatedCall);
    } catch (error) {
      console.error('Error toggling video:', error);
    }
  }, [localStream, currentCall, user]);

  const toggleAudio = useCallback(() => {
    if (!localStream || !currentCall || !user) return;

    try {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length === 0) return;

      const isAudioEnabled = audioTracks[0].enabled;
      
      audioTracks.forEach(track => {
        track.enabled = !isAudioEnabled;
      });

      const updatedCall: CallSession = {
        ...currentCall,
        participants: currentCall.participants.map(p => 
          p.id === user.id ? { ...p, isAudioEnabled: !isAudioEnabled } : p
        ),
      };

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        senderId: 'system',
        senderName: 'System',
        message: `${user.firstName || 'User'} ${!isAudioEnabled ? 'unmuted' : 'muted'} their microphone`,
        timestamp: new Date().toISOString(),
        type: 'system',
      };

      updatedCall.chatMessages = [...updatedCall.chatMessages, message];
      setCurrentCall(updatedCall);
    } catch (error) {
      console.error('Error toggling audio:', error);
    }
  }, [localStream, currentCall, user]);

  const startScreenShare = useCallback(async (): Promise<void> => {
    if (!localStream || !user) return;

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          width: { ideal: 1920 }, 
          height: { ideal: 1080 } 
        },
        audio: true,
      });

      const videoTrack = screenStream.getVideoTracks()[0];
      if (!videoTrack) return;

      const peerConnectionValues = Object.values(peerConnections.current);
      if (peerConnectionValues.length > 0) {
        const sender = peerConnectionValues[0]
          .getSenders()
          .find(s => s.track && s.track.kind === 'video');

        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
      }

      const oldVideoTrack = localStream.getVideoTracks()[0];
      if (oldVideoTrack) {
        localStream.removeTrack(oldVideoTrack);
        oldVideoTrack.stop();
      }
      localStream.addTrack(videoTrack);

      isScreenSharing.current = true;

      videoTrack.onended = () => {
        stopScreenShare();
      };

      if (currentCall) {
        const message: ChatMessage = {
          id: crypto.randomUUID(),
          senderId: 'system',
          senderName: 'System',
          message: `${user.firstName || 'User'} started screen sharing`,
          timestamp: new Date().toISOString(),
          type: 'system',
        };

        const updatedCall: CallSession = { 
          ...currentCall,
          chatMessages: [...currentCall.chatMessages, message]
        };
        setCurrentCall(updatedCall);
      }
    } catch (error) {
      console.error('Failed to start screen share:', error);
      alert('Failed to start screen sharing. Please try again.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStream, currentCall, user]);

  const stopScreenShare = useCallback(async (): Promise<void> => {
    if (!isScreenSharing.current || !localStream || !user) return;

    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false,
      });

      const videoTrack = cameraStream.getVideoTracks()[0];
      if (!videoTrack) return;

      const peerConnectionValues = Object.values(peerConnections.current);
      if (peerConnectionValues.length > 0) {
        const sender = peerConnectionValues[0]
          .getSenders()
          .find(s => s.track && s.track.kind === 'video');

        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
      }

      const oldVideoTrack = localStream.getVideoTracks()[0];
      if (oldVideoTrack) {
        localStream.removeTrack(oldVideoTrack);
        oldVideoTrack.stop();
      }
      localStream.addTrack(videoTrack);

      isScreenSharing.current = false;

      if (currentCall) {
        const message: ChatMessage = {
          id: crypto.randomUUID(),
          senderId: 'system',
          senderName: 'System',
          message: `${user.firstName || 'User'} stopped screen sharing`,
          timestamp: new Date().toISOString(),
          type: 'system',
        };

        const updatedCall: CallSession = { 
          ...currentCall,
          chatMessages: [...currentCall.chatMessages, message]
        };
        setCurrentCall(updatedCall);
      }
    } catch (error) {
      console.error('Failed to stop screen share:', error);
    }
  }, [localStream, currentCall, user]);

  const startRecording = useCallback(() => {
    if (!localStream || !currentCall) return;

    try {
      recordedChunks.current = [];
      
      if (!MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        throw new Error('Recording format not supported');
      }

      mediaRecorder.current = new MediaRecorder(localStream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        try {
          const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          
          if (currentCall) {
            const updatedCall: CallSession = {
              ...currentCall,
              recordingUrl: url,
            };
            setCurrentCall(updatedCall);
          }

          const a = document.createElement('a');
          a.href = url;
          a.download = `consultation_${currentCall?.appointmentId || 'unknown'}_${new Date().toISOString().split('T')[0]}.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (error) {
          console.error('Error processing recording:', error);
        }
      };

      mediaRecorder.current.onerror = (error) => {
        console.error('MediaRecorder error:', error);
      };

      mediaRecorder.current.start(1000);

      const updatedCall: CallSession = {
        ...currentCall,
        recordingStarted: true,
      };

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        senderId: 'system',
        senderName: 'System',
        message: 'Recording started',
        timestamp: new Date().toISOString(),
        type: 'system',
      };

      updatedCall.chatMessages = [...updatedCall.chatMessages, message];
      setCurrentCall(updatedCall);

    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to start recording. Please try again.');
    }
  }, [localStream, currentCall]);

  const stopRecording = useCallback(() => {
    if (!mediaRecorder.current || mediaRecorder.current.state !== 'recording' || !currentCall) return;

    try {
      mediaRecorder.current.stop();

      const updatedCall: CallSession = {
        ...currentCall,
        recordingStarted: false,
      };

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        senderId: 'system',
        senderName: 'System',
        message: 'Recording stopped and saved',
        timestamp: new Date().toISOString(),
        type: 'system',
      };

      updatedCall.chatMessages = [...updatedCall.chatMessages, message];
      setCurrentCall(updatedCall);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  }, [currentCall]);

  const sendMessage = useCallback((message: string, type: 'text' | 'file' = 'text') => {
    if (!currentCall || !user || !message.trim()) return;

    try {
      const chatMessage: ChatMessage = {
        id: crypto.randomUUID(),
        senderId: user.id,
        senderName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        message: message.trim(),
        timestamp: new Date().toISOString(),
        type,
      };

      const updatedCall: CallSession = {
        ...currentCall,
        chatMessages: [...currentCall.chatMessages, chatMessage],
      };

      setCurrentCall(updatedCall);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [currentCall, user]);

  const getCallById = useCallback((id: string) => {
    return callHistory.find(call => call.id === id);
  }, [callHistory]);

  const getActiveCallsForDoctor = useCallback((doctorId: string) => {
    return callHistory.filter(call => 
      call.doctorId === doctorId && call.status === 'active'
    );
  }, [callHistory]);

  return (
    <TelemedicineContext.Provider value={{
      currentCall,
      callHistory,
      isInitializingCall,
      localStream,
      remoteStreams,
      startCall,
      joinCall,
      endCall,
      toggleVideo,
      toggleAudio,
      startScreenShare,
      stopScreenShare,
      startRecording,
      stopRecording,
      sendMessage,
      getCallById,
      getActiveCallsForDoctor,
    }}>
      {children}
    </TelemedicineContext.Provider>
  );
};