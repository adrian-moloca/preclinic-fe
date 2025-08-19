import React from "react";
import { Menu, MenuItem as MuiMenuItem, Divider, ListItemIcon, ListItemText } from "@mui/material";
import { 
  Visibility, 
  Edit, 
  Download, 
  History, 
  CloudUpload, 
  FileCopy, 
  Share, 
  Public, 
  Delete,
  TextFields,
  Security,
  BugReport,
  GetApp
} from "@mui/icons-material";
import { FileItem } from "../types";

interface FileContextMenuProps {
  anchorEl: null | HTMLElement;
  handleMenuClose: () => void;
  menuFileId: string;
  files: FileItem[];
  previewFile: (fileId: string) => void;
  openEditDialog: (fileId: string) => void;
  downloadSingleFile: (fileId: string) => void;
  viewVersionHistory: (fileId: string) => void;
  uploadNewVersion: (fileId: string) => void;
  duplicateFile: (fileId: string) => void;
  openShareDialog: (fileId: string) => void;
  stopSharing: (fileId: string) => void;
  selectedFiles: Set<string>;
  setSelectedFiles: (files: Set<string>) => void;
  deleteSelected: () => void;
  processFileWithOCR: (fileId: string) => void;
  setOcrDialogOpen: (open: boolean) => void;
  setMenuFileId: ((id: string) => void) | null;
}

export function FileContextMenu({
  anchorEl,
  handleMenuClose,
  menuFileId,
  files,
  previewFile,
  openEditDialog,
  downloadSingleFile,
  viewVersionHistory,
  uploadNewVersion,
  duplicateFile,
  openShareDialog,
  stopSharing,
  selectedFiles,
  setSelectedFiles,
  deleteSelected,
  processFileWithOCR,
  setOcrDialogOpen,
  setMenuFileId
}: FileContextMenuProps) {
  
  const currentFile = files.find(f => f.id === menuFileId);

  const handleOCRProcessing = () => {
    if (currentFile && (currentFile.type.startsWith('image/') || currentFile.type === 'application/pdf')) {
      processFileWithOCR(menuFileId);
    }
    handleMenuClose();
  };

  const handleAdvancedOCR = () => {
    if (setMenuFileId) {
      setMenuFileId(menuFileId);
    }
    setOcrDialogOpen(true);
    handleMenuClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: { minWidth: 200 }
      }}
    >
      <MuiMenuItem onClick={() => {
        previewFile(menuFileId);
        handleMenuClose();
      }}>
        <ListItemIcon>
          <Visibility fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Preview" />
      </MuiMenuItem>
      
      <MuiMenuItem onClick={() => {
        openEditDialog(menuFileId);
        handleMenuClose();
      }}>
        <ListItemIcon>
          <Edit fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Edit Details" />
      </MuiMenuItem>
      
      <MuiMenuItem onClick={() => {
        downloadSingleFile(menuFileId);
        handleMenuClose();
      }}>
        <ListItemIcon>
          <Download fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Download" />
      </MuiMenuItem>
      
      <Divider />
      
      <MuiMenuItem onClick={() => {
        viewVersionHistory(menuFileId);
        handleMenuClose();
      }}>
        <ListItemIcon>
          <History fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Version History" />
      </MuiMenuItem>
      
      <MuiMenuItem onClick={() => {
        uploadNewVersion(menuFileId);
        handleMenuClose();
      }}>
        <ListItemIcon>
          <CloudUpload fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Upload New Version" />
      </MuiMenuItem>
      
      <MuiMenuItem onClick={() => {
        duplicateFile(menuFileId);
        handleMenuClose();
      }}>
        <ListItemIcon>
          <FileCopy fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Duplicate" />
      </MuiMenuItem>
      
      <Divider />
      
      {currentFile && (currentFile.type.startsWith('image/') || currentFile.type === 'application/pdf') && (
        <>
          <MuiMenuItem onClick={handleOCRProcessing}>
            <ListItemIcon>
              <TextFields fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary={currentFile.isOcrProcessed ? "Re-process OCR" : "Process OCR"} 
              secondary={currentFile.isOcrProcessed ? "Text already extracted" : "Extract text from document"}
            />
          </MuiMenuItem>
          
          <MuiMenuItem onClick={handleAdvancedOCR}>
            <ListItemIcon>
              <BugReport fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Advanced OCR" 
              secondary="Configure language & settings"
            />
          </MuiMenuItem>
          
          <Divider />
        </>
      )}
      
      <MuiMenuItem onClick={() => {
        openShareDialog(menuFileId);
        handleMenuClose();
      }}>
        <ListItemIcon>
          <Share fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Share File" />
      </MuiMenuItem>
      
      {currentFile?.sharedWith && currentFile.sharedWith.length > 0 && (
        <MuiMenuItem onClick={() => {
          stopSharing(menuFileId);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <Public fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Stop Sharing" 
            secondary={`Shared with ${currentFile.sharedWith?.length ?? 0} people`}
          />
        </MuiMenuItem>
      )}
      
      <Divider />
      
      {currentFile?.accessLog && currentFile.accessLog.length > 0 && (
        <MuiMenuItem onClick={() => {
          handleMenuClose();
        }}>
          <ListItemIcon>
            <Security fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Access History" 
            secondary={`${currentFile.accessCount || 0} total accesses`}
          />
        </MuiMenuItem>
      )}
      
      {currentFile?.isOcrProcessed && (
        <MuiMenuItem onClick={() => {
          handleMenuClose();
        }}>
          <ListItemIcon>
            <GetApp fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="View OCR Data" 
            secondary="Show extracted text & medical data"
          />
        </MuiMenuItem>
      )}
      
      <Divider />
      
      <MuiMenuItem 
        onClick={() => {
          setSelectedFiles(new Set([menuFileId]));
          deleteSelected();
          handleMenuClose();
        }}
        sx={{ color: 'error.main' }}
      >
        <ListItemIcon>
          <Delete fontSize="small" sx={{ color: 'error.main' }} />
        </ListItemIcon>
        <ListItemText primary="Delete" />
      </MuiMenuItem>
    </Menu>
  );
}