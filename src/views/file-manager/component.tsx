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
import { HIPAADashboard } from './components/hipaa-dashboard/component';
import { DICOMViewer } from './components/dicom-viewer/component';
import { ClinicalDecisionSupport } from './components/clinical-decision/component';
import MedicalClassificationDialog from './components/medical-clasification';

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

const mockPatients = [
  { id: '1', firstName: 'John', lastName: 'Doe' },
  { id: '2', firstName: 'Jane', lastName: 'Smith' },
  { id: '3', firstName: 'Bob', lastName: 'Johnson' },
];

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

  const addFiles = useCallback((fileList: FileList) => {
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
          content: file.type.startsWith('image/') ? reader.result as string : undefined,
          patientId: selectedPatientForUpload?.id,
          patientName: selectedPatientForUpload ? `${selectedPatientForUpload.firstName} ${selectedPatientForUpload.lastName}` : undefined,
          category: selectedCategory,
          tags: fileTags.split(',').map(tag => tag.trim()).filter(Boolean),
          isConfidential: isConfidential,
          priority: 'medium',
          processingStatus: 'pending',
          accessCount: 0,
          sharedWith: [],
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

  function getFileIcon(fileType: string) {
    if (fileType.startsWith("image/")) return <Image sx={{ color: '#4CAF50' }} />;
    if (fileType === "application/pdf") return <PictureAsPdf sx={{ color: '#F44336' }} />;
    if (fileType.startsWith("video/")) return <VideoFile sx={{ color: '#2196F3' }} />;
    if (fileType.startsWith("audio/")) return <AudioFile sx={{ color: '#FF9800' }} />;
    return <InsertDriveFile sx={{ color: '#757575' }} />;
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function renderPreview(file: FileItem) {
    if (file.type.startsWith("image/") && file.content) {
      return (
        <Avatar
          src={file.content}
          alt={file.name}
          sx={{ width: 40, height: 40, borderRadius: 1 }}
        />
      );
    }
    return (
      <Avatar sx={{ 
        width: 40, 
        height: 40, 
        borderRadius: 1, 
        bgcolor: theme.palette.action.hover,
      }}>
        {getFileIcon(file.type)}
      </Avatar>
    );
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

  function downloadSelected() {
    selectedFiles.forEach(fileId => {
      const file = files.find(f => f.id === fileId);
      if (file) {
        logFileAccess(fileId, 'download');
        console.log(`Downloading ${file.name}`);
      }
    });
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          const file = files.find(f => f.id === menuFileId);
          if (file) {
            logFileAccess(file.id, 'view');
          }
          handleMenuClose();
        }}>
          <ListItemIcon><Visibility /></ListItemIcon>
          Preview
        </MenuItem>
        <MenuItem onClick={() => {
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
          if (file && (file.type.includes('dicom') || file.category === 'imaging')) {
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
          const file = files.find(f => f.id === menuFileId);
          if (file) {
            logFileAccess(file.id, 'download');
          }
          handleMenuClose();
        }}>
          <ListItemIcon><Download /></ListItemIcon>
          Download
        </MenuItem>
        
        <MenuItem onClick={() => {
          const file = files.find(f => f.id === menuFileId);
          if (file) {
            logFileAccess(file.id, 'share');
          }
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