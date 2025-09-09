import { createContext, useContext } from "react";
import { ISignInContext } from "./types";

export const SignInContext = createContext<ISignInContext>({
    signInData: null,
    signInHistory: {},
    availableCabinets: [],
    availableRoles: [],
    setSignInData: () => { },
    addSignIn: async () => false,
    validateSignInData: () => ({ isValid: false, errors: [] }),
    clearSignInData: () => { },
    getLastSignInForEmail: () => undefined,
    resetSignInHistory: () => { },
    setSignInHistory: () => { },
    saveSignInInfo: () => { },
});

export const useSignInContext = () => useContext(SignInContext);