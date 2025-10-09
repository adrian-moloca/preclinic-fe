import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { 
  Product, 
  StockBatch, 
  ProductWithStock, 
  ProductsContextType, 
  ProductType,
} from './types';
import axios from 'axios';
import { useClinicContext } from '../clinic/context';

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockBatches, setStockBatches] = useState<StockBatch[]>([]);
  const { selectedClinic } = useClinicContext();

  const addProduct = async (product: Product) => {
    try {
      const response = await axios.post('/api/product/create', product);
      const newProduct = response.data;
      setProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  }

  const updateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    try {
      const response = await axios.put(`/api/product/patch/${id}`, updatedProduct);
      const updated = response.data;
      setProducts(prev => prev.map(product => product._id === id ? updated : product));
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const response = await axios.delete(`/api/product/delete/${id}`);
      const deletedProduct = response.data;
      setProducts(prev => prev.filter(product => product._id !== deletedProduct._id));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  }

  const getAllProductsByClinic = async () => {
    try {
      const clinicId = selectedClinic?._id;
      
      if (!clinicId) {
        console.warn('No clinic selected, cannot fetch products');
        setProducts([]);
        return;
      }
      
      const response = await axios.get(`/api/product/getAllByClinic/${clinicId}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }

  const addStockBatch = async (batch: StockBatch) => {
    try {
      const batchWithClinic = {
        ...batch,
        clinicId: selectedClinic?._id,
        productId: batch.productId  
      };
      
      const response = await axios.post('/api/stockBatch/create', batchWithClinic);
      const newBatch = response.data;
      setStockBatches(prev => [...prev, newBatch]);
    } catch (error) {
      console.error('Failed to add stock batch:', error);
      throw error;
    }
  }

  const addProductWithBatch = async (
    productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>, 
    batchData: Omit<StockBatch, 'productId' | 'clinicId' | '_id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      // Step 1: Create the product with clinic ID
      const productWithClinic = {
        ...productData,
        clinic: selectedClinic?._id
      };
      
      const productResponse = await axios.post('/api/product/create', productWithClinic);
      const newProduct = productResponse.data;
      
      const batchWithIds = {
        ...batchData,
        productId: newProduct._id,
        clinicId: selectedClinic?._id
      };
      
      const batchResponse = await axios.post('/api/stockBatch/create', batchWithIds);
      const newBatch = batchResponse.data;
      
      setProducts(prev => [...prev, newProduct]);
      setStockBatches(prev => [...prev, newBatch]);
      
      return { product: newProduct, batch: newBatch };
      
    } catch (error) {
      console.error('Failed to add product with batch:', error);
      throw error;
    }
  };

  const getAllBatchesStockByClinic = async () => {
    try {
      const clinicId = selectedClinic?._id;
      
      if (!clinicId) {
        console.warn('No clinic selected, cannot fetch stock batches');
        setStockBatches([]);
        return;
      }
      
      const response = await axios.get(`/api/stockBatch/getAllByClinic/${clinicId}`);
      setStockBatches(response.data);
    } catch (error) {
      console.error('Failed to fetch stock batches:', error);
    }
  }

const updateStockBatch = async (id: string, updatedBatch: Partial<StockBatch>) => {
  try {
    // Check if ID is valid before making the request
    if (!id) {
      console.error('Cannot update batch: No ID provided');
      return;
    }
    
    const response = await axios.put(`/api/stockBatch/patch/${id}`, updatedBatch);
    const updated = response.data;
    setStockBatches(prev => prev.map(batch => batch._id === id ? updated : batch));
  } catch (error) {
    console.error('Failed to update stock batch:', error);
  }
}

  const deleteStockBatch = async (id: string) => {
    try {
      const response = await axios.delete(`/api/stockBatch/delete/${id}`);
      const deletedBatch = response.data;
      setStockBatches(prev => prev.filter(batch => batch._id !== deletedBatch.id));
    } catch (error) {
      console.error('Failed to delete stock batch:', error);
    }
  }

  const getBatchesForProduct = useCallback((productId: string): StockBatch[] => {
    return stockBatches.filter(batch => batch.productId === productId);
  }, [stockBatches]);

  const getTotalQuantityForProduct = useCallback((productId: string): number => {
    return getBatchesForProduct(productId)
      .filter(batch => batch.status === 'active')
      .reduce((total, batch) => total + batch.quantity, 0);
  }, [getBatchesForProduct]);

  const getProductWithStock = useCallback((productId: string): ProductWithStock | undefined => {
    const product = products.find(p => p._id === productId);
    if (!product) return undefined;

    const batches = getBatchesForProduct(productId);
    const activeBatches = batches.filter(b => b.status === 'active');
    const totalQuantity = activeBatches.reduce((sum, b) => sum + b.quantity, 0);

    const nearestExpiry = activeBatches.length > 0
      ? activeBatches
          .map(b => b.expiryDate)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0]
      : undefined;

    const averagePrice = activeBatches.length > 0 && totalQuantity > 0
      ? activeBatches.reduce((sum, b) => sum + b.unitPrice * b.quantity, 0) / totalQuantity
      : 0;

    return {
      ...product,
      batches,
      totalQuantity,
      nearestExpiry,
      averagePrice,
      batchCount: batches.length
    };
  }, [products, getBatchesForProduct]);

  const getAllProductsWithStock = useCallback((): ProductWithStock[] => {
    return products.map(product => {
      const productWithStock = getProductWithStock(product._id ?? '');
      return productWithStock;
    }).filter(Boolean) as ProductWithStock[];
  }, [products, getProductWithStock]);

  const getExpiringBatches = useCallback((days: number = 30): StockBatch[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    return stockBatches.filter(batch => {
      const expiryDate = new Date(batch.expiryDate);
      return expiryDate <= cutoffDate && batch.status === 'active';
    });
  }, [stockBatches]);

  const getLowStockProducts = useCallback((threshold: number = 10): ProductWithStock[] => {
    return getAllProductsWithStock().filter(product => product.totalQuantity <= threshold);
  }, [getAllProductsWithStock]);

  const getProductsByType = useCallback((type: ProductType): ProductWithStock[] => {
    return getAllProductsWithStock().filter(product => product.type === type);
  }, [getAllProductsWithStock]);

  const getProductsByCategory = useCallback((category: string): ProductWithStock[] => {
    return getAllProductsWithStock().filter(product => product.category === category);
  }, [getAllProductsWithStock]);

  const contextValue: ProductsContextType = {
    products,
    stockBatches,
    addProduct,
    updateProduct,
    deleteProduct,
    addStockBatch,
    updateStockBatch,
    getAllProductsByClinic,
    deleteStockBatch,
    addProductWithBatch,
    getProductWithStock,
    getAllProductsWithStock,
    getTotalQuantityForProduct,
    getBatchesForProduct,
    getExpiringBatches,
    getLowStockProducts,
    getProductsByType,
    getProductsByCategory,
    getAllBatchesStockByClinic
  };

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProductsContext must be used within a ProductsProvider');
  }
  return context;
};

export { ProductsContext };