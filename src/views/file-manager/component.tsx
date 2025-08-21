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
  useTheme, // NEW: Add theme hook
} from '@mui/material';
import {
  CloudUpload,
  Search,
  Download,
  Delete,
  MoreVert,
  Sort,
  Image,
  PictureAsPdf,
  VideoFile,
  AudioFile,
  InsertDriveFile,
} from '@mui/icons-material';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  date: string;
  content?: string;
}

export const LocalFileManager: React.FC = () => {
  const theme = useTheme(); 
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [, setMenuFileId] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    const modifier = sortDir === 'asc' ? 1 : -1;
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * modifier;
    }
    
    return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * modifier;
  });

  const pageFiles = sortedFiles.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const addFiles = useCallback((fileList: FileList) => {
    setLoading(true);
    Array.from(fileList).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileItem: FileItem = {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          date: new Date().toISOString(),
          content: file.type.startsWith('image/') ? reader.result as string : undefined
        };
        setFiles(prev => [...prev, fileItem]);
      };
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
    setTimeout(() => setLoading(false), 1000);
  }, []);

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
        bgcolor: theme.palette.action.hover, // FIXED: Use theme
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
    setFiles(prev => prev.filter(f => !selectedFiles.has(f.id)));
    setSelectedFiles(new Set());
  }

  function downloadSelected() {
    selectedFiles.forEach(fileId => {
      const file = files.find(f => f.id === fileId);
      if (file) {
        console.log(`Downloading ${file.name}`);
      }
    });
  }

  function handleSort(field: 'name' | 'size' | 'date') {
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
          File Manager
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload, organize, and manage your files with ease
        </Typography>
      </Box>

      <Card sx={{ 
        mb: 3, 
        boxShadow: 2,
        backgroundColor: theme.palette.background.paper, // FIXED: Use theme
      }}>
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
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                  sx={{ width: 250 }}
                />
                <IconButton
                  onClick={() => handleSort('name')}
                  title={`Sort by name (${sortBy === 'name' ? sortDir : "asc"})`}
                  color="primary"
                  sx={{ 
                    bgcolor: theme.palette.action.hover, // FIXED: Use theme
                    '&:hover': { bgcolor: theme.palette.action.selected } // FIXED: Use theme
                  }}
                >
                  <Sort sx={{ transform: sortDir === 'desc' ? 'rotate(180deg)' : 'none' }} />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
        </Box>
      )}

      {/* Files Table */}
      <Card sx={{ 
        boxShadow: 3,
        backgroundColor: theme.palette.background.paper, // FIXED: Use theme
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                bgcolor: theme.palette.background.paper, // FIXED: Use theme instead of 'grey.50'
              }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      pageFiles.length > 0 &&
                      pageFiles.every((f) => selectedFiles.has(f.id))
                    }
                    onChange={toggleSelectAll}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Preview
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Size
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Date Added
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Type
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
              {pageFiles.map((file) => (
                <TableRow
                  key={file.id}
                  hover
                  sx={{
                    bgcolor: selectedFiles.has(file.id) ? theme.palette.action.selected : 'inherit', // FIXED: Use theme
                    '&:hover': {
                      bgcolor: selectedFiles.has(file.id) 
                        ? theme.palette.action.selected 
                        : theme.palette.action.hover // FIXED: Use theme
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
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {file.name}
                    </Typography>
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
                    <Chip 
                      label={file.type.split('/')[0] || 'file'} 
                      size="small" 
                      variant="outlined"
                      sx={{ textTransform: 'capitalize' }}
                    />
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
              ))}
              {pageFiles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
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
            backgroundColor: theme.palette.background.paper, // FIXED: Use theme
            borderTop: `1px solid ${theme.palette.divider}`, // FIXED: Use theme
          }}
        />
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: theme.palette.background.paper, // FIXED: Use theme
          }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Download sx={{ mr: 2 }} />
          Download
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Delete sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Menu>

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
              : 'rgba(0, 0, 0, 0.1)', // FIXED: Use theme
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
              border: `3px dashed ${theme.palette.primary.main}`, // FIXED: Use theme
              borderRadius: 3,
              p: 6,
              backgroundColor: theme.palette.background.paper, // FIXED: Use theme
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