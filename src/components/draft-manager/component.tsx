import React, { FC, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Alert,
} from '@mui/material';
import {
  Restore as RestoreIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useDraftSaving } from '../../hooks/draft-saving';
import { formatDistanceToNow } from 'date-fns';

interface DraftManagerProps {
  onRestoreDraft?: (data: Record<string, any>, formType: string) => void;
  formTypeFilter?: string;
}

export const DraftManager: FC<DraftManagerProps> = ({ 
  onRestoreDraft,
  formTypeFilter 
}) => {
  const { getAllDrafts, clearExpiredDrafts } = useDraftSaving('');
  const [selectedDraft, setSelectedDraft] = useState<any>(null);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);

  const drafts = getAllDrafts(formTypeFilter);

  const handleRestoreDraft = (draft: any) => {
    setSelectedDraft(draft);
    setShowRestoreDialog(true);
  };

  const confirmRestore = () => {
    if (selectedDraft && onRestoreDraft) {
      onRestoreDraft(selectedDraft.data, selectedDraft.formType);
    }
    setShowRestoreDialog(false);
    setSelectedDraft(null);
  };

  const getFormTypeLabel = (formType: string) => {
    return formType
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getFormTypeColor = (formType: string) => {
    if (formType.includes('patient')) return 'primary';
    if (formType.includes('appointment')) return 'secondary';
    if (formType.includes('prescription')) return 'success';
    return 'default';
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <SaveIcon />
              Draft Forms
            </Typography>
            <Button
              size="small"
              onClick={clearExpiredDrafts}
              variant="outlined"
            >
              Clean Up
            </Button>
          </Box>

          {drafts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No saved drafts found.
            </Typography>
          ) : (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                Drafts are automatically saved and expire after 7 days.
              </Alert>
              
              <List>
                {drafts.map((draft) => (
                  <ListItem key={draft.id} divider>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" fontWeight={500}>
                            {getFormTypeLabel(draft.formType)}
                          </Typography>
                          <Chip
                            label={draft.formType}
                            size="small"
                            variant="outlined"
                            color={getFormTypeColor(draft.formType) as any}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          Saved {formatDistanceToNow(draft.lastSaved, { addSuffix: true })}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleRestoreDraft(draft)}
                        title="Restore draft"
                        color="primary"
                      >
                        <RestoreIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={showRestoreDialog} onClose={() => setShowRestoreDialog(false)}>
        <DialogTitle>Restore Draft</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to restore this draft? Any current form data will be replaced.
          </Typography>
          {selectedDraft && (
            <Box mt={2}>
              <Typography variant="caption" color="text.secondary">
                Form: {getFormTypeLabel(selectedDraft.formType)}
              </Typography>
              <br />
              <Typography variant="caption" color="text.secondary">
                Saved: {formatDistanceToNow(selectedDraft.lastSaved, { addSuffix: true })}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRestoreDialog(false)}>
            Cancel
          </Button>
          <Button onClick={confirmRestore} variant="contained">
            Restore
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};