import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  Product, 
  StockBatch, 
  ProductWithStock, 
  ProductsContextType, 
  ProductType,
} from './types';

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const PRODUCTS_LOCAL_STORAGE_KEY = 'preclinic_products';
const STOCK_BATCHES_LOCAL_STORAGE_KEY = 'preclinic_stock_batches';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    name: 'Paracetamol',
    type: 'medication',
    category: 'Analgesic',
    manufacturer: 'Pharma Corp',
    activeIngredient: 'Paracetamol',
    dosageForm: 'tablet',
    strength: '500mg',
    unit: 'tablets',
    description: 'Pain reliever and fever reducer',
    prescriptionRequired: false,
    storageConditions: 'Store in cool, dry place',
    barcode: '123456789012',
    supplierInfo: {
      name: 'Medical Supply Co',
      contactNumber: '0123456789',
      email: 'orders@medsupply.com',
      address: '123 Medical St, City'
    },
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

const MOCK_STOCK_BATCHES: StockBatch[] = [
  {
    id: 'batch_001',
    productId: 'prod_001',
    batchNumber: 'PAR2024001',
    expiryDate: '2025-12-31',
    quantity: 100,
    unitPrice: 0.25,
    receivedDate: '2024-01-15T00:00:00.000Z',
    status: 'active',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 'batch_002',
    productId: 'prod_001',
    batchNumber: 'PAR2024002',
    expiryDate: '2024-06-30',
    quantity: 50,
    unitPrice: 0.23,
    receivedDate: '2024-02-01T00:00:00.000Z',
    status: 'active',
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z'
  }
];

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockBatches, setStockBatches] = useState<StockBatch[]>([]);

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem(PRODUCTS_LOCAL_STORAGE_KEY);
      const storedBatches = localStorage.getItem(STOCK_BATCHES_LOCAL_STORAGE_KEY);

      let loadedProducts = [...MOCK_PRODUCTS];
      let loadedBatches = [...MOCK_STOCK_BATCHES];

      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        if (Array.isArray(parsedProducts)) {
          const userProducts = parsedProducts.filter(p => !MOCK_PRODUCTS.find(mp => mp.id === p.id));
          loadedProducts = [...MOCK_PRODUCTS, ...userProducts];
        }
      }

      if (storedBatches) {
        const parsedBatches = JSON.parse(storedBatches);
        if (Array.isArray(parsedBatches)) {
          const userBatches = parsedBatches.filter(b => !MOCK_STOCK_BATCHES.find(mb => mb.id === b.id));
          loadedBatches = [...MOCK_STOCK_BATCHES, ...userBatches];
        }
      }

      setProducts(loadedProducts);
      setStockBatches(loadedBatches);
    } catch (error) {
      setProducts(MOCK_PRODUCTS);
      setStockBatches(MOCK_STOCK_BATCHES);
    }
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      try {
        const userProducts = products.filter(p => !MOCK_PRODUCTS.find(mp => mp.id === p.id));
        localStorage.setItem(PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
      } catch (error) {
        // Ignore localStorage errors
      }
    }
  }, [products]);

  useEffect(() => {
    if (stockBatches.length > 0) {
      try {
        const userBatches = stockBatches.filter(b => !MOCK_STOCK_BATCHES.find(mb => mb.id === b.id));
        localStorage.setItem(STOCK_BATCHES_LOCAL_STORAGE_KEY, JSON.stringify(userBatches));
      } catch (error) {
        // Ignore localStorage errors
      }
    }
  }, [stockBatches]);

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [...prev, product]);
  }, []);

  const updateProduct = useCallback((id: string, productUpdate: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id
          ? { ...product, ...productUpdate, updatedAt: new Date().toISOString() }
          : product
      )
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    if (MOCK_PRODUCTS.some(mp => mp.id === id)) return;
    setProducts(prev => prev.filter(product => product.id !== id));
    setStockBatches(prev => prev.filter(batch => batch.productId !== id));
  }, []);

  const getProduct = useCallback((id: string): Product | undefined => {
    return products.find(product => product.id === id);
  }, [products]);

  const addStockBatch = useCallback((batch: StockBatch) => {
    setStockBatches(prev => [...prev, batch]);
  }, []);

  const updateStockBatch = useCallback((id: string, batchUpdate: Partial<StockBatch>) => {
    setStockBatches(prev =>
      prev.map(batch =>
        batch.id === id
          ? { ...batch, ...batchUpdate, updatedAt: new Date().toISOString() }
          : batch
      )
    );
  }, []);

  const deleteStockBatch = useCallback((id: string) => {
    if (MOCK_STOCK_BATCHES.some(mb => mb.id === id)) return;
    setStockBatches(prev => prev.filter(batch => batch.id !== id));
  }, []);

  const getBatchesForProduct = useCallback((productId: string): StockBatch[] => {
    return stockBatches.filter(batch => batch.productId === productId);
  }, [stockBatches]);

  const getTotalQuantityForProduct = useCallback((productId: string): number => {
    return getBatchesForProduct(productId)
      .filter(batch => batch.status === 'active')
      .reduce((total, batch) => total + batch.quantity, 0);
  }, [getBatchesForProduct]);

  const getProductWithStock = useCallback((productId: string): ProductWithStock | undefined => {
    const product = products.find(p => p.id === productId);
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
      const productWithStock = getProductWithStock(product.id);
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
    getProduct,
    addStockBatch,
    updateStockBatch,
    deleteStockBatch,
    getProductWithStock,
    getAllProductsWithStock,
    getTotalQuantityForProduct,
    getBatchesForProduct,
    getExpiringBatches,
    getLowStockProducts,
    getProductsByType,
    getProductsByCategory
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