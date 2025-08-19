import React from "react";
import { 
  Card, 
  Grid, 
  Box, 
  Typography, 
  Checkbox, 
  IconButton, 
  Chip,
  Button,
  Badge,
  Tooltip,
  LinearProgress
} from "@mui/material";
import { 
  MoreVert, 
  Person, 
  Lock, 
  Share, 
  InsertDriveFile, 
  TextFields,
  Visibility,
  CloudDone,
  Error,
  Schedule
} from "@mui/icons-material";
import { FileCategory, FileItem } from "../types";

interface FilesGridProps {
  pageFiles: FileItem[];
  selectedFiles: Set<string>;
  toggleSelect: (id: string) => void;
  handleMenuOpen: (event: React.MouseEvent<HTMLElement>, fileId: string) => void;
  getCategoryInfo: (category: FileCategory) => any;
  formatFileSize: (bytes: number) => string;
  getFileIcon: (fileType: string) => string;
  searchTerm: string;
  categoryFilter: FileCategory | 'all';
  patientFilter: string | null;
  tagFilter: string;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export function FilesGrid({
  pageFiles,
  selectedFiles,
  toggleSelect,
  handleMenuOpen,
  getCategoryInfo,
  formatFileSize,
  getFileIcon,
  searchTerm,
  categoryFilter,
  patientFilter,
  tagFilter,
  totalPages,
  currentPage,
  setCurrentPage
}: FilesGridProps) {

  function renderIconFromString(iconName: string) {
    const iconProps = { sx: { fontSize: 40, color: 'grey.600' } };
    
    switch (iconName) {
      case 'Image': return <InsertDriveFile {...iconProps} style={{ color: '#4CAF50' }} />;
      case 'PictureAsPdf': return <InsertDriveFile {...iconProps} style={{ color: '#F44336' }} />;
      case 'VideoFile': return <InsertDriveFile {...iconProps} style={{ color: '#2196F3' }} />;
      case 'AudioFile': return <InsertDriveFile {...iconProps} style={{ color: '#FF9800' }} />;
      default: return <InsertDriveFile {...iconProps} />;
    }
  }

  function getProcessingStatusDisplay(file: FileItem) {
    if (file.processingStatus === 'processing') {
      return (
        <Box sx={{ 
          position: 'absolute', 
          top: 8, 
          right: 40, 
          zIndex: 1,
          bgcolor: 'warning.light',
          borderRadius: 1,
          p: 0.5
        }}>
          <Schedule sx={{ fontSize: 16, color: 'warning.main' }} />
        </Box>
      );
    }
    return null;
  }

  return (
    <Card sx={{ boxShadow: 3 }}>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {pageFiles.map((file) => {
            const categoryInfo = getCategoryInfo(file.category);
            return (
              <Grid key={file.id}>
                <Card
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: selectedFiles.has(file.id) ? 2 : 1,
                    borderColor: selectedFiles.has(file.id) ? 'primary.main' : 'divider',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => toggleSelect(file.id)}
                >
                  <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
                    <Checkbox
                      checked={selectedFiles.has(file.id)}
                      onChange={() => toggleSelect(file.id)}
                      size="small"
                      sx={{ bgcolor: 'white', borderRadius: 1 }}
                    />
                  </Box>
                  
                  <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e, file.id);
                      }}
                      sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Box>

                  {getProcessingStatusDisplay(file)}

                  <Box sx={{ p: 2, pt: 5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, position: 'relative' }}>
                      {file.type.startsWith("image/") && file.content ? (
                        <Box sx={{ position: 'relative' }}>
                          <img
                            src={file.content}
                            alt={file.name}
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 8
                            }}
                          />
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
                              borderRadius: 2
                            }}>
                              <Schedule sx={{ color: 'warning.main' }} />
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'grey.100',
                            borderRadius: 2,
                            position: 'relative'
                          }}
                        >
                          {renderIconFromString(getFileIcon(file.type))}
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
                              borderRadius: 2
                            }}>
                              <Schedule sx={{ color: 'warning.main' }} />
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>

                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {file.name}
                    </Typography>

                    {file.patientName && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Person sx={{ fontSize: 14, mr: 0.5, color: 'primary.main' }} />
                        <Typography variant="caption" color="text.secondary">
                          {file.patientName}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ mb: 1 }}>
                      <Chip
                        label={categoryInfo.label}
                        size="small"
                        sx={{
                          bgcolor: categoryInfo.color,
                          color: 'white',
                          fontWeight: 'medium'
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                      {file.isOcrProcessed && (
                        <Tooltip title="OCR Processed">
                          <Chip
                            icon={<TextFields />}
                            label="OCR"
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        </Tooltip>
                      )}
                      {file.isConfidential && (
                        <Tooltip title="Confidential">
                          <Chip
                            icon={<Lock />}
                            label="Private"
                            size="small"
                            color="error"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        </Tooltip>
                      )}
                      {file.processingStatus === 'completed' && (
                        <Tooltip title="Processing Complete">
                          <CloudDone sx={{ fontSize: 16, color: 'success.main' }} />
                        </Tooltip>
                      )}
                      {file.processingStatus === 'failed' && (
                        <Tooltip title="Processing Failed">
                          <Error sx={{ fontSize: 16, color: 'error.main' }} />
                        </Tooltip>
                      )}
                    </Box>

                    {file.description && (
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ 
                          display: 'block',
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {file.description}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                        {file.sharedWith.length > 0 && (
                          <Tooltip title={`Shared with ${file.sharedWith.length} people`}>
                            <Badge badgeContent={file.sharedWith.length} color="primary">
                              <Share sx={{ fontSize: 12, color: 'primary.main' }} />
                            </Badge>
                          </Tooltip>
                        )}
                        {file.accessCount && file.accessCount > 0 && (
                          <Tooltip title={`Accessed ${file.accessCount} times`}>
                            <Badge badgeContent={file.accessCount} color="info">
                              <Visibility sx={{ fontSize: 12, color: 'info.main' }} />
                            </Badge>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>

                    {file.processingStatus === 'processing' && (
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress />
                        <Typography variant="caption" color="text.secondary">
                          Processing...
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        
        {pageFiles.length === 0 && (
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
        )}
      </Box>
      
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