import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Stack,
  AppBar,
  Toolbar,
  Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { format } from 'date-fns';

type Message = {
  id: number;
  text: string;
  sender: 'me' | 'bot';
  timestamp: Date;
};

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'me',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    setTimeout(() => {
      const botReply: Message = {
        id: Date.now() + 1,
        text: 'Auto-reply: Got your message!',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 600,
        height: 700,
        mx: 'auto',
        my: 4,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Avatar sx={{ mr: 2 }}>B</Avatar>
          <Typography variant="h6">Chat with Bot</Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          backgroundColor: '#f1f5f9',
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            display="flex"
            justifyContent={msg.sender === 'me' ? 'flex-end' : 'flex-start'}
            mb={1.5}
          >
            <Stack direction="row" spacing={1} alignItems="flex-end">
              {msg.sender === 'bot' && <Avatar sx={{ bgcolor: 'secondary.main' }}>B</Avatar>}
              <Box
                sx={{
                  bgcolor: msg.sender === 'me' ? 'primary.main' : 'grey.300',
                  color: msg.sender === 'me' ? 'white' : 'black',
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  borderTopRightRadius: msg.sender === 'me' ? 0 : 3,
                  borderTopLeftRadius: msg.sender === 'me' ? 3 : 0,
                  maxWidth: 350,
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', mt: 0.5, textAlign: 'right', opacity: 0.7 }}
                >
                  {format(msg.timestamp, 'HH:mm')}
                </Typography>
              </Box>
              {msg.sender === 'me' && <Avatar sx={{ bgcolor: 'primary.main' }}>Y</Avatar>}
            </Stack>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      {/* Input */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'white',
        }}
      >
        <TextField
          fullWidth
          placeholder="Type your message..."
          variant="outlined"
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ borderRadius: 2 }}
        />
        <IconButton color="primary" onClick={sendMessage} sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};