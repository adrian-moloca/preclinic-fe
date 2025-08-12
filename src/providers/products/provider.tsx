import React, { useState, ReactNode, useEffect } from 'react';
import { MedicalProduct, ProductType } from './types';
import { ProductsContext } from './context';

const LOCAL_STORAGE_KEY = 'products';

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<MedicalProduct[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch {
        console.warn('Failed to parse products from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = (product: MedicalProduct) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (id: string, productUpdate: Partial<MedicalProduct>) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id 
          ? { ...product, ...productUpdate, updatedAt: new Date().toISOString() }
          : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getProductsByType = (type: ProductType) => {
    return products.filter(product => product.type === type);
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const getLowStockProducts = (threshold: number = 10) => {
    return products.filter(product => product.quantity <= threshold);
  };

  const getExpiringProducts = (days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    
    return products.filter(product => {
      const expiryDate = new Date(product.expiryDate);
      return expiryDate <= cutoffDate;
    });
  };

  return (
    <ProductsContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductsByType,
      getProductsByCategory,
      getLowStockProducts,
      getExpiringProducts
    }}>
      {children}
    </ProductsContext.Provider>
  );
};