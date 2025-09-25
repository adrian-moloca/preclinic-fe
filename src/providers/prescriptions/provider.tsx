import React, {
  FC,
  ReactNode,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Prescription } from "./types";
import { PrescriptionContext } from "./context";
import axios from "axios";
import { useClinicContext } from "../clinic/context";

export const PrescriptionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [prescription, setPrescription] = useState<{ [key: string]: Prescription }>({});
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const isFetchingRef = useRef(false);
  const { selectedClinic } = useClinicContext();

  const fetchPrescriptions = useCallback(async (force: boolean = false) => {
    if ((hasLoaded && !force) || isFetchingRef.current) {
      return;
    }
    
    isFetchingRef.current = true;
    setLoading(true);
    
    try {
      const clinicId = selectedClinic?._id;
      
      if (!clinicId) {
        console.warn('No clinic selected or clinic has no _id');
        setPrescription({});
        setHasLoaded(true);
        return;
      }
      
      const response = await axios.get<Prescription[]>(`/api/prescription/getAllByClinic/${clinicId}`);
      const data = response.data;
      
      const prescriptionsMap: { [key: string]: Prescription } = {};
      if (Array.isArray(data)) {
        data.forEach(pres => {
          const id = (pres as any)._id || (pres as any).id;
          if (id) {
            prescriptionsMap[id] = { ...pres, id };
          }
        });
      }
      
      setPrescription(prescriptionsMap);
      setHasLoaded(true);
    } catch (error) {
      console.error("Failed to fetch prescriptions:", error);
      setPrescription({});
      setHasLoaded(true);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [hasLoaded, selectedClinic]);

  const addPrescription = async (newEntry: Prescription) => {
    try {
      const clinicId = selectedClinic?._id;
      
      if (!clinicId) {
        console.error('No clinic selected, cannot create prescription');
        throw new Error('No clinic selected');
      }
      
      const prescriptionData = {
        ...newEntry,
        clinic: clinicId,
      };
      
      const response = await axios.post<Prescription>('/api/prescription/create', prescriptionData);
      const id = (response.data as any)._id || response.data.id;
      setPrescription((prev) => ({
        ...prev,
        [id]: { ...response.data, id },
      }));
    } catch (error) {
      console.error("Failed to add prescription:", error);
    }
  };

  const updatePrescription = async (id: string, updatedData: Partial<Prescription>) => {
    try {
      const response = await axios.put<Prescription>(`/api/prescription/patch/${id}`, updatedData);
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
      const response = await axios.delete(`/api/prescription/delete/${id}`);
      if (response.status === 200) {
        setPrescription((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      }
    } catch (error) {
      console.error("Failed to delete prescription:", error);
    }
  };

  const resetPrescription = useCallback(() => {
    setPrescription({});
    setHasLoaded(false);
  }, []);

  useEffect(() => {
    setPrescription({});
    setHasLoaded(false);
    
    if (selectedClinic?._id) {
      const timer = setTimeout(() => {
        fetchPrescriptions(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClinic?._id]);

  return (
    <PrescriptionContext.Provider
      value={{
        prescription,
        addPrescription,
        updatePrescription,
        deletePrescription,
        resetPrescription,
        setPrescription,
        fetchPrescriptions,
        loading,
        hasLoaded,
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
};