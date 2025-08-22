import React, { FC, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Avatar,
  Chip,
  Grid
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useRecentItems } from '../../../../../hooks/recent-items';
import { useParams } from 'react-router-dom';
import FavoriteButton from '../../../../../components/favorite-buttons';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  profileImg?: string;
}

interface EnhancedPatientHeaderProps {
  patient: Patient;
}

export const EnhancedPatientHeader: FC<EnhancedPatientHeaderProps> = ({ patient }) => {
  const { addRecentItem } = useRecentItems();
  const { id } = useParams();

  useEffect(() => {
    if (patient && id) {
      addRecentItem({
        id: patient.id,
        type: 'patient',
        title: `${patient.firstName} ${patient.lastName}`,
        subtitle: patient.email || patient.phoneNumber || '',
        url: `/patients/${patient.id}`,
        metadata: {
          gender: patient.gender,
          email: patient.email,
          phone: patient.phoneNumber,
        },
      });
    }
  }, [patient, id, addRecentItem]);

  if (!patient) return null;

  const favoriteItem = {
    id: patient.id,
    type: 'patient' as const,
    title: `${patient.firstName} ${patient.lastName}`,
    subtitle: patient.email || patient.phoneNumber || '',
    url: `/patients/${patient.id}`,
    metadata: {
      gender: patient.gender,
      email: patient.email,
      phone: patient.phoneNumber,
    },
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid>
            <Avatar
              src={patient.profileImg}
              sx={{ width: 80, height: 80 }}
            >
              <PersonIcon fontSize="large" />
            </Avatar>
          </Grid>
          
          <Grid>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Typography variant="h4" fontWeight="bold">
                {patient.firstName} {patient.lastName}
              </Typography>
              <FavoriteButton item={favoriteItem} />
              {patient.gender && (
                <Chip 
                  label={patient.gender} 
                  size="small" 
                  variant="outlined" 
                />
              )}
            </Box>
            
            <Typography variant="body1" color="text.secondary">
              {patient.email && `Email: ${patient.email}`}
            </Typography>
            
            {patient.phoneNumber && (
              <Typography variant="body1" color="text.secondary">
                Phone: {patient.phoneNumber}
              </Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};