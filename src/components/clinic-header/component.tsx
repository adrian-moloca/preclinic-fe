import { FC } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
} from '@mui/icons-material';
import { useClinicContext } from '../../providers/clinic/context';

export const ClinicHeader: FC = () => {
  const { selectedClinic } = useClinicContext();

  if (!selectedClinic) {
    return null;
  }

  return (
    <Box 
      sx={{ 
        bgcolor: 'background.paper', 
        borderBottom: '1px solid',
        borderColor: 'divider',
        p: 2,
        mb: 2,
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        {/* Clinic Logo */}
        <Avatar
          src={selectedClinic.logo}
          sx={{ 
            width: 60, 
            height: 60,
            bgcolor: 'primary.light',
          }}
        >
          {!selectedClinic.logo && <BusinessIcon fontSize="large" />}
        </Avatar>

        {/* Clinic Info */}
        <Box flex={1}>
          <Typography variant="h5" fontWeight={600} color="primary.main">
            {selectedClinic.name}
          </Typography>
          
          {selectedClinic.description && (
            <Typography variant="body2" color="text.secondary" mb={1}>
              {selectedClinic.description}
            </Typography>
          )}

          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            {selectedClinic.phone && (
              <Tooltip title="Phone">
                <Chip
                  icon={<PhoneIcon />}
                  label={selectedClinic.phone}
                  size="small"
                  variant="outlined"
                />
              </Tooltip>
            )}
            
            {selectedClinic.email && (
              <Tooltip title="Email">
                <Chip
                  icon={<EmailIcon />}
                  label={selectedClinic.email}
                  size="small"
                  variant="outlined"
                />
              </Tooltip>
            )}
            
            {selectedClinic.website && (
              <Tooltip title="Website">
                <Chip
                  icon={<WebsiteIcon />}
                  label={selectedClinic.website}
                  size="small"
                  variant="outlined"
                  clickable
                  onClick={() => window.open(
                    selectedClinic.website.startsWith('http') 
                      ? selectedClinic.website 
                      : `https://${selectedClinic.website}`, 
                    '_blank'
                  )}
                />
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Status */}
        <Box>
          <Chip
            label={selectedClinic.status}
            color={selectedClinic.status === 'active' ? 'success' : 'default'}
            size="small"
          />
        </Box>
      </Box>
    </Box>
  );
};