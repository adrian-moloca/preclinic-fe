export interface CallParticipant {
  id: string;
  name: string;
  role: 'doctor' | 'patient' | 'assistant';
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  stream?: MediaStream;
}

export interface CallSession {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  startTime: string;
  endTime?: string;
  status: 'waiting' | 'connecting' | 'active' | 'ended' | 'failed';
  participants: CallParticipant[];
  recordingStarted?: boolean;
  recordingUrl?: string;
  chatMessages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
}

export interface TelemedicineContextType {
  currentCall: CallSession | null;
  callHistory: CallSession[];
  isInitializingCall: boolean;
  localStream: MediaStream | null;
  remoteStreams: { [participantId: string]: MediaStream };
  
  // Call management
  startCall: (appointmentId: string) => Promise<void>;
  joinCall: (callId: string) => Promise<void>;
  endCall: () => void;
  
  // Media controls
  toggleVideo: () => void;
  toggleAudio: () => void;
  startScreenShare: () => Promise<void>;
  stopScreenShare: () => void;
  
  // Recording
  startRecording: () => void;
  stopRecording: () => void;
  
  // Chat
  sendMessage: (message: string, type?: 'text' | 'file') => void;
  
  // Utils
  getCallById: (id: string) => CallSession | undefined;
  getActiveCallsForDoctor: (doctorId: string) => CallSession[];
}