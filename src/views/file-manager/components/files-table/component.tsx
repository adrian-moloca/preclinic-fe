import React from "react";
import { 
  Card, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Checkbox,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Badge,
  Button,
  Avatar,
} from "@mui/material";
import { 
  Person, 
  MoreVert, 
  Lock, 
  Share, 
  History, 
  InsertDriveFile,
  Image,
  PictureAsPdf,
  VideoFile,
  AudioFile,
  TextFields,
  Visibility,
  CloudDone,
  Error,
  Schedule
} from "@mui/icons-material";
import { FileCategory, FileItem } from "../types";

interface FilesTableProps {
  pageFiles: FileItem[];
  selectedFiles: Set<string>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  handleMenuOpen: (event: React.MouseEvent<HTMLElement>, fileId: string) => void;
  getCategoryInfo: (category: FileCategory) => any;
  formatFileSize: (bytes: number) => string;
  renderPreview: (file: FileItem) => any;
  searchTerm: string;
  categoryFilter: FileCategory | 'all';
  patientFilter: string | null;
  tagFilter: string;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export function FilesTable({
  pageFiles,
  selectedFiles,
  toggleSelect,
  toggleSelectAll,
  handleMenuOpen,
  getCategoryInfo,
  formatFileSize,
  renderPreview,
  searchTerm,
  categoryFilter,
  patientFilter,
  tagFilter,
  totalPages,
  currentPage,
  setCurrentPage
}: FilesTableProps) {

  function getFileIcon(fileType: string) {
    if (fileType.startsWith("image/")) return <Image sx={{ color: '#4CAF50' }} />;
    if (fileType === "application/pdf") return <PictureAsPdf sx={{ color: '#F44336' }} />;
    if (fileType.startsWith("video/")) return <VideoFile sx={{ color: '#2196F3' }} />;
    if (fileType.startsWith("audio/")) return <AudioFile sx={{ color: '#FF9800' }} />;
    return <InsertDriveFile sx={{ color: '#757575' }} />;
  }

  function renderFilePreview(file: FileItem) {
    const preview = renderPreview(file);
    
    if (preview.isImage && preview.content) {
      return (
        <Avatar
          src={preview.content}
          alt={preview.name}
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

  function getProcessingStatusIcon(file: FileItem) {
    switch (file.processingStatus) {
      case 'processing':
        return <Schedule sx={{ color: 'warning.main' }} />;
      case 'completed':
        return <CloudDone sx={{ color: 'success.main' }} />;
      case 'failed':
        return <Error sx={{ color: 'error.main' }} />;
      default:
        return null;
    }
  }

  return (
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
                  Patient
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Category
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Tags
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Size
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Date
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Status
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
                    <Box sx={{ position: 'relative' }}>
                      {renderFilePreview(file)}
                      {file.processingStatus === 'processing' && (
                        <Box sx={{ 
                          position: 'absolute', 
                          top: 0, 
                          left: 0, 
                          right: 0, 
                          bottom: 0,
                          bgcolor: 'rgba(255, 255, 255, 0.8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1
                        }}>
                          <Schedule sx={{ color: 'warning.main', fontSize: 16 }} />
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {file.name}
                      </Typography>
                      {file.description && (
                        <Typography variant="caption" color="text.secondary">
                          {file.description}
                        </Typography>
                      )}
                      {file.ocrText && (
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            icon={<TextFields />}
                            label="OCR Processed"
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {file.patientName ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ fontSize: 16, mr: 0.5, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {file.patientName}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No patient
                      </Typography>
                    )}
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
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {file.tags.slice(0, 2).map((tag: string, index: number) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                      {file.tags.length > 2 && (
                        <Chip
                          label={`+${file.tags.length - 2}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
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
                    {file.lastAccessed && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Last: {new Date(file.lastAccessed).toLocaleDateString()}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      {file.isConfidential && (
                        <Tooltip title="Confidential">
                          <Lock sx={{ fontSize: 16, color: 'error.main' }} />
                        </Tooltip>
                      )}
                      {file.sharedWith.length > 0 && (
                        <Tooltip title={`Shared with ${file.sharedWith.length} people`}>
                          <Badge badgeContent={file.sharedWith.length} color="primary">
                            <Share sx={{ fontSize: 16, color: 'primary.main' }} />
                          </Badge>
                        </Tooltip>
                      )}
                      {file.version > 1 && (
                        <Tooltip title={`Version ${file.version}`}>
                          <Badge badgeContent={file.version} color="secondary">
                            <History sx={{ fontSize: 16, color: 'secondary.main' }} />
                          </Badge>
                        </Tooltip>
                      )}
                      {file.isOcrProcessed && (
                        <Tooltip title="OCR Processed">
                          <TextFields sx={{ fontSize: 16, color: 'success.main' }} />
                        </Tooltip>
                      )}
                      {getProcessingStatusIcon(file)}
                      {file.accessCount && file.accessCount > 0 && (
                        <Tooltip title={`Accessed ${file.accessCount} times`}>
                          <Badge badgeContent={file.accessCount} color="info">
                            <Visibility sx={{ fontSize: 16, color: 'info.main' }} />
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
                <TableCell colSpan={10}>
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <InsertDriveFile sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No files found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm || categoryFilter !== 'all' || patientFilter || tagFilter ? 
                        'Try adjusting your filters' : 
                        'Upload some files to get started'}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {totalPages > 1 && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
          {Array.from({ length: totalPages }, (_, p) => (
            <Button
              key={p}
              variant={currentPage === p + 1 ? "contained" : "outlined"}
              onClick={() => setCurrentPage(p + 1)}
              sx={{
                minWidth: 40,
                height: 40,
                borderRadius: 1,
              }}
            >
              {p + 1}
            </Button>
          ))}
        </Box>
      )}
    </Card>
  );
}