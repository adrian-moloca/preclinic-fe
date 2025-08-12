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
} from "@mui/material";
import { FC } from "react";
import { Warning, Delete } from "@mui/icons-material";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  isDeleting?: boolean;
  deleteButtonText?: string;
  cancelButtonText?: string;
}

export const DeleteModal: FC<DeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Delete Item",
  message,
  itemName,
  isDeleting = false,
  deleteButtonText = "Delete",
  cancelButtonText = "Cancel",
}) => {
  const defaultMessage = itemName
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : "Are you sure you want to delete this item? This action cannot be undone.";

  return (
    <Dialog
      open={open}
      onClose={!isDeleting ? onClose : undefined}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="delete-dialog-title">
        <Box display="flex" alignItems="center" gap={2}>
          <Warning sx={{ color: 'warning.main', fontSize: 28 }} />
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          {message || defaultMessage}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={onClose} 
          disabled={isDeleting}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          {cancelButtonText}
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={20} /> : <Delete />}
          sx={{ minWidth: 120 }}
        >
          {isDeleting ? 'Deleting...' : deleteButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};