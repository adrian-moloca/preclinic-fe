import React, { useState, useEffect, useRef } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Checkbox,
  IconButton,
  Card,
  CardContent,
  Grid,
  Chip,
  Menu,
  MenuItem as MuiMenuItem,
  Divider,
  LinearProgress,
  Avatar
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  Download,
  Undo,
  Search,
  Sort,
  MoreVert,
  Edit,
  InsertDriveFile,
  Image,
  PictureAsPdf,
  VideoFile,
  AudioFile,
} from "@mui/icons-material";

const PAGE_SIZE = 12;

interface FileItem {
  id: string;
  name: string;
  size: number;
  date: string;
  type: string;
  content: string | null;
  isFolder: boolean;
  folderId: string | null;
  fileObject: File;
}

interface UndoAction {
  type: 'delete';
  files: FileItem[];
}

export default function AdvancedFileManager() {
  const [files, setFiles] = useState<FileItem[]>(() => {
    try {
      const stored = localStorage.getItem("files");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuFileId, setMenuFileId] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files));
  }, [files]);

  function addFiles(fileList: FileList) {
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
      folderId: null,
      fileObject: file,
    }));

    newFiles.forEach((fileObj) => {
      if (fileObj.type.startsWith("image/") || fileObj.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setFiles((oldFiles: FileItem[]) =>
              oldFiles.map((f) =>
                f.id === fileObj.id ? { ...f, content: e.target!.result as string } : f
              )
            );
          }
        };
        reader.readAsDataURL(fileObj.fileObject);
      }
    });

    setFiles((old: FileItem[]) => [...old, ...newFiles]);
    setLoading(false);
  }

  function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      addFiles(e.target.files);
    }
    if (e.target) {
      e.target.value = "";
    }
  }

  function deleteSelected() {
    if (selectedFiles.size === 0) return;
    const filesToDelete = files.filter((f) => selectedFiles.has(f.id));
    setUndoStack((stack) => [...stack, { type: "delete", files: filesToDelete }]);
    setFiles((old) => old.filter((f) => !selectedFiles.has(f.id)));
    setSelectedFiles(new Set());
  }

  function undo() {
    if (undoStack.length === 0) return;
    const lastAction = undoStack[undoStack.length - 1];
    const newStack = undoStack.slice(0, -1);
    
    if (lastAction.type === "delete") {
      setFiles((old) => [...old, ...lastAction.files]);
    }
    setUndoStack(newStack);
  }

  function renameFile(id: string) {
    const file = files.find(f => f.id === id);
    const newName = prompt("Enter new name:", file?.name);
    if (!newName) return;
    setFiles((old) =>
      old.map((f) => (f.id === id ? { ...f, name: newName } : f))
    );
  }

  const sortedFilteredFiles = [...files]
    .filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let res = 0;
      if (sortBy === "name") {
        res = a.name.localeCompare(b.name);
      } else if (sortBy === "date") {
        res = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === "size") {
        res = a.size - b.size;
      }
      return sortDir === "asc" ? res : -res;
    });

  const totalPages = Math.ceil(sortedFilteredFiles.length / PAGE_SIZE);
  const pageFiles = sortedFilteredFiles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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

  function downloadSelected() {
    selectedFiles.forEach((id) => {
      const file = files.find((f) => f.id === id);
      if (!file) return;
      if (file.fileObject) {
        const url = URL.createObjectURL(file.fileObject);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
      } else if (file.content) {
        fetch(file.content)
          .then((res) => res.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = file.name;
            a.click();
            URL.revokeObjectURL(url);
          })
          .catch((error) => {
            console.error("Error downloading file:", error);
          });
      }
    });
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
      <Avatar sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: 'grey.100' }}>
        {getFileIcon(file.type)}
      </Avatar>
    );
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
                  color="success"
                >
                  Download ({selectedFiles.size})
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Undo />}
                  onClick={undo}
                  disabled={undoStack.length === 0}
                >
                  Undo
                </Button>
              </Box>
            </Grid>
            
            <Grid>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <TextField
                  size="small"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
                  }}
                  sx={{ minWidth: 200 }}
                />
                
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort by"
                    onChange={(e) => setSortBy(e.target.value as "name" | "date" | "size")}
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="size">Size</MenuItem>
                  </Select>
                </FormControl>
                
                <IconButton
                  onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
                  color="primary"
                  sx={{ 
                    bgcolor: 'primary.50', 
                    '&:hover': { bgcolor: 'primary.100' }
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
      <Card sx={{ boxShadow: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
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
                    bgcolor: selectedFiles.has(file.id) ? 'action.selected' : 'inherit',
                    '&:hover': {
                      bgcolor: selectedFiles.has(file.id) ? 'action.selected' : 'action.hover'
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
                        {searchTerm ? 'Try adjusting your search terms' : 'Upload some files to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
            {Array.from({ length: totalPages }, (_, p) => (
              <Button
                key={p}
                variant={currentPage === p + 1 ? "contained" : "outlined"}
                size="small"
                onClick={() => setCurrentPage(p + 1)}
                disabled={currentPage === p + 1}
                sx={{ minWidth: 40 }}
              >
                {p + 1}
              </Button>
            ))}
          </Box>
        )}
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MuiMenuItem 
          onClick={() => {
            renameFile(menuFileId);
            handleMenuClose();
          }}
        >
          <Edit sx={{ mr: 2 }} />
          Rename
        </MuiMenuItem>
        <MuiMenuItem 
          onClick={() => {
            setSelectedFiles(new Set([menuFileId]));
            downloadSelected();
            handleMenuClose();
          }}
          sx={{ color: 'success.main' }}
        >
          <Download sx={{ mr: 2 }} />
          Download
        </MuiMenuItem>
        <Divider />
        <MuiMenuItem 
          onClick={() => {
            setSelectedFiles(new Set([menuFileId]));
            deleteSelected();
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 2 }} />
          Delete
        </MuiMenuItem>
      </Menu>

      {/* Drag and Drop Overlay */}
      {dragging && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
            <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Drop files here
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Release to upload your files
            </Typography>
          </Card>
        </Box>
      )}

      {/* Main Drop Zone */}
      <Box
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: dragging ? 'all' : 'none',
          zIndex: dragging ? 9998 : -1,
        }}
      />
    </Container>
  );
}