import React, { FC, useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Paper,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Send,
  Close,
  AttachFile,
} from '@mui/icons-material';
import { useTelemedicineContext } from '../../../providers/telemedicine';
import { format } from 'date-fns';

interface ChatPanelProps {
  onClose: () => void;
}

export const ChatPanel: FC<ChatPanelProps> = ({ onClose }) => {
  const { currentCall, sendMessage } = useTelemedicineContext();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentCall?.chatMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      sendMessage(`📎 ${file.name}`, 'file');
      event.target.value = '';
    }
  };

  if (!currentCall) return null;

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" color="white">
          Chat
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 1,
        }}
      >
        <List dense>
          {currentCall.chatMessages.map((message) => (
            <ListItem key={message.id} sx={{ mb: 1 }}>
              <Paper
                sx={{
                  p: 1.5,
                  backgroundColor: message.type === 'system' 
                    ? 'rgba(255, 255, 255, 0.05)'
                    : message.senderId === 'system'
                      ? 'rgba(33, 150, 243, 0.1)'
                      : 'rgba(76, 175, 80, 0.1)',
                  width: '100%',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: message.type === 'system' ? 'gray' : 'white',
                      fontWeight: 500,
                    }}
                  >
                    {message.senderName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'gray' }}>
                    {format(new Date(message.timestamp), 'HH:mm')}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: message.type === 'system' ? 'gray' : 'white',
                    fontStyle: message.type === 'system' ? 'italic' : 'normal',
                  }}
                >
                  {message.message}
                </Typography>
                {message.type === 'file' && (
                  <Chip
                    size="small"
                    label="File attachment"
                    sx={{
                      mt: 0.5,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    }}
                  />
                )}
              </Paper>
            </ListItem>
          ))}
        </List>
        <div ref={messagesEndRef} />
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <TextField
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          multiline
          maxRows={3}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(33, 150, 243, 0.5)',
              },
            },
            '& .MuiOutlinedInput-input::placeholder': {
              color: 'gray',
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ color: 'gray', mr: 1 }}
                >
                  <AttachFile />
                </IconButton>
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  sx={{
                    color: newMessage.trim() ? '#2196f3' : 'gray',
                  }}
                >
                  <Send />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileAttachment}
          accept="image/*,.pdf,.doc,.docx"
        />
      </Box>
    </Box>
  );
};