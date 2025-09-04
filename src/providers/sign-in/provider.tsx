import React, {
  FC,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ISignIn } from "./types";
import { SignInContext } from "./context";

const LOCAL_STORAGE_KEY = "signInHistory";
const LOCAL_STORAGE_KEY_CURRENT = "currentSignInData";

const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const SignInProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [signInData, setSignInDataState] = useState<ISignIn | null>(null);
  const [signInHistory, setSignInHistory] = useState<Record<string, ISignIn>>({});

  const availableCabinets = React.useMemo(() => ["Cabinet A", "Cabinet B", "Cabinet C"], []);
  const availableRoles = React.useMemo(() => ["owner-doctor", "doctor", "assistant"], []);

  useEffect(() => {
    // Load current sign-in data
    const storedCurrent = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT);
    if (storedCurrent) {
      try {
        setSignInDataState(JSON.parse(storedCurrent));
      } catch {
        console.warn("Failed to parse current sign-in data from localStorage");
      }
    }

    // Load sign-in history
    const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedHistory) {
      try {
        setSignInHistory(JSON.parse(storedHistory));
      } catch {
        console.warn("Failed to parse sign-in history from localStorage");
      }
    }
  }, [availableCabinets, availableRoles]);

  useEffect(() => {
    if (signInData) {
      localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT, JSON.stringify(signInData));
    }
  }, [signInData]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(signInHistory));
  }, [signInHistory]);

  const validateSignInData = useCallback((data: Partial<ISignIn>) => {
    const errors: string[] = [];

    if (!data.email?.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Please enter a valid email address");
    }

    if (!data.password) {
      errors.push("Password is required");
    }

    if (!data.cabinet?.trim()) {
      errors.push("Cabinet selection is required");
    } else if (!availableCabinets.includes(data.cabinet)) {
      errors.push("Please select a valid cabinet");
    }

    if (!data.role?.trim()) {
      errors.push("Role selection is required");
    } else if (!availableRoles.includes(data.role)) {
      errors.push("Please select a valid role");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addSignIn = useCallback(async (signInData: Omit<ISignIn, 'id'>): Promise<boolean> => {
    try {
      const validation = validateSignInData(signInData);
      if (!validation.isValid) {
        console.warn("❌ Sign-in validation failed:", validation.errors);
        return false;
      }

      const newSignIn: ISignIn = {
        id: generateId(),
        ...signInData,
      };

      setSignInHistory((prev) => ({
        ...prev,
        [newSignIn.id]: newSignIn,
      }));

      if (signInData.rememberMe) {
        setSignInDataState(newSignIn);
      }

      console.log("✅ Sign-in data saved:", newSignIn.email);
      return true;

    } catch (error) {
      console.error("❌ Sign-in failed:", error);
      return false;
    }
  }, [validateSignInData]);

  const setSignInData = useCallback((data: ISignIn) => {
    setSignInDataState(data);
  }, []);

  const getLastSignInForEmail = useCallback((email: string): ISignIn | undefined => {
    return Object.values(signInHistory).find(signIn => 
      signIn.email.toLowerCase() === email.toLowerCase() && signIn.rememberMe
    );
  }, [signInHistory]);

  const clearSignInData = useCallback(() => {
    setSignInDataState(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CURRENT);
  }, []);

  const resetSignInHistory = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CURRENT);
    setSignInHistory({});
    setSignInDataState(null);
  }, []);

  return (
    <SignInContext.Provider
      value={{
        signInData,
        signInHistory,
        availableCabinets,
        availableRoles,
        setSignInData,
        addSignIn,
        validateSignInData,
        clearSignInData,
        getLastSignInForEmail,
        resetSignInHistory,
        setSignInHistory,
      }}
    >
      {children}
    </SignInContext.Provider>
  );
};