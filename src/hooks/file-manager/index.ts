import { useState, useEffect, useRef, useMemo } from "react";
import { FileCategory, FileItem, FolderItem } from "../../views/file-manager/components/types";
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
  // Core state
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

  // Navigation state
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<FileCategory | 'all'>('all');
  const [patientFilter, setPatientFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string>('');
  const [showOnlyShared, setShowOnlyShared] = useState(false);
  const [showOnlyConfidential, setShowOnlyConfidential] = useState(false);
  
  // Sort state
  const [sortBy, setSortBy] = useState<"name" | "date" | "size" | "category" | "patient">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Action state
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuFileId, setMenuFileId] = useState<string>("");
  
  // Dialog state
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [moveFilesOpen, setMoveFilesOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  
  // Working state for dialogs - FIXED NAMING CONFLICT
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<FileItem>>({});
  const [currentPreviewFile, setCurrentPreviewFile] = useState<FileItem | null>(null); // CHANGED FROM previewFile
  const [selectedFileForHistory, setSelectedFileForHistory] = useState<FileItem | null>(null);
  const [shareUsers, setShareUsers] = useState<string[]>([]);
  const [shareNote, setShareNote] = useState('');
  
  // Form state
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedPatientForUpload, setSelectedPatientForUpload] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('other');
  const [fileTags, setFileTags] = useState<string>('');
  const [fileDescription, setFileDescription] = useState('');
  const [isConfidential, setIsConfidential] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [dragging, setDragging] = useState(false);

  // Get patients for linking
  const { patients } = usePatientsContext();

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("enhanced_files", JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem("file_folders", JSON.stringify(folders));
  }, [folders]);

  // Get current folder
  const currentFolder = folders.find(f => f.id === currentFolderId) || folders[0];
  
  // Get folder breadcrumbs
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

  // Filter and sort files
  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      if (file.folderId !== currentFolderId) return false;
      if (searchTerm && !file.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !file.description?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !file.patientName?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (categoryFilter !== 'all' && file.category !== categoryFilter) return false;
      if (patientFilter && file.patientId !== patientFilter) return false;
      if (tagFilter && !file.tags.some((tag: string) => tag.toLowerCase().includes(tagFilter.toLowerCase()))) {
        return false;
      }
      if (showOnlyShared && file.sharedWith.length === 0) return false;
      if (showOnlyConfidential && !file.isConfidential) return false;
      return true;
    });
  }, [files, currentFolderId, searchTerm, categoryFilter, patientFilter, tagFilter, showOnlyShared, showOnlyConfidential]);

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

  // Pagination
  const totalPages = Math.ceil(sortedFiles.length / PAGE_SIZE);
  const pageFiles = sortedFiles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Get folders in current directory
  const currentFolders = folders.filter(f => f.parentId === currentFolderId);

  // Utility functions
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

  // Working Action Functions
  function openEditDialog(fileId: string) {
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
      sharedWith: []
    };
    
    setFiles(prev => [...prev, duplicatedFile]);
  }

  // FIXED FUNCTION - This is the function that should be passed to context menu
  function previewFile(fileId: string) {
    const file = files.find(f => f.id === fileId);
    if (!file) return;
    
    setCurrentPreviewFile(file); // CHANGED FROM setPreviewFile
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
        ]
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
    const file = files.find(f => f.id === fileId);
    if (!file || !file.fileObject) return;
    
    const url = URL.createObjectURL(file.fileObject);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  function stopSharing(fileId: string) {
    setFiles(prev =>
      prev.map(f =>
        f.id === fileId ? { ...f, sharedWith: [] } : f
      )
    );
  }

  // File upload with enhanced metadata
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
      isConfidential
    }));

    // Process files for preview
    const processPromises = newFiles.map(async (fileObj) => {
      if (fileObj.type.startsWith("image/") || fileObj.type === "application/pdf") {
        return new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setFiles(prevFiles =>
                prevFiles.map(f =>
                  f.id === fileObj.id ? { ...f, content: e.target!.result as string } : f
                )
              );
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
    
    // Reset form
    setSelectedPatientForUpload(null);
    setSelectedCategory('other');
    setFileTags('');
    setFileDescription('');
    setIsConfidential(false);
    
    setLoading(false);
  }

  // Create new folder
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

  // Move files to folder
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

  // Bulk edit selected files
  function bulkEditFiles(updates: Partial<FileItem>) {
    setFiles(prev => 
      prev.map(f => 
        selectedFiles.has(f.id) ? { ...f, ...updates } : f
      )
    );
    
    setSelectedFiles(new Set());
    setBulkEditOpen(false);
  }

  // Delete selected files
  function deleteSelected() {
    if (selectedFiles.size === 0) return;
    const filesToDelete = files.filter((f) => selectedFiles.has(f.id));
    setUndoStack((stack) => [...stack, { type: "delete", files: filesToDelete }]);
    setFiles((old) => old.filter((f) => !selectedFiles.has(f.id)));
    setSelectedFiles(new Set());
  }

  // Undo last action
  function undo() {
    if (undoStack.length === 0) return;
    const lastAction = undoStack[undoStack.length - 1];
    const newStack = undoStack.slice(0, -1);
    
    switch (lastAction.type) {
      case "delete":
        setFiles((old) => [...old, ...lastAction.files]);
        break;
      case "move":
        if (lastAction.previousFolder !== undefined) {
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

  // File selection
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

  // Download selected files
  function downloadSelected() {
    selectedFiles.forEach((id) => {
      const file = files.find((f) => f.id === id);
      if (!file || !file.fileObject) return;
      
      const url = URL.createObjectURL(file.fileObject);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // Drag and drop
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

  // File input change
  function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      addFiles(e.target.files);
    }
    if (e.target) {
      e.target.value = "";
    }
  }

  // Context menu
  function handleMenuOpen(event: React.MouseEvent<HTMLElement>, fileId: string) {
    setAnchorEl(event.currentTarget);
    setMenuFileId(fileId);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    setMenuFileId("");
  }

  return {
    // State
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
    
    // Working state - FIXED NAMING
    editingFile,
    setEditingFile,
    editFormData,
    setEditFormData,
    currentPreviewFile,        // CHANGED FROM previewFile (this is the state variable)
    setCurrentPreviewFile,     // CHANGED FROM setPreviewFile
    selectedFileForHistory,
    setSelectedFileForHistory,
    shareUsers,
    setShareUsers,
    shareNote,
    setShareNote,
    
    // Form state
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
    
    // Refs
    fileInputRef,
    dragging,
    
    // Computed values
    currentFolder,
    breadcrumbs,
    filteredFiles,
    sortedFiles,
    totalPages,
    pageFiles,
    currentFolders,
    patients,
    
    // Constants
    FILE_CATEGORIES,
    
    // Functions
    getFileIcon,
    formatFileSize,
    getCategoryInfo,
    renderPreview,
    openEditDialog,
    saveFileEdit,
    duplicateFile,
    previewFile,               // This is the FUNCTION (fileId: string) => void
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
    handleMenuClose
  };
}