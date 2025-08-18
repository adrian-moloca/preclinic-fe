import React from "react";
import { Container, Box, Typography } from "@mui/material";
import { FileManagerHeader } from "./components/header/component";
import { NavigationBreadcrumbs } from "./components/navigation/component";
import { FileManagerControls } from "./components/controls/component";
import { CloudUpload } from "@mui/icons-material";
import { useFileManager } from "../../hooks/file-manager";
import FileStatistics from "./components/statistics";
import FoldersDisplay from "./components/folders";
import FilesTable from "./components/files-table";
import FilesGrid from "./components/files-grid";
import FileContextMenu from "./components/context-menu";
import EditFileDialog from "./components/edit-dialogs";
import PreviewDialog from "./components/preview-dialogs";
import VersionHistoryDialog from "./components/history-dialog";
import CreateFolderDialog from "./components/create-folder";
import MoveFilesDialog from "./components/move-files";
import BulkEditDialog from "./components/bulk-edit";
import ShareDialog from "./components/share-dialog";

export default function EnhancedFileManager() {
  const fileManager = useFileManager();

  return (
    <Container 
      maxWidth="xl" 
      sx={{ py: 4 }}
      onDragEnter={fileManager.onDragEnter}
      onDragLeave={fileManager.onDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={fileManager.onDrop}
    >
      <FileManagerHeader />

      {fileManager.dragging && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(25, 118, 210, 0.1)',
            border: '3px dashed',
            borderColor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        >
          <Box textAlign="center">
            <CloudUpload sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" color="primary">
              Drop files here to upload
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Files will be added to: {fileManager.currentFolder?.name}
            </Typography>
          </Box>
        </Box>
      )}

      <NavigationBreadcrumbs 
        breadcrumbs={fileManager.breadcrumbs}
        currentFolder={fileManager.currentFolder}
        setCurrentFolderId={fileManager.setCurrentFolderId}
        viewMode={fileManager.viewMode}
        setViewMode={fileManager.setViewMode}
      />

      <FileManagerControls 
        fileManager={fileManager}
      />

      <FileStatistics 
        sortedFiles={fileManager.sortedFiles}
        currentFolders={fileManager.currentFolders}
      />

      <FoldersDisplay 
        currentFolders={fileManager.currentFolders}
        setCurrentFolderId={fileManager.setCurrentFolderId}
      />

      {fileManager.viewMode === 'table' ? (
        <FilesTable 
          pageFiles={fileManager.pageFiles}
          selectedFiles={fileManager.selectedFiles}
          toggleSelect={fileManager.toggleSelect}
          toggleSelectAll={fileManager.toggleSelectAll}
          handleMenuOpen={fileManager.handleMenuOpen}
          getCategoryInfo={fileManager.getCategoryInfo}
          formatFileSize={fileManager.formatFileSize}
          renderPreview={fileManager.renderPreview}
          searchTerm={fileManager.searchTerm}
          categoryFilter={fileManager.categoryFilter}
          patientFilter={fileManager.patientFilter}
          tagFilter={fileManager.tagFilter}
          totalPages={fileManager.totalPages}
          currentPage={fileManager.currentPage}
          setCurrentPage={fileManager.setCurrentPage}
        />
      ) : (
        <FilesGrid 
          pageFiles={fileManager.pageFiles}
          selectedFiles={fileManager.selectedFiles}
          toggleSelect={fileManager.toggleSelect}
          handleMenuOpen={fileManager.handleMenuOpen}
          getCategoryInfo={fileManager.getCategoryInfo}
          formatFileSize={fileManager.formatFileSize}
          getFileIcon={fileManager.getFileIcon}
          searchTerm={fileManager.searchTerm}
          categoryFilter={fileManager.categoryFilter}
          patientFilter={fileManager.patientFilter}
          tagFilter={fileManager.tagFilter}
          totalPages={fileManager.totalPages}
          currentPage={fileManager.currentPage}
          setCurrentPage={fileManager.setCurrentPage}
        />
      )}

      <FileContextMenu 
        anchorEl={fileManager.anchorEl}
        handleMenuClose={fileManager.handleMenuClose}
        menuFileId={fileManager.menuFileId}
        files={fileManager.files}
        previewFile={fileManager.previewFile}
        openEditDialog={fileManager.openEditDialog}
        downloadSingleFile={fileManager.downloadSingleFile}
        viewVersionHistory={fileManager.viewVersionHistory}
        uploadNewVersion={fileManager.uploadNewVersion}
        duplicateFile={fileManager.duplicateFile}
        openShareDialog={fileManager.openShareDialog}
        stopSharing={fileManager.stopSharing}
        selectedFiles={fileManager.selectedFiles}
        setSelectedFiles={fileManager.setSelectedFiles}
        deleteSelected={fileManager.deleteSelected}
      />

      <EditFileDialog fileManager={fileManager} />
      <PreviewDialog fileManager={fileManager} />
      <VersionHistoryDialog fileManager={fileManager} />
      <CreateFolderDialog fileManager={fileManager} />
      <MoveFilesDialog fileManager={fileManager} />
      <BulkEditDialog fileManager={fileManager} />
      <ShareDialog fileManager={fileManager} />

      <input
        ref={fileManager.fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={fileManager.onFileInputChange}
      />
    </Container>
  );
}