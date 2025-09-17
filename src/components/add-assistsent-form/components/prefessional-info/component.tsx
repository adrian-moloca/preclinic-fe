import React, { useState } from 'react';
import { Box, Card, CardContent, Grid, TextField, Typography, Chip } from '@mui/material';
import { Work, Remove } from '@mui/icons-material';
import { IAssistent } from '../../../../providers/assistent/types';

interface ProfessionalInfoSectionProps {
  formData: Omit<IAssistent, 'id'>;
  errors: Record<string, string>;
  handleInputChange: any;
  setFormData: any;
}

export const ProfessionalInfoSection: React.FC<ProfessionalInfoSectionProps> = ({
  formData,
  errors,
  handleInputChange,
  setFormData
}) => {
  const [languageInput, setLanguageInput] = useState('');

  const addLanguage = () => {
    const trimmed = languageInput.trim();
    if (trimmed && !formData.languages.includes(trimmed)) {
      setFormData((prev: any) => ({
        ...prev,
        languages: [...prev.languages, trimmed]
      }));
      setLanguageInput('');
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    setFormData((prev: any) => ({
      ...prev,
      languages: prev.languages.filter((lang: string) => lang !== languageToRemove)
    }));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addLanguage();
    }
  };

  return (
    <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Work sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Professional Information
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid>
            <TextField
              fullWidth
              label="Department"
              value={formData.department}
              onChange={handleInputChange('department')}
              error={!!errors.department}
              helperText={errors.department}
              placeholder="e.g., Emergency, ICU, General"
              required
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Medical License Number"
              value={formData.medLicenseNumber}
              onChange={handleInputChange('medLicenseNumber')}
              error={!!errors.medLicenseNumber}
              helperText={errors.medLicenseNumber}
              required
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Years of Experience"
              type="number"
              value={formData.yearsOfExperience}
              onChange={handleInputChange('yearsOfExperience')}
              sx={{ width: 300 }}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="Languages Spoken"
              placeholder="Type a language and press Enter"
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{ width: 300 }}
            />
            <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
              {formData.languages.map((language) => (
                <Chip
                  key={language}
                  label={language}
                  onDelete={() => removeLanguage(language)}
                  deleteIcon={<Remove />}
                  sx={{ height: 32 }}
                />
              ))}
            </Box>
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="About"
              rows={4}
              value={formData.about}
              onChange={handleInputChange('about')}
              placeholder="Brief description about the assistant's experience..."
              sx={{ width: 300 }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};