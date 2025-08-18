export interface FileItem {
  id: string;
  name: string;
  size: number;
  date: string;
  type: string;
  content: string | null;
  isFolder: boolean;
  folderId: string | null;
  fileObject?: File;
  
  // Enhanced features
  patientId?: string;
  patientName?: string;
  category: FileCategory;
  tags: string[];
  version: number;
  versions: FileVersion[];
  sharedWith: string[];
  isTemplate: boolean;
  templateType?: TemplateType;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  isConfidential: boolean;
}

export interface FolderItem {
  id: string;
  name: string;
  parentId: string;
  color: string;
  icon: string;
  createdAt: string;
  fileCount: number;
  isPatientFolder: boolean;
  patientId?: string;
}

export interface FileVersion {
  id: string;
  version: number;
  date: string;
  uploadedBy: string;
  changes: string;
  fileSize: number;
}

export type FileCategory = 
  | 'lab_results'
  | 'prescriptions' 
  | 'medical_reports'
  | 'insurance_documents'
  | 'consent_forms'
  | 'billing'
  | 'imaging'
  | 'patient_records'
  | 'administrative'
  | 'templates'
  | 'other';

export type TemplateType =
  | 'prescription_form'
  | 'lab_request'
  | 'consent_form'
  | 'medical_report'
  | 'insurance_claim'
  | 'patient_intake';

export interface DocumentTemplate {
  id: string;
  name: string;
  type: TemplateType;
  category: FileCategory;
  fields: TemplateField[];
  content: string;
}

export interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'date' | 'select' | 'checkbox' | 'signature';
  required: boolean;
  options?: string[];
  placeholder?: string;
}