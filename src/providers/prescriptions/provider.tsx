import React, {
  FC,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { Prescription } from "./types";
import { PrescriptionContext } from "./context";
import axios from "axios";

// const LOCAL_STORAGE_KEY = "prescription";

export const PrescriptionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [prescription, setPrescription] = useState<{ [key: string]: Prescription }>({});

//  useEffect(() => {
//   const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
//   if (stored) {
//     try {
//       setPrescription(JSON.parse(stored));
//     } catch {
//       console.warn("Failed to parse prescriptions from localStorage");
//     }
//   }
// }, []);

// useEffect(() => {
//   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prescription));
// }, [prescription]);

const addPrescription = async (newEntry: Prescription) => {
  try {
    const response = await axios.post<Prescription>('/prescription', newEntry);
    setPrescription((prev) => ({
      ...prev,
      [response.data.id]: response.data,
    }));
  } catch (error) {
    console.error("Failed to add prescription:", error);
  }
};

const updatePrescription = async (id: string, updatedData: Partial<Prescription>) => {
  try {
    const existingPrescription = prescription[id];
    if (!existingPrescription) {
      console.error("Prescription not found:", id);
      return;
    }
    
    const updatedPrescription = { ...existingPrescription, ...updatedData };
    
    const response = await axios.put<Prescription>(`/prescription/${id}`, updatedPrescription);
    setPrescription((prev) => ({
      ...prev,
      [id]: response.data,
    }));
  } catch (error) {
    console.error("Failed to update prescription:", error);
  }
};

const deletePrescription = async (id: string) => {
    try {
      await axios.delete(`/prescription/${id}`);
      setPrescription((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (error) {
      console.error("Failed to delete prescription:", error);
    } 
  };

  const resetPrescription = useCallback(() => {
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
