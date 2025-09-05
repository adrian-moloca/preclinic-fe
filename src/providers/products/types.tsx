export interface Product {
  id: string;
  name: string;
  type: ProductType;
  category: string;
  manufacturer: string;
  activeIngredient?: string;
  dosageForm?: DosageForm;
  strength?: string;
  unit: MeasurementUnit;
  description: string;
  prescriptionRequired: boolean;
  storageConditions: string;
  barcode?: string;
  supplierInfo: SupplierInfo;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StockBatch {
  id: string;
  productId: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unitPrice: number;
  receivedDate: string;
  status: BatchStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithStock extends Product {
  batches: StockBatch[];
  totalQuantity: number;
  nearestExpiry?: string;
  averagePrice: number;
  batchCount: number;
}

export interface SupplierInfo {
  name: string;
  contactNumber: string;
  email: string;
  address: string;
}

export type ProductType = 
  | 'medication'
  | 'medical_equipment'
  | 'consumables'
  | 'diagnostic_tools'
  | 'surgical_instruments'
  | 'first_aid'
  | 'laboratory_supplies';

export type ProductStatus = 'active' | 'discontinued';

export type BatchStatus = 'active' | 'expired' | 'recalled' | 'depleted';

export type MeasurementUnit = 
  | 'pieces'
  | 'bottles'
  | 'boxes'
  | 'vials'
  | 'tubes'
  | 'packs'
  | 'units'
  | 'ml'
  | 'mg'
  | 'g'
  | 'tablets'
  | 'kg';

export type DosageForm = 
  | 'tablet'
  | 'capsule'
  | 'syrup'
  | 'injection'
  | 'cream'
  | 'ointment'
  | 'drops'
  | 'inhaler'
  | 'patch'
  | 'suppository';

export interface ProductsContextType {
  products: Product[];
  stockBatches: StockBatch[];
  
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  
  addStockBatch: (batch: StockBatch) => void;
  updateStockBatch: (id: string, batch: Partial<StockBatch>) => void;
  deleteStockBatch: (id: string) => void;
  
  getProductWithStock: (productId: string) => ProductWithStock | undefined;
  getAllProductsWithStock: () => ProductWithStock[];
  getTotalQuantityForProduct: (productId: string) => number;
  getBatchesForProduct: (productId: string) => StockBatch[];
  getExpiringBatches: (days?: number) => StockBatch[];
  getLowStockProducts: (threshold?: number) => ProductWithStock[];
  getProductsByType: (type: ProductType) => ProductWithStock[];
  getProductsByCategory: (category: string) => ProductWithStock[];
}

export interface MedicalProduct extends Product {
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unitPrice: number;
}