import { createContext, useContext } from "react";
import { ProductsContextType } from "./types";

export const ProductsContext = createContext<ProductsContextType>({
    products: [],
    addProduct: () => {},
    updateProduct: () => {},
    deleteProduct: () => {},
    getProductsByType: () => [],
    getProductsByCategory: () => [],
    getLowStockProducts: () => [],
    getExpiringProducts: () => [],
});

export const useProductsContext = () => useContext(ProductsContext);