import React, { useEffect, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, Chip, Button, Divider
} from '@mui/material';
import {
  Keyboard as KeyboardIcon,
  ArrowForward as ArrowIcon,
  Add as AddIcon,
  ViewWeek as ViewIcon
} from '@mui/icons-material';

interface CalendarShortcutsProps {
  open: boolean;
  onClose: () => void;
  calendarRef: any;
  onCreateEvent: (date: string) => void;
}

export const CalendarShortcuts: React.FC<CalendarShortcutsProps> = ({
  open,
  onClose,
  calendarRef,
  onCreateEvent
}) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!calendarRef) return;
    
    const api = calendarRef.getApi();
    const currentDate = api.getDate();
    
    const shortcuts = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 't', 'w', 'm', 'd', 'n', ' '];
    if (shortcuts.includes(event.key)) {
      event.preventDefault();
    }

    switch (event.key) {
      case 'ArrowLeft':
        api.prev();
        break;
      case 'ArrowRight':
        api.next();
        break;
      case 'ArrowUp':
        if (api.view.type.includes('Week')) {
          api.gotoDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
        } else {
          api.prev();
        }
        break;
      case 'ArrowDown':
        if (api.view.type.includes('Week')) {
          api.gotoDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
        } else {
          api.next();
        }
        break;
      case 't':
        api.today();
        break;
      case 'n':
        onCreateEvent(new Date().toISOString().split('T')[0]);
        break;
      case ' ':
        if (event.ctrlKey || event.metaKey) {
          onCreateEvent(api.getDate().toISOString().split('T')[0]);
        }
        break;
      case 'm':
        api.changeView('dayGridMonth');
        break;
      case 'w':
        api.changeView('timeGridWeek');
        break;
      case 'd':
        api.changeView('timeGridDay');
        break;
      case 'a':
        api.changeView('listWeek');
        break;
    }
  }, [calendarRef, onCreateEvent]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const shortcuts = [
    { category: 'Navigation', items: [
      { key: '←→', description: 'Previous/Next period' },
      { key: '↑↓', description: 'Previous/Next week' },
      { key: 'T', description: 'Go to today' },
    ]},
    { category: 'Views', items: [
      { key: 'M', description: 'Month view' },
      { key: 'W', description: 'Week view' },
      { key: 'D', description: 'Day view' },
      { key: 'A', description: 'Agenda view' },
    ]},
    { category: 'Actions', items: [
      { key: 'N', description: 'New event today' },
      { key: 'Ctrl+Space', description: 'New event on selected date' },
      { key: 'Esc', description: 'Close dialogs' },
    ]},
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        bgcolor: 'primary.main',
        color: 'primary.contrastText'
      }}>
        <KeyboardIcon />
        Keyboard Shortcuts
        <Chip 
          label="Pro Tips" 
          size="small" 
          sx={{ 
            ml: 'auto',
            bgcolor: 'primary.dark',
            color: 'primary.contrastText'
          }} 
        />
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Use these keyboard shortcuts to navigate and manage your calendar efficiently.
        </Typography>

        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
          {shortcuts.map((section, index) => (
            <Box key={index}>
              <Typography variant="h6" color="primary.main" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mb: 2
              }}>
                {section.category === 'Navigation' && <ArrowIcon />}
                {section.category === 'Views' && <ViewIcon />}
                {section.category === 'Actions' && <AddIcon />}
                {section.category}
              </Typography>
              
              {section.items.map((item, itemIndex) => (
                <Box key={itemIndex} display="flex" justifyContent="space-between" alignItems="center" py={0.5}>
                  <Chip
                    label={item.key}
                    size="small"
                    variant="outlined"
                    sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '0.7rem',
                      minWidth: 60
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 2, flex: 1 }}>
                    {item.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ bgcolor: 'info.light', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle2" gutterBottom color="info.main">
            💡 Pro Tips:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Hold Shift while using arrow keys for faster navigation<br />
            • Use Ctrl/Cmd + shortcuts for advanced actions<br />
            • Double-click any date to quickly create an event
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="contained" fullWidth>
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
};