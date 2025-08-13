import React, { useState, ReactNode, useEffect } from 'react';
import { MedicalProduct, ProductType } from './types';
import { ProductsContext } from './context';

const LOCAL_STORAGE_KEY = 'products';

export const MOCK_PRODUCTS: MedicalProduct[] = [
  {
    id: 'p1',
    name: 'Paracetamol 500mg',
    type: 'medication',
    category: 'Analgesics',
    manufacturer: 'Terapia',
    batchNumber: 'BATCH123',
    expiryDate: '2026-05-01',
    quantity: 120,
    unitPrice: 0.25,
    unit: 'mg',
    description: 'Pain reliever and fever reducer.',
    activeIngredient: 'Paracetamol',
    dosageForm: 'tablet',
    strength: '500mg',
    prescriptionRequired: false,
    storageConditions: 'Store below 25°C',
    barcode: '5941234567890',
    supplierInfo: {
      name: 'Farmex',
      contactNumber: '0722123456',
      email: 'contact@farmex.ro',
      address: 'Str. Farmaciei 10, Bucuresti'
    },
    createdAt: '2025-08-01T09:00:00.000Z',
    updatedAt: '2025-08-01T09:00:00.000Z',
    status: 'active'
  },
  {
    id: 'p2',
    name: 'Disposable Syringe 5ml',
    type: 'consumables',
    category: 'Injection Supplies',
    manufacturer: 'B Braun',
    batchNumber: 'SYR2025',
    expiryDate: '2027-01-15',
    quantity: 500,
    unitPrice: 0.15,
    unit: 'pieces',
    description: 'Sterile disposable syringe for single use.',
    prescriptionRequired: false,
    storageConditions: 'Store in a dry place',
    supplierInfo: {
      name: 'MedSupply',
      contactNumber: '0733123456',
      email: 'info@medsupply.ro',
      address: 'Str. Medicala 5, Cluj-Napoca'
    },
    createdAt: '2025-08-01T09:00:00.000Z',
    updatedAt: '2025-08-01T09:00:00.000Z',
    status: 'active'
  },
  {
    id: 'p3',
    name: 'Blood Pressure Monitor',
    type: 'medical_equipment',
    category: 'Diagnostic Tools',
    manufacturer: 'Omron',
    batchNumber: 'BP2025',
    expiryDate: '2030-12-31',
    quantity: 10,
    unitPrice: 120,
    unit: 'pieces',
    description: 'Automatic digital blood pressure monitor.',
    prescriptionRequired: false,
    storageConditions: 'Store at room temperature',
    supplierInfo: {
      name: 'Medical Devices SRL',
      contactNumber: '0744123456',
      email: 'sales@medicaldevices.ro',
      address: 'Str. Aparaturii 8, Timisoara'
    },
    createdAt: '2025-08-01T09:00:00.000Z',
    updatedAt: '2025-08-01T09:00:00.000Z',
    status: 'active'
  }
];

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<MedicalProduct[]>(MOCK_PRODUCTS);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Always include mock products
        const merged = [
          ...MOCK_PRODUCTS,
          ...parsed.filter((p: MedicalProduct) => !MOCK_PRODUCTS.some(mp => mp.id === p.id))
        ];
        setProducts(merged);
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
    // Prevent deleting mock products
    if (MOCK_PRODUCTS.some(mp => mp.id === id)) {
      console.warn("❌ Cannot delete mock product:", id);
      return;
    }
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