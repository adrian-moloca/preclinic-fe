import React, {
  FC,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { IPayroll } from "./types";
import { PayrollsContext } from "./context";

const LOCAL_STORAGE_KEY = "payrolls";

export const PayrollProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [payrolls, setPayrolls] = useState<IPayroll[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        if (Array.isArray(parsedData)) {
          setPayrolls(parsedData);
        } else if (typeof parsedData === 'object' && parsedData !== null) {
          const payrollsArray = Object.values(parsedData) as IPayroll[];
          setPayrolls(payrollsArray);
        }
      } catch {
        console.warn("Failed to parse payrolls from localStorage");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payrolls));
  }, [payrolls]);

  const addPayroll = useCallback((payroll: IPayroll) => {
    setPayrolls((prev) => [...prev, payroll]);
  }, []);

  const updatePayroll = useCallback((id: string, updatedData: Partial<IPayroll>) => {
    setPayrolls((prev) => {
      const payrollIndex = prev.findIndex((payroll) => payroll.id === id);
      if (payrollIndex === -1) {
        console.warn("❌ Payroll not found:", id);
        return prev;
      }

      const updatedPayrolls = [...prev];
      updatedPayrolls[payrollIndex] = {
        ...updatedPayrolls[payrollIndex],
        ...updatedData,
      };

      return updatedPayrolls;
    });
  }, []);

  const deletePayroll = useCallback((id: string) => {
    setPayrolls((prev) => prev.filter((payroll) => payroll.id !== id));
  }, []);

  const resetPayrolls = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setPayrolls([]);
  }, []);

  return (
    <PayrollsContext.Provider
      value={{
        payrolls,
        addPayroll,
        updatePayroll,
        deletePayroll,
        resetPayrolls,
        setPayrolls,
      }}
    >
      {children}
    </PayrollsContext.Provider>
  );
};