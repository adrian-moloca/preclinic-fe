import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { AccessLogEntry, ExtractedMedicalData, FileCategory, FileItem, FolderItem, SearchFilters, MedicalInsight } from "../../views/file-manager/components/types";
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
  
  const [medicalClassificationOpen, setMedicalClassificationOpen] = useState(false);
  const [dicomViewerOpen, setDicomViewerOpen] = useState(false);
  const [clinicalDecisionOpen, setClinicalDecisionOpen] = useState(false);
  const [patientPortalOpen, setPatientPortalOpen] = useState(false);
  const [accessControlOpen, setAccessControlOpen] = useState(false);
  const [retentionPolicyOpen, setRetentionPolicyOpen] = useState(false);
  
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
  
  const [fileClassificationResults, setFileClassificationResults] = useState<{[fileId: string]: ExtractedMedicalData}>({});
  const [, setClinicalInsights] = useState<{[fileId: string]: MedicalInsight[]}>({});
  
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

  const updateFileWithMedicalData = useCallback((fileId: string, medicalData: ExtractedMedicalData, insights: MedicalInsight[]) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { 
            ...file, 
            extractedData: medicalData,
            category: inferCategoryFromMedicalData(medicalData),
            patientName: medicalData.patientName || file.patientName,
            processingStatus: 'completed',
            clinicalInsights: insights
          }
        : file
    ));
    
    setFileClassificationResults(prev => ({ ...prev, [fileId]: medicalData }));
    setClinicalInsights(prev => ({ ...prev, [fileId]: insights }));
  }, []);

  const inferCategoryFromMedicalData = (data: ExtractedMedicalData): FileCategory => {
    if (data.testResults && data.testResults.length > 0) return 'lab_results';
    if (data.medications && data.medications.length > 0) return 'prescriptions';
    if (data.documentType?.toLowerCase().includes('report')) return 'medical_reports';
    if (data.documentType?.toLowerCase().includes('consent')) return 'consent_forms';
    return 'patient_records';
  };

  const updateFileAnnotations = useCallback((fileId: string, annotations: any) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, annotations }
        : file
    ));
  }, []);

  const logFileAccess = useCallback((fileId: string, action: AccessLogEntry['action'], userId?: string) => {
    const logEntry: AccessLogEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      userAgent: navigator.userAgent,
      location: 'Cluj-Napoca, RO'
    };

    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { 
            ...file, 
            accessLog: [...(file.accessLog || []), logEntry],
            lastAccessed: logEntry.timestamp,
            accessCount: (file.accessCount || 0) + 1
          }
        : file
    ));
  }, []);

  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || file.category === categoryFilter;
      const matchesPatient = !patientFilter || file.patientId === patientFilter;
      const matchesTag = !tagFilter || file.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()));
      const matchesShared = !showOnlyShared || (file.sharedWith && file.sharedWith.length > 0);
      const matchesConfidential = !showOnlyConfidential || file.isConfidential;
      const matchesFolder = file.folderId === currentFolderId;

      return matchesSearch && matchesCategory && matchesPatient && matchesTag && matchesShared && matchesConfidential && matchesFolder;
    });
  }, [files, searchTerm, categoryFilter, patientFilter, tagFilter, showOnlyShared, showOnlyConfidential, currentFolderId]);

  const sortedFiles = useMemo(() => {
    return [...filteredFiles].sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'date':
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          break;
        case 'size':
          aVal = a.size;
          bVal = b.size;
          break;
        case 'category':
          aVal = a.category;
          bVal = b.category;
          break;
        case 'patient':
          aVal = a.patientName || '';
          bVal = b.patientName || '';
          break;
        default:
          aVal = a.name;
          bVal = b.name;
      }

      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredFiles, sortBy, sortDir]);

  const totalPages = Math.ceil(sortedFiles.length / PAGE_SIZE);
  const pageFiles = sortedFiles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const getCategoryInfo = (category: FileCategory) => {
    return FILE_CATEGORIES.find(cat => cat.value === category) || FILE_CATEGORIES[FILE_CATEGORIES.length - 1];
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toggleSelect = (fileId: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedFiles.size === pageFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(pageFiles.map(file => file.id)));
    }
  };

  const deleteSelectedFiles = () => {
    const filesToDelete = files.filter(file => selectedFiles.has(file.id));
    setUndoStack(prev => [...prev, { type: 'delete', files: filesToDelete }]);
    setFiles(prev => prev.filter(file => !selectedFiles.has(file.id)));
    setSelectedFiles(new Set());
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, fileId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuFileId(fileId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuFileId("");
  };

  const addToSearchHistory = (term: string) => {
    if (term.trim() && !searchHistory.includes(term.trim())) {
      const newHistory = [term.trim(), ...searchHistory].slice(0, 10);
      setSearchHistory(newHistory);
    }
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: FolderItem = {
      id: `folder-${Date.now()}`,
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
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
            addFiles([file]);
          }
        });
      }
    }
    stopCamera();
  };

  const addFiles = (fileList: FileList | File[]) => {
    setLoading(true);
    Array.from(fileList).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileItem: FileItem = {
          id: `${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          type: file.type,
          date: new Date().toISOString(),
          content: file.type.startsWith('image/') ? reader.result as string : null,
          isFolder: false,
          folderId: currentFolderId,
          fileObject: file,
          patientId: selectedPatientForUpload?.id,
          patientName: selectedPatientForUpload?.firstName + ' ' + selectedPatientForUpload?.lastName,
          category: selectedCategory,
          tags: fileTags.split(',').map(tag => tag.trim()).filter(Boolean),
          version: 1,
          versions: [],
          sharedWith: [],
          isTemplate: false,
          description: fileDescription,
          priority: 'medium',
          isConfidential: isConfidential,
          processingStatus: 'pending',
          accessCount: 0
        };
        
        setFiles(prev => [...prev, fileItem]);
        logFileAccess(fileItem.id, 'view');
      };
      
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
    
    setTimeout(() => setLoading(false), 1000);
    
    setSelectedPatientForUpload(null);
    setSelectedCategory('other');
    setFileTags('');
    setFileDescription('');
    setIsConfidential(false);
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setCurrentRecording(recorder);
      setIsRecording(true);
      recorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopVoiceRecording = () => {
    if (currentRecording) {
      currentRecording.stop();
      setCurrentRecording(null);
      setIsRecording(false);
    }
  };

  return {
    // File data
    files,
    setFiles,
    folders,
    setFolders,
    currentFolderId,
    setCurrentFolderId,
    selectedFiles,
    setSelectedFiles,
    viewMode,
    setViewMode,
    
    // Search and filter
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
    advancedSearchOpen,
    setAdvancedSearchOpen,
    searchFilters,
    setSearchFilters,
    searchHistory,
    setSearchHistory,
    addToSearchHistory,
    
    // Sort and pagination
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    currentPage,
    setCurrentPage,
    totalPages,
    pageFiles,
    sortedFiles,
    filteredFiles,
    
    // UI state
    undoStack,
    setUndoStack,
    loading,
    setLoading,
    anchorEl,
    setAnchorEl,
    menuFileId,
    setMenuFileId,
    dragging,
    setDragging,
    
    // Dialog states
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
    ocrDataViewerOpen,
    setOcrDataViewerOpen,
    
    // NEW: Medical AI dialogs
    medicalClassificationOpen,
    setMedicalClassificationOpen,
    dicomViewerOpen,
    setDicomViewerOpen,
    clinicalDecisionOpen,
    setClinicalDecisionOpen,
    patientPortalOpen,
    setPatientPortalOpen,
    accessControlOpen,
    setAccessControlOpen,
    retentionPolicyOpen,
    setRetentionPolicyOpen,
    
    // Form data
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
    
    // Processing
    ocrProgress,
    setOcrProgress,
    processingQueue,
    selectedFilesForProcessing,
    setSelectedFilesForProcessing,
    
    // Camera and recording
    cameraStream,
    setCameraStream,
    isRecording,
    setIsRecording,
    currentRecording,
    setCurrentRecording,
    
    // Upload form
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
    
    // NEW: Medical data
    fileClassificationResults,
    setClinicalInsights,
    updateFileWithMedicalData,
    updateFileAnnotations,
    logFileAccess,
    
    // References
    fileInputRef,
    dragCounter,
    videoRef,
    canvasRef,
    
    // Data
    patients,
    FILE_CATEGORIES,
    PAGE_SIZE,
    
    // Helper functions
    getCategoryInfo,
    formatFileSize,
    toggleSelect,
    toggleSelectAll,
    deleteSelectedFiles,
    handleMenuOpen,
    handleMenuClose,
    createFolder,
    addFiles,
    startCamera,
    stopCamera,
    capturePhoto,
    startVoiceRecording,
    stopVoiceRecording,
  };
}