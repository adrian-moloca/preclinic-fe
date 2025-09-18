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
  const [educationList, setEducationList] = useState<EducationEntry[]>(() => {
    if (formData.educationalInformation && formData.educationalInformation.length > 0) {
      return formData.educationalInformation.map(edu => ({
        educationalDegree: edu.educationalDegree || '',
        university: edu.university || '',
        from: edu.from ? new Date(edu.from) : null,
        to: edu.to ? new Date(edu.to) : null
      }));
    }
    return [{
      educationalDegree: '',
      university: '',
      from: null,
      to: null
    }];
  });

  // Only update formData when educationList actually changes (not on initial mount)
  const [isInitialMount, setIsInitialMount] = useState(true);

  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }
    
    // Only update if there's actual data to save
    setFormData(prev => ({
      ...prev,
      educationalInformation: (
        educationList.length === 1
          ? [{
              educationalDegree: educationList[0].educationalDegree || '',
              university: educationList[0].university || '',
              from: educationList[0].from ? educationList[0].from.getFullYear().toString() : '',
              to: educationList[0].to ? educationList[0].to.getFullYear().toString() : ''
            }]
          : educationList.map(edu => ({
              educationalDegree: edu.educationalDegree || '',
              university: edu.university || '',
              from: edu.from ? edu.from.getFullYear().toString() : '',
              to: edu.to ? edu.to.getFullYear().toString() : ''
            }))
      ) as typeof prev.educationalInformation
    }));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [educationList]); // Remove setFormData from deps to avoid infinite loop

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
