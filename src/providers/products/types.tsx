export interface MedicalProduct {
  id: string;
  name: string;
  type: ProductType;
  category: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unitPrice: number;
  unit: MeasurementUnit;
  description: string;
  activeIngredient?: string;
  dosageForm?: DosageForm;
  strength?: string;
  prescriptionRequired: boolean;
  storageConditions: string;
  barcode?: string;
  supplierInfo: SupplierInfo;
  createdAt: string;
  updatedAt: string;
  status: ProductStatus;
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

export type ProductStatus = 'active' | 'discontinued' | 'out_of_stock' | 'expired';

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
  products: MedicalProduct[];
  updateProduct: (id: string, product: Partial<MedicalProduct>) => void;
  deleteProduct: (id: string) => void;
  addProduct: (product: MedicalProduct) => void;
  getProductsByType: (type: ProductType) => MedicalProduct[];
  getProductsByCategory: (category: string) => MedicalProduct[];
  getLowStockProducts: (threshold?: number) => MedicalProduct[];
  getExpiringProducts: (days?: number) => MedicalProduct[];
}