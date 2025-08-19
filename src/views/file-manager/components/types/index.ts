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
  
  // NEW: OCR and Processing Features
  ocrText?: string;
  isOcrProcessed?: boolean;
  ocrLanguage?: string;
  extractedData?: ExtractedMedicalData;
  processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  
  // NEW: Access tracking
  accessLog?: AccessLogEntry[];
  lastAccessed?: string;
  accessCount?: number;
  
  // NEW: Mobile features
  capturedLocation?: GeolocationCoordinates;
  voiceNotes?: VoiceNote[];
  
  // NEW: File processing
  originalFileId?: string;
  processedFrom?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  color: string;
  icon: string;
  createdAt: string;
  fileCount: number;
  isPatientFolder: boolean;
}

export interface FileVersion {
  id: string;
  version: number;
  date: string;
  uploadedBy: string;
  changes: string;
  fileSize: number;
}

export interface ExtractedMedicalData {
  patientName?: string;
  dateOfBirth?: string;
  medicalRecordNumber?: string;
  doctorName?: string;
  facilityName?: string;
  medications?: string[];
  testResults?: string[];
  [key: string]: string | string[] | undefined;
}

export interface AccessLogEntry {
  timestamp: string;
  action: 'view' | 'download' | 'edit' | 'share' | 'delete';
  userId?: string;
  userAgent?: string;
  location?: string;
}

export interface VoiceNote {
  id: string;
  timestamp: string;
  duration: number;
  transcription?: string;
  audioBlob?: Blob;
}

export interface SearchFilters {
  textSearch?: string;
  categoryFilter?: FileCategory | 'all';
  patientFilter?: string;
  tagFilter?: string;
  dateRange?: { start: Date; end: Date };
  sizeRange?: { min: number; max: number };
  hasOCR?: boolean;
  isConfidential?: boolean;
  isShared?: boolean;
  accessedRecently?: boolean;
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
  | 'consent_form'
  | 'medical_form'
  | 'prescription_template'
  | 'report_template'
  | 'insurance_form';