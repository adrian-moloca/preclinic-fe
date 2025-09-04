import { createContext, useContext } from "react";
import { IRegisterContext } from "./types";

export const RegisterContext = createContext<IRegisterContext>({
    registrations: {},
    addRegister: async () => false,
    getRegistrationByEmail: () => undefined,
    validateRegistration: () => ({ isValid: false, errors: [] }),
    isEmailTaken: () => false,
    resetRegistrations: () => {},
    setRegistrations: () => {},
});

export const useRegisterContext = () => useContext(RegisterContext);