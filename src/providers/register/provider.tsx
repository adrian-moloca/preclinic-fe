import React, {
  FC,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { IRegister } from "./types";
import { RegisterContext } from "./context";
import axios from "axios";

// const LOCAL_STORAGE_KEY = "registrations";

const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const RegisterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [registrations, setRegistrations] = useState<Record<string, IRegister>>({});

  // useEffect(() => {
  //   const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  //   if (stored) {
  //     try {
  //       setRegistrations(JSON.parse(stored));
  //     } catch {
  //       console.warn("Failed to parse registrations from localStorage");
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(registrations));
  // }, [registrations]);

  const validateRegistration = useCallback((data: Partial<IRegister>) => {
    const errors: string[] = [];

    if (!data.fullName?.trim()) {
      errors.push("Full name is required");
    }

    if (!data.email?.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Please enter a valid email address");
    }

    if (!data.password) {
      errors.push("Password is required");
    } else if (data.password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (data.password !== data.confirmPassword) {
      errors.push("Passwords do not match");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const isEmailTaken = useCallback((email: string): boolean => {
    return Object.values(registrations).some(reg => 
      reg.email.toLowerCase() === email.toLowerCase()
    );
  }, [registrations]);

const addRegister = async (registration: Omit<IRegister, "id">): Promise<boolean> => {
  try {
    const newRegistration: IRegister = {
      id: generateId(),
      ...registration
    };
    
    const response = await axios.post<IRegister>('/signup', newRegistration);
    setRegistrations(prev => ({
      ...prev,
      [response.data.id || newRegistration.id]: response.data,
    }));
    
    return true;
  } catch (error) {
    console.error("❌ Registration failed:", error);
    return false;
  }
};

  // Add getRegistrationByEmail and resetRegistrations to match IRegisterContext
  const getRegistrationByEmail = useCallback((email: string): IRegister | undefined => {
    return Object.values(registrations).find(reg => reg.email.toLowerCase() === email.toLowerCase());
  }, [registrations]);

  const resetRegistrations = useCallback(() => {
    setRegistrations({});
  }, []);

  return (
    <RegisterContext.Provider
      value={{
        registrations,
        addRegister,
        validateRegistration,
        isEmailTaken,
        setRegistrations,
        getRegistrationByEmail,
        resetRegistrations,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
};