import React, {
  FC,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import {  ProfileContext } from "./context";
import { Profile } from "./types";

const LOCAL_STORAGE_KEY = "profiles";

export const ProfileProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setProfiles(JSON.parse(stored));
      } catch {
        console.warn("Failed to parse profiles from localStorage");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles]);

  const addProfile = useCallback((profile: Profile) => {
    setProfiles((prev) => ({
      ...prev,
      [profile.id]: profile,
    }));
  }, []);

  const updateProfile = useCallback((id: string, updatedData: Partial<Profile>) => {
    setProfiles((prev) => {
      const existing = prev[id];
      if (!existing) {
        console.warn("❌ Profile not found:", id);
        return prev;
      }

      return {
        ...prev,
        [id]: {
          ...existing,
          ...updatedData,
        },
      };
    });
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setProfiles((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const resetProfiles = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setProfiles({});
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        addProfile,
        updateProfile,
        deleteProfile,
        resetProfiles,
        setProfiles,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
