import { createContext, useContext } from 'react';
import { ProfileContextType } from './types';

export const ProfileContext = createContext<ProfileContextType>({
  profiles: {},
  addProfile: () => {},
  updateProfile: () => {},
  deleteProfile: () => {},
  resetProfiles: () => {},
  setProfiles: () => {},
});

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
};