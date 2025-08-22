import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Warning,
  Delete,
  Save,
  Block,
  CheckCircle,
  ErrorOutline,
  InfoOutlined,
} from '@mui/icons-material';

export type ConfirmationType = 'delete' | 'save' | 'discard' | 'block' | 'approve' | 'warning' | 'info';

interface EnhancedConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type?: ConfirmationType;
  title?: string;
  message?: string;
  itemName?: string;
  isLoading?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showWarning?: boolean;
  warningMessage?: string;
  details?: Array<{ label: string; value: string }>;
  consequences?: string[];
  customIcon?: React.ComponentType<any>;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const typeConfig = {
  delete: {
    icon: Delete,
    color: 'error' as const,
    confirmText: 'Delete',
    title: 'Delete Item',
    severity: 'error' as const,
  },
  save: {
    icon: Save,
    color: 'primary' as const,
    confirmText: 'Save',
    title: 'Save Changes',
    severity: 'info' as const,
  },
  discard: {
    icon: Block,
    color: 'warning' as const,
    confirmText: 'Discard',
    title: 'Discard Changes',
    severity: 'warning' as const,
  },
  block: {
    icon: Block,
    color: 'error' as const,
    confirmText: 'Block',
    title: 'Block User',
    severity: 'error' as const,
  },
  approve: {
    icon: CheckCircle,
    color: 'success' as const,
    confirmText: 'Approve',
    title: 'Approve Request',
    severity: 'success' as const,
  },
  warning: {
    icon: Warning,
    color: 'warning' as const,
    confirmText: 'Continue',
    title: 'Warning',
    severity: 'warning' as const,
  },
  info: {
    icon: InfoOutlined,
    color: 'info' as const,
    confirmText: 'Confirm',
    title: 'Information',
    severity: 'info' as const,
  },
};

export const ConfirmationDialog: React.FC<EnhancedConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  type = 'warning',
  title,
  message,
  itemName,
  isLoading = false,
  confirmButtonText,
  cancelButtonText = 'Cancel',
  showWarning = false,
  warningMessage,
  details,
  consequences,
  customIcon,
  maxWidth = 'sm',
}) => {
  const config = typeConfig[type];
  const IconComponent = customIcon || config.icon;

  const getDefaultMessage = () => {
    switch (type) {
      case 'delete':
        return itemName 
          ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
          : 'Are you sure you want to delete this item? This action cannot be undone.';
      case 'save':
        return 'Are you sure you want to save these changes?';
      case 'discard':
        return 'Are you sure you want to discard your changes? All unsaved data will be lost.';
      case 'block':
        return itemName
          ? `Are you sure you want to block "${itemName}"?`
          : 'Are you sure you want to block this user?';
      case 'approve':
        return itemName
          ? `Are you sure you want to approve "${itemName}"?`
          : 'Are you sure you want to approve this request?';
      default:
        return 'Are you sure you want to continue?';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!isLoading ? onClose : undefined}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'visible',
        },
      }}
    >
      <DialogTitle 
        id="confirmation-dialog-title"
        sx={{ 
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            backgroundColor: `${config.color}.50`,
            color: `${config.color}.main`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconComponent sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={600} color={`${config.color}.main`}>
            {title || config.title}
          </Typography>
          {itemName && (
            <Chip
              label={itemName}
              size="small"
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          )}
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pb: 2 }}>
        <DialogContentText id="confirmation-dialog-description" sx={{ mb: 2 }}>
          {message || getDefaultMessage()}
        </DialogContentText>

        {details && details.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Details:
            </Typography>
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
              {details.map((detail, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {detail.label}:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {detail.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {consequences && consequences.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              This action will:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {consequences.map((consequence, index) => (
                <Typography key={index} component="li" variant="body2" color="text.secondary">
                  {consequence}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        {(showWarning || warningMessage) && (
          <Alert 
            severity={config.severity} 
            sx={{ mt: 2 }}
            icon={<ErrorOutline />}
          >
            {warningMessage || 'This action cannot be undone. Please proceed with caution.'}
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={onClose} 
          disabled={isLoading}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          {cancelButtonText}
        </Button>
        <Button 
          onClick={onConfirm} 
          color={config.color}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <IconComponent />}
          sx={{ minWidth: 120 }}
        >
          {isLoading ? 'Processing...' : (confirmButtonText || config.confirmText)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};