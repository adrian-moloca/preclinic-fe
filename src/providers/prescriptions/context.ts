import { createContext, useContext } from "react";
import { PrescriptionsContextType } from "./types";



export const PrescriptionContext = createContext<PrescriptionsContextType>({
  prescription: {},
  addPrescription: () => {},
  updatePrescription: () => {},
  deletePrescription: () => {},
  resetPrescription: () => {},
  setPrescription: () => {},
  fetchPrescriptions: async () => {},
  loading: false,
  hasLoaded: false,
});

export const usePrescriptionContext = () => useContext(PrescriptionContext);
