import React from 'react';
import { Box, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import { School } from '@mui/icons-material';
import { IAssistent } from '../../../../providers/assistent/types';

interface EducationInfoSectionProps {
  formData: Omit<IAssistent, 'id'>;
  setFormData: any;
}

export const EducationInfoSection: React.FC<EducationInfoSectionProps> = ({
  formData,
  setFormData
}) => {
  return (
    <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <School sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Education Information
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid>
            <TextField
              fullWidth
              label="Educational Degrees"
              value={formData.educationalInformation?.educationalDegree || ''}
              onChange={(e) => setFormData((prev: any) => ({ 
                ...prev, 
                educationalInformation: {
                  ...prev.educationalInformation,
                  educationalDegree: e.target.value
                }
              }))}
              placeholder="e.g., Nursing Diploma, BSN, MSN"
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="University"
              value={formData.educationalInformation?.university || ''}
              onChange={(e) => setFormData((prev: any) => ({ 
                ...prev, 
                educationalInformation: {
                  ...prev.educationalInformation,
                  university: e.target.value
                }
              }))}
              placeholder="e.g., Johns Hopkins School of Nursing"
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="From Year"
              value={formData.educationalInformation?.from || ''}
              onChange={(e) => setFormData((prev: any) => ({ 
                ...prev, 
                educationalInformation: {
                  ...prev.educationalInformation,
                  from: e.target.value
                }
              }))}
              placeholder="e.g., 2018"
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="To Year"
              value={formData.educationalInformation?.to || ''}
              onChange={(e) => setFormData((prev: any) => ({ 
                ...prev, 
                educationalInformation: {
                  ...prev.educationalInformation,
                  to: e.target.value
                }
              }))}
              placeholder="e.g., 2022"
              sx={{ width: 300 }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
