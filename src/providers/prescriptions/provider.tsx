import React, {
  FC,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Prescription } from "./types";
import { PrescriptionContext } from "./context";

const LOCAL_STORAGE_KEY = "prescription";

export const PrescriptionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [prescription, setPrescription] = useState<{ [key: string]: Prescription }>({});

 useEffect(() => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      setPrescription(JSON.parse(stored));
    } catch {
      console.warn("Failed to parse prescriptions from localStorage");
    }
  }
}, []);

useEffect(() => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prescription));
}, [prescription]);

const addPrescription = useCallback((prescription: Prescription) => {
  setPrescription((prev) => ({
    ...prev,
    [prescription.id]: prescription,
  }));
}, []);


  const updatePrescription = useCallback((id: string, updatedData: Partial<Prescription>) => {
    setPrescription((prev) => {
      const existing = prev[id];
      if (!existing) {
        console.warn("❌ Prescription not found:", id);
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

  const deletePrescription = useCallback((id: string) => {
    setPrescription((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const resetPrescription = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setPrescription({});
  }, []);

  return (
    <PrescriptionContext.Provider
      value={{
        prescription,
        addPrescription,
        updatePrescription,
        deletePrescription,
        resetPrescription,
        setPrescription,
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
};
