import { createContext, useContext } from 'react';
import { TelemedicineContextType } from './types';

export const TelemedicineContext = createContext<TelemedicineContextType>({
  currentCall: null,
  callHistory: [],
  isInitializingCall: false,
  localStream: null,
  remoteStreams: {},
  startCall: async () => {},
  joinCall: async () => {},
  endCall: () => {},
  toggleVideo: () => {},
  toggleAudio: () => {},
  startScreenShare: async () => {},
  stopScreenShare: () => {},
  startRecording: () => {},
  stopRecording: () => {},
  sendMessage: () => {},
  getCallById: () => undefined,
  getActiveCallsForDoctor: () => [],
});

export const useTelemedicineContext = () => useContext(TelemedicineContext);