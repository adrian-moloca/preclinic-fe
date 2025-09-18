export interface IDepartments {
    id?: string;
    name: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    status: string;
    doctors: string[];
    assistants: string[];
};

export interface IDepartmentsContext {
    departments: IDepartments[];
    setDepartments: (departments: IDepartments[]) => void;
    addDepartment: (department: IDepartments) => void;
    updateDepartment: (id: string, updatedDepartment: IDepartments) => void;
    deleteDepartment: (id: string) => void;
    resetDepartments: () => void;
    loading: boolean;
    hasLoaded: boolean;
    error?: string | null;
    fetchDepartments: () => Promise<void>;
};