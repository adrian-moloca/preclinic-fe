import React from "react";
import { Container, Box, Typography } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { FileManagerHeader } from "./components/header/component";
import { NavigationBreadcrumbs } from "./components/navigation/component";
import { FileManagerControls } from "./components/controls/component";
import { FoldersDisplay } from "./components/folders/component";
import { FilesTable } from "./components/files-table/component";
import { FilesGrid } from "./components/files-grid/component";
import { FileContextMenu } from "./components/context-menu/component";
import { useFileManager } from "../../hooks/file-manager";
import EditFileDialog from "./components/edit-dialogs";
import PreviewDialog from "./components/preview-dialogs";
import VersionHistoryDialog from "./components/history-dialog";
import CreateFolderDialog from "./components/create-folder";
import MoveFilesDialog from "./components/move-files";
import BulkEditDialog from "./components/bulk-edit";
import ShareDialog from "./components/share-dialog";
import OCRDialog from "./components/ocr-dialog";
import FileProcessingDialog from "./components/file-processing";
import MobileIntegrationsDialog from "./components/mobile-integration";
import SecurityDashboardDialog from "./components/security-dashboard";
import AdvancedSearchDialog from "./components/advanced-search";
import OCRDataViewerDialog from "./components/ocr-data-viewer";

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
        processFileWithOCR={fileManager.processFileWithOCR}
        setOcrDialogOpen={fileManager.setOcrDialogOpen}
        setMenuFileId={fileManager.setMenuFileId}
        viewOCRData={fileManager.viewOCRData}
      />

      <EditFileDialog fileManager={fileManager} />
      <PreviewDialog fileManager={fileManager} />
      <VersionHistoryDialog fileManager={fileManager} />
      <CreateFolderDialog fileManager={fileManager} />
      <MoveFilesDialog fileManager={fileManager} />
      <BulkEditDialog fileManager={fileManager} />
      <ShareDialog fileManager={fileManager} />

      <OCRDialog fileManager={fileManager} />
      <FileProcessingDialog fileManager={fileManager} />
      <MobileIntegrationsDialog fileManager={fileManager} />
      <SecurityDashboardDialog fileManager={fileManager} />
      <AdvancedSearchDialog fileManager={fileManager} />
      <OCRDataViewerDialog fileManager={fileManager} />

      <input
        ref={fileManager.fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={fileManager.onFileInputChange}
      />

      <video
        ref={fileManager.videoRef}
        autoPlay
        playsInline
        style={{ display: 'none' }}
      />
      
      <canvas
        ref={fileManager.canvasRef}
        style={{ display: 'none' }}
      />
    </Container>
  );
}