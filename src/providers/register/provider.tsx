import React, {
  FC,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { IRegister } from "./types";
import { RegisterContext } from "./context";

const LOCAL_STORAGE_KEY = "registrations";

const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const RegisterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [registrations, setRegistrations] = useState<Record<string, IRegister>>({});

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setRegistrations(JSON.parse(stored));
      } catch {
        console.warn("Failed to parse registrations from localStorage");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(registrations));
  }, [registrations]);

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

  const addRegister = useCallback(async (registrationData: Omit<IRegister, 'id'>): Promise<boolean> => {
    try {
      // Check if email is already taken
      if (isEmailTaken(registrationData.email)) {
        console.warn("❌ Email already exists:", registrationData.email);
        return false;
      }

      // Validate the registration data
      const validation = validateRegistration(registrationData);
      if (!validation.isValid) {
        console.warn("❌ Registration validation failed:", validation.errors);
        return false;
      }

      // Create the complete registration object
      const newRegistration: IRegister = {
        id: generateId(),
        ...registrationData,
      };

      // Add to registrations
      setRegistrations((prev) => ({
        ...prev,
        [newRegistration.id]: newRegistration,
      }));

      console.log("✅ Registration successful:", newRegistration.email);
      return true;

    } catch (error) {
      console.error("❌ Registration failed:", error);
      return false;
    }
  }, [isEmailTaken, validateRegistration]);

  const getRegistrationByEmail = useCallback((email: string): IRegister | undefined => {
    return Object.values(registrations).find(reg => 
      reg.email.toLowerCase() === email.toLowerCase()
    );
  }, [registrations]);

  const resetRegistrations = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setRegistrations({});
  }, []);

  return (
    <RegisterContext.Provider
      value={{
        registrations,
        addRegister,
        getRegistrationByEmail,
        validateRegistration,
        isEmailTaken,
        resetRegistrations,
        setRegistrations,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
};