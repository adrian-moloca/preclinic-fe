export interface IInvoice {
    id: string;
    patientId: string;
    invoiceNumber: string;
    patientName: string;
    email: string;
    department: string;
    tax: string;
    invoiceDate: string;
    dueDate: string;
    patientAddress: string;
    appointment: string;
    billingAddress: string;
    paymentMethod: string;
    paymentStatus: string;
    productName: string;
    description: string;
    unitCost: string;
    quantity: string;
    amount: string;
}

export interface InvoiceContextType {
    invoices: IInvoice[];
    addInvoice: (invoice: IInvoice) => void;
    updateInvoice: (id: string, updatedData: Partial<IInvoice>) => void;
    deleteInvoice: (id: string) => void;
    resetInvoices: () => void;
    setInvoices: React.Dispatch<React.SetStateAction<IInvoice[]>>;
}