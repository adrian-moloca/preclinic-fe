export interface IPayroll {
    id: string;
    employee: string;
    netSalary: number;
    basicSalary: number;
    da: number;
    hra: number;
    conveyance: number;
    medicalAllowance: number;
    tds: number;
    pf: number;
    esi: number;
    profTax: number;
    labourWelfareFund: number;
    otherDeductions: number;
    otherEarnings: number;
    date: string;
}

export interface PayrollContextType {
    payrolls: IPayroll[];
    addPayroll: (payroll: IPayroll) => void;
    updatePayroll: (id: string, updatedData: Partial<IPayroll>) => void;
    deletePayroll: (id: string) => void;
    resetPayrolls: () => void;
    setPayrolls: React.Dispatch<React.SetStateAction<IPayroll[]>>;
}