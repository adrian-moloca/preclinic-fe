import { createContext, useContext } from "react";
import { PayrollContextType } from "./types";

export const PayrollsContext = createContext<PayrollContextType>({
  payrolls: [],
  addPayroll: () => {},
  updatePayroll: () => {},
  deletePayroll: () => {},
  resetPayrolls: () => {},
  setPayrolls: () => {},
});

export const usePayrollsContext = () => useContext(PayrollsContext);