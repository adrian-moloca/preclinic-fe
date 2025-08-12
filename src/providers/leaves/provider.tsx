import React, {
  FC,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { LeavesContext } from "./context";
import { Leaves } from "./types";

const LOCAL_STORAGE_KEY = "leaves";

export const LeavesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [leaves, setLeaves] = useState<Leaves[]>([]);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
      } catch {
        console.warn("Failed to parse leaves from localStorage");
      }
    }
    isInitialLoad.current = false;
  }, []);

  useEffect(() => {
    if (!isInitialLoad.current) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leaves));
    }
  }, [leaves]);

  const addLeave = useCallback((leave: Leaves) => {
    setLeaves((prev) => [...prev, leave]);
  }, []);

  const updateLeave = useCallback((id: string, updatedData: Partial<Leaves>) => {
    setLeaves((prev) =>
      prev.map((leave) =>
        leave.id === id ? { ...leave, ...updatedData } : leave
      )
    );
  }, []);

  const deleteLeave = useCallback((id: string) => {
    setLeaves((prev) => prev.filter((leave) => leave.id !== id));
  }, []);

  const resetLeaves = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setLeaves([]);
  }, []);

  return (
    <LeavesContext.Provider
      value={{
        leaves,
        addLeave,
        updateLeave,
        deleteLeave,
        resetLeaves,
        setLeaves,
      }}
    >
      {children}
    </LeavesContext.Provider>
  );
};
