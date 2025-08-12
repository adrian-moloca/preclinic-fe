import React from 'react';
import { Card, CardContent, Box, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import { IDepartments } from '../../../../../providers/departments';

interface DepartmentInfoCardProps {
  department: IDepartments;
  totalStaff: number;
  departmentDoctors: any[];
  departmentAssistants: any[];
  getStatusColor: (status: string) => string;
}

export const DepartmentInfoCard: React.FC<DepartmentInfoCardProps> = ({
  department,
  totalStaff,
  departmentDoctors,
  departmentAssistants,
  getStatusColor
}) => {
  return (
    <Card elevation={1} sx={{ width: "300px", height: "500px" }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <BusinessIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Department Information
          </Typography>
        </Box>
        <List dense>
          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary="Department Name"
              secondary={department.name}
            />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary="Status"
              secondary={
                <Chip 
                  label={department.status} 
                  color={getStatusColor(department.status) as any}
                  size="small"
                  sx={{ textTransform: 'capitalize', mt: 0.5 }}
                />
              }
            />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary="Created Date"
              secondary={new Date(department.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary="Total Staff"
              secondary={`${totalStaff} members (${departmentDoctors.length} doctors, ${departmentAssistants.length} assistants)`}
            />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary="Description"
              secondary={
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mt: 1,
                    maxHeight: '150px',
                    overflow: 'auto',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 1,
                    bgcolor: 'grey.50'
                  }}
                >
                  {department.description || 'No description provided'}
                </Typography>
              }
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};