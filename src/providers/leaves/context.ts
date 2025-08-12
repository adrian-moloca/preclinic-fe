import { createContext, useContext } from "react";
import { LeavesContextType } from "./types";



export const LeavesContext = createContext<LeavesContextType>({
  leaves: [],
  addLeave: () => {},
  updateLeave: () => {},
  deleteLeave: () => {},
  resetLeaves: () => {},
  setLeaves: () => {},
});

export const useLeavesContext = () => useContext(LeavesContext);
