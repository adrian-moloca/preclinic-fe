import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  LinearProgress,
  TablePagination,
  Grid,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  FormControlLabel,
  Switch,
  Tooltip,
  Badge,
  Divider,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import CloudUpload from '@mui/icons-material/CloudUpload';
import Search from '@mui/icons-material/Search';
import Download from '@mui/icons-material/Download';
import Delete from '@mui/icons-material/Delete';
import MoreVert from '@mui/icons-material/MoreVert';
import Sort from '@mui/icons-material/Sort';
import Image from '@mui/icons-material/Image';
import PictureAsPdf from '@mui/icons-material/PictureAsPdf';
import VideoFile from '@mui/icons-material/VideoFile';
import AudioFile from '@mui/icons-material/AudioFile';
import InsertDriveFile from '@mui/icons-material/InsertDriveFile';
import Psychology from '@mui/icons-material/Psychology';
import Security from '@mui/icons-material/Security';
import Settings from '@mui/icons-material/Settings';
import LocalHospital from '@mui/icons-material/LocalHospital';
import TextFields from '@mui/icons-material/TextFields';
import Person from '@mui/icons-material/Person';
import Lock from '@mui/icons-material/Lock';
import Share from '@mui/icons-material/Share';
import Edit from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
import History from '@mui/icons-material/History';
import Science from '@mui/icons-material/Science';
import Code from '@mui/icons-material/Code';
import Description from '@mui/icons-material/Description';
import Article from '@mui/icons-material/Article';
import Close from '@mui/icons-material/Close';
import { HIPAADashboard } from './components/hipaa-dashboard/component';
import { DICOMViewer } from './components/dicom-viewer/component';
import MedicalClassificationDialog from './components/medical-clasification';
import { ClinicalDecisionSupport } from './components/clinical-decision/component';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  date: string;
  content?: string;
  patientId?: string;
  patientName?: string;
  category: FileCategory;
  tags: string[];
  isConfidential: boolean;
  sharedWith?: string[];
  extractedData?: ExtractedMedicalData;
  isOcrProcessed?: boolean;
  processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  clinicalInsights?: MedicalInsight[];
  accessLog?: AccessLogEntry[];
  lastAccessed?: string;
  accessCount?: number;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  // Add file storage properties
  fileData?: ArrayBuffer;
  fileBlob?: Blob;
  originalFile?: File;
}

type FileCategory = 
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

interface ExtractedMedicalData {
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
}

interface MedicalInsight {
  type: 'medication' | 'vital' | 'diagnosis' | 'appointment' | 'warning';
  text: string;
  confidence: number;
  source: string;
}

interface AccessLogEntry {
  timestamp: string;
  action: 'view' | 'download' | 'edit' | 'share' | 'delete';
  userId?: string;
  userAgent?: string;
  location?: string;
}

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

const FILE_FORMATS = [
  { value: 'pdf', label: 'PDF Document', mimeType: 'application/pdf', icon: PictureAsPdf },
  { value: 'html', label: 'HTML Document', mimeType: 'text/html', icon: Code },
  { value: 'htm', label: 'HTML Document', mimeType: 'text/html', icon: Code },
  { value: 'txt', label: 'Text Document', mimeType: 'text/plain', icon: Article },
  { value: 'doc', label: 'Word Document', mimeType: 'application/msword', icon: Description },
  { value: 'docx', label: 'Word Document (DOCX)', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', icon: Description },
  { value: 'jpg', label: 'JPEG Image', mimeType: 'image/jpeg', icon: Image },
  { value: 'jpeg', label: 'JPEG Image', mimeType: 'image/jpeg', icon: Image },
  { value: 'png', label: 'PNG Image', mimeType: 'image/png', icon: Image },
  { value: 'gif', label: 'GIF Image', mimeType: 'image/gif', icon: Image },
  { value: 'mp4', label: 'MP4 Video', mimeType: 'video/mp4', icon: VideoFile },
  { value: 'avi', label: 'AVI Video', mimeType: 'video/avi', icon: VideoFile },
  { value: 'mp3', label: 'MP3 Audio', mimeType: 'audio/mpeg', icon: AudioFile },
  { value: 'wav', label: 'WAV Audio', mimeType: 'audio/wav', icon: AudioFile },
  { value: 'xml', label: 'XML Document', mimeType: 'text/xml', icon: Code },
  { value: 'csv', label: 'CSV File', mimeType: 'text/csv', icon: Article },
];

const mockPatients = [
  { id: '1', firstName: 'John', lastName: 'Doe' },
  { id: '2', firstName: 'Jane', lastName: 'Smith' },
  { id: '3', firstName: 'Bob', lastName: 'Johnson' },
];

// Mock users for sharing
const mockUsers = [
  { id: '1', name: 'Dr. Sarah Wilson', email: 'sarah.wilson@clinic.com', role: 'Doctor' },
  { id: '2', name: 'Nurse Mary Johnson', email: 'mary.johnson@clinic.com', role: 'Nurse' },
  { id: '3', name: 'Admin John Smith', email: 'john.smith@clinic.com', role: 'Administrator' },
  { id: '4', name: 'Dr. Michael Brown', email: 'michael.brown@clinic.com', role: 'Doctor' },
];

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`preview-tabpanel-${index}`}
      aria-labelledby={`preview-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const LocalFileManager: React.FC = () => {
  const theme = useTheme(); 
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date' | 'category' | 'patient'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuFileId, setMenuFileId] = useState('');

  const [categoryFilter, setCategoryFilter] = useState<FileCategory | 'all'>('all');
  const [patientFilter, setPatientFilter] = useState<string | null>(null);
  const [tagFilter] = useState<string>('');
  const [showOnlyShared] = useState(false);
  const [showOnlyConfidential] = useState(false);
  
  const [medicalClassificationOpen, setMedicalClassificationOpen] = useState(false);
  const [securityDashboardOpen, setSecurityDashboardOpen] = useState(false);
  const [dicomViewerOpen, setDicomViewerOpen] = useState(false);
  const [clinicalDecisionOpen, setClinicalDecisionOpen] = useState(false);
  
  const [selectedPatientForUpload, setSelectedPatientForUpload] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('other');
  const [fileTags, setFileTags] = useState<string>('');
  const [isConfidential, setIsConfidential] = useState(false);
  
  const [currentPreviewFile, setCurrentPreviewFile] = useState<FileItem | null>(null);
  const [currentOCRFile, setCurrentOCRFile] = useState<FileItem | null>(null);

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  // Edit states
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [editFileName, setEditFileName] = useState('');
  const [editFileExtension, setEditFileExtension] = useState('');
  const [editFileDescription, setEditFileDescription] = useState('');
  const [editFileCategory, setEditFileCategory] = useState<FileCategory>('other');
  const [editFileTags, setEditFileTags] = useState<string[]>([]);

  // Share states
  const [sharingFile, setSharingFile] = useState<FileItem | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [shareMessage, setShareMessage] = useState('');

  // Preview states
  const [previewTabValue, setPreviewTabValue] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || file.category === categoryFilter;
    const matchesPatient = !patientFilter || file.patientId === patientFilter;
    const matchesTag = !tagFilter || file.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()));
    const matchesShared = !showOnlyShared || (file.sharedWith && file.sharedWith.length > 0);
    const matchesConfidential = !showOnlyConfidential || file.isConfidential;

    return matchesSearch && matchesCategory && matchesPatient && matchesTag && matchesShared && matchesConfidential;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
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

    const modifier = sortDir === 'asc' ? 1 : -1;
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * modifier;
    }
    
    return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * modifier;
  });

  const pageFiles = sortedFiles.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  // FIXED: Proper file upload handling
  const addFiles = useCallback((fileList: FileList) => {
    setLoading(true);
    
    const promises = Array.from(fileList).map((file, index) => {
      return new Promise<void>((resolve) => {
        // Create file item immediately with original file
        const fileItem: FileItem = {
          id: `${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          type: file.type,
          date: new Date().toISOString(),
          patientId: selectedPatientForUpload?.id,
          patientName: selectedPatientForUpload ? `${selectedPatientForUpload.firstName} ${selectedPatientForUpload.lastName}` : undefined,
          category: selectedCategory,
          tags: fileTags.split(',').map(tag => tag.trim()).filter(Boolean),
          isConfidential: isConfidential,
          priority: 'medium',
          processingStatus: 'pending',
          accessCount: 0,
          sharedWith: [],
          originalFile: file, // Store the original file
        };

        // For images, also read as data URL for preview
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            fileItem.content = reader.result as string;
            setFiles(prev => [...prev, fileItem]);
            logFileAccess(fileItem.id, 'view');
            resolve();
          };
          reader.readAsDataURL(file);
        } else {
          setFiles(prev => [...prev, fileItem]);
          logFileAccess(fileItem.id, 'view');
          resolve();
        }
      });
    });

    Promise.all(promises).then(() => {
      setLoading(false);
    });
  }, [selectedPatientForUpload, selectedCategory, fileTags, isConfidential]);

  const logFileAccess = (fileId: string, action: AccessLogEntry['action'], userId?: string) => {
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
  };

  const getCategoryInfo = (category: FileCategory) => {
    return FILE_CATEGORIES.find(cat => cat.value === category) || FILE_CATEGORIES[FILE_CATEGORIES.length - 1];
  };

  function getFileIcon(fileType: string, size: number = 24) {
    const iconProps = { sx: { fontSize: size } };
    
    if (fileType.startsWith("image/")) return <Image {...iconProps} sx={{ ...iconProps.sx, color: '#4CAF50' }} />;
    if (fileType === "application/pdf") return <PictureAsPdf {...iconProps} sx={{ ...iconProps.sx, color: '#F44336' }} />;
    if (fileType.startsWith("video/")) return <VideoFile {...iconProps} sx={{ ...iconProps.sx, color: '#2196F3' }} />;
    if (fileType.startsWith("audio/")) return <AudioFile {...iconProps} sx={{ ...iconProps.sx, color: '#FF9800' }} />;
    if (fileType.includes("html") || fileType.includes("xml")) return <Code {...iconProps} sx={{ ...iconProps.sx, color: '#FF5722' }} />;
    if (fileType.includes("text/")) return <Article {...iconProps} sx={{ ...iconProps.sx, color: '#607D8B' }} />;
    if (fileType.includes("word") || fileType.includes("document")) return <Description {...iconProps} sx={{ ...iconProps.sx, color: '#1976D2' }} />;
    return <InsertDriveFile {...iconProps} sx={{ ...iconProps.sx, color: '#757575' }} />;
  }

  function getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  }

  function renderPreview(file: FileItem) {
    if (file.type.startsWith("image/") && file.content) {
      return (
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            src={file.content}
            alt={file.name}
            sx={{ width: 50, height: 50, borderRadius: 1 }}
          />
          <Chip 
            label={getFileExtension(file.name)} 
            size="small"
            sx={{ 
              position: 'absolute',
              bottom: -8,
              right: -8,
              fontSize: '0.65rem',
              height: 18,
              bgcolor: theme.palette.primary.main,
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>
      );
    }
    
    return (
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <Avatar sx={{ 
          width: 50, 
          height: 50, 
          borderRadius: 1, 
          bgcolor: theme.palette.background.default,
          border: 1,
          borderColor: 'divider'
        }}>
          {getFileIcon(file.type, 28)}
        </Avatar>
        <Chip 
          label={getFileExtension(file.name)} 
          size="small"
          sx={{ 
            position: 'absolute',
            bottom: -8,
            right: -8,
            fontSize: '0.65rem',
            height: 18,
            bgcolor: theme.palette.primary.main,
            color: 'white',
            fontWeight: 'bold'
          }}
        />
      </Box>
    );
  }

  // FIXED: Proper download functionality
  function handleDownloadFile(fileId: string) {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    logFileAccess(fileId, 'download');

    // Use the original file if available
    if (file.originalFile) {
      const url = URL.createObjectURL(file.originalFile);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    // Fallback for images with base64 content
    if (file.type.startsWith('image/') && file.content) {
      try {
        // Convert data URL to blob
        const arr = file.content.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    }

    // If no original file or content is available, show error
    alert('File content is not available for download. The original file may have been lost.');
  }

  // Download multiple files
  function downloadSelected() {
    selectedFiles.forEach(fileId => {
      handleDownloadFile(fileId);
    });
  }

  // Preview functionality
  function handlePreviewFile(fileId: string) {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    logFileAccess(fileId, 'view');
    setCurrentPreviewFile(file);
    setPreviewDialogOpen(true);
    setPreviewTabValue(0);
  }

  // Share functionality
  function handleShareFile(fileId: string) {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    setSharingFile(file);
    setSelectedUsers(file.sharedWith || []);
    setShareMessage('');
    setShareDialogOpen(true);
  }

  function handleSaveShare() {
    if (!sharingFile) return;

    // Update file with new shared users
    const updatedFile = {
      ...sharingFile,
      sharedWith: selectedUsers
    };

    setFiles(prev => prev.map(f => f.id === sharingFile.id ? updatedFile : f));
    logFileAccess(sharingFile.id, 'share');

    // In a real app, you would send notifications/emails to selected users
    console.log(`Sharing ${sharingFile.name} with:`, selectedUsers.map(id => {
      const user = mockUsers.find(u => u.id === id);
      return user?.email;
    }));

    setShareDialogOpen(false);
    setSharingFile(null);
    setSelectedUsers([]);
  }

  // Edit file functions
  function handleEditFile(fileId: string) {
    const file = files.find(f => f.id === fileId);
    if (!file) return;
    
    const fileName = file.name.substring(0, file.name.lastIndexOf('.'));
    const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);
    
    setEditingFile(file);
    setEditFileName(fileName || file.name);
    setEditFileExtension(fileExtension || '');
    setEditFileDescription(file.description || '');
    setEditFileCategory(file.category);
    setEditFileTags(file.tags);
    setEditDialogOpen(true);
  }

  function handleSaveEdit() {
    if (!editingFile) return;

    const newFileName = editFileExtension 
      ? `${editFileName}.${editFileExtension}` 
      : editFileName;

    const formatInfo = FILE_FORMATS.find(f => f.value === editFileExtension.toLowerCase());
    const newMimeType = formatInfo?.mimeType || editingFile.type;

    const updatedFile: FileItem = {
      ...editingFile,
      name: newFileName,
      type: newMimeType,
      description: editFileDescription,
      category: editFileCategory,
      tags: editFileTags,
    };

    setFiles(prev => prev.map(f => f.id === editingFile.id ? updatedFile : f));
    logFileAccess(editingFile.id, 'edit');
    
    setEditDialogOpen(false);
    setEditingFile(null);
  }

  function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
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

  function handleMenuOpen(event: React.MouseEvent<HTMLElement>, fileId: string) {
    setAnchorEl(event.currentTarget);
    setMenuFileId(fileId);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    setMenuFileId("");
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function toggleSelect(fileId: string) {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  }

  function toggleSelectAll() {
    if (pageFiles.length > 0 && pageFiles.every(f => selectedFiles.has(f.id))) {
      setSelectedFiles(prev => {
        const newSet = new Set(prev);
        pageFiles.forEach(f => newSet.delete(f.id));
        return newSet;
      });
    } else {
      setSelectedFiles(prev => {
        const newSet = new Set(prev);
        pageFiles.forEach(f => newSet.add(f.id));
        return newSet;
      });
    }
  }

  function deleteSelected() {
    selectedFiles.forEach(fileId => {
      logFileAccess(fileId, 'delete');
    });
    setFiles(prev => prev.filter(f => !selectedFiles.has(f.id)));
    setSelectedFiles(new Set());
  }

  function handleSort(field: 'name' | 'size' | 'date' | 'category' | 'patient') {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
          Medical File Manager
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Advanced file management with AI-powered medical document analysis, HIPAA compliance, and clinical decision support.
        </Typography>
      </Box>

      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Medical Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Psychology />}
              onClick={() => setMedicalClassificationOpen(true)}
              color="secondary"
            >
              AI Classification
            </Button>
            <Button
              variant="outlined"
              startIcon={<Security />}
              onClick={() => setSecurityDashboardOpen(true)}
              color="error"
            >
              HIPAA Dashboard
            </Button>
            <Button
              variant="outlined"
              startIcon={<Settings />}
              onClick={() => setDicomViewerOpen(true)}
              color="info"
            >
              DICOM Viewer
            </Button>
            <Button
              variant="outlined"
              startIcon={<LocalHospital />}
              onClick={() => setClinicalDecisionOpen(true)}
              color="warning"
            >
              Clinical Support
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<CloudUpload />}
                  onClick={() => fileInputRef.current?.click()}
                  size="large"
                  sx={{ 
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                  }}
                >
                  Upload Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={onFileInputChange}
                />
                
                <Button
                  variant="outlined"
                  startIcon={<Delete />}
                  onClick={deleteSelected}
                  disabled={selectedFiles.size === 0}
                  color="error"
                >
                  Delete ({selectedFiles.size})
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={downloadSelected}
                  disabled={selectedFiles.size === 0}
                >
                  Download ({selectedFiles.size})
                </Button>
              </Box>
            </Grid>
            
            <Grid>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 200 }}
                />
                
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Category"
                    onChange={(e) => setCategoryFilter(e.target.value as FileCategory | 'all')}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {FILE_CATEGORIES.map((cat) => (
                      <MenuItem key={cat.value} value={cat.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: cat.color,
                              mr: 1
                            }}
                          />
                          {cat.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Autocomplete
                  size="small"
                  options={mockPatients}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  value={mockPatients.find(p => p.id === patientFilter) || null}
                  onChange={(_, newValue) => setPatientFilter(newValue?.id || null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Patient"
                      placeholder="Select patient..."
                    />
                  )}
                  sx={{ minWidth: 200 }}
                />
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Upload Configuration
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid>
              <Autocomplete
                size="small"
                options={mockPatients}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                value={selectedPatientForUpload}
                onChange={(_, newValue) => setSelectedPatientForUpload(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Default Patient"
                    placeholder="Select patient..."
                  />
                )}
              />
            </Grid>
            <Grid>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value as FileCategory)}
                >
                  {FILE_CATEGORIES.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: cat.color,
                            mr: 1
                          }}
                        />
                        {cat.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid>
              <TextField
                fullWidth
                size="small"
                label="Tags"
                value={fileTags}
                onChange={(e) => setFileTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
            </Grid>
            <Grid>
              <FormControlLabel
                control={
                  <Switch
                    checked={isConfidential}
                    onChange={(e) => setIsConfidential(e.target.checked)}
                  />
                }
                label="Confidential"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
        </Box>
      )}

      <Card sx={{ boxShadow: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.background.paper }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={pageFiles.length > 0 && pageFiles.every((f) => selectedFiles.has(f.id))}
                    onChange={toggleSelectAll}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Preview
                  </Typography>
                </TableCell>
                <TableCell onClick={() => handleSort('name')} sx={{ cursor: 'pointer' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Name <Sort sx={{ fontSize: 16, ml: 0.5 }} />
                  </Typography>
                </TableCell>
                <TableCell onClick={() => handleSort('category')} sx={{ cursor: 'pointer' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Category <Sort sx={{ fontSize: 16, ml: 0.5 }} />
                  </Typography>
                </TableCell>
                <TableCell onClick={() => handleSort('patient')} sx={{ cursor: 'pointer' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Patient <Sort sx={{ fontSize: 16, ml: 0.5 }} />
                  </Typography>
                </TableCell>
                <TableCell onClick={() => handleSort('size')} sx={{ cursor: 'pointer' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Size <Sort sx={{ fontSize: 16, ml: 0.5 }} />
                  </Typography>
                </TableCell>
                <TableCell onClick={() => handleSort('date')} sx={{ cursor: 'pointer' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Date <Sort sx={{ fontSize: 16, ml: 0.5 }} />
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Medical Status
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageFiles.map((file) => {
                const categoryInfo = getCategoryInfo(file.category);
                return (
                  <TableRow
                    key={file.id}
                    hover
                    sx={{
                      bgcolor: selectedFiles.has(file.id) ? theme.palette.action.selected : 'inherit',
                      '&:hover': {
                        bgcolor: selectedFiles.has(file.id) 
                          ? theme.palette.action.selected 
                          : theme.palette.action.hover
                      }
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedFiles.has(file.id)}
                        onChange={() => toggleSelect(file.id)}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      {renderPreview(file)}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {file.name}
                        </Typography>
                        {file.tags.length > 0 && (
                          <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {file.tags.slice(0, 2).map((tag, index) => (
                              <Chip key={index} label={tag} size="small" variant="outlined" />
                            ))}
                            {file.tags.length > 2 && (
                              <Chip label={`+${file.tags.length - 2}`} size="small" variant="outlined" />
                            )}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={categoryInfo.label}
                        size="small"
                        sx={{
                          bgcolor: categoryInfo.color,
                          color: 'white',
                          fontWeight: 'medium'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {file.patientName ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Person sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">{file.patientName}</Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Not assigned
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(file.date).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        {file.isConfidential && (
                          <Tooltip title="Confidential">
                            <Lock sx={{ fontSize: 16, color: 'error.main' }} />
                          </Tooltip>
                        )}
                        {file.sharedWith && file.sharedWith.length > 0 && (
                          <Tooltip title={`Shared with ${file.sharedWith.length} users`}>
                            <Badge badgeContent={file.sharedWith.length} color="primary">
                              <Share sx={{ fontSize: 16, color: 'info.main' }} />
                            </Badge>
                          </Tooltip>
                        )}
                        {file.isOcrProcessed && (
                          <Tooltip title="OCR Processed">
                            <TextFields sx={{ fontSize: 16, color: 'success.main' }} />
                          </Tooltip>
                        )}
                        {file.extractedData && (
                          <Tooltip title="Medical Data Extracted">
                            <Science sx={{ fontSize: 16, color: 'info.main' }} />
                          </Tooltip>
                        )}
                        {file.clinicalInsights && file.clinicalInsights.length > 0 && (
                          <Tooltip title={`${file.clinicalInsights.length} Clinical Insights`}>
                            <Badge badgeContent={file.clinicalInsights.length} color="secondary">
                              <Psychology sx={{ fontSize: 16, color: 'secondary.main' }} />
                            </Badge>
                          </Tooltip>
                        )}
                        {file.accessCount && file.accessCount > 0 && (
                          <Tooltip title={`Accessed ${file.accessCount} times`}>
                            <Badge badgeContent={file.accessCount} color="default" max={99}>
                              <History sx={{ fontSize: 16, color: 'text.secondary' }} />
                            </Badge>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, file.id)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {pageFiles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9}>
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <InsertDriveFile sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No files found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm ? 
                          'Try adjusting your search terms' : 
                          'Upload files to get started'
                        }
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={filteredFiles.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        />
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handlePreviewFile(menuFileId);
          handleMenuClose();
        }}>
          <ListItemIcon><Visibility /></ListItemIcon>
          Preview
        </MenuItem>
        <MenuItem onClick={() => {
          handleEditFile(menuFileId);
          handleMenuClose();
        }}>
          <ListItemIcon><Edit /></ListItemIcon>
          Edit Details
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => {
          const file = files.find(f => f.id === menuFileId);
          if (file) {
            setCurrentOCRFile(file);
            setMedicalClassificationOpen(true);
          }
          handleMenuClose();
        }}>
          <ListItemIcon><Psychology /></ListItemIcon>
          AI Medical Analysis
        </MenuItem>
        
        <MenuItem onClick={() => {
          const file = files.find(f => f.id === menuFileId);
          if (file) {
            setCurrentPreviewFile(file);
            setDicomViewerOpen(true);
          }
          handleMenuClose();
        }}>
          <ListItemIcon><Settings /></ListItemIcon>
          DICOM Viewer
        </MenuItem>
        
        <MenuItem onClick={() => {
          setClinicalDecisionOpen(true);
          handleMenuClose();
        }}>
          <ListItemIcon><LocalHospital /></ListItemIcon>
          Clinical Decision Support
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => {
          handleDownloadFile(menuFileId);
          handleMenuClose();
        }}>
          <ListItemIcon><Download /></ListItemIcon>
          Download
        </MenuItem>
        
        <MenuItem onClick={() => {
          handleShareFile(menuFileId);
          handleMenuClose();
        }}>
          <ListItemIcon><Share /></ListItemIcon>
          Share
        </MenuItem>
        
        <MenuItem onClick={() => {
          const file = files.find(f => f.id === menuFileId);
          if (file) {
            logFileAccess(file.id, 'delete');
            setFiles(prev => prev.filter(f => f.id !== file.id));
          }
          handleMenuClose();
        }}>
          <ListItemIcon><Delete color="error" /></ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      {/* Preview Dialog */}
      <Dialog 
        open={previewDialogOpen} 
        onClose={() => setPreviewDialogOpen(false)} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}>
                {currentPreviewFile && getFileIcon(currentPreviewFile.type, 24)}
              </Avatar>
              <Box>
                <Typography variant="h6">File Preview</Typography>
                {currentPreviewFile && (
                  <Typography variant="caption" color="text.secondary">
                    {getFileExtension(currentPreviewFile.name)} • {formatFileSize(currentPreviewFile.size)}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {currentPreviewFile?.isOcrProcessed && (
                <Chip
                  icon={<TextFields />}
                  label="OCR Processed"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              )}
              {currentPreviewFile?.isConfidential && (
                <Chip
                  icon={<Security />}
                  label="Confidential"
                  size="small"
                  color="error"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
          <IconButton onClick={() => setPreviewDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        {currentPreviewFile && (
          <>
            <Tabs 
              value={previewTabValue} 
              onChange={(_, newValue) => setPreviewTabValue(newValue)} 
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="File Details" />
              <Tab label="Content Preview" />
              {currentPreviewFile.accessLog && <Tab label="Access History" />}
            </Tabs>

            <DialogContent sx={{ p: 0 }}>
              <TabPanel value={previewTabValue} index={0}>
                <Grid container spacing={3}>
                  <Grid>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Avatar 
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          bgcolor: 'background.paper', 
                          border: 2, 
                          borderColor: 'primary.main' 
                        }}
                      >
                        {getFileIcon(currentPreviewFile.type, 30)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{getFileExtension(currentPreviewFile.name)} File</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {currentPreviewFile.type}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="subtitle2" color="text.secondary">File Name</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{currentPreviewFile.name}</Typography>
                    
                    <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                    <Chip 
                      label={getCategoryInfo(currentPreviewFile.category).label}
                      size="small"
                      sx={{ bgcolor: getCategoryInfo(currentPreviewFile.category).color, color: 'white', mb: 2 }}
                    />
                    
                    {currentPreviewFile.patientName && (
                      <>
                        <Typography variant="subtitle2" color="text.secondary">Patient</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Person sx={{ fontSize: 16, mr: 0.5, color: 'primary.main' }} />
                          <Typography variant="body1">{currentPreviewFile.patientName}</Typography>
                        </Box>
                      </>
                    )}
                  </Grid>
                  
                  <Grid>
                    <Typography variant="subtitle2" color="text.secondary">Size</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{formatFileSize(currentPreviewFile.size)}</Typography>
                    
                    <Typography variant="subtitle2" color="text.secondary">Upload Date</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {new Date(currentPreviewFile.date).toLocaleString()}
                    </Typography>
                    
                    {currentPreviewFile.lastAccessed && (
                      <>
                        <Typography variant="subtitle2" color="text.secondary">Last Accessed</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {new Date(currentPreviewFile.lastAccessed).toLocaleString()}
                        </Typography>
                      </>
                    )}
                    
                    {currentPreviewFile.accessCount && (
                      <>
                        <Typography variant="subtitle2" color="text.secondary">Access Count</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>{currentPreviewFile.accessCount}</Typography>
                      </>
                    )}
                  </Grid>
                </Grid>
                
                {currentPreviewFile.description && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Description</Typography>
                    <Typography variant="body1">{currentPreviewFile.description}</Typography>
                  </>
                )}
                
                {currentPreviewFile.tags.length > 0 && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Tags</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {currentPreviewFile.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </>
                )}

                {currentPreviewFile.sharedWith && currentPreviewFile.sharedWith.length > 0 && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Shared With</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentPreviewFile.sharedWith.length} people
                    </Typography>
                  </>
                )}
              </TabPanel>

              <TabPanel value={previewTabValue} index={1}>
                {currentPreviewFile.type.startsWith('image/') && currentPreviewFile.content && (
                  <Box sx={{ textAlign: 'center' }}>
                    <img 
                      src={currentPreviewFile.content} 
                      alt={currentPreviewFile.name}
                      style={{ maxWidth: '100%', maxHeight: '600px', borderRadius: 8 }}
                    />
                  </Box>
                )}
                
                {currentPreviewFile.originalFile && !currentPreviewFile.type.startsWith('image/') && (
                  <Alert severity="info">
                    File preview is available through download. The original {currentPreviewFile.name} file is ready for download.
                  </Alert>
                )}
                
                {!currentPreviewFile.content && !currentPreviewFile.originalFile && (
                  <Alert severity="warning">
                    Preview not available for this file type. The file may not have been properly uploaded.
                  </Alert>
                )}
              </TabPanel>

              {currentPreviewFile.accessLog && (
                <TabPanel value={previewTabValue} index={2}>
                  <Typography variant="h6" gutterBottom>Access History</Typography>
                  <List>
                    {currentPreviewFile.accessLog.map((entry, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={`${entry.action.charAt(0).toUpperCase() + entry.action.slice(1)} action`}
                          secondary={`${new Date(entry.timestamp).toLocaleString()} - ${entry.location}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </TabPanel>
              )}
            </DialogContent>
          </>
        )}

        <DialogActions>
          <Button 
            startIcon={<Download />} 
            onClick={() => currentPreviewFile && handleDownloadFile(currentPreviewFile.id)}
          >
            Download
          </Button>
          <Button 
            startIcon={<Share />} 
            onClick={() => currentPreviewFile && handleShareFile(currentPreviewFile.id)}
          >
            Share
          </Button>
          <Button onClick={() => setPreviewDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
      <Dialog 
        open={shareDialogOpen} 
        onClose={() => setShareDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Share />
            Share File: {sharingFile?.name}
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Select users to share with:
          </Typography>
          
          <List>
            {mockUsers.map((user) => (
              <ListItem key={user.id}>
                <ListItemAvatar>
                  <Avatar>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={`${user.email} • ${user.role}`}
                />
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(prev => [...prev, user.id]);
                    } else {
                      setSelectedUsers(prev => prev.filter(id => id !== user.id));
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Message (optional)"
            value={shareMessage}
            onChange={(e) => setShareMessage(e.target.value)}
            placeholder="Add a message for the recipients..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveShare}
            disabled={selectedUsers.length === 0}
            startIcon={<Share />}
          >
            Share with {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit File Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Edit File Details</Typography>
          <IconButton onClick={() => setEditDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Grid>
                <TextField
                  fullWidth
                  label="File Name (without extension)"
                  value={editFileName}
                  onChange={(e) => setEditFileName(e.target.value)}
                  placeholder="Enter file name"
                  sx={{ width: "420px" }}
                />
              </Grid>
              
              <Grid>
                <FormControl fullWidth sx={{ width: "420px" }}>
                  <InputLabel>File Type</InputLabel>
                  <Select
                    value={editFileExtension}
                    label="File Type"
                    onChange={(e) => setEditFileExtension(e.target.value)}
                  >
                    {FILE_FORMATS.map((format) => {
                      const IconComponent = format.icon;
                      return (
                        <MenuItem key={format.value} value={format.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconComponent sx={{ fontSize: 20 }} />
                            <Box>
                              <Typography variant="body2">{format.label}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                .{format.value.toUpperCase()}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>

              <Grid>
                <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 1, border: 1, borderColor: 'primary.200', maxWidth: "420px" }}>
                  <Typography variant="body2" color="primary.main">
                    <strong>Full file name:</strong> {editFileName || 'filename'}.{editFileExtension || 'ext'}
                  </Typography>
                </Box>
              </Grid>

              <Grid>
                <Divider />
              </Grid>

              <Grid>
                <FormControl fullWidth sx={{ width: "420px" }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={editFileCategory}
                    label="Category"
                    onChange={(e) => setEditFileCategory(e.target.value as FileCategory)}
                  >
                    {FILE_CATEGORIES.map((cat) => (
                      <MenuItem key={cat.value} value={cat.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: cat.color, mr: 1 }} />
                          {cat.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={editFileDescription}
                  onChange={(e) => setEditFileDescription(e.target.value)}
                  placeholder="Enter file description..."
                  sx={{ width: "420px" }}
                />
              </Grid>
              
              <Grid>
                <Autocomplete
                  multiple
                  freeSolo
                  value={editFileTags}
                  onChange={(_, newValue) => setEditFileTags(newValue)}
                  options={[]}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} key={index} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Tags" placeholder="Add tags..." sx={{ width: "420px" }} />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Existing Dialogs */}
      <MedicalClassificationDialog 
        fileManager={{
          medicalClassificationOpen,
          setMedicalClassificationOpen,
          currentOCRFile,
          updateFileWithMedicalData: (fileId: string, medicalData: ExtractedMedicalData, insights: MedicalInsight[]) => {
            setFiles(prev => prev.map(file => 
              file.id === fileId 
                ? { 
                    ...file, 
                    extractedData: medicalData,
                    clinicalInsights: insights,
                    processingStatus: 'completed'
                  }
                : file
            ));
          }
        }} 
      />
      
      <HIPAADashboard 
        fileManager={{
          securityDashboardOpen,
          setSecurityDashboardOpen,
        }} 
      />
      
      <DICOMViewer 
        fileManager={{
          dicomViewerOpen,
          setDicomViewerOpen,
          currentPreviewFile,
          updateFileAnnotations: (fileId: string, annotations: any) => {
            setFiles(prev => prev.map(file => 
              file.id === fileId ? { ...file, annotations } : file
            ));
          }
        }} 
      />
      
      <ClinicalDecisionSupport 
        fileManager={{
          clinicalDecisionOpen,
          setClinicalDecisionOpen,
          files,
          setCurrentPreviewFile,
          setPreviewDialogOpen: () => {},
        }} 
      />

      {/* Drag and Drop Overlay */}
      {dragging && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            pointerEvents: 'none',
          }}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <Box
            sx={{
              border: `3px dashed ${theme.palette.primary.main}`,
              borderRadius: 3,
              p: 6,
              backgroundColor: theme.palette.background.paper,
              textAlign: 'center',
            }}
          >
            <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" color="primary.main">
              Drop files here to upload
            </Typography>
          </Box>
        </Box>
      )}
    </Container>
  );
};