import React from 'react';
import {
  Alert,
  AlertTitle,
  Button,
  Box,
  Portal,
  Slide,
  IconButton,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  Info,
  Close,
} from '@mui/icons-material';
import { useToast } from './context';
import { ToastMessage } from './types';

const ToastIcon = {
  success: CheckCircle,
  error: Error,
  warning: Warning,
  info: Info,
};

interface ToastItemProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
  index: number;
}

 export const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose, index }) => {
  const Icon = ToastIcon[toast.type];

  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          top: 80 + (index * 80),
          right: 24,
          zIndex: 9999,
          minWidth: 400,
          maxWidth: 500,
          mb: 1,
        }}
      >
        <Alert
          severity={toast.type}
          icon={<Icon />}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {toast.action && (
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    toast.action?.onClick();
                    onClose(toast.id);
                  }}
                >
                  {toast.action.label}
                </Button>
              )}
              <IconButton
                size="small"
                color="inherit"
                onClick={() => onClose(toast.id)}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          }
          sx={{
            boxShadow: 6,
            borderRadius: 2,
            '& .MuiAlert-message': {
              flex: 1,
            },
          }}
        >
          <AlertTitle sx={{ fontWeight: 600 }}>{toast.title}</AlertTitle>
          {toast.message && toast.message}
        </Alert>
      </Box>
    </Slide>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast();

  return (
    <Portal>
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={hideToast}
          index={index}
        />
      ))}
    </Portal>
  );
};

export const useToastHelpers = () => {
  const { showToast } = useToast();

  return {
    success: (title: string, message?: string, action?: { label: string; onClick: () => void }) => {
      showToast({ type: 'success', title, message, action });
    },
    error: (title: string, message?: string, action?: { label: string; onClick: () => void }) => {
      showToast({ type: 'error', title, message, action });
    },
    warning: (title: string, message?: string, action?: { label: string; onClick: () => void }) => {
      showToast({ type: 'warning', title, message, action });
    },
    info: (title: string, message?: string, action?: { label: string; onClick: () => void }) => {
      showToast({ type: 'info', title, message, action });
    },
  };
};