// src/components/telemedicine/video-call/component.tsx
import React, { FC, useRef, useEffect, useState, useCallback } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Chip,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  CallEnd,
  ScreenShare,
  FiberManualRecord,
  Stop,
  Chat,
} from '@mui/icons-material';
import { useTelemedicineContext } from '../../../providers/telemedicine';
import { ChatPanel } from '../chat-panel/component';
import { format } from 'date-fns';

interface VideoCallProps {
  appointmentId: string;
  onEndCall?: () => void;
}

export const VideoCall: FC<VideoCallProps> = ({ appointmentId, onEndCall }) => {
  const {
    currentCall,
    localStream,
    remoteStreams,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    startRecording,
    stopRecording,
    endCall,
  } = useTelemedicineContext();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [cameraStatus, setCameraStatus] = useState<{
    available: boolean;
    working: boolean;
    hasVideoTrack: boolean;
    error: string | null;
  }>({
    available: false,
    working: false,
    hasVideoTrack: false,
    error: null,
  });
  
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const streamMonitorRef = useRef<NodeJS.Timeout | null>(null);
  const restartAttempts = useRef(0);
  const maxRestartAttempts = 2;
  const isRestartingRef = useRef(false);
  const cameraFailedRef = useRef(false);
  const videoSetupRef = useRef<string | null>(null);

  useEffect(() => {
    console.log('🎥 VideoCall component state:', {
      hasCurrentCall: !!currentCall,
      hasLocalStream: !!localStream,
      streamActive: localStream?.active,
      videoTracks: localStream?.getVideoTracks().length || 0,
      audioTracks: localStream?.getAudioTracks().length || 0,
      streamId: localStream?.id,
    });
  }, [currentCall, localStream]);

  const checkCameraStatus = useCallback(async (): Promise<{
    available: boolean;
    working: boolean;
    hasVideoTrack: boolean;
    error: string | null;
  }> => {
    try {
      const hasVideoTrack = localStream ? localStream.getVideoTracks().length > 0 : false;
      const videoTrackWorking = hasVideoTrack && localStream ? 
        localStream.getVideoTracks()[0].readyState === 'live' : false;

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const hasVideoDevice = videoDevices.length > 0;

      let canAccessCamera = false;
      if (hasVideoDevice && !cameraFailedRef.current) {
        try {
          const testStream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 320, height: 240 },
            audio: false 
          });
          canAccessCamera = true;
          testStream.getTracks().forEach(track => track.stop());
        } catch (testError) {
          console.warn('Camera test failed:', testError);
          canAccessCamera = false;
          if (testError instanceof Error && testError.name !== 'NotAllowedError') {
            cameraFailedRef.current = true;
          }
        }
      }

      const status = {
        available: hasVideoDevice,
        working: videoTrackWorking && canAccessCamera,
        hasVideoTrack,
        error: cameraFailedRef.current ? 'Camera hardware unavailable' : null,
      };

      return status;
    } catch (error) {
      console.error('Failed to check camera status:', error);
      return {
        available: false,
        working: false,
        hasVideoTrack: false,
        error: 'Unable to check camera status',
      };
    }
  }, [localStream]);

  useEffect(() => {
    if (localStream) {
      const monitorCamera = async () => {
        const status = await checkCameraStatus();
        setCameraStatus(status);
        
        if (status.available && 
            !status.working && 
            status.hasVideoTrack && 
            !isRestartingRef.current && 
            restartAttempts.current < maxRestartAttempts &&
            !cameraFailedRef.current) {
          
          const timeSinceLastAttempt = Date.now() - (window as any).lastRestartTime || 0;
          if (timeSinceLastAttempt > 10000) {
            console.log('🔄 Camera detected as not working, attempting restart...');
            (window as any).lastRestartTime = Date.now();
            restartCamera();
          }
        }
      };
      
      streamMonitorRef.current = setInterval(monitorCamera, 10000);
      monitorCamera();
      
      const resetCounter = setInterval(() => {
        if (restartAttempts.current > 0) {
          console.log('🔄 Reset restart attempts counter');
          restartAttempts.current = 0;
          cameraFailedRef.current = false;
        }
      }, 60000);
      
      return () => {
        if (streamMonitorRef.current) {
          clearInterval(streamMonitorRef.current);
        }
        clearInterval(resetCounter);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStream, checkCameraStatus]);

  const restartCamera = useCallback(async (): Promise<boolean> => {
    if (isRestartingRef.current || cameraFailedRef.current) {
      console.log('🔄 Skipping restart - already restarting or camera failed');
      return false;
    }

    isRestartingRef.current = true;
    restartAttempts.current += 1;
    
    try {
      console.log(`🔄 Attempting camera restart (${restartAttempts.current}/${maxRestartAttempts})...`);
      
      const status = await checkCameraStatus();
      if (!status.available) {
        throw new Error('No camera devices available');
      }

      if (!localStream) {
        throw new Error('Local stream no longer exists');
      }

      const constraints = {
        video: { 
          width: { ideal: 320, max: 640 },
          height: { ideal: 240, max: 480 },
          facingMode: 'user',
          frameRate: { ideal: 15, max: 20 }
        },
        audio: false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      const newVideoTrack = newStream.getVideoTracks()[0];
      
      if (!newVideoTrack) {
        throw new Error('No video track in new stream');
      }
      
      const oldVideoTracks = localStream.getVideoTracks();
      oldVideoTracks.forEach(track => {
        localStream.removeTrack(track);
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping old track:', e);
        }
      });
      
      localStream.addTrack(newVideoTrack);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
        videoSetupRef.current = localStream.id;
        
        try {
          await localVideoRef.current.play();
          console.log('✅ Camera restart successful');
          return true;
        } catch (playError) {
          console.warn('Video play warning after restart:', playError);
        }
      }
      
      return true;
      
    } catch (error) {
      console.error(`❌ Camera restart failed (${restartAttempts.current}/${maxRestartAttempts}):`, error);
      
      if (restartAttempts.current >= maxRestartAttempts) {
        console.error('🚫 Maximum restart attempts reached. Marking camera as failed.');
        cameraFailedRef.current = true;
      }
      
      return false;
    } finally {
      isRestartingRef.current = false;
    }
  }, [localStream, checkCameraStatus]);

  const handleManualRestart = useCallback(async () => {
    console.log('🔄 Manual camera restart requested');
    cameraFailedRef.current = false;
    restartAttempts.current = 0;
    const success = await restartCamera();
    
    if (!success) {
      alert('Unable to restart camera. Please check if another application is using your camera, or try refreshing the page.');
    }
  }, [restartCamera]);

  useEffect(() => {
    if (localVideoRef.current && localStream && videoSetupRef.current !== localStream.id) {
      console.log('📹 Setting up local video element for stream:', localStream.id);
      
      const video = localVideoRef.current;
      
      videoSetupRef.current = localStream.id;
      
      video.srcObject = localStream;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      
      const playVideo = async () => {
        try {
          if (video.readyState < 2) {
            await new Promise<void>((resolve) => {
              const onCanPlay = () => {
                video.removeEventListener('canplay', onCanPlay);
                resolve();
              };
              video.addEventListener('canplay', onCanPlay);
            });
          }
          
          await video.play();
          console.log('✅ Local video playing successfully');
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            console.warn('Video play error:', error);
          }
        }
      };
      
      playVideo();
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && Object.keys(remoteStreams).length > 0) {
      const firstRemoteStream = Object.values(remoteStreams)[0];
      remoteVideoRef.current.srcObject = firstRemoteStream;
    }
  }, [remoteStreams]);

  useEffect(() => {
    if (currentCall && currentCall.status === 'active') {
      const startTime = new Date(currentCall.startTime).getTime();
      const timer = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentCall]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    console.log('🛑 Ending call from VideoCall component');
    endCall();
    if (onEndCall) {
      onEndCall();
    }
  };

  if (!currentCall) {
    return (
      <Box 
        sx={{ 
          width: '100%', 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#000'
        }}
      >
        <Typography variant="h6" color="white">
          Initializing call...
        </Typography>
      </Box>
    );
  }

  if (currentCall.status === 'connecting' || !localStream) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Connecting to call...
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please allow camera and microphone access
        </Typography>
      </Box>
    );
  }

  const isLocalVideoEnabled = currentCall?.participants.find(p => p.id === currentCall?.doctorId)?.isVideoEnabled ?? true;
  const isLocalAudioEnabled = currentCall?.participants.find(p => p.id === currentCall?.doctorId)?.isAudioEnabled ?? true;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#000',
        overflow: 'hidden',
        cursor: showControls ? 'default' : 'none',
      }}
      onMouseMove={() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }}
    >
      <Box sx={{ width: '100%', height: '100%' }}>
        {Object.keys(remoteStreams).length > 0 ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1e1e1e',
            }}
          >
            <Box textAlign="center">
              <Typography variant="h4" color="white" gutterBottom>
                Call Active
              </Typography>
              <Typography variant="body1" color="gray">
                Waiting for patient to join...
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Paper
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 250,
          height: 180,
          overflow: 'hidden',
          borderRadius: 2,
          transition: 'opacity 0.3s ease',
          opacity: showControls ? 1 : 0.7,
          border: cameraStatus.working ? '2px solid #4caf50' : '2px solid #ff4444',
        }}
      >
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)',
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          <Chip
            size="small"
            label={cameraStatus.working ? 'CAMERA ON' : 'CAMERA OFF'}
            sx={{
              backgroundColor: cameraStatus.working ? '#4caf50' : '#ff4444',
              color: 'white',
              fontSize: '9px',
              height: '18px',
            }}
          />
          
          {!cameraStatus.available && (
            <Chip
              size="small"
              label="NO DEVICE"
              sx={{
                backgroundColor: '#ff9800',
                color: 'white',
                fontSize: '9px',
                height: '18px',
              }}
            />
          )}
          
          {cameraFailedRef.current && (
            <Chip
              size="small"
              label="CAM FAILED"
              sx={{
                backgroundColor: '#f44336',
                color: 'white',
                fontSize: '9px',
                height: '18px',
              }}
            />
          )}
        </Box>

        {(!isLocalVideoEnabled || !cameraStatus.working) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <VideocamOff sx={{ color: 'white', fontSize: 40, mb: 1 }} />
            {cameraStatus.error && (
              <Typography variant="caption" color="white" textAlign="center">
                {cameraStatus.error}
              </Typography>
            )}
          </Box>
        )}
      </Paper>

      <Fade in={showControls}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h6" color="white">
              Medical Consultation
            </Typography>
            <Typography variant="body2" color="gray">
              {format(new Date(currentCall.startTime), 'MMM dd, yyyy • HH:mm')}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              icon={<FiberManualRecord sx={{ color: '#4caf50' }} />}
              label={formatDuration(callDuration)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
              }}
            />
            {currentCall.recordingStarted && (
              <Chip
                icon={<FiberManualRecord sx={{ color: '#ff4444' }} />}
                label="REC"
                sx={{
                  backgroundColor: 'rgba(255, 0, 0, 0.2)',
                  color: 'white',
                  animation: 'pulse 2s infinite',
                }}
              />
            )}
          </Box>
        </Box>
      </Fade>

      <Fade in={showControls}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            p: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box display="flex" gap={2} alignItems="center">
            <Tooltip title={isLocalAudioEnabled ? 'Mute' : 'Unmute'}>
              <IconButton
                onClick={toggleAudio}
                sx={{
                  backgroundColor: isLocalAudioEnabled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 0, 0, 0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: isLocalAudioEnabled ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 0, 0, 0.3)',
                  },
                }}
              >
                {isLocalAudioEnabled ? <Mic /> : <MicOff />}
              </IconButton>
            </Tooltip>

            <Tooltip title={isLocalVideoEnabled ? 'Turn off camera' : 'Turn on camera'}>
              <IconButton
                onClick={toggleVideo}
                sx={{
                  backgroundColor: isLocalVideoEnabled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 0, 0, 0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: isLocalVideoEnabled ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 0, 0, 0.3)',
                  },
                }}
              >
                {isLocalVideoEnabled ? <Videocam /> : <VideocamOff />}
              </IconButton>
            </Tooltip>

            {cameraStatus.available && !cameraStatus.working && (
              <Tooltip 
                title={isRestartingRef.current ? "Restarting camera..." : "Fix camera"}
              >
                <span>
                  <IconButton
                    onClick={handleManualRestart}
                    disabled={isRestartingRef.current}
                    sx={{
                      backgroundColor: 'rgba(255, 165, 0, 0.2)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 165, 0, 0.3)',
                      },
                      '&:disabled': {
                        backgroundColor: 'rgba(255, 165, 0, 0.1)',
                        color: 'rgba(255, 255, 255, 0.5)',
                      },
                    }}
                  >
                    <Typography>
                      {isRestartingRef.current ? '⏳' : '🔧'}
                    </Typography>
                  </IconButton>
                </span>
              </Tooltip>
            )}

            <Tooltip title="Share screen">
              <IconButton
                onClick={startScreenShare}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <ScreenShare />
              </IconButton>
            </Tooltip>

            <Tooltip title={currentCall.recordingStarted ? 'Stop recording' : 'Start recording'}>
              <IconButton
                onClick={currentCall.recordingStarted ? stopRecording : startRecording}
                sx={{
                  backgroundColor: currentCall.recordingStarted ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: currentCall.recordingStarted ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                {currentCall.recordingStarted ? <Stop /> : <FiberManualRecord />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Toggle chat">
              <IconButton
                onClick={() => setShowChatPanel(!showChatPanel)}
                sx={{
                  backgroundColor: showChatPanel ? 'rgba(33, 150, 243, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: showChatPanel ? 'rgba(33, 150, 243, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <Chat />
              </IconButton>
            </Tooltip>

            <Tooltip title="End call">
              <IconButton
                onClick={handleEndCall}
                sx={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#d32f2f',
                  },
                  ml: 2,
                }}
              >
                <CallEnd />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Fade>

      {showChatPanel && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 350,
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <ChatPanel onClose={() => setShowChatPanel(false)} />
        </Box>
      )}

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
};