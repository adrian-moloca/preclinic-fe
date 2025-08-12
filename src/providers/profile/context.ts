import { createContext, useContext } from "react";
import { ProfileContextType } from "./types";

export const ProfileContext = createContext<ProfileContextType>({
  profiles: {},
  addProfile: () => {},
  updateProfile: () => {},
  deleteProfile: () => {},
  resetProfiles: () => {},
  setProfiles: () => {},
});

export const useProfileContext = () => useContext(ProfileContext);
