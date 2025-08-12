import { createContext, useContext } from "react";
import { InvoiceContextType } from "./types";

export const InvoicesContext = createContext<InvoiceContextType>({
    invoices: [],
    addInvoice: () => {},
    updateInvoice: () => {},
    deleteInvoice: () => {},
    resetInvoices: () => {},
    setInvoices: () => {},
});

export const useInvoicesContext = () => useContext(InvoicesContext);