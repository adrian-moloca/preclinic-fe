import React from "react";
import { 
  Card, 
  Grid, 
  Box, 
  Typography, 
  Checkbox, 
  IconButton, 
  Chip,
  Button
} from "@mui/material";
import { MoreVert, Person, Lock, Share, InsertDriveFile } from "@mui/icons-material";
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
      case 'Image': return <img {...iconProps} alt="" />;
      case 'PictureAsPdf': return <InsertDriveFile {...iconProps} />;
      case 'VideoFile': return <InsertDriveFile {...iconProps} />;
      case 'AudioFile': return <InsertDriveFile {...iconProps} />;
      default: return <InsertDriveFile {...iconProps} />;
    }
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

                  <Box sx={{ p: 2, pt: 5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      {file.type.startsWith("image/") && file.content ? (
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
                      ) : (
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'grey.100',
                            borderRadius: 2
                          }}
                        >
                          {renderIconFromString(getFileIcon(file.type))}
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

                    <Chip
                      label={categoryInfo.label}
                      size="small"
                      sx={{
                        bgcolor: categoryInfo.color,
                        color: 'white',
                        fontWeight: 'medium',
                        mb: 1
                      }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {file.isConfidential && (
                          <Lock sx={{ fontSize: 12, color: 'error.main' }} />
                        )}
                        {file.sharedWith.length > 0 && (
                          <Share sx={{ fontSize: 12, color: 'primary.main' }} />
                        )}
                      </Box>
                    </Box>
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
      
      {/* Pagination */}
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