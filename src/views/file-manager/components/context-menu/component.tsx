import React from "react";
import { Menu, MenuItem as MuiMenuItem, Divider } from "@mui/material";
import { 
  Visibility, 
  Edit, 
  Download, 
  History, 
  CloudUpload, 
  FileCopy, 
  Share, 
  Public, 
  Delete 
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
  deleteSelected
}: FileContextMenuProps) {
  
  const currentFile = files.find(f => f.id === menuFileId);

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MuiMenuItem onClick={() => {
        previewFile(menuFileId);
        handleMenuClose();
      }}>
        <Visibility fontSize="small" sx={{ mr: 1 }} />
        Preview
      </MuiMenuItem>
      
      <MuiMenuItem onClick={() => {
        openEditDialog(menuFileId);
        handleMenuClose();
      }}>
        <Edit fontSize="small" sx={{ mr: 1 }} />
        Edit Details
      </MuiMenuItem>
      
      <MuiMenuItem onClick={() => {
        downloadSingleFile(menuFileId);
        handleMenuClose();
      }}>
        <Download fontSize="small" sx={{ mr: 1 }} />
        Download
      </MuiMenuItem>
      
      <Divider />
      
      <MuiMenuItem onClick={() => {
        viewVersionHistory(menuFileId);
        handleMenuClose();
      }}>
        <History fontSize="small" sx={{ mr: 1 }} />
        Version History
      </MuiMenuItem>
      
      <MuiMenuItem onClick={() => {
        uploadNewVersion(menuFileId);
        handleMenuClose();
      }}>
        <CloudUpload fontSize="small" sx={{ mr: 1 }} />
        Upload New Version
      </MuiMenuItem>
      
      <MuiMenuItem onClick={() => {
        duplicateFile(menuFileId);
        handleMenuClose();
      }}>
        <FileCopy fontSize="small" sx={{ mr: 1 }} />
        Duplicate
      </MuiMenuItem>
      
      <Divider />
      
      <MuiMenuItem onClick={() => {
        openShareDialog(menuFileId);
        handleMenuClose();
      }}>
        <Share fontSize="small" sx={{ mr: 1 }} />
        Share File
      </MuiMenuItem>
      
      {(currentFile?.sharedWith && currentFile.sharedWith.length > 0) && (
        <MuiMenuItem onClick={() => {
          stopSharing(menuFileId);
          handleMenuClose();
        }}>
          <Public fontSize="small" sx={{ mr: 1 }} />
          Stop Sharing
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
        <Delete fontSize="small" sx={{ mr: 1 }} />
        Delete
      </MuiMenuItem>
    </Menu>
  );
}