import { useState, useRef, useCallback } from 'react';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  date: string;
  content?: string;
}

export const useFileManagerLogic = (confirmDelete?: (count: number) => boolean) => {
  const [files, setFiles] = useState<FileItem[]>(() => {
    try {
      const stored = localStorage.getItem('file-manager-files');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuFileId, setMenuFileId] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Filter and sort logic
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

  // Persist files to localStorage
  const updateFiles = useCallback((newFiles: FileItem[]) => {
    setFiles(newFiles);
    try {
      localStorage.setItem('file-manager-files', JSON.stringify(newFiles));
    } catch (error) {
      console.error('Failed to save files to localStorage:', error);
    }
  }, []);

  // File upload logic
  const addFiles = useCallback((fileList: FileList) => {
    setLoading(true);
    
    const promises = Array.from(fileList).map((file) => {
      return new Promise<FileItem>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const fileItem: FileItem = {
            id: `${Date.now()}-${Math.random()}`,
            name: file.name,
            size: file.size,
            type: file.type,
            date: new Date().toISOString(),
            content: file.type.startsWith('image/') ? reader.result as string : undefined,
          };
          resolve(fileItem);
        };
        
        if (file.type.startsWith('image/')) {
          reader.readAsDataURL(file);
        } else {
          reader.readAsText(file);
        }
      });
    });

    Promise.all(promises).then((newFiles) => {
      updateFiles([...files, ...newFiles]);
      setLoading(false);
    });
  }, [files, updateFiles]);

  // Event handlers
  const handleSort = (field: 'name' | 'size' | 'date') => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const handleSelectFile = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedFiles.size === pageFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(pageFiles.map(f => f.id)));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      addFiles(files);
    }
    // Reset the input value to allow uploading the same file again
    if (event.target.value) {
      event.target.value = '';
    }
  };

  const handleDeleteSelected = () => {
    if (selectedFiles.size === 0) return;

    let shouldDelete = true;
    if (typeof confirmDelete === 'function') {
      shouldDelete = confirmDelete(selectedFiles.size);
    }
    if (shouldDelete) {
      const newFiles = files.filter(file => !selectedFiles.has(file.id));
      updateFiles(newFiles);
      setSelectedFiles(new Set());
    }
  };

  const handleDownloadSelected = () => {
    selectedFiles.forEach(fileId => {
      const file = files.find(f => f.id === fileId);
      if (file) {
        // Create a download link
        const element = document.createElement('a');
        const fileContent = file.content || `File: ${file.name}\nSize: ${file.size} bytes\nType: ${file.type}`;
        const file_blob = new Blob([fileContent], { type: file.type });
        element.href = URL.createObjectURL(file_blob);
        element.download = file.name;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, fileId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuFileId(fileId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuFileId('');
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    dragCounter.current = 0;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleDragEvents = {
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
  };

  return {
    files,
    selectedFiles,
    searchTerm,
    sortBy,
    sortDir,
    page,
    rowsPerPage,
    loading,
    dragging,
    anchorEl,
    menuFileId,
    filteredFiles,
    sortedFiles,
    pageFiles,
    fileInputRef,
    setSearchTerm,
    setPage: (newPage: number) => setPage(newPage),
    setRowsPerPage: (newRowsPerPage: number) => {
      setRowsPerPage(newRowsPerPage);
      setPage(0);
    },
    handleSort,
    handleSelectFile,
    handleSelectAll,
    handleFileUpload,
    handleDeleteSelected,
    handleDownloadSelected,
    handleMenuOpen,
    handleMenuClose,
    handleDragEvents,
  };
};