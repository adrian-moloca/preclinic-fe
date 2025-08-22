import React, { FC, ReactNode, useEffect, useState } from 'react';
import { Box, Alert, IconButton, Collapse } from '@mui/material';
import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material';
import { useDraftSaving } from '../../hooks/draft-saving';

interface AutoSaveFormWrapperProps {
  children: ReactNode;
  formType: string;
  formData: Record<string, any>;
  onRestoreDraft?: (data: Record<string, any>) => void;
  autoSaveInterval?: number; 
  formId?: string;
}

export const AutoSaveFormWrapper: FC<AutoSaveFormWrapperProps> = ({
  children,
  formType,
  formData,
  onRestoreDraft,
  autoSaveInterval = 30000, 
  formId,
}) => {
  const { saveDraft, loadDraft, lastSaved } = useDraftSaving(formType, formId);
  const [showDraftAlert, setShowDraftAlert] = useState(false);
  const [autoSaveEnabled, ] = useState(true);

  useEffect(() => {
    const existingDraft = loadDraft();
    if (existingDraft && Object.keys(existingDraft).length > 0) {
      setShowDraftAlert(true);
    }
  }, [loadDraft]);

  useEffect(() => {
    if (!autoSaveEnabled) return;

    const interval = setInterval(() => {
      const hasData = Object.values(formData).some(value => {
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
        return value !== null && value !== undefined;
      });

      if (hasData) {
        saveDraft(formData);
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [formData, saveDraft, autoSaveInterval, autoSaveEnabled]);

  const handleRestoreDraft = () => {
    const draftData = loadDraft();
    if (draftData && onRestoreDraft) {
      onRestoreDraft(draftData);
      setShowDraftAlert(false);
    }
  };

  const handleDismissDraft = () => {
    setShowDraftAlert(false);
  };

  return (
    <Box>
      <Collapse in={showDraftAlert}>
        <Alert
          severity="info"
          action={
            <Box display="flex" gap={1}>
              <IconButton
                size="small"
                onClick={handleRestoreDraft}
                title="Restore draft"
                color="inherit"
              >
                <SaveIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleDismissDraft}
                title="Dismiss"
                color="inherit"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          }
          sx={{ mb: 2 }}
        >
          A saved draft was found for this form. Would you like to restore it?
        </Alert>
      </Collapse>
      
      {children}
      
      {lastSaved && autoSaveEnabled && (
        <Box mt={1}>
          <Alert severity="success" sx={{ py: 0.5 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <SaveIcon fontSize="small" />
              Draft auto-saved {new Date(lastSaved).toLocaleTimeString()}
            </Box>
          </Alert>
        </Box>
      )}
    </Box>
  );
};