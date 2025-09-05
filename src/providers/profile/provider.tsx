import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { Profile } from './types';
import { ProfileContext } from './context';

const LOCAL_STORAGE_KEY = 'profiles';

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: FC<ProfileProviderProps> = ({ children }) => {
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});

  // Load profiles from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProfiles(parsed);
        console.log('Loaded profiles from localStorage:', parsed);
      } catch (error) {
        console.warn('Failed to parse profiles from localStorage:', error);
        setProfiles({});
      }
    }
  }, []);

  // Save profiles to localStorage whenever profiles change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profiles));
    console.log('Saved profiles to localStorage:', profiles);
  }, [profiles]);

  const addProfile = useCallback((profile: Profile) => {
    console.log('Adding profile:', profile);
    setProfiles(prev => ({
      ...prev,
      [profile.id]: profile
    }));
  }, []);

  const updateProfile = useCallback((id: string, updatedData: Partial<Profile>) => {
    console.log('Updating profile:', id, updatedData);
    setProfiles(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...updatedData,
        id // Ensure ID is preserved
      }
    }));
  }, []);

  const deleteProfile = useCallback((id: string) => {
    console.log('Deleting profile:', id);
    setProfiles(prev => {
      const newProfiles = { ...prev };
      delete newProfiles[id];
      return newProfiles;
    });
  }, []);

  const resetProfiles = useCallback(() => {
    console.log('Resetting all profiles');
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setProfiles({});
  }, []);

  return (
    <ProfileContext.Provider value={{
      profiles,
      setProfiles,
      addProfile,
      updateProfile,
      deleteProfile,
      resetProfiles,
    }}>
      {children}
    </ProfileContext.Provider>
  );
};