import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  Grid,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Button,
} from "@mui/material";
import { FC } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useAssistentsContext } from '../../../providers/assistent/context';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteModal from '../../../components/delete-modal';

export const AssistentDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { assistents, deleteAssistent } = useAssistentsContext();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const assistent = assistents.find(ast => ast.id === id);

  const handleDeleteClick = () => {
    if (assistent) {
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!assistent) return;

    setIsDeleting(true);
    try {
       deleteAssistent(assistent.id as string);
      setDeleteModalOpen(false);
      navigate('/assistents/all');
    } catch (error) {
      console.error('Error deleting assistent:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false);
    }
  };

  const handleEdit = () => {
    navigate(`/assistents/edit/${id}`);
  };

  if (!assistent) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error" mb={2}>
            Assistant Not Found
          </Typography>
          <Typography color="text.secondary" mb={3}>
            The assistant with ID "{id}" could not be found.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/assistents/all')}>
            Back to All Assistants
          </Button>
        </Paper>
      </Box>
    );
  }

  const formatLanguages = (languages: string[]) => {
    if (!languages || languages.length === 0) return "Not specified";
    return languages.join(", ");
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box mb={3} display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" fontWeight={600}>
          Assistant Details
        </Typography>
        <Box display="flex" gap={2}>
          <Tooltip title="Edit Assistant">
            <Button
              variant="outlined"
              onClick={handleEdit}
              startIcon={<EditIcon />}
              sx={{ minWidth: 120 }}
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete Assistant">
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteClick}
              startIcon={<DeleteIcon />}
              sx={{ minWidth: 120 }}
            >
              Delete
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={3} mb={4}>
          <Avatar
            src={assistent.profileImg || undefined}
            sx={{
              width: 120,
              height: 120,
              fontSize: 48,
              bgcolor: 'primary.main'
            }}
          >
            {!assistent.profileImg && `${assistent.firstName?.[0] || 'A'}${assistent.lastName?.[0] || ''}`}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={600} mb={1}>
              {assistent.firstName} {assistent.lastName}
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={2}>
              Assistant - {assistent.department}
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip label={assistent.department} color="primary" size="small" />
              {assistent.yearsOfExperience > 0 && (
                <Chip label={`${assistent.yearsOfExperience} years exp.`} variant="outlined" size="small" />
              )}
              {assistent.gender && (
                <Chip label={assistent.gender} variant="outlined" size="small" />
              )}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={4} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid>
            <Card elevation={1} sx={{ width: "300px", height: "400px" }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Personal Information
                  </Typography>
                </Box>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Email"
                      secondary={assistent.email || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Phone Number"
                      secondary={assistent.phoneNumber || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Birth Date"
                      secondary={assistent.birthDate || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Blood Group"
                      secondary={assistent.bloodGroup || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Languages"
                      secondary={formatLanguages(assistent.languages)}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid>
            <Card elevation={1} sx={{ width: "300px", height: "400px" }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <LocationOnIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Address Information
                  </Typography>
                </Box>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Address"
                      secondary={assistent.address || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="City"
                      secondary={assistent.city || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="State"
                      secondary={assistent.state || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Country"
                      secondary={assistent.country || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="ZIP Code"
                      secondary={assistent.zipCode || 'Not provided'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid>
            <Card elevation={1} sx={{ width: "300px", height: "400px" }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <WorkIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Professional Information
                  </Typography>
                </Box>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Medical License Number"
                      secondary={assistent.medLicenseNumber || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Years of Experience"
                      secondary={assistent.yearsOfExperience ? `${assistent.yearsOfExperience} years` : 'Not specified'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="About"
                      secondary={assistent.about || 'No description provided'}
                      sx={{
                        '& .MuiListItemText-secondary': {
                          maxHeight: '200px',
                          overflow: 'auto'
                        }
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid>
            <Card elevation={1} sx={{ width: "300px", height: "400px" }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <SchoolIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Education Information
                  </Typography>
                </Box>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Educational Degrees"
                      secondary={assistent.educationalInformation?.educationalDegree || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="University"
                      secondary={assistent.educationalInformation?.university || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Duration"
                      secondary={
                        assistent.educationalInformation?.from && assistent.educationalInformation?.to
                          ? `${assistent.educationalInformation.from} - ${assistent.educationalInformation.to}`
                          : 'Not provided'
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid>
            <Card elevation={1} sx={{ width: "300px", height: "400px" }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <ScheduleIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Working Schedule
                  </Typography>
                </Box>
                {assistent.workingSchedule && Array.isArray(assistent.workingSchedule) && assistent.workingSchedule.length > 0 ? (
                  <List dense>
                    {assistent.workingSchedule.map((daySchedule, dayIndex) => (
                      <ListItem key={dayIndex} sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant="subtitle2" fontWeight={600} color="primary">
                          {daySchedule.day}
                        </Typography>
                        {daySchedule.schedule && Array.isArray(daySchedule.schedule) && daySchedule.schedule.length > 0 ? (
                          <Box sx={{ pl: 2, width: '100%' }}>
                            {daySchedule.schedule.map((timeSlot, slotIndex) => (
                              <Typography key={slotIndex} variant="body2" color="text.secondary">
                                {timeSlot.session}: {timeSlot.from} - {timeSlot.to}
                              </Typography>
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                            No schedule set
                          </Typography>
                        )}
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">
                    No working schedule configured
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Assistant"
        itemName={assistent ? `${assistent.firstName} ${assistent.lastName}` : undefined}
        message={assistent ? `Are you sure you want to delete ${assistent.firstName} ${assistent.lastName}? This action cannot be undone.` : undefined}
        isDeleting={isDeleting}
      />
    </Box>
  );
};