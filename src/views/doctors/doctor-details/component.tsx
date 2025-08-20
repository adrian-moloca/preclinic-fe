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
import { useDoctorsContext } from '../../../providers/doctor/context';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import ScheduleIcon from '@mui/icons-material/Schedule';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteModal from '../../../components/delete-modal';
import { IDoctor } from '../../../providers/doctor/types';

export const DoctorDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { doctors, deleteDoctor } = useDoctorsContext();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const doctor = doctors.find((doc: IDoctor) => doc.id === id);

  const handleDeleteClick = () => {
    if (doctor) {
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!doctor) return;

    setIsDeleting(true);
    try {
      await deleteDoctor(doctor.id);
      setDeleteModalOpen(false);
      navigate('/doctors/all');
    } catch (error) {
      console.error('Error deleting doctor:', error);
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
    navigate(`/doctors/edit/${id}`);
  };

  if (!doctor) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error" mb={2}>
            Doctor Not Found
          </Typography>
          <Typography color="text.secondary" mb={3}>
            The doctor with ID "{id}" could not be found.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/doctors/all')}>
            Back to All Doctors
          </Button>
        </Paper>
      </Box>
    );
  }

  const formatSchedule = (workingSchedule: any) => {
    if (!workingSchedule || Object.keys(workingSchedule).length === 0) {
      return [];
    }

    return Object.entries(workingSchedule as Record<string, any[]>)
      .filter(([_, schedules]) => schedules && schedules.length > 0)
      .map(([day, schedules]) => ({
        day,
        sessions: (schedules as any[]).map((schedule: any) =>
          `${schedule.session}: ${schedule.from} - ${schedule.to}`
        )
      }));
  };

  const formatLanguages = (languages: string[]) => {
    if (!languages || languages.length === 0) return "Not specified";
    return languages.join(", ");
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box mb={3} display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" fontWeight={600}>
          Doctor Details
        </Typography>
        <Box display="flex" gap={2}>
          <Tooltip title="Edit Doctor">
            <Button
              variant="outlined"
              onClick={handleEdit}
              startIcon={<EditIcon />}
              sx={{ minWidth: 120 }}
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete Doctor">
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
            src={doctor.profileImg || undefined}
            sx={{
              width: 120,
              height: 120,
              fontSize: 48,
              bgcolor: 'primary.main'
            }}
          >
            {!doctor.profileImg && `${doctor.firstName?.[0] || 'D'}${doctor.lastName?.[0] || ''}`}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={600} mb={1}>
              Dr. {doctor.firstName} {doctor.lastName}
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={2}>
              {doctor.designation} - {doctor.department}
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip label={doctor.department} color="primary" size="small" />
              {doctor.yearsOfExperience > 0 && (
                <Chip label={`${doctor.yearsOfExperience} years exp.`} variant="outlined" size="small" />
              )}
              {doctor.gender && (
                <Chip label={doctor.gender} variant="outlined" size="small" />
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
                      secondary={doctor.email || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Phone Number"
                      secondary={doctor.phoneNumber || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Birth Date"
                      secondary={doctor.birthDate || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Blood Group"
                      secondary={doctor.bloodGroup || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Languages"
                      secondary={formatLanguages(doctor.languages)}
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
                      secondary={doctor.address || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="City"
                      secondary={doctor.city || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="State"
                      secondary={doctor.state || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Country"
                      secondary={doctor.country || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="ZIP Code"
                      secondary={doctor.zipCode || 'Not provided'}
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
                      secondary={doctor.medLicenteNumber || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Years of Experience"
                      secondary={doctor.yearsOfExperience ? `${doctor.yearsOfExperience} years` : 'Not specified'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="About"
                      secondary={doctor.about || 'No description provided'}
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
                      secondary={doctor.educationalDegrees || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="University"
                      secondary={doctor.university || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Duration"
                      secondary={
                        doctor.from && doctor.to
                          ? `${doctor.from} - ${doctor.to}`
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
                  <MonetizationOnIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Appointment Settings
                  </Typography>
                </Box>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Appointment Type"
                      secondary={doctor.appointmentType || 'Not specified'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Appointment Duration"
                      secondary={`${doctor.appointmentDuration || 30} minutes`}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Consultation Charge"
                      secondary={`$${doctor.consultationCharge || 0}`}
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
                {doctor.workingSchedule && typeof doctor.workingSchedule === 'object' && !Array.isArray(doctor.workingSchedule) && formatSchedule(doctor.workingSchedule).length > 0 ? (
                  <List dense>
                    {formatSchedule(doctor.workingSchedule).map(({ day, sessions }) => (
                      <ListItem key={day} sx={{ px: 0 }}>
                        <ListItemText
                          primary={day}
                          secondary={
                            <Box>
                              {sessions.map((session, index) => (
                                <Typography key={index} variant="body2" component="div">
                                  {session}
                                </Typography>
                              ))}
                            </Box>
                          }
                        />
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
        title="Delete Doctor"
        itemName={doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : undefined}
        message={doctor ? `Are you sure you want to delete Dr. ${doctor.firstName} ${doctor.lastName}? This action cannot be undone.` : undefined}
        isDeleting={isDeleting}
      />
    </Box>
  );
};