import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  Download,
  ZoomIn,
  ZoomOut,
  RotateLeft,
  RotateRight,
  Fullscreen,
  Share,
  Delete,
  Edit,
  Info,
} from '@mui/icons-material';

interface ImagePreviewModalProps {
  open: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  metadata?: {
    size?: string;
    dimensions?: string;
    type?: string;
    uploadDate?: string;
    uploadedBy?: string;
  };
  actions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  }>;
  allowDownload?: boolean;
  allowDelete?: boolean;
  allowShare?: boolean;
  allowEdit?: boolean;
  onDownload?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onEdit?: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  open,
  onClose,
  src,
  alt = 'Image preview',
  title,
  subtitle,
  metadata,
  actions = [],
  allowDownload = true,
  allowDelete = false,
  allowShare = false,
  allowEdit = false,
  onDownload,
  onDelete,
  onShare,
  onEdit,
  maxWidth = 'lg',
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (open) {
      setZoom(1);
      setRotation(0);
      setIsFullscreen(false);
      setIsLoading(true);
      setImageError(false);
      setShowInfo(false);
    }
  }, [open, src]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.25));
  };

  const handleRotateLeft = () => {
    setRotation(prev => prev - 90);
  };

  const handleRotateRight = () => {
    setRotation(prev => prev + 90);
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      const link = document.createElement('a');
      link.href = src;
      link.download = title || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isFullscreen ? false : maxWidth}
      fullWidth={!isFullscreen}
      fullScreen={isFullscreen}
      PaperProps={{
        sx: {
          borderRadius: isFullscreen ? 0 : 3,
          height: isFullscreen ? '100vh' : 'auto',
          maxHeight: isFullscreen ? '100vh' : '90vh',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {title && (
            <Typography variant="h6" fontWeight={600} noWrap>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {metadata && (
            <IconButton
              size="small"
              onClick={() => setShowInfo(!showInfo)}
              color={showInfo ? 'primary' : 'default'}
            >
              <Info />
            </IconButton>
          )}
          
          <IconButton size="small" onClick={handleZoomOut} disabled={zoom <= 0.25}>
            <ZoomOut />
          </IconButton>
          
          <Typography variant="caption" sx={{ minWidth: 50, textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </Typography>
          
          <IconButton size="small" onClick={handleZoomIn} disabled={zoom >= 3}>
            <ZoomIn />
          </IconButton>
          
          <IconButton size="small" onClick={handleRotateLeft}>
            <RotateLeft />
          </IconButton>
          
          <IconButton size="small" onClick={handleRotateRight}>
            <RotateRight />
          </IconButton>
          
          <IconButton size="small" onClick={handleFullscreen}>
            <Fullscreen />
          </IconButton>
          
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          minHeight: 400,
          background: 'linear-gradient(45deg, #f5f5f5 25%, transparent 25%), linear-gradient(-45deg, #f5f5f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f5f5f5 75%), linear-gradient(-45deg, transparent 75%, #f5f5f5 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        }}
      >
        {showInfo && metadata && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'background.paper',
              p: 2,
              borderRadius: 2,
              boxShadow: 3,
              zIndex: 10,
              minWidth: 200,
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Image Information
            </Typography>
            {metadata.size && (
              <Typography variant="caption" display="block">
                Size: {metadata.size}
              </Typography>
            )}
            {metadata.dimensions && (
              <Typography variant="caption" display="block">
                Dimensions: {metadata.dimensions}
              </Typography>
            )}
            {metadata.type && (
              <Typography variant="caption" display="block">
                Type: {metadata.type}
              </Typography>
            )}
            {metadata.uploadDate && (
              <Typography variant="caption" display="block">
                Uploaded: {metadata.uploadDate}
              </Typography>
            )}
            {metadata.uploadedBy && (
              <Typography variant="caption" display="block">
                By: {metadata.uploadedBy}
              </Typography>
            )}
          </Box>
        )}

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'auto',
            position: 'relative',
          }}
        >
          {isLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {imageError ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h6" color="error" gutterBottom>
                Failed to load image
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The image could not be displayed. Please check the image source.
              </Typography>
            </Box>
          ) : (
            <Box
              component="img"
              src={src}
              alt={alt}
              onLoad={handleImageLoad}
              onError={handleImageError}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease',
                cursor: zoom > 1 ? 'grab' : 'default',
                '&:active': {
                  cursor: zoom > 1 ? 'grabbing' : 'default',
                },
              }}
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          {allowDownload && (
            <Button
              startIcon={<Download />}
              onClick={handleDownload}
              size="small"
              variant="outlined"
            >
              Download
            </Button>
          )}
          
          {allowShare && (
            <Button
              startIcon={<Share />}
              onClick={onShare}
              size="small"
              variant="outlined"
            >
              Share
            </Button>
          )}
          
          {allowEdit && (
            <Button
              startIcon={<Edit />}
              onClick={onEdit}
              size="small"
              variant="outlined"
            >
              Edit
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {actions.map((action, index) => (
            <Button
              key={index}
              startIcon={action.icon}
              onClick={action.onClick}
              size="small"
              variant="outlined"
              color={action.color || 'primary'}
            >
              {action.label}
            </Button>
          ))}
          
          {allowDelete && (
            <Button
              startIcon={<Delete />}
              onClick={onDelete}
              size="small"
              variant="outlined"
              color="error"
            >
              Delete
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};