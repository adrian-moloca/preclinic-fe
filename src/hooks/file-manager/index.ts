import { useState, useEffect, useRef, useMemo } from "react";
import { AccessLogEntry, ExtractedMedicalData, FileCategory, FileItem, FolderItem, SearchFilters } from "../../views/file-manager/components/types";
import { usePatientsContext } from "../../providers/patients";

const PAGE_SIZE = 15;

const FILE_CATEGORIES = [
  { value: 'lab_results', label: 'Lab Results', color: '#4CAF50', icon: 'science' },
  { value: 'prescriptions', label: 'Prescriptions', color: '#FF9800', icon: 'medication' },
  { value: 'medical_reports', label: 'Medical Reports', color: '#2196F3', icon: 'description' },
  { value: 'insurance_documents', label: 'Insurance', color: '#9C27B0', icon: 'security' },
  { value: 'consent_forms', label: 'Consent Forms', color: '#795548', icon: 'assignment' },
  { value: 'billing', label: 'Billing', color: '#607D8B', icon: 'receipt' },
  { value: 'imaging', label: 'Imaging', color: '#E91E63', icon: 'camera' },
  { value: 'patient_records', label: 'Patient Records', color: '#3F51B5', icon: 'folder_shared' },
  { value: 'administrative', label: 'Administrative', color: '#757575', icon: 'business_center' },
  { value: 'templates', label: 'Templates', color: '#00BCD4', icon: 'description' },
  { value: 'other', label: 'Other', color: '#8BC34A', icon: 'insert_drive_file' }
];

interface UndoAction {
  type: 'delete' | 'move' | 'rename';
  files: FileItem[];
  previousFolder?: string;
}

export function useFileManager() {
  const [files, setFiles] = useState<FileItem[]>(() => {
    try {
      const stored = localStorage.getItem("enhanced_files");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  
  const [folders, setFolders] = useState<FolderItem[]>(() => {
    try {
      const stored = localStorage.getItem("file_folders");
      return stored ? JSON.parse(stored) : [
        {
          id: 'root',
          name: 'Root',
          parentId: null,
          color: '#2196F3',
          icon: 'folder',
          createdAt: new Date().toISOString(),
          fileCount: 0,
          isPatientFolder: false
        }
      ];
    } catch {
      return [];
    }
  });

  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<FileCategory | 'all'>('all');
  const [patientFilter, setPatientFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string>('');
  const [showOnlyShared, setShowOnlyShared] = useState(false);
  const [showOnlyConfidential, setShowOnlyConfidential] = useState(false);
  
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("search_history") || "[]");
    } catch {
      return [];
    }
  });
  
  const [sortBy, setSortBy] = useState<"name" | "date" | "size" | "category" | "patient">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuFileId, setMenuFileId] = useState<string>("");
  
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [moveFilesOpen, setMoveFilesOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  
  const [ocrDialogOpen, setOcrDialogOpen] = useState(false);
  const [fileProcessingOpen, setFileProcessingOpen] = useState(false);
  const [mobileIntegrationsOpen, setMobileIntegrationsOpen] = useState(false);
  const [securityDashboardOpen, setSecurityDashboardOpen] = useState(false);
  const [ocrDataViewerOpen, setOcrDataViewerOpen] = useState(false);
  
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<FileItem>>({});
  const [currentPreviewFile, setCurrentPreviewFile] = useState<FileItem | null>(null);
  const [selectedFileForHistory, setSelectedFileForHistory] = useState<FileItem | null>(null);
  const [shareUsers, setShareUsers] = useState<string[]>([]);
  const [shareNote, setShareNote] = useState('');
  const [currentOCRFile, setCurrentOCRFile] = useState<FileItem | null>(null);
  
  const [ocrProgress, setOcrProgress] = useState<{ [fileId: string]: number }>({});
  const [processingQueue] = useState<string[]>([]);
  const [selectedFilesForProcessing, setSelectedFilesForProcessing] = useState<string[]>([]);
  
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentRecording, setCurrentRecording] = useState<MediaRecorder | null>(null);
  
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedPatientForUpload, setSelectedPatientForUpload] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('other');
  const [fileTags, setFileTags] = useState<string>('');
  const [fileDescription, setFileDescription] = useState('');
  const [isConfidential, setIsConfidential] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [dragging, setDragging] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { patients } = usePatientsContext();

  useEffect(() => {
    localStorage.setItem("enhanced_files", JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem("file_folders", JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem("search_history", JSON.stringify(searchHistory));
  }, [searchHistory]);

  const currentFolder = folders.find(f => f.id === currentFolderId) || folders[0];
  
  const breadcrumbs = useMemo(() => {
    const crumbs: FolderItem[] = [];
    let current: FolderItem | null = currentFolder;
    
    while (current && current.id !== 'root') {
      crumbs.unshift(current);
      const parentId: string | null | undefined = current.parentId;
      current = folders.find(f => f.id === parentId) || null;
    }
    
    return crumbs;
  }, [currentFolder, folders]);

  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      if (file.folderId !== currentFolderId) return false;
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesName = file.name.toLowerCase().includes(searchLower);
        const matchesDescription = file.description?.toLowerCase().includes(searchLower);
        const matchesPatient = file.patientName?.toLowerCase().includes(searchLower);
        const matchesOCR = file.ocrText?.toLowerCase().includes(searchLower);
        
        if (!matchesName && !matchesDescription && !matchesPatient && !matchesOCR) {
          return false;
        }
      }
      
      if (searchFilters.categoryFilter && searchFilters.categoryFilter !== 'all' && file.category !== searchFilters.categoryFilter) return false;
      if (searchFilters.patientFilter && file.patientId !== searchFilters.patientFilter) return false;
      if (searchFilters.hasOCR !== undefined && (!!file.ocrText) !== searchFilters.hasOCR) return false;
      if (searchFilters.isConfidential !== undefined && file.isConfidential !== searchFilters.isConfidential) return false;
      if (searchFilters.isShared !== undefined && (file.sharedWith.length > 0) !== searchFilters.isShared) return false;
      
      if (searchFilters.dateRange) {
        const fileDate = new Date(file.date);
        if (fileDate < searchFilters.dateRange.start || fileDate > searchFilters.dateRange.end) return false;
      }
      
      if (searchFilters.sizeRange) {
        if (file.size < searchFilters.sizeRange.min || file.size > searchFilters.sizeRange.max) return false;
      }
      
      if (categoryFilter !== 'all' && file.category !== categoryFilter) return false;
      if (patientFilter && file.patientId !== patientFilter) return false;
      if (tagFilter && !file.tags.some((tag: string) => tag.toLowerCase().includes(tagFilter.toLowerCase()))) return false;
      if (showOnlyShared && file.sharedWith.length === 0) return false;
      if (showOnlyConfidential && !file.isConfidential) return false;
      
      return true;
    });
  }, [files, currentFolderId, searchTerm, categoryFilter, patientFilter, tagFilter, showOnlyShared, showOnlyConfidential, searchFilters]);

  const sortedFiles = useMemo(() => {
    return [...filteredFiles].sort((a, b) => {
      let res = 0;
      switch (sortBy) {
        case "name":
          res = a.name.localeCompare(b.name);
          break;
        case "date":
          res = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "size":
          res = a.size - b.size;
          break;
        case "category":
          res = a.category.localeCompare(b.category);
          break;
        case "patient":
          res = (a.patientName || '').localeCompare(b.patientName || '');
          break;
      }
      return sortDir === "asc" ? res : -res;
    });
  }, [filteredFiles, sortBy, sortDir]);

  const totalPages = Math.ceil(sortedFiles.length / PAGE_SIZE);
  const pageFiles = sortedFiles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const currentFolders = folders.filter(f => f.parentId === currentFolderId);

  function getFileIcon(fileType: string) {
    if (fileType.startsWith("image/")) return 'Image';
    if (fileType === "application/pdf") return 'PictureAsPdf';
    if (fileType.startsWith("video/")) return 'VideoFile';
    if (fileType.startsWith("audio/")) return 'AudioFile';
    return 'InsertDriveFile';
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function getCategoryInfo(category: FileCategory) {
    return FILE_CATEGORIES.find(cat => cat.value === category) || FILE_CATEGORIES[FILE_CATEGORIES.length - 1];
  }

  function renderPreview(file: FileItem) {
    return {
      isImage: file.type.startsWith("image/") && file.content,
      content: file.content,
      name: file.name
    };
  }

  function logFileAccess(fileId: string, action: 'view' | 'download' | 'edit' | 'share' | 'delete') {
    const timestamp = new Date().toISOString();
    const logEntry: AccessLogEntry = {
      timestamp,
      action,
      userId: 'current-user',
      userAgent: navigator.userAgent,
      location: window.location.href
    };

    setFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        const newAccessLog = [...(f.accessLog || []), logEntry];
        return {
          ...f,
          accessLog: newAccessLog.slice(-50),
          lastAccessed: timestamp,
          accessCount: (f.accessCount || 0) + 1
        };
      }
      return f;
    }));
  }

  function dataURLToBlob(dataURL: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        const arr = dataURL.split(',');
        if (arr.length !== 2) {
          throw new Error('Invalid data URL format');
        }
        
        const mime = arr[0].match(/:(.*?);/)?.[1];
        if (!mime) {
          throw new Error('Could not extract MIME type from data URL');
        }
        
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        
        resolve(new Blob([u8arr], { type: mime }));
      } catch (error) {
        reject(error);
      }
    });
  }

  function dataURLToBlobSync(dataURL: string): Blob {
    try {
      const arr = dataURL.split(',');
      if (arr.length !== 2) {
        throw new Error('Invalid data URL format');
      }
      
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      
      return new Blob([u8arr], { type: mime });
    } catch (error) {
      console.error('Failed to convert data URL to blob:', error);
      throw new Error('Could not convert file data for download');
    }
  }

  async function convertPDFToImage(file: any): Promise<Blob> {
    try {
      if (!file.fileObject) {
        throw new Error('No PDF file object found');
      }

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Could not get canvas context');
      }

      canvas.width = 800;
      canvas.height = 600;
      context.fillStyle = 'white';
      context.fillRect(0, 0, 800, 600);
      context.fillStyle = 'black';
      context.font = '16px Arial';
      context.fillText('PDF OCR not fully implemented yet', 50, 100);
      context.fillText('Please use image files for now', 50, 130);

      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert PDF to image'));
          }
        }, 'image/png');
      });

    } catch (error) {
      console.error('PDF to image conversion failed:', error);
      throw error;
    }
  }

  async function processFileWithOCR(fileId: string, language: string = 'eng') {
    const file = files.find(f => f.id === fileId);
    if (!file) {
      console.error('File not found for OCR processing');
      return;
    }

    console.log('Starting OCR for file:', file.name, 'Type:', file.type);

    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, processingStatus: 'processing', isOcrProcessed: false } : f
    ));

    try {
      let imageSource;

      if (file.type.startsWith('image/')) {
        if (file.fileObject) {
          imageSource = file.fileObject;
          console.log('Using file object for OCR');
        } else if (file.content && file.content.startsWith('data:')) {
          imageSource = await dataURLToBlob(file.content);
          console.log('Converted data URL to blob for OCR');
        } else {
          throw new Error('No valid image source found');
        }
      } else if (file.type === 'application/pdf') {
        imageSource = await convertPDFToImage(file);
        console.log('Converted PDF to image for OCR');
      } else {
        throw new Error(`Unsupported file type for OCR: ${file.type}`);
      }

      if (!imageSource) {
        throw new Error('Failed to prepare image source for OCR');
      }

      console.log('Image source prepared, starting OCR...');

      const { createWorker } = await import('tesseract.js');
      
      const worker = await createWorker(language, 1, {
        logger: (m: any) => {
          console.log('Tesseract log:', m);
          if (m.status === 'recognizing text' && typeof m.progress === 'number') {
            setOcrProgress(prev => ({ ...prev, [fileId]: m.progress }));
          }
        }
      });

      console.log('Worker created, recognizing text...');

      const result = await worker.recognize(imageSource);

      console.log('OCR completed, text length:', result.data.text.length);

      await worker.terminate();

      const extractedData = extractMedicalDataFromText(result.data.text);

      setFiles(prev => prev.map(f => {
        if (f.id === fileId) {
          return {
            ...f,
            ocrText: result.data.text,
            isOcrProcessed: true,
            ocrLanguage: language,
            extractedData,
            processingStatus: 'completed',
            patientName: extractedData.patientName || f.patientName,
            description: f.description || `OCR processed: ${extractedData.patientName || 'Document'}`
          };
        }
        return f;
      }));

      setOcrProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });

      console.log('OCR processing completed successfully');

    } catch (error) {
      console.error('OCR processing failed:', error);
      
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, processingStatus: 'failed' } : f
      ));
      
      setOcrProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
    }
  }

  function extractMedicalDataFromText(text: string): ExtractedMedicalData {
    const extractedData: ExtractedMedicalData = {};

    const patterns = {
      patientName: /Patient:?\s*([A-Za-z\s]+)/i,
      dateOfBirth: /(?:DOB|Date of Birth):?\s*(\d{1,2}\/\d{1,2}\/\d{4})/i,
      medicalRecordNumber: /(?:MRN|Medical Record):?\s*([A-Z0-9]+)/i,
      doctorName: /(?:Dr\.|Doctor|Physician):?\s*([A-Za-z\s]+)/i,
      facilityName: /(?:Hospital|Clinic|Medical Center):?\s*([A-Za-z\s]+)/i
    };

    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = text.match(pattern);
      if (match && match[1]) {
        (extractedData as any)[key] = match[1].trim();
      }
    });

    const medicationPatterns = /(?:medication|drug|prescription):?\s*([A-Za-z\s,]+)/gi;
    const medications: string[] = [];
    let medicationMatch;
    while ((medicationMatch = medicationPatterns.exec(text)) !== null) {
      if (medicationMatch[1]) {
        medications.push(medicationMatch[1].trim());
      }
    }
    if (medications.length > 0) {
      extractedData.medications = medications;
    }

    const testResultPatterns = /(?:result|value|level):?\s*([0-9.]+\s*[A-Za-z/]*)/gi;
    const testResults: string[] = [];
    let testMatch;
    while ((testMatch = testResultPatterns.exec(text)) !== null) {
      if (testMatch[0]) {
        testResults.push(testMatch[0].trim());
      }
    }
    if (testResults.length > 0) {
      extractedData.testResults = testResults;
    }

    return extractedData;
  }

  function viewOCRData(fileId: string) {
    const file = files.find(f => f.id === fileId);
    if (!file || !file.isOcrProcessed) {
      alert('No OCR data available for this file.');
      return;
    }
    
    setCurrentOCRFile(file);
    setOcrDataViewerOpen(true);
  }

  async function mergePDFs(fileIds: string[]) {
    const pdfFiles = files.filter(f => fileIds.includes(f.id) && f.type === 'application/pdf');
    if (pdfFiles.length < 2) return;

    try {
      const { PDFDocument } = await import('pdf-lib');
      const mergedPdf = await PDFDocument.create();

      for (const file of pdfFiles) {
        if (file.fileObject) {
          const arrayBuffer = await file.fileObject.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
      }

      const pdfBytes = await mergedPdf.save();
      
      const uint8Array = new Uint8Array(pdfBytes);
      const blob = new Blob([uint8Array], { type: 'application/pdf' });
      
      const file = new File([blob], `merged-${Date.now()}.pdf`, { type: 'application/pdf' });

      const mergedFileItem: FileItem = {
        id: crypto.randomUUID(),
        name: `Merged-${pdfFiles.map(f => f.name.split('.')[0]).join('-')}.pdf`,
        size: blob.size,
        date: new Date().toISOString(),
        type: 'application/pdf',
        content: null,
        isFolder: false,
        folderId: currentFolderId,
        fileObject: file,
        category: 'medical_reports',
        tags: ['merged', 'pdf'],
        version: 1,
        versions: [{
          id: crypto.randomUUID(),
          version: 1,
          date: new Date().toISOString(),
          uploadedBy: 'Current User',
          changes: `Merged from ${pdfFiles.length} PDFs`,
          fileSize: blob.size
        }],
        sharedWith: [],
        isTemplate: false,
        description: `Merged PDF from: ${pdfFiles.map(f => f.name).join(', ')}`,
        priority: 'medium',
        isConfidential: false,
        processedFrom: 'pdf_merge',
        originalFileId: fileIds[0],
        accessLog: [],
        accessCount: 0
      };

      setFiles(prev => [...prev, mergedFileItem]);
    } catch (error) {
      console.error('PDF merge failed:', error);
    }
  }

  async function convertImageToPDF(fileIds: string[]) {
    const imageFiles = files.filter(f => fileIds.includes(f.id) && f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    try {
      const { default: jsPDF } = await import('jspdf');
      const pdf = new jsPDF();
      
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        if (file.content) {
          if (i > 0) pdf.addPage();
          
          const img = new Image();
          img.src = file.content;
          
          await new Promise<void>(resolve => {
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d')!;
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              
              const imgData = canvas.toDataURL('image/jpeg', 0.95);
              const imgProps = pdf.getImageProperties(imgData);
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
              
              pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
              resolve();
            };
          });
        }
      }

      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], `converted-${Date.now()}.pdf`, { type: 'application/pdf' });

      const convertedFileItem: FileItem = {
        id: crypto.randomUUID(),
        name: `Converted-${imageFiles.map(f => f.name.split('.')[0]).join('-')}.pdf`,
        size: pdfBlob.size,
        date: new Date().toISOString(),
        type: 'application/pdf',
        content: null,
        isFolder: false,
        folderId: currentFolderId,
        fileObject: pdfFile,
        category: 'medical_reports',
        tags: ['converted', 'pdf'],
        version: 1,
        versions: [{
          id: crypto.randomUUID(),
          version: 1,
          date: new Date().toISOString(),
          uploadedBy: 'Current User',
          changes: `Converted from ${imageFiles.length} images`,
          fileSize: pdfBlob.size
        }],
        sharedWith: [],
        isTemplate: false,
        description: `Converted PDF from: ${imageFiles.map(f => f.name).join(', ')}`,
        priority: 'medium',
        isConfidential: false,
        processedFrom: 'image_to_pdf',
        originalFileId: fileIds[0],
        accessLog: [],
        accessCount: 0
      };

      setFiles(prev => [...prev, convertedFileItem]);
    } catch (error) {
      console.error('Image to PDF conversion failed:', error);
    }
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d')!;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const timestamp = new Date().toISOString();
        const file = new File([blob], `capture-${timestamp}.jpg`, { type: 'image/jpeg' });
        
        const capturedFileItem: FileItem = {
          id: crypto.randomUUID(),
          name: `Camera-Capture-${new Date().toLocaleDateString()}.jpg`,
          size: blob.size,
          date: timestamp,
          type: 'image/jpeg',
          content: canvas.toDataURL(),
          isFolder: false,
          folderId: currentFolderId,
          fileObject: file,
          category: 'imaging',
          tags: ['camera', 'mobile'],
          version: 1,
          versions: [{
            id: crypto.randomUUID(),
            version: 1,
            date: timestamp,
            uploadedBy: 'Current User',
            changes: 'Captured via mobile camera',
            fileSize: blob.size
          }],
          sharedWith: [],
          isTemplate: false,
          description: 'Document captured using mobile camera',
          priority: 'medium',
          isConfidential: false,
          processedFrom: 'camera_capture',
          accessLog: [],
          accessCount: 0
        };

        setFiles(prev => [...prev, capturedFileItem]);
        stopCamera();
      }
    }, 'image/jpeg', 0.95);
  }

  async function startVoiceRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], `voice-note-${Date.now()}.wav`, { type: 'audio/wav' });
        
        const voiceNoteFile: FileItem = {
          id: crypto.randomUUID(),
          name: `Voice-Note-${new Date().toLocaleDateString()}.wav`,
          size: audioBlob.size,
          date: new Date().toISOString(),
          type: 'audio/wav',
          content: null,
          isFolder: false,
          folderId: currentFolderId,
          fileObject: audioFile,
          category: 'other',
          tags: ['voice', 'recording'],
          version: 1,
          versions: [{
            id: crypto.randomUUID(),
            version: 1,
            date: new Date().toISOString(),
            uploadedBy: 'Current User',
            changes: 'Voice note recorded',
            fileSize: audioBlob.size
          }],
          sharedWith: [],
          isTemplate: false,
          description: 'Voice note recording',
          priority: 'medium',
          isConfidential: false,
          processedFrom: 'voice_recording',
          accessLog: [],
          accessCount: 0
        };

        setFiles(prev => [...prev, voiceNoteFile]);
        stream.getTracks().forEach(track => track.stop());
      };

      setCurrentRecording(mediaRecorder);
      setIsRecording(true);
      mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  }

  function stopVoiceRecording() {
    if (currentRecording && isRecording) {
      currentRecording.stop();
      setCurrentRecording(null);
      setIsRecording(false);
    }
  }

  function performAdvancedSearch(filters: SearchFilters) {
    setSearchFilters(filters);
    setCurrentPage(1);
    
    if (filters.textSearch && !searchHistory.includes(filters.textSearch)) {
      setSearchHistory(prev => [filters.textSearch!, ...prev.slice(0, 9)]);
    }
  }

  function clearSearch() {
    setSearchTerm('');
    setSearchFilters({});
    setCategoryFilter('all');
    setPatientFilter(null);
    setTagFilter('');
    setShowOnlyShared(false);
    setShowOnlyConfidential(false);
    setCurrentPage(1);
  }

  function openEditDialog(fileId: string) {
    logFileAccess(fileId, 'edit');
    
    const file = files.find(f => f.id === fileId);
    if (!file) return;
    
    setEditingFile(file);
    setEditFormData({
      name: file.name,
      description: file.description || '',
      category: file.category,
      tags: file.tags,
      patientId: file.patientId,
      patientName: file.patientName,
      isConfidential: file.isConfidential,
      priority: file.priority
    });
    setEditDialogOpen(true);
  }

  function saveFileEdit() {
    if (!editingFile) return;
    
    const updatedFile = {
      ...editingFile,
      ...editFormData,
      name: editFormData.name || editingFile.name,
      description: editFormData.description,
      category: editFormData.category || editingFile.category,
      tags: editFormData.tags || editingFile.tags,
      patientId: editFormData.patientId,
      patientName: editFormData.patientName,
      isConfidential: editFormData.isConfidential || false,
      priority: editFormData.priority || editingFile.priority
    };
    
    setFiles(prev => 
      prev.map(f => f.id === editingFile.id ? updatedFile : f)
    );
    
    setEditDialogOpen(false);
    setEditingFile(null);
    setEditFormData({});
  }

  function duplicateFile(fileId: string) {
    const file = files.find(f => f.id === fileId);
    if (!file) return;
    
    const duplicatedFile: FileItem = {
      ...file,
      id: crypto.randomUUID(),
      name: `${file.name.replace(/\.[^/.]+$/, '')} - Copy${file.name.match(/\.[^/.]+$/)?.[0] || ''}`,
      date: new Date().toISOString(),
      version: 1,
      versions: [{
        id: crypto.randomUUID(),
        version: 1,
        date: new Date().toISOString(),
        uploadedBy: 'Current User',
        changes: 'Duplicated from original file',
        fileSize: file.size
      }],
      sharedWith: [],
      accessLog: [],
      accessCount: 0,
      originalFileId: file.id,
      processedFrom: 'duplicate'
    };
    
    setFiles(prev => [...prev, duplicatedFile]);
  }

  function previewFile(fileId: string) {
    logFileAccess(fileId, 'view');
    
    const file = files.find(f => f.id === fileId);
    if (!file) return;
    
    setCurrentPreviewFile(file);
    setPreviewDialogOpen(true);
  }

  function viewVersionHistory(fileId: string) {
    const file = files.find(f => f.id === fileId);
    if (!file) return;
    
    setSelectedFileForHistory(file);
    setVersionHistoryOpen(true);
  }

  function uploadNewVersion(fileId: string) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = files.find(f => f.id === fileId)?.type || '*/*';
    
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const existingFile = files.find(f => f.id === fileId);
      if (!existingFile) return;
      
      const newVersion = existingFile.version + 1;
      const now = new Date().toISOString();
      
      let content = existingFile.content;
      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            content = e.target.result as string;
          }
        };
        reader.readAsDataURL(file);
      }
      
      const updatedFile: FileItem = {
        ...existingFile,
        name: file.name,
        size: file.size,
        type: file.type,
        content,
        fileObject: file,
        version: newVersion,
        date: now,
        versions: [
          ...existingFile.versions,
          {
            id: crypto.randomUUID(),
            version: newVersion,
            date: now,
            uploadedBy: 'Current User',
            changes: 'File updated',
            fileSize: file.size
          }
        ],
        ocrText: undefined,
        isOcrProcessed: false,
        extractedData: undefined,
        processingStatus: undefined
      };
      
      setFiles(prev => 
        prev.map(f => f.id === fileId ? updatedFile : f)
      );
    };
    
    input.click();
  }

  function openShareDialog(fileId: string) {
    const file = files.find(f => f.id === fileId);
    if (!file) return;
    
    setMenuFileId(fileId);
    setShareUsers(file.sharedWith || []);
    setShareNote('');
    setShareDialogOpen(true);
  }

  function shareFile() {
    if (!menuFileId) return;
    
    logFileAccess(menuFileId, 'share');
    
    setFiles(prev =>
      prev.map(f =>
        f.id === menuFileId
          ? { ...f, sharedWith: Array.from(new Set([...f.sharedWith, ...shareUsers])) }
          : f
      )
    );
    
    setShareDialogOpen(false);
    setShareUsers([]);
    setShareNote('');
    setMenuFileId('');
  }

  function downloadSingleFile(fileId: string) {
    logFileAccess(fileId, 'download');
    
    const file = files.find(f => f.id === fileId);
    if (!file) {
      console.error('File not found for download');
      return;
    }

    try {
      let downloadUrl: string;
      let fileName = file.name;

      if (file.fileObject && file.fileObject instanceof File) {
        downloadUrl = URL.createObjectURL(file.fileObject);
      } else if (file.content && file.content.startsWith('data:')) {
        const blob = dataURLToBlobSync(file.content);
        downloadUrl = URL.createObjectURL(blob);
      } else {
        console.error('No valid file source found for download');
        alert('This file cannot be downloaded - no valid source found.');
        return;
      }

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file. Please try again.');
    }
  }

  function downloadSelected() {
    if (selectedFiles.size === 0) {
      alert('No files selected for download.');
      return;
    }

    selectedFiles.forEach((id) => {
      try {
        downloadSingleFile(id);
      } catch (error) {
        console.error(`Failed to download file ${id}:`, error);
      }
    });
  }

  function stopSharing(fileId: string) {
    setFiles(prev =>
      prev.map(f =>
        f.id === fileId ? { ...f, sharedWith: [] } : f
      )
    );
  }

  async function addFiles(fileList: FileList) {
    setLoading(true);
    const now = new Date().toISOString();
    
    const newFiles: FileItem[] = Array.from(fileList).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      date: now,
      type: file.type,
      content: null,
      isFolder: false,
      folderId: currentFolderId,
      fileObject: file,
      patientId: selectedPatientForUpload?.id,
      patientName: selectedPatientForUpload ? `${selectedPatientForUpload.firstName} ${selectedPatientForUpload.lastName}` : undefined,
      category: selectedCategory,
      tags: fileTags ? fileTags.split(',').map(tag => tag.trim()) : [],
      version: 1,
      versions: [{
        id: crypto.randomUUID(),
        version: 1,
        date: now,
        uploadedBy: 'Current User',
        changes: 'Initial upload',
        fileSize: file.size
      }],
      sharedWith: [],
      isTemplate: false,
      description: fileDescription,
      priority: 'medium',
      isConfidential,
      accessLog: [],
      accessCount: 0,
      processingStatus: 'pending'
    }));

    const processPromises = newFiles.map(async (fileObj) => {
      if (fileObj.type.startsWith("image/") || fileObj.type === "application/pdf") {
        return new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            if (e.target?.result) {
              setFiles(prevFiles =>
                prevFiles.map(f =>
                  f.id === fileObj.id ? { ...f, content: e.target!.result as string } : f
                )
              );

              if (fileObj.type.startsWith("image/")) {
                setTimeout(() => {
                  processFileWithOCR(fileObj.id);
                }, 1000);
              }
            }
            resolve();
          };
          reader.readAsDataURL(fileObj.fileObject!);
        });
      }
      return Promise.resolve();
    });

    setFiles(old => [...old, ...newFiles]);
    await Promise.all(processPromises);
    
    setSelectedPatientForUpload(null);
    setSelectedCategory('other');
    setFileTags('');
    setFileDescription('');
    setIsConfidential(false);
    
    setLoading(false);
  }

  function createFolder() {
    if (!newFolderName.trim()) return;
    
    const newFolder: FolderItem = {
      id: crypto.randomUUID(),
      name: newFolderName,
      parentId: currentFolderId,
      color: '#2196F3',
      icon: 'folder',
      createdAt: new Date().toISOString(),
      fileCount: 0,
      isPatientFolder: false
    };
    
    setFolders(prev => [...prev, newFolder]);
    setNewFolderName('');
    setCreateFolderOpen(false);
  }

  function moveSelectedFiles(targetFolderId: string) {
    const filesToMove = files.filter(f => selectedFiles.has(f.id));
    
    setUndoStack(prev => [...prev, {
      type: 'move',
      files: filesToMove,
      previousFolder: currentFolderId
    }]);
    
    setFiles(prev => 
      prev.map(f => 
        selectedFiles.has(f.id) ? { ...f, folderId: targetFolderId } : f
      )
    );
    
    setSelectedFiles(new Set());
    setMoveFilesOpen(false);
  }

  function bulkEditFiles(updates: Partial<FileItem>) {
    setFiles(prev => 
      prev.map(f => 
        selectedFiles.has(f.id) ? { ...f, ...updates } : f
      )
    );
    
    setSelectedFiles(new Set());
    setBulkEditOpen(false);
  }

  function deleteSelected() {
    if (selectedFiles.size === 0) return;
    
    selectedFiles.forEach(fileId => {
      logFileAccess(fileId, 'delete');
    });
    
    const filesToDelete = files.filter((f) => selectedFiles.has(f.id));
    setUndoStack((stack) => [...stack, { type: "delete", files: filesToDelete }]);
    setFiles((old) => old.filter((f) => !selectedFiles.has(f.id)));
    setSelectedFiles(new Set());
  }

  function undo() {
    if (undoStack.length === 0) return;
    const lastAction = undoStack[undoStack.length - 1];
    const newStack = undoStack.slice(0, -1);
    
    switch (lastAction.type) {
      case "delete":
        setFiles((old) => [...old, ...lastAction.files]);
        break;
      case "move":
        if (lastAction.previousFolder) {
          setFiles(prev => 
            prev.map(f => 
              lastAction.files.some(af => af.id === f.id) 
                ? { ...f, folderId: lastAction.previousFolder ?? null } 
                : f
            )
          );
        }
        break;
    }
    
    setUndoStack(newStack);
  }

  function toggleSelect(id: string) {
    const newSet = new Set(selectedFiles);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedFiles(newSet);
  }

  function toggleSelectAll() {
    if (pageFiles.every((f) => selectedFiles.has(f.id))) {
      setSelectedFiles((old) => {
        const newSet = new Set(old);
        pageFiles.forEach((f) => newSet.delete(f.id));
        return newSet;
      });
    } else {
      setSelectedFiles((old) => {
        const newSet = new Set(old);
        pageFiles.forEach((f) => newSet.add(f.id));
        return newSet;
      });
    }
  }

  function onDragEnter(e: React.DragEvent) {
    e.preventDefault();
    dragCounter.current++;
    setDragging(true);
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragging(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }

  function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      addFiles(e.target.files);
    }
    if (e.target) {
      e.target.value = "";
    }
  }

  function handleMenuOpen(event: React.MouseEvent<HTMLElement>, fileId: string) {
    setAnchorEl(event.currentTarget);
    setMenuFileId(fileId);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    setMenuFileId("");
  }

  return {
    files,
    folders,
    currentFolderId,
    setCurrentFolderId,
    selectedFiles,
    setSelectedFiles,
    viewMode,
    setViewMode,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    patientFilter,
    setPatientFilter,
    tagFilter,
    setTagFilter,
    showOnlyShared,
    setShowOnlyShared,
    showOnlyConfidential,
    setShowOnlyConfidential,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    currentPage,
    setCurrentPage,
    undoStack,
    loading,
    anchorEl,
    menuFileId,
    setMenuFileId,
    
    createFolderOpen,
    setCreateFolderOpen,
    moveFilesOpen,
    setMoveFilesOpen,
    shareDialogOpen,
    setShareDialogOpen,
    bulkEditOpen,
    setBulkEditOpen,
    templateDialogOpen,
    setTemplateDialogOpen,
    versionHistoryOpen,
    setVersionHistoryOpen,
    editDialogOpen,
    setEditDialogOpen,
    previewDialogOpen,
    setPreviewDialogOpen,
    ocrDialogOpen,
    setOcrDialogOpen,
    fileProcessingOpen,
    setFileProcessingOpen,
    mobileIntegrationsOpen,
    setMobileIntegrationsOpen,
    securityDashboardOpen,
    setSecurityDashboardOpen,
    advancedSearchOpen,
    setAdvancedSearchOpen,
    ocrDataViewerOpen,
    setOcrDataViewerOpen,
    
    editingFile,
    setEditingFile,
    editFormData,
    setEditFormData,
    currentPreviewFile,
    setCurrentPreviewFile,
    selectedFileForHistory,
    setSelectedFileForHistory,
    shareUsers,
    setShareUsers,
    shareNote,
    setShareNote,
    currentOCRFile,
    setCurrentOCRFile,
    
    searchFilters,
    setSearchFilters,
    searchHistory,
    ocrProgress,
    setOcrProgress,
    processingQueue,
    selectedFilesForProcessing,
    setSelectedFilesForProcessing,
    cameraStream,
    isRecording,
    
    newFolderName,
    setNewFolderName,
    selectedPatientForUpload,
    setSelectedPatientForUpload,
    selectedCategory,
    setSelectedCategory,
    fileTags,
    setFileTags,
    fileDescription,
    setFileDescription,
    isConfidential,
    setIsConfidential,
    
    fileInputRef,
    dragging,
    videoRef,
    canvasRef,
    
    currentFolder,
    breadcrumbs,
    filteredFiles,
    sortedFiles,
    totalPages,
    pageFiles,
    currentFolders,
    patients,
    
    FILE_CATEGORIES,
    
    getFileIcon,
    formatFileSize,
    getCategoryInfo,
    renderPreview,
    openEditDialog,
    saveFileEdit,
    duplicateFile,
    previewFile,
    viewVersionHistory,
    uploadNewVersion,
    openShareDialog,
    shareFile,
    downloadSingleFile,
    stopSharing,
    addFiles,
    createFolder,
    moveSelectedFiles,
    bulkEditFiles,
    deleteSelected,
    undo,
    toggleSelect,
    toggleSelectAll,
    downloadSelected,
    onDragEnter,
    onDragLeave,
    onDrop,
    onFileInputChange,
    handleMenuOpen,
    handleMenuClose,
    
    processFileWithOCR,
    extractMedicalDataFromText,
    mergePDFs,
    convertImageToPDF,
    performAdvancedSearch,
    clearSearch,
    logFileAccess,
    startCamera,
    stopCamera,
    capturePhoto,
    startVoiceRecording,
    stopVoiceRecording,
    viewOCRData,
    
    setFiles,
    dataURLToBlob,
    dataURLToBlobSync,
    convertPDFToImage
  };
}