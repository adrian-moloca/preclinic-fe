import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Typography,
  Button
} from '@mui/material';
import { School, Add, Delete } from '@mui/icons-material';
import { IDoctor } from '../../../../providers/doctor/types';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

interface EducationEntry {
  educationalDegree: string;
  university: string;
  from: Date | null;
  to: Date | null;
}

interface EducationInfoSectionProps {
  formData: Omit<IDoctor, 'id'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<IDoctor, 'id'>>>;
}

export const EducationInfoSection: React.FC<EducationInfoSectionProps> = ({
  formData,
  setFormData
}) => {
  const [educationList, setEducationList] = useState<EducationEntry[]>([
    {
      educationalDegree: formData.educationalInformation?.educationalDegree || '',
      university: formData.educationalInformation?.university || '',
      from: formData.educationalInformation?.from ? new Date(formData.educationalInformation.from) : null,
      to: formData.educationalInformation?.to ? new Date(formData.educationalInformation.to) : null
    }
  ]);

  useEffect(() => {
    if (educationList.length > 0) {
      const primaryEducation = educationList[0];
      setFormData(prev => ({
        ...prev,
        educationalInformation: {
          educationalDegree: primaryEducation.educationalDegree,
          university: primaryEducation.university,
          from: primaryEducation.from ? primaryEducation.from.getFullYear().toString() : '',
          to: primaryEducation.to ? primaryEducation.to.getFullYear().toString() : ''
        }
      }));
    }
  }, [educationList, setFormData]);

  const handleEducationChange = (index: number, field: keyof EducationEntry, value: any) => {
    const updatedList = [...educationList];
    updatedList[index] = { ...updatedList[index], [field]: value };
    setEducationList(updatedList);
  };

  const addEducation = () => {
    setEducationList((prev) => [
      ...prev,
      { 
        educationalDegree: '', 
        university: '', 
        from: null, 
        to: null 
      }
    ]);
  };

  const removeEducation = (index: number) => {
    if (educationList.length > 1) {
      const updatedList = educationList.filter((_, i) => i !== index);
      setEducationList(updatedList);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Box display="flex" alignItems="center">
              <School sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Education Information
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={addEducation}
              size="small"
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.50',
                  borderColor: 'primary.main',
                }
              }}
            >
              Add Education
            </Button>
          </Box>

          {educationList.map((edu, index) => (
            <Box key={index} sx={{ mb: index < educationList.length - 1 ? 3 : 0 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
                  Education {index + 1}
                </Typography>
                
                {educationList.length > 1 && (
                  <IconButton
                    onClick={() => removeEducation(index)}
                    size="small"
                    sx={{
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'error.50',
                      }
                    }}
                  >
                    <Delete />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
                <Grid>
                  <TextField
                    fullWidth
                    label="Educational Degrees"
                    value={edu.educationalDegree}
                    onChange={(e) =>
                      handleEducationChange(index, 'educationalDegree', e.target.value)
                    }
                    placeholder="e.g., MBBS, MD, PhD"
                    required={index === 0}
                    sx={{ width: 300 }}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="University"
                    value={edu.university}
                    onChange={(e) => handleEducationChange(index, 'university', e.target.value)}
                    placeholder="e.g., Harvard Medical School"
                    required={index === 0}
                    sx={{ width: 300 }}
                  />
                </Grid>
                <Grid>
                  <DatePicker
                    views={['year']}
                    label="From Year"
                    value={edu.from}
                    onChange={(newValue) => handleEducationChange(index, 'from', newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: "Select year",
                        sx: { width: 300 }
                      }
                    }}
                  />
                </Grid>
                <Grid>
                  <DatePicker
                    views={['year']}
                    label="To Year"
                    value={edu.to}
                    onChange={(newValue) => handleEducationChange(index, 'to', newValue)}
                    minDate={edu.from || undefined}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: "Select year",
                        sx: { width: 300 }
                      }
                    }}
                  />
              </Grid>

              {/* Divider between education entries */}
              {index < educationList.length - 1 && (
                <Box sx={{ borderBottom: '1px solid #e0e0e0', mt: 3 }} />
              )}
              </Grid>
            </Box>
          ))}
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};
