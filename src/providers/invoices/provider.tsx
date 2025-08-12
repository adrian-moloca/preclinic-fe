import React, {
  FC,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { IInvoice } from "./types";
import { InvoicesContext } from "./context";

const LOCAL_STORAGE_KEY = "invoices";

export const InvoicesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        // Handle migration from object to array format
        if (Array.isArray(parsedData)) {
          setInvoices(parsedData);
        } else if (typeof parsedData === 'object' && parsedData !== null) {
          // Convert object to array for backward compatibility
          const invoicesArray = Object.values(parsedData) as IInvoice[];
          setInvoices(invoicesArray);
        }
      } catch {
        console.warn("Failed to parse invoices from localStorage");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  const addInvoice = useCallback((invoice: IInvoice) => {
    setInvoices((prev) => [...prev, invoice]);
  }, []);

  const updateInvoice = useCallback((id: string, updatedData: Partial<IInvoice>) => {
    setInvoices((prev) => {
      const invoiceIndex = prev.findIndex((invoice) => invoice.id === id);
      if (invoiceIndex === -1) {
        console.warn("❌ Invoice not found:", id);
        return prev;
      }

      const updatedInvoices = [...prev];
      updatedInvoices[invoiceIndex] = {
        ...updatedInvoices[invoiceIndex],
        ...updatedData,
      };

      return updatedInvoices;
    });
  }, []);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
  }, []);

  const resetInvoices = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setInvoices([]);
  }, []);

  return (
    <InvoicesContext.Provider
      value={{
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        resetInvoices,
        setInvoices,
      }}
    >
      {children}
    </InvoicesContext.Provider>
  );
};