export interface ISignIn {
    id: string;
    email: string;
    password: string;
    role: string;
    cabinet: string;
    rememberMe: boolean;
}

export interface ISignInContext {
    signInData: ISignIn | null;
    signInHistory: Record<string, ISignIn>;
    availableCabinets: string[];
    availableRoles: string[];
    setSignInData: (data: ISignIn) => void;
    addSignIn: (signIn: Omit<ISignIn, 'id'>) => Promise<boolean>;
    validateSignInData: (data: Partial<ISignIn>) => { isValid: boolean; errors: string[] };
    clearSignInData: () => void;
    getLastSignInForEmail: (email: string) => ISignIn | undefined;
    resetSignInHistory: () => void;
    setSignInHistory: React.Dispatch<React.SetStateAction<Record<string, ISignIn>>>;
}