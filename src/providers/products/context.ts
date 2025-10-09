import { createContext, useContext } from "react";
import { ProductsContextType } from "./types";

export const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProductsContext = () => {
    const context = useContext(ProductsContext);
    if (context === undefined) {
        throw new Error('useProductsContext must be used within a ProductsProvider');
    }
    return context;
};