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
  
  // OCR and Processing Features
  ocrText?: string;
  isOcrProcessed?: boolean;
  ocrLanguage?: string;
  extractedData?: ExtractedMedicalData;
  processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  
  // Access tracking
  accessLog?: AccessLogEntry[];
  lastAccessed?: string;
  accessCount?: number;
  
  // Mobile features
  capturedLocation?: GeolocationCoordinates;
  voiceNotes?: VoiceNote[];
  
  // File processing
  originalFileId?: string;
  processedFrom?: string;
  
  // NEW: Medical AI annotations
  annotations?: any;
  clinicalInsights?: MedicalInsight[];
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
  documentType?: string;
  dateOfService?: string;
  medications?: string[];
  testResults?: string[];
  diagnoses?: string[];
  vitalSigns?: {
    temperature?: string;
    heartRate?: string;
    bloodPressure?: string;
    [key: string]: string | undefined;
  };
  [key: string]: string | string[] | object | undefined;
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

// NEW: Medical AI interfaces
export interface MedicalInsight {
  type: 'medication' | 'vital' | 'diagnosis' | 'appointment' | 'warning';
  text: string;
  confidence: number;
  source: string;
}

export interface ClinicalRecommendation {
  id: string;
  type: 'medication_interaction' | 'follow_up' | 'screening' | 'lifestyle' | 'referral';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  evidence: string;
  actionRequired: boolean;
  relatedFiles: string[];
}

export interface ComplianceMetrics {
  encryptionStatus: number;
  accessControlCompliance: number;
  auditTrailCoverage: number;
  retentionPolicyCompliance: number;
  overallScore: number;
}

export interface SecurityAlert {
  id: string;
  type: 'unauthorized_access' | 'retention_violation' | 'encryption_issue' | 'access_pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  fileId?: string;
  userId?: string;
  resolved: boolean;
}

export interface DICOMMetadata {
  patientName?: string;
  studyDate?: string;
  modality?: string;
  bodyPart?: string;
  studyDescription?: string;
  seriesDescription?: string;
  instanceNumber?: number;
  sliceThickness?: string;
  pixelSpacing?: string;
}

export interface Measurement {
  id: string;
  type: 'line' | 'angle' | 'area' | 'circle';
  points: { x: number; y: number }[];
  value: number;
  unit: string;
}

export interface PatientSummary {
  patientId: string;
  patientName: string;
  totalDocuments: number;
  recentVisits: number;
  activeConditions: string[];
  currentMedications: string[];
  riskFactors: string[];
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