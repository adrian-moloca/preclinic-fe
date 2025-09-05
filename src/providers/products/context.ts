import { createContext, useContext } from "react";
import { ProductsContextType } from "./types";

export const ProductsContext = createContext<ProductsContextType>({
    products: [],
    stockBatches: [],
    
    addProduct: () => {},
    updateProduct: () => {},
    deleteProduct: () => {},
    getProduct: () => undefined,
    
    addStockBatch: () => {},
    updateStockBatch: () => {},
    deleteStockBatch: () => {},
    
    getProductWithStock: () => undefined,
    getAllProductsWithStock: () => [],
    getTotalQuantityForProduct: () => 0,
    getBatchesForProduct: () => [],
    getExpiringBatches: () => [],
    getLowStockProducts: () => [],
    getProductsByType: () => [],
    getProductsByCategory: () => [],
});

export const useProductsContext = () => {
    const context = useContext(ProductsContext);
    if (context === undefined) {
        throw new Error('useProductsContext must be used within a ProductsProvider');
    }
    return context;
};