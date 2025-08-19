import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { Folder, Security, Cloud, TextFields, Smartphone } from "@mui/icons-material";

export function FileManagerHeader() {
  return (
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
        <Folder sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Enhanced File Manager
        </Typography>
      </Box>
      
      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
        Advanced document management with OCR, AI processing, and mobile integration
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Chip 
          icon={<TextFields />} 
          label="OCR Processing" 
          color="primary" 
          variant="outlined" 
          size="small"
        />
        <Chip 
          icon={<Security />} 
          label="Secure Sharing" 
          color="secondary" 
          variant="outlined" 
          size="small"
        />
        <Chip 
          icon={<Cloud />} 
          label="Cloud Storage" 
          color="info" 
          variant="outlined" 
          size="small"
        />
        <Chip 
          icon={<Smartphone />} 
          label="Mobile Ready" 
          color="success" 
          variant="outlined" 
          size="small"
        />
      </Box>
    </Box>
  );
}