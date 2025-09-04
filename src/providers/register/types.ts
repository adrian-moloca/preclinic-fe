export interface IRegister {
    id: string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface IRegisterContext {
    registrations: Record<string, IRegister>;
    addRegister: (registration: Omit<IRegister, 'id'>) => Promise<boolean>;
    getRegistrationByEmail: (email: string) => IRegister | undefined;
    validateRegistration: (data: Partial<IRegister>) => { isValid: boolean; errors: string[] };
    isEmailTaken: (email: string) => boolean;
    resetRegistrations: () => void;
    setRegistrations: React.Dispatch<React.SetStateAction<Record<string, IRegister>>>;
}