import { createContext, useContext } from "react";
import { CasesContextType } from "./types";

export const CasesContext = createContext<CasesContextType | undefined>(undefined);

export const useCasesContext = () => {
  const context = useContext(CasesContext);
  if (!context) {
    throw new Error("useCasesContext must be used within a CasesProvider");
  }
  return context;
};